import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "node:crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_ROOT = path.resolve(__dirname, "../../upload");

const UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function ensureSubmissionId(req) {
    if (typeof req.uploadSubmissionId === "string" && UUID_REGEX.test(req.uploadSubmissionId)) {
        return req.uploadSubmissionId;
    }

    const candidates = [
        req.query?.submission_id,
        req.body?.submission_id,
        req.headers["x-submission-id"],
    ];

    const found = candidates.find((value) => typeof value === "string" && UUID_REGEX.test(value));
    const submissionId = found ?? randomUUID();
    req.uploadSubmissionId = submissionId;
    return submissionId;
}

export function withUploadSubmissionId(req, _res, next) {
    ensureSubmissionId(req);
    next();
}

const storage = multer.diskStorage({
    // Redirige tous les fichiers dans un seul dossier de soumission: upload/<submission_id>
    destination: (req, file, cb) => {
        const submissionId = ensureSubmissionId(req);
        const destination = path.join(UPLOAD_ROOT, submissionId);
        fs.mkdirSync(destination, { recursive: true });
        cb(null, destination);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const base = path
            .basename(file.originalname, ext)
            .replace(/\s+/g, "_")
            .replace(/[^a-zA-Z0-9_-]/g, "");
        cb(null, `${file.fieldname}_${Date.now()}_${base}${ext}`);
    },
});

// Accepte les 3 champs en une seule requête
export const upload = multer({ storage }).fields([
    { name: "video", maxCount: 1 },
    { name: "poster", maxCount: 1 },
    { name: "subtitles", maxCount: 1 },
]);