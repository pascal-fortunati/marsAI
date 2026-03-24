import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_ROOT = path.resolve(__dirname, "../../upload");

function sanitizeText(value) {
    return String(value ?? "").trim();
}

export function uploadFiles(req, res) {
    const files = req.files ?? {};
    const submissionId = req.uploadSubmissionId;

    if (!submissionId) {
        return res.status(500).json({ error: "Impossible de générer un identifiant de soumission." });
    }

    const url = (field) => files[field]?.[0]
        ? `/uploads/${submissionId}/${files[field][0].filename}`
        : null;

    const country = sanitizeText(req.body?.country);

    const persistMetadata = async () => {
        const metadataPath = path.join(UPLOAD_ROOT, submissionId, "metadata.json");
        let existing = {};

        try {
            const raw = await fs.readFile(metadataPath, "utf8");
            existing = JSON.parse(raw);
        } catch {
            existing = {};
        }

        const nextMetadata = {
            ...existing,
            country,
            updated_at: new Date().toISOString(),
        };

        await fs.writeFile(metadataPath, JSON.stringify(nextMetadata, null, 2), "utf8");
    };

    persistMetadata().catch((err) => {
        console.warn("[uploadFiles] metadata persist failed", err);
    });

    return res.json({
        submission_id: submissionId,
        video_url: url("video"),
        poster_url: url("poster"),
        subtitles_url: url("subtitles"),
    });
}