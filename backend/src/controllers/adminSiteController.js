import Busboy from "busboy";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { env } from "../config/env.js";
import {
  getFestivalSettings,
  updateFestivalSettings,
  updatePartnersLogos,
} from "../services/siteSettingsService.js";
import {
  disconnectYoutubeConnection,
  getYoutubeConnectUrl,
  getYoutubeConnectionStatus,
  handleYoutubeConnectCallback,
} from "../services/youtubeConnectionService.js";
import { getSubscribedDirectorsEmails } from "../models/submissionsModel.js";
import { getPalmares } from "../services/palmaresService.js";
import {
  sendPhase1EndEmail,
  sendPhase2EndEmail,
  sendPhase3EndEmail,
  sendWinnersEmail,
} from "../services/phaseEmailService.js";
import { getSettingByKey } from "../models/siteSettingsModel.js";

const partnerUploadPublicPrefix = "/partners";
const partnerUploadRoot = path.resolve(
  process.cwd(),
  "..",
  "frontend",
  "public",
  "partners",
);

function normalizeOrigin(input) {
  if (!input || typeof input !== "string") return null;
  const raw = input.trim();
  if (!raw) return null;
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    return new URL(withProtocol).origin;
  } catch {
    return null;
  }
}

async function resolvePlatformOrigin() {
  const platformSetting = await getSettingByKey("platform_base_url");
  return (
    normalizeOrigin(platformSetting?.value) ||
    normalizeOrigin(env.corsOrigin) ||
    "http://localhost:4001"
  );
}

function extractPartnerRelativePath(url) {
  if (typeof url !== "string") return null;
  const raw = url.trim();
  if (!raw) return null;

  if (raw.startsWith("/partners/")) {
    return raw.replace(/^\/partners\//, "");
  }

  if (/^https?:\/\//i.test(raw)) {
    try {
      const parsed = new URL(raw);
      if (parsed.pathname.startsWith("/partners/")) {
        return parsed.pathname.replace(/^\/partners\//, "");
      }
    } catch {
      return null;
    }
  }
  return null;
}

// Génère un nom de fichier sécurisé à partir d'un nom de fichier original
// Remplace les caractères non alphanumériques par des underscores
function safeBasename(filename) {
  if (!filename || typeof filename !== "string") return "file";
  return path.basename(filename).replace(/[^\w.-]+/g, "_");
}

// Récupère l'extension de fichier à partir d'un type MIME
function extFromMime(mime) {
  const v = typeof mime === "string" ? mime.toLowerCase() : "";
  if (v === "image/png") return ".png";
  if (v === "image/jpeg" || v === "image/jpg") return ".jpg";
  if (v === "image/webp") return ".webp";
  if (v === "image/svg+xml") return ".svg";
  if (v === "image/gif") return ".gif";
  return "";
}

// Récupère les paramètres de site pour l'admin
export async function getAdminSiteSettings(req, res, next) {
  try {
    const settings = await getFestivalSettings();
    return res.json({ settings });
  } catch (err) {
    next(err);
  }
}

// Détermine la phase actuelle en fonction des paramètres
function getPhase(settings) {
  const now = new Date();
  if (!settings.phase1CloseIso || now < new Date(settings.phase1CloseIso))
    return 1;
  if (
    !settings.phase2CatalogueIso ||
    now < new Date(settings.phase2CatalogueIso)
  )
    return 2;
  if (!settings.phase3PalmaresIso || now < new Date(settings.phase3PalmaresIso))
    return 3;
  return 4; // Phase clôturée
}

// Met à jour les paramètres de site pour l'admin
export async function putAdminSiteSettings(req, res, next) {
  try {
    const body = req.body || {};

    // On récupère l'état actuel pour comparer
    const oldSettings = await getFestivalSettings();
    const oldPhase = getPhase(oldSettings);

    const settings = await updateFestivalSettings({
      phase1CloseIso:
        "phase1CloseIso" in body ? body.phase1CloseIso : undefined,
      phase2CatalogueIso:
        "phase2CatalogueIso" in body ? body.phase2CatalogueIso : undefined,
      phase3PalmaresIso:
        "phase3PalmaresIso" in body ? body.phase3PalmaresIso : undefined,
      siteLogo: "siteLogo" in body ? body.siteLogo : undefined,
      heroImageUrl: "heroImageUrl" in body ? body.heroImageUrl : undefined,
      platformBaseUrl:
        "platformBaseUrl" in body ? body.platformBaseUrl : undefined,
      partners: body.partners ?? undefined,
      partnersLogos: body.partnersLogos ?? undefined,
      footerText: body.footerText ?? undefined,
      festivalDescription: body.festivalDescription ?? undefined,
      submissionCategories: body.submissionCategories ?? undefined,
      submissionLanguages: body.submissionLanguages ?? undefined,
      submissionCountries: body.submissionCountries ?? undefined,
      submissionJobs: body.submissionJobs ?? undefined,
      submissionDiscoverySources: body.submissionDiscoverySources ?? undefined,
      submissionAiToolSuggestions:
        body.submissionAiToolSuggestions ?? undefined,
      submissionSemanticTags: body.submissionSemanticTags ?? undefined,
      submissionSocialNetworks: body.submissionSocialNetworks ?? undefined,
      homeTranslations: body.homeTranslations ?? undefined,
      youtubeChannelId: body.youtubeChannelId ?? undefined,
      youtubeChannelName: body.youtubeChannelName ?? undefined,
      youtubeDefaultPrivacy: body.youtubeDefaultPrivacy ?? undefined,
      youtubeAutoCopyrightCheck: body.youtubeAutoCopyrightCheck ?? undefined,
      youtubeMoveToS3AfterCheck: body.youtubeMoveToS3AfterCheck ?? undefined,
      brevoSenderEmail: body.brevoSenderEmail ?? undefined,
      emailSubmissionReceivedTemplate:
        body.emailSubmissionReceivedTemplate ?? undefined,
      emailDecisionTemplates: body.emailDecisionTemplates ?? undefined,
    });

    const newPhase = getPhase(settings);

    // Détection des transitions de phase et envoi d'emails
    if (newPhase > oldPhase) {
      // On lance l'envoi en arrière-plan (sans await) pour ne pas bloquer la réponse HTTP
      // sauf si c'est critique, mais ici l'envoi peut être long.
      // Cependant, pour être sûr que ça part, on va juste logger l'erreur si ça plante.
      (async () => {
        try {
          const recipients = await getSubscribedDirectorsEmails();
          if (recipients.length === 0) return;

          console.log(
            `Phase transition detected: ${oldPhase} -> ${newPhase}. Sending emails to ${recipients.length} directors.`,
          );

          if (oldPhase === 1 && newPhase >= 2) {
            await sendPhase1EndEmail(recipients);
          }
          if (oldPhase <= 2 && newPhase >= 3) {
            await sendPhase2EndEmail(recipients);
          }
          if (oldPhase <= 3 && newPhase >= 4) {
            await sendPhase3EndEmail(recipients);
            // On attend un peu ou on enchaîne pour les gagnants
            const { laureats } = await getPalmares();
            if (laureats && laureats.length > 0) {
              await sendWinnersEmail(recipients, laureats);
            }
          }
        } catch (err) {
          console.error("Error sending phase transition emails:", err);
        }
      })();
    }

    return res.json({ settings });
  } catch (err) {
    next(err);
  }
}

// Met à jour les logos des partenaires pour l'admin
export async function postAdminPartnerLogos(req, res, next) {
  try {
    const contentType = req.headers["content-type"] || "";
    if (!String(contentType).startsWith("multipart/form-data")) {
      return res.status(415).json({ error: "Expected multipart/form-data" });
    }

    fs.mkdirSync(partnerUploadRoot, { recursive: true });

    const uploaded = [];
    const writes = [];
    let fileCount = 0;
    let badType = false;

    const busboy = Busboy({
      headers: req.headers,
      limits: { files: 20, fileSize: 5 * 1024 * 1024 },
    });

    busboy.on("file", (name, file, info) => {
      const { filename, mimeType } = info;
      fileCount += 1;

      const isImage =
        typeof mimeType === "string" &&
        mimeType.toLowerCase().startsWith("image/");
      if (!isImage) {
        badType = true;
        file.resume();
        return;
      }

      const safeName = safeBasename(filename);
      const ext = path.extname(safeName) || extFromMime(mimeType);
      const targetName = `${crypto.randomUUID()}${ext}`;
      const targetPath = path.join(partnerUploadRoot, targetName);

      const writeStream = fs.createWriteStream(targetPath);
      const p = new Promise((resolve, reject) => {
        writeStream.on("finish", resolve);
        writeStream.on("error", reject);
      });

      file.pipe(writeStream);
      writes.push(p);

      const displayName =
        safeName.replace(path.extname(safeName), "").trim() || null;
      uploaded.push({
        url: `${partnerUploadPublicPrefix}/${targetName}`,
        name: displayName,
      });
    });

    busboy.on("error", (err) => next(err));

    busboy.on("finish", async () => {
      try {
        await Promise.all(writes);

        if (badType)
          return res.status(415).json({ error: "Unsupported file type" });
        if (fileCount === 0)
          return res.status(400).json({ error: "No files uploaded" });

        const current = await getFestivalSettings();
        const prev = Array.isArray(current.partnersLogos)
          ? current.partnersLogos
          : [];
        const merged = [...prev];

        for (const item of uploaded) {
          if (!merged.some((p) => p.url === item.url)) merged.push(item);
        }

        const settings = await updatePartnersLogos(merged);
        return res.json({ settings });
      } catch (err) {
        next(err);
      }
    });

    req.pipe(busboy);
  } catch (err) {
    next(err);
  }
}

// Supprime les logos des partenaires pour l'admin
export async function deleteAdminPartnerLogos(req, res, next) {
  try {
    const body = req.body || {};
    const urls = Array.isArray(body.urls)
      ? body.urls.map((u) => String(u))
      : [];
    const wanted = urls.map((u) => u.trim()).filter(Boolean);

    if (wanted.length === 0)
      return res.status(400).json({ error: "Missing urls" });

    const current = await getFestivalSettings();
    const prev = Array.isArray(current.partnersLogos)
      ? current.partnersLogos
      : [];
    const nextLogos = prev.filter((p) => !wanted.includes(p.url));

    const removed = prev.filter((p) => wanted.includes(p.url));
    for (const r of removed) {
      let filePath = null;
      if (r.url.startsWith("/uploads/partners/")) {
        const rel = r.url.replace(/^\/uploads\/partners\//, "");
        filePath = path.resolve(process.cwd(), "uploads", "partners", rel);
      }
      const rel = extractPartnerRelativePath(r.url);
      if (rel) {
        filePath = path.join(partnerUploadRoot, rel);
      }
      if (!filePath) continue;
      try {
        fs.unlinkSync(filePath);
      } catch {
        // ignore
      }
    }

    const settings = await updatePartnersLogos(nextLogos);
    return res.json({ settings });
  } catch (err) {
    next(err);
  }
}

export async function putAdminPartnerLogos(req, res, next) {
  try {
    const body = req.body || {};
    const logos = Array.isArray(body.logos) ? body.logos : null;
    if (!logos) return res.status(400).json({ error: "Missing logos" });
    const settings = await updatePartnersLogos(logos);
    return res.json({ settings });
  } catch (err) {
    next(err);
  }
}

export async function getAdminYoutubeConnect(req, res, next) {
  try {
    const url = getYoutubeConnectUrl({
      userId: req.user?.userId,
      role: req.user?.role,
    });
    return res.json({ url });
  } catch (err) {
    next(err);
  }
}

export async function getAdminYoutubeCallback(req, res) {
  const origin = await resolvePlatformOrigin();
  const toPanelYoutube = (extra) =>
    `${origin}/panel?tab=youtube${extra ? `&${extra}` : ""}`;
  try {
    const providerError =
      typeof req.query.error === "string" ? req.query.error : "";
    const providerMessage =
      typeof req.query.error_description === "string"
        ? req.query.error_description
        : providerError;
    if (providerError) {
      return res.redirect(
        toPanelYoutube(
          `youtubeError=${encodeURIComponent(
            providerMessage || "Google OAuth error",
          )}`,
        ),
      );
    }
    const code = typeof req.query.code === "string" ? req.query.code : "";
    const state = typeof req.query.state === "string" ? req.query.state : "";
    if (!code || !state) {
      return res.redirect(
        toPanelYoutube("youtubeError=Missing%20OAuth%20callback%20parameters"),
      );
    }
    await handleYoutubeConnectCallback({ code, state });
    return res.redirect(toPanelYoutube("youtubeConnected=1"));
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "YouTube OAuth callback failed";
    return res.redirect(
      toPanelYoutube(`youtubeError=${encodeURIComponent(message)}`),
    );
  }
}

export async function getAdminYoutubeStatus(_req, res, next) {
  try {
    const status = await getYoutubeConnectionStatus();
    return res.json({ status });
  } catch (err) {
    next(err);
  }
}

export async function deleteAdminYoutubeConnection(_req, res, next) {
  try {
    await disconnectYoutubeConnection();
    const status = await getYoutubeConnectionStatus();
    return res.json({ ok: true, status });
  } catch (err) {
    next(err);
  }
}
