import Busboy from "busboy";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { createSubmission } from "../services/submissionsService.js";
import {
  getSubmissionFileStreamFromStorage,
  isObjectStorageConfigured,
  uploadSubmissionFile,
} from "../services/objectStorageService.js";
import { getFestivalSettings } from "../services/siteSettingsService.js";
import { uploadSubmissionVideoToYoutube } from "../services/youtubeUploadService.js";
import { sendSubmissionReceivedEmail } from "../services/notificationEmailService.js";
import { probeVideoDurationSeconds } from "../services/videoMetadataService.js";

// Crée une nouvelle soumission
function safeBasename(filename) {
  if (!filename || typeof filename !== "string") return "file";
  return path.basename(filename).replace(/[^\w.-]+/g, "_");
}

// Service pour parser une chaîne JSON en tableau de chaînes nettoyées
function parseStringArrayJson(value) {
  if (!value || typeof value !== "string") return [];
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) => String(item || "").trim()).filter(Boolean);
  } catch {
    return [];
  }
}

// Service pour vérifier si l'extension d'un fichier est autorisée
function hasAllowedExtension(filename, allowedExtensions) {
  const ext = path.extname(String(filename || "")).toLowerCase();
  return allowedExtensions.includes(ext);
}

// Service pour vérifier si le type MIME d'un fichier est autorisé
function hasAllowedMime(mimeType, allowedMimes) {
  const mime = String(mimeType || "").toLowerCase();
  return allowedMimes.includes(mime);
}

function parseDurationSeconds(value) {
  const str = String(value || "").trim();
  if (!str) return 0;
  if (str.includes(":")) {
    const [m, s] = str.split(":").map((v) => Number(v));
    const min = Number.isFinite(m) ? m : 0;
    const sec = Number.isFinite(s) ? s : 0;
    return min * 60 + sec;
  }
  const n = Number(str);
  return Number.isFinite(n) ? n : 0;
}

// Crée une nouvelle soumission
export async function postSubmission(req, res, next) {
  try {
    const contentType = req.headers["content-type"] || "";
    if (!String(contentType).startsWith("multipart/form-data")) {
      return res.status(415).json({ error: "Expected multipart/form-data" });
    }

    const id = crypto.randomUUID();
    const fields = {};
    const files = {
      videoUrl: null,
      posterUrl: null,
      subtitlesUrl: null,
      youtubePrivateId: null,
    };
    const writes = [];
    const objectStorageFiles = [];
    const useObjectStorage = isObjectStorageConfigured();
    const uploadRoot = path.resolve(process.cwd(), "uploads", id);
    let localVideoPath = null;
    let localVideoContentType = "application/octet-stream";
    let videoStorageKey = null;
    const seenFileFields = new Set();
    let parsingError = null;
    fs.mkdirSync(uploadRoot, { recursive: true });

    const busboy = Busboy({
      headers: req.headers,
      limits: { files: 3, fileSize: 350 * 1024 * 1024 },
    });

    busboy.on("field", (name, value) => {
      fields[name] = value;
    });

    busboy.on("file", (name, file, info) => {
      if (parsingError) {
        file.resume();
        return;
      }
      if (!["video", "poster", "subtitles"].includes(name)) {
        file.resume();
        const err = new Error("Champ fichier invalide");
        err.status = 400;
        parsingError = err;
        return;
      }
      if (seenFileFields.has(name)) {
        file.resume();
        const err = new Error("Fichier en double");
        err.status = 400;
        parsingError = err;
        return;
      }
      seenFileFields.add(name);
      const filename = safeBasename(info?.filename);
      const lowerName = filename.toLowerCase();
      const mimeType = String(info?.mimeType || "").toLowerCase();
      const videoExt = [".mp4", ".mov"];
      const posterExt = [".jpg", ".jpeg", ".png", ".gif"];
      const subtitleExt = [".srt", ".vtt"];
      const videoMimes = ["video/mp4", "video/quicktime"];
      const posterMimes = ["image/jpeg", "image/png", "image/gif"];
      const subtitleMimes = [
        "text/plain",
        "text/vtt",
        "application/x-subrip",
        "application/octet-stream",
      ];
      if (
        name === "video" &&
        (!hasAllowedExtension(lowerName, videoExt) ||
          !hasAllowedMime(mimeType, videoMimes))
      ) {
        file.resume();
        const err = new Error("Format vidéo invalide");
        err.status = 400;
        parsingError = err;
        return;
      }
      if (
        name === "poster" &&
        (!hasAllowedExtension(lowerName, posterExt) ||
          !hasAllowedMime(mimeType, posterMimes))
      ) {
        file.resume();
        const err = new Error("Format image invalide");
        err.status = 400;
        parsingError = err;
        return;
      }
      if (
        name === "subtitles" &&
        !hasAllowedExtension(lowerName, subtitleExt)
      ) {
        file.resume();
        const err = new Error("Format sous-titres invalide");
        err.status = 400;
        parsingError = err;
        return;
      }
      if (name === "subtitles" && !hasAllowedMime(mimeType, subtitleMimes)) {
        file.resume();
        const err = new Error("Type MIME sous-titres invalide");
        err.status = 400;
        parsingError = err;
        return;
      }
      const ext = path.extname(filename) || "";
      const targetName =
        name === "video"
          ? `video${ext || ".mp4"}`
          : name === "poster"
            ? `poster${ext || ".jpg"}`
            : name === "subtitles"
              ? `subtitles${ext || ".srt"}`
              : `${name}${ext}`;
      const diskPath = path.join(uploadRoot, targetName);
      const writeStream = fs.createWriteStream(diskPath);
      const p = new Promise((resolve, reject) => {
        writeStream.on("close", resolve);
        writeStream.on("error", reject);
        file.on("error", reject);
      });
      file.pipe(writeStream);
      writes.push(p);

      if (name === "video") {
        localVideoPath = diskPath;
        localVideoContentType = info?.mimeType || "application/octet-stream";
      }

      if (useObjectStorage) {
        objectStorageFiles.push({
          name,
          targetName,
          diskPath,
          contentType: info?.mimeType || "application/octet-stream",
        });
      } else {
        if (name === "video") files.videoUrl = `/uploads/${id}/${targetName}`;
        if (name === "poster") files.posterUrl = `/uploads/${id}/${targetName}`;
        if (name === "subtitles")
          files.subtitlesUrl = `/uploads/${id}/${targetName}`;
      }
    });

    busboy.on("error", (err) => next(err));

    busboy.on("finish", async () => {
      try {
        if (parsingError) throw parsingError;
        await Promise.all(writes);
        if (!localVideoPath) {
          const err = new Error("Fichier vidéo source introuvable");
          err.status = 400;
          throw err;
        }
        const detectedDurationSeconds =
          await probeVideoDurationSeconds(localVideoPath);
        if (detectedDurationSeconds > 120) {
          const err = new Error(
            `Durée vidéo invalide: ${detectedDurationSeconds}s (max 120s)`,
          );
          err.status = 400;
          throw err;
        }
        const enteredDurationSeconds = parseDurationSeconds(fields.duration);
        if (
          enteredDurationSeconds > 0 &&
          Math.abs(enteredDurationSeconds - detectedDurationSeconds) > 2
        ) {
          const err = new Error(
            `Durée déclarée invalide (${enteredDurationSeconds}s). Durée détectée: ${detectedDurationSeconds}s`,
          );
          err.status = 400;
          throw err;
        }
        fields.duration = String(detectedDurationSeconds);
        if (useObjectStorage) {
          for (const entry of objectStorageFiles) {
            const stat = await fs.promises.stat(entry.diskPath);
            const stream = fs.createReadStream(entry.diskPath);
            const uploaded = await uploadSubmissionFile({
              submissionId: id,
              targetName: entry.targetName,
              body: stream,
              contentType: entry.contentType,
              contentLength: stat.size,
            });
            if (entry.name === "video") files.videoUrl = uploaded.url;
            if (entry.name === "video") videoStorageKey = uploaded.key;
            if (entry.name === "poster") files.posterUrl = uploaded.url;
            if (entry.name === "subtitles") files.subtitlesUrl = uploaded.url;
          }
        }

        const settings = await getFestivalSettings();
        if (settings.youtubeAutoCopyrightCheck) {
          const source = useObjectStorage
            ? await getSubmissionFileStreamFromStorage({ key: videoStorageKey })
            : (() => {
              if (!localVideoPath) {
                const err = new Error("Fichier vidéo source introuvable");
                err.status = 500;
                throw err;
              }
              const stat = fs.statSync(localVideoPath);
              return {
                stream: fs.createReadStream(localVideoPath),
                contentLength: stat.size,
                contentType: localVideoContentType,
              };
            })();

          const youtubeUpload = await uploadSubmissionVideoToYoutube({
            title: String(fields.title || "marsAI Submission"),
            description: String(fields.synopsis || ""),
            tags: parseStringArrayJson(fields.semanticTags),
            privacyStatus: settings.youtubeDefaultPrivacy,
            videoStream: source.stream,
            videoMimeType: source.contentType || localVideoContentType,
            videoSize: source.contentLength,
          });
          files.youtubePrivateId = youtubeUpload.youtubeVideoId;
        } else {
          console.warn(
            `[submission:${id}] Upload YouTube automatique désactivé dans les paramètres du site`,
          );
        }

        const created = await createSubmission({ id, fields, files });
        await sendSubmissionReceivedEmail({
          to: String(fields.directorEmail || "").trim(),
          directorName: String(fields.directorName || "").trim(),
          filmTitle: String(fields.title || "").trim(),
          language: String(fields.language || "").trim(),
          submissionId: id,
        });
        return res.status(201).json(created);
      } catch (err) {
        next(err);
      } finally {
        if (useObjectStorage) {
          await Promise.allSettled(
            objectStorageFiles.map((entry) =>
              fs.promises.unlink(entry.diskPath),
            ),
          );
          await fs.promises.rm(uploadRoot, { recursive: true, force: true });
        }
      }
    });

    req.pipe(busboy);
  } catch (err) {
    next(err);
  }
}
