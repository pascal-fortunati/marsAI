import { sendTransactionalEmail } from "./brevoService.js";
import { getFestivalSettings } from "./siteSettingsService.js";
import { buildFestivalEmailHtml } from "./emailTemplate.js";

// Service pour vérifier si la langue est en français
function isFrenchLanguage(value) {
  const raw = String(value || "").toLowerCase();
  return (
    raw.includes("fr") || raw.includes("français") || raw.includes("french")
  );
}

// Service pour normaliser le statut d'une soumission
function normalizeStatus(status) {
  const s = String(status || "").toLowerCase();
  if (s === "selected") return "selected";
  if (s === "refused") return "refused";
  if (s === "review") return "review";
  if (s === "validated") return "validated";
  return "pending";
}

function applyTemplateVars(template, vars) {
  return String(template || "").replace(
    /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g,
    (_, key) => String(vars?.[key] ?? "")
  );
}

function buildLocalizedCopy({
  isFr,
  directorName,
  juryReason,
  templates,
  filmTitle,
  status,
}) {
  const langTemplate = isFr ? templates?.fr || {} : templates?.en || {};
  const vars = {
    filmTitle: filmTitle || "",
    festival_name: "marsAI 2026",
    artist_name:
      directorName || (isFr ? "réalisatrice/réalisateur" : "director"),
    decision_date: new Date().toISOString().slice(0, 10),
    stage: status || "",
    contact_email: "contact@marsai.festival",
    directorName:
      directorName || (isFr ? "réalisatrice/réalisateur" : "director"),
  };
  const subject = applyTemplateVars(langTemplate.subject, vars);
  const title = applyTemplateVars(langTemplate.title, vars);
  const body = applyTemplateVars(langTemplate.body, vars);
  const reason = juryReason
    ? isFr
      ? `\n\nMotif (commentaires jury)\n${juryReason}`
      : `\n\nReason (jury comments)\n${juryReason}`
    : "";
  const text = [
    isFr
      ? `Bonjour ${directorName || "réalisatrice/réalisateur"},`
      : `Hello ${directorName || "director"},`,
    "",
    body,
    reason,
    "",
    isFr ? "Cordialement," : "Kind regards,",
    isFr ? "Équipe marsAI" : "marsAI team",
  ].join("\n");
  const reasonHtml = juryReason
    ? isFr
      ? `<p><strong>Motif (commentaires jury)</strong><br/>${juryReason.replace(
          /\n/g,
          "<br/>"
        )}</p>`
      : `<p><strong>Reason (jury comments)</strong><br/>${juryReason.replace(
          /\n/g,
          "<br/>"
        )}</p>`
    : "";
  const html = `
    <p>${isFr ? "Bonjour" : "Hello"} ${
    directorName || (isFr ? "réalisatrice/réalisateur" : "director")
  },</p>
    <p>${body}</p>
    ${reasonHtml}
    <p>${isFr ? "Cordialement" : "Kind regards"},<br/>${
    isFr ? "Équipe marsAI" : "marsAI team"
  }</p>
  `;
  return {
    subject,
    title,
    text,
    html,
  };
}

// Service pour envoyer l'email de décision d'une soumission
export async function sendSubmissionDecisionEmail({
  to,
  directorName,
  filmTitle,
  language,
  status,
  juryReason,
}) {
  const normalized = normalizeStatus(status);
  const isFr = isFrenchLanguage(language);
  const settings = await getFestivalSettings();
  const decisionTemplates = settings?.emailDecisionTemplates || {};
  const templateByStatus =
    decisionTemplates?.[normalized] || decisionTemplates?.pending || {};
  const copy = buildLocalizedCopy({
    isFr,
    directorName,
    juryReason,
    templates: templateByStatus,
    filmTitle,
    status: normalized,
  });
  const payload = await sendTransactionalEmail({
    to,
    toName: directorName,
    subject: copy.subject,
    text: copy.text,
    html: buildFestivalEmailHtml({
      title: copy.title || (isFr ? "Décision du jury" : "Jury decision"),
      subtitle: isFr
        ? "Mise à jour de votre soumission marsAI 2026"
        : "Update for your marsAI 2026 submission",
      bodyHtml: copy.html,
    }),
  });
  return { ok: true, messageId: payload.messageId };
}
