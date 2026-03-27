import { env } from "../config/env.js";
import { isBrevoConfigured, sendTransactionalEmail } from "./brevoService.js";
import { getFestivalSettings } from "./siteSettingsService.js";
import { buildFestivalEmailHtml } from "./emailTemplate.js";

// Fonction pour vérifier si la langue est en français
function isFrenchLanguage(value) {
  const raw = String(value || "").toLowerCase();
  return (
    raw.includes("fr") || raw.includes("français") || raw.includes("french")
  );
}

// Fonction pour appliquer les variables de substitution dans un modèle de texte
function applyTemplateVars(template, vars) {
  return String(template || "").replace(
    /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g,
    (_, key) => String(vars?.[key] ?? ""),
  );
}

// Fonction pour échapper les caractères spéciaux HTML
function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Fonction pour convertir du texte en HTML en échappant les caractères spéciaux
function textToHtml(text) {
  return String(text || "")
    .split("\n")
    .map((line) => escapeHtml(line))
    .join("<br/>");
}

function normalizeBaseUrl(input) {
  const raw = String(input || "").trim();
  if (!raw) return null;
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    return new URL(withProtocol).origin;
  } catch {
    return null;
  }
}

// Fonction pour envoyer un email de confirmation de réception de soumission
export async function sendSubmissionReceivedEmail({
  to,
  directorName,
  filmTitle,
  language,
  submissionId,
}) {
  if (!isBrevoConfigured()) return { ok: false, skipped: true };
  const isFr = isFrenchLanguage(language);
  const settings = await getFestivalSettings();
  const tplRoot = settings?.emailSubmissionReceivedTemplate || {};
  const langTpl = isFr ? tplRoot?.fr || {} : tplRoot?.en || {};
  const vars = {
    directorName:
      directorName || (isFr ? "réalisatrice/réalisateur" : "director"),
    artist_name:
      directorName || (isFr ? "réalisatrice/réalisateur" : "director"),
    filmTitle: filmTitle || "",
    festival_name: "marsAI 2026",
    submission_date: new Date().toISOString().slice(0, 10),
    submissionId: submissionId || "",
    submission_id: submissionId || "",
  };
  const subject = applyTemplateVars(langTpl.subject, vars);
  const text = applyTemplateVars(langTpl.text, vars);
  const htmlTemplate = applyTemplateVars(langTpl.html, vars);
  const html = buildFestivalEmailHtml({
    title: isFr ? "Soumission reçue" : "Submission received",
    subtitle: isFr
      ? "Votre film est en cours d’examen par le jury"
      : "Your film is now under jury review",
    bodyHtml: htmlTemplate || `<p>${textToHtml(text)}</p>`,
  });
  const payload = await sendTransactionalEmail({
    to,
    toName: directorName,
    subject,
    text,
    html,
  });
  return { ok: true, messageId: payload.messageId };
}

// Fonction pour envoyer un email d'invitation d'utilisateur
export async function sendUserInvitationEmail({
  to,
  name,
  role,
  baseUrlOverride,
}) {
  if (!isBrevoConfigured()) return { ok: false, skipped: true };
  const settings = await getFestivalSettings();
  const normalizedRole = role === "moderator" ? "moderator" : "jury";
  const targetPath = normalizedRole === "jury" ? "/jury" : "/panel";
  const baseUrl =
    normalizeBaseUrl(baseUrlOverride) ||
    normalizeBaseUrl(settings?.platformBaseUrl) ||
    normalizeBaseUrl(env.corsOrigin) ||
    "http://localhost:4001";
  const loginUrl = `${baseUrl}${targetPath}`;
  const roleLabelFr = normalizedRole === "jury" ? "Jury" : "Modérateur";
  const roleLabelEn = normalizedRole === "jury" ? "Jury" : "Moderator";
  const subject = `marsAI 2026 · Invitation ${roleLabelFr}`;
  const text = [
    `Bonjour ${name || "membre"},`,
    "",
    `Vous avez été ajouté en tant que ${roleLabelFr} sur marsAI.`,
    `Accès : ${loginUrl}`,
    "",
    "Connectez-vous avec votre compte Google pré-enregistré.",
    "",
    "Équipe marsAI",
    "",
    `Hello ${name || "member"},`,
    "",
    `You have been added as ${roleLabelEn} on marsAI.`,
    `Access: ${loginUrl}`,
    "",
    "Sign in using your pre-registered Google account.",
    "",
    "marsAI team",
  ].join("\n");
  const bodyHtml = `
    <p>Bonjour ${name || "membre"},</p>
    <p>Vous avez été ajouté en tant que <strong>${roleLabelFr}</strong> sur marsAI.</p>
    <p><a href="${loginUrl}">Accéder à la plateforme</a></p>
    <p>Connectez-vous avec votre compte Google pré-enregistré.</p>
    <hr/>
    <p>Hello ${name || "member"},</p>
    <p>You have been added as <strong>${roleLabelEn}</strong> on marsAI.</p>
    <p><a href="${loginUrl}">Access the platform</a></p>
    <p>Sign in using your pre-registered Google account.</p>
    <p>marsAI team</p>
  `;
  const html = buildFestivalEmailHtml({
    title: "Invitation d’accès / Access invitation",
    subtitle: "marsAI 2026",
    bodyHtml,
    ctaLabel: "OPEN PLATFORM",
    ctaUrl: loginUrl,
  });
  const payload = await sendTransactionalEmail({
    to,
    toName: name,
    subject,
    text,
    html,
  });
  return { ok: true, messageId: payload.messageId };
}
