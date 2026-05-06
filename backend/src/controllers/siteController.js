import {
  getFestivalSettings,
  getSubmissionOptions,
} from "../services/siteSettingsService.js";
import fs from "node:fs";
import path from "node:path";

// Récupère les paramètres du site
export async function getSiteSettings(req, res, next) {
  try {
    const settings = await getFestivalSettings();
    return res.json({ settings });
  } catch (err) {
    next(err);
  }
}

// Récupère les options de soumission
export async function getSiteOptions(req, res, next) {
  try {
    const options = await getSubmissionOptions();
    return res.json({ options });
  } catch (err) {
    next(err);
  }
}

export async function getSiteEmailLogo(req, res, next) {
  try {
    const roots = [
      path.resolve(process.cwd(), "..", "frontend", "src", "assets"),
      path.resolve(process.cwd(), "frontend", "src", "assets"),
      path.resolve(process.cwd(), "src", "assets"),
    ];
    const logoPath =
      roots
        .map((r) => path.join(r, "mars_ai_logo.png"))
        .find((candidate) => fs.existsSync(candidate)) || "";
    if (!logoPath) return res.status(404).json({ error: "Logo not found" });
    res.setHeader("Cache-Control", "public, max-age=3600");
    return res.sendFile(logoPath);
  } catch (err) {
    next(err);
  }
}
