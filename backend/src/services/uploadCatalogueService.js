import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { db } from "../config/db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_ROOT = path.resolve(__dirname, "../../upload");

const VIDEO_EXTS = new Set([".mp4", ".mov", ".webm", ".mkv", ".avi", ".m4v"]);
const POSTER_EXTS = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"]);
const SUBTITLE_EXTS = new Set([".srt", ".vtt"]);
const UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function buildUploadId(folderName) {
    return `upload-${folderName}`;
}

function displayTitle(filename) {
    const stem = filename
        .replace(/\.[^.]+$/, "")
        .replace(/^(video|poster|subtitles?)_\d+_/, "")
        .replace(/^\d+_/, "");
    const cleaned = stem.replace(/[_-]+/g, " ").trim();
    return cleaned.length > 0 ? cleaned : "Film uploadé";
}

async function safeReadDir(dirPath) {
    try {
        return await fs.readdir(dirPath, { withFileTypes: true });
    } catch {
        return [];
    }
}

async function safeReadJson(filePath) {
    try {
        const raw = await fs.readFile(filePath, "utf8");
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
        return {};
    }
}

async function getSubmissionMetadataByIds(ids) {
    if (!ids.length) return new Map();

    const placeholders = ids.map(() => "?").join(",");
    const [rows] = await db.execute(
        `SELECT id, country, title, synopsis, director_name, year, duration_seconds, ai_tools
         FROM submissions
         WHERE id IN (${placeholders})`,
        ids
    );

    const byId = new Map();
    for (const row of rows) {
        byId.set(row.id, row);
    }
    return byId;
}

function parseJsonArray(value) {
    if (Array.isArray(value)) return value;
    if (typeof value === "string") {
        try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }
    return [];
}

function detectKind(filename) {
    const lower = filename.toLowerCase();
    if (lower.startsWith("video_")) return "video";
    if (lower.startsWith("poster_")) return "poster";
    if (lower.startsWith("subtitles_") || lower.startsWith("subtitle_")) return "subtitles";

    const ext = path.extname(lower);
    if (VIDEO_EXTS.has(ext)) return "video";
    if (POSTER_EXTS.has(ext)) return "poster";
    if (SUBTITLE_EXTS.has(ext)) return "subtitles";
    return null;
}

function selectLatest(files, kind) {
    return files
        .filter((item) => detectKind(item.name) === kind)
        .sort((a, b) => b.stats.mtimeMs - a.stats.mtimeMs)[0] ?? null;
}

function buildUploadFilm(id, folderName, video, poster, subtitles, mtime, metadata = {}, dbMeta = null) {
    const country = typeof metadata.country === "string" && metadata.country.trim().length > 0
        ? metadata.country.trim()
        : (typeof dbMeta?.country === "string" ? dbMeta.country.trim() : "");
    const title = typeof dbMeta?.title === "string" && dbMeta.title.trim().length > 0
        ? dbMeta.title.trim()
        : displayTitle(video.name);
    const synopsis = typeof dbMeta?.synopsis === "string" && dbMeta.synopsis.trim().length > 0
        ? dbMeta.synopsis.trim()
        : "";
    const directorName = typeof dbMeta?.director_name === "string" && dbMeta.director_name.trim().length > 0
        ? dbMeta.director_name.trim()
        : "Soumission incomplète";
    const year = Number.isFinite(Number(dbMeta?.year)) ? Number(dbMeta.year) : new Date().getFullYear();
    const durationSeconds = Number.isFinite(Number(dbMeta?.duration_seconds))
        ? Number(dbMeta.duration_seconds)
        : 0;
    const aiTools = parseJsonArray(dbMeta?.ai_tools);

    return {
        id,
        title,
        synopsis,
        country,
        language: "",
        category: "uploads",
        year,
        duration_seconds: durationSeconds,
        ai_tools: aiTools,
        semantic_tags: [],
        director_name: directorName,
        poster_url: poster ? `/uploads/${folderName}/${poster.name}` : null,
        video_url: `/uploads/${folderName}/${video.name}`,
        subtitles_url: subtitles ? `/uploads/${folderName}/${subtitles.name}` : null,
        youtube_public_id: null,
        status: "uploaded",
        badge: null,
        prize: null,
        music_credits: null,
        director_socials: {},
        director_job: null,
        director_country: null,
        admin_comment: null,
        _mtime: mtime,
    };
}


async function collectUploads() {
    const rootEntries = await safeReadDir(UPLOAD_ROOT);
    const allUploads = [];
    const submissionIds = rootEntries
        .filter((entry) => entry.isDirectory() && UUID_REGEX.test(entry.name))
        .map((entry) => entry.name);
    const dbMetadataById = await getSubmissionMetadataByIds(submissionIds);

    for (const entry of rootEntries) {
        if (!entry.isDirectory()) continue;
        const folderPath = path.join(UPLOAD_ROOT, entry.name);

        // Filtrer les anciens dossiers plats (video, poster, subtitles)
        if (["video", "poster", "subtitles"].includes(entry.name)) {
            if (entry.name === "video") {
                const legacyUploads = await collectLegacyVideoFolder(folderPath);
                allUploads.push(...legacyUploads);
            }
            continue;
        }

        const files = await safeReadDir(folderPath);
        const flat = files.filter((f) => f.isFile());

        if (flat.length === 0) continue;

        const filesWithStats = await Promise.all(
            flat.map(async (f) => ({
                name: f.name,
                stats: await fs.stat(path.join(folderPath, f.name)),
            }))
        );

        const metadata = await safeReadJson(path.join(folderPath, "metadata.json"));
        const dbMeta = dbMetadataById.get(entry.name) ?? null;

        const video = selectLatest(filesWithStats, "video");
        if (!video) continue;

        const poster = selectLatest(filesWithStats, "poster");
        const subtitles = selectLatest(filesWithStats, "subtitles");

        const upload = buildUploadFilm(
            buildUploadId(entry.name),
            entry.name,
            video,
            poster,
            subtitles,
            video.stats.mtimeMs,
            metadata,
            dbMeta
        );
        allUploads.push(upload);
    }

    return allUploads;
}

async function collectLegacyVideoFolder(videoDir) {
    const [videos, posters, subtitles] = await Promise.all([
        safeReadDir(videoDir),
        safeReadDir(path.join(UPLOAD_ROOT, "poster")),
        safeReadDir(path.join(UPLOAD_ROOT, "subtitles")),
    ]);

    const videoFiles = videos.filter((f) => f.isFile());
    const posterFile = posters.find((f) => f.isFile())?.name ?? null;
    const subtitleFile = subtitles.find((f) => f.isFile())?.name ?? null;

    return Promise.all(
        videoFiles.map(async (entry) => {
            const stats = await fs.stat(path.join(videoDir, entry.name));
            const poster = posterFile ? { name: posterFile, stats: { mtimeMs: 0 } } : null;
            const sub = subtitleFile ? { name: subtitleFile, stats: { mtimeMs: 0 } } : null;

            return buildUploadFilm(
                buildUploadId(`legacy:${entry.name}`),
                "legacy",
                { name: entry.name, stats },
                poster,
                sub,
                stats.mtimeMs
            );
        })
    );
}


export async function listUploadedFilms({ q } = {}) {
    const uploads = await collectUploads();
    const loweredQuery = String(q ?? "").trim().toLowerCase();

    return uploads
        .sort((a, b) => b._mtime - a._mtime)
        .filter((film) => {
            if (!loweredQuery) return true;
            return (
                film.title.toLowerCase().includes(loweredQuery) ||
                film.synopsis.toLowerCase().includes(loweredQuery)
            );
        })
        .map(({ _mtime, ...film }) => film);
}

export async function findUploadedFilmById(id) {
    const uploads = await listUploadedFilms();
    return uploads.find((film) => film.id === id) ?? null;
}
