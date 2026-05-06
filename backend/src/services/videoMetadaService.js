import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { env } from "../config/env.js";

const execFileAsync = promisify(execFile);

export async function probeVideoDurationSeconds(filePath) {
    const ffprobePath = String(env.ffprobePath || "ffprobe").trim() || "ffprobe";
    try {
        const { stdout } = await execFileAsync(ffprobePath, [
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "default=noprint_wrappers=1:nokey=1",
            filePath,
        ]);
        const duration = Number.parseFloat(String(stdout || "").trim());
        if (!Number.isFinite(duration) || duration <= 0) {
            const err = new Error("Durée vidéo introuvable");
            err.status = 400;
            throw err;
        }
        return Math.round(duration);
    } catch (error) {
        const code = String(error?.code || "");
        if (code === "ENOENT") {
            const err = new Error(
                "ffprobe introuvable sur le serveur. Installez ffmpeg/ffprobe ou configurez FFPROBE_PATH.",
            );
            err.status = 500;
            throw err;
        }
        if (error?.status) throw error;
        const err = new Error("Impossible d'analyser la durée de la vidéo");
        err.status = 400;
        throw err;
    }
}
