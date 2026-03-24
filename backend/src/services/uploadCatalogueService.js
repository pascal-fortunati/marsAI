import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_ROOT = path.resolve(__dirname, "../../upload");

const VIDEO_EXTS = new Set([".mp4", ".mov", ".webm", ".mkv", ".avi", ".m4v"]);
const POSTER_EXTS = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"]);
const SUBTITLE_EXTS = new Set([".srt", ".vtt"]);

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

async function buildFlatFolderUpload(folderName) {
    const folderPath = path.join(UPLOAD_ROOT, folderName);
    const entries = await safeReadDir(folderPath);
    const fileEntries = entries.filter((entry) => entry.isFile());
    if (fileEntries.length === 0) return null;

    const files = await Promise.all(
        fileEntries.map(async (entry) => ({
            name: entry.name,
            stats: await fs.stat(path.join(folderPath, entry.name)),
        }))
    );

    const video = selectLatest(files, "video");
    if (!video) return null;

    const poster = selectLatest(files, "poster");
    const subtitles = selectLatest(files, "subtitles");

    return {
        id: buildUploadId(folderName),
        title: displayTitle(video.name),
        synopsis: "Vidéo uploadée à l'étape 3 (soumission non finalisée).",
        country: "",
        language: "",
        category: "uploads",
        year: new Date().getFullYear(),
        duration_seconds: 0,
        ai_tools: [],
        semantic_tags: [],
        director_name: "Soumission incomplète",
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
        _mtime: video.stats.mtimeMs,
    };
}

async function buildNestedFolderUploads(folderName) {
    const baseDir = path.join(UPLOAD_ROOT, folderName);
    const [videos, posters, subtitles] = await Promise.all([
        safeReadDir(path.join(baseDir, "video")),
        safeReadDir(path.join(baseDir, "poster")),
        safeReadDir(path.join(baseDir, "subtitles")),
    ]);

    const videoEntries = videos.filter((entry) => entry.isFile());
    if (videoEntries.length === 0) return [];

    const posterEntries = posters.filter((entry) => entry.isFile());
    const subtitleEntries = subtitles.filter((entry) => entry.isFile());

    const posterFile = posterEntries[0]?.name ?? null;
    const subtitleFile = subtitleEntries[0]?.name ?? null;

    return Promise.all(
        videoEntries.map(async (entry) => {
            const stats = await fs.stat(path.join(baseDir, "video", entry.name));
            return {
                id: buildUploadId(`${folderName}:${entry.name}`),
                title: displayTitle(entry.name),
                synopsis: "Vidéo uploadée à l'étape 3 (soumission non finalisée).",
                country: "",
                language: "",
                category: "uploads",
                year: new Date().getFullYear(),
                duration_seconds: 0,
                ai_tools: [],
                semantic_tags: [],
                director_name: "Soumission incomplète",
                poster_url: posterFile ? `/uploads/${folderName}/poster/${posterFile}` : null,
                video_url: `/uploads/${folderName}/video/${entry.name}`,
                subtitles_url: subtitleFile ? `/uploads/${folderName}/subtitles/${subtitleFile}` : null,
                youtube_public_id: null,
                status: "uploaded",
                badge: null,
                prize: null,
                music_credits: null,
                director_socials: {},
                director_job: null,
                director_country: null,
                admin_comment: null,
                _mtime: stats.mtimeMs,
            };
        })
    );
}

async function buildLegacyUploads() {
    const legacyVideoDir = path.join(UPLOAD_ROOT, "video");
    const legacyPosterDir = path.join(UPLOAD_ROOT, "poster");
    const legacySubtitleDir = path.join(UPLOAD_ROOT, "subtitles");
    const [legacyVideos, legacyPosters, legacySubtitles] = await Promise.all([
        safeReadDir(legacyVideoDir),
        safeReadDir(legacyPosterDir),
        safeReadDir(legacySubtitleDir),
    ]);

    const posterFile = legacyPosters.find((entry) => entry.isFile())?.name ?? null;
    const subtitleFile = legacySubtitles.find((entry) => entry.isFile())?.name ?? null;

    return Promise.all(
        legacyVideos
            .filter((entry) => entry.isFile())
            .map(async (entry) => {
                const stats = await fs.stat(path.join(legacyVideoDir, entry.name));
                return {
                    id: buildUploadId(`legacy:${entry.name}`),
                    title: displayTitle(entry.name),
                    synopsis: "Vidéo uploadée à l'étape 3 (soumission non finalisée).",
                    country: "",
                    language: "",
                    category: "uploads",
                    year: new Date().getFullYear(),
                    duration_seconds: 0,
                    ai_tools: [],
                    semantic_tags: [],
                    director_name: "Soumission incomplète",
                    poster_url: posterFile ? `/uploads/poster/${posterFile}` : null,
                    video_url: `/uploads/video/${entry.name}`,
                    subtitles_url: subtitleFile ? `/uploads/subtitles/${subtitleFile}` : null,
                    youtube_public_id: null,
                    status: "uploaded",
                    badge: null,
                    prize: null,
                    music_credits: null,
                    director_socials: {},
                    director_job: null,
                    director_country: null,
                    admin_comment: null,
                    _mtime: stats.mtimeMs,
                };
            })
    );
}

export async function listUploadedFilms({ q } = {}) {
    const rootEntries = await safeReadDir(UPLOAD_ROOT);
    const folderEntries = rootEntries.filter((entry) => entry.isDirectory());
    const uploadsByFolder = await Promise.all(
        folderEntries
            .filter((folder) => !["video", "poster", "subtitles"].includes(folder.name))
            .map(async (folder) => {
                const flat = await buildFlatFolderUpload(folder.name);
                if (flat) return [flat];
                return buildNestedFolderUploads(folder.name);
            })
    );
    const legacyUploads = await buildLegacyUploads();

    const loweredQuery = String(q ?? "").trim().toLowerCase();

    const uploads = [...uploadsByFolder.flat(), ...legacyUploads]
        .sort((a, b) => b._mtime - a._mtime)
        .filter((film) => {
            if (!loweredQuery) return true;
            return (
                film.title.toLowerCase().includes(loweredQuery) ||
                film.synopsis.toLowerCase().includes(loweredQuery)
            );
        })
        .map(({ _mtime, ...film }) => film);

    return uploads;
}

export async function findUploadedFilmById(id) {
    const uploads = await listUploadedFilms();
    return uploads.find((film) => film.id === id) ?? null;
}
