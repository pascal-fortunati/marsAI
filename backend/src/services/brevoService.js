import { BrevoClient } from "@getbrevo/brevo";
import { env } from "../config/env.js";
import { getSettingByKey } from "../models/siteSettingsModel.js";
import { ensureFestivalEmailHtml } from "./emailTemplate.js";

let brevoClient = null;

function getBrevoSenderName() {
  return String(env.brevoSenderName || "marsAI").trim();
}

export function isBrevoConfigured() {
  return Boolean(String(env.brevoApiKey || "").trim());
}

function normalizeTimeoutInSeconds(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return undefined;
  return Math.floor(n);
}

function normalizeMaxRetries(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return undefined;
  return Math.floor(n);
}

function getBrevoClient() {
  if (!isBrevoConfigured()) {
    const err = new Error("La configuration complète de Brevo est requise");
    err.status = 500;
    throw err;
  }

  if (!brevoClient) {
    const timeoutInSeconds = normalizeTimeoutInSeconds(env.brevoTimeoutSeconds);
    const maxRetries = normalizeMaxRetries(env.brevoMaxRetries);
    brevoClient = new BrevoClient({
      apiKey: String(env.brevoApiKey || "").trim(),
      timeoutInSeconds,
      maxRetries,
    });
  }

  return brevoClient;
}

async function getBrevoSenderEmailRuntime() {
  const envEmail = String(env.brevoSenderEmail || "").trim();
  try {
    const row = await getSettingByKey("brevo_sender_email");
    const dbEmail = String(row?.value || "").trim();
    return dbEmail || envEmail;
  } catch {
    return envEmail;
  }
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

async function getPlatformBaseUrlRuntime() {
  const envOrigin = normalizeBaseUrl(env.corsOrigin);
  try {
    const row = await getSettingByKey("platform_base_url");
    const dbBaseUrl = normalizeBaseUrl(row?.value);
    return dbBaseUrl || envOrigin;
  } catch {
    return envOrigin;
  }
}

function resolveLogoUrl(rawLogoUrl, platformBaseUrl) {
  const value = String(rawLogoUrl || "").trim();
  if (!value) return "";
  if (/^data:image\//i.test(value)) return value;
  if (/^https?:\/\//i.test(value)) return value;
  if (!platformBaseUrl) return value.startsWith("/") ? value : `/${value}`;
  return value.startsWith("/")
    ? `${platformBaseUrl}${value}`
    : `${platformBaseUrl}/${value}`;
}

async function getEmailLogoUrlRuntime(platformBaseUrl) {
  try {
    const row = await getSettingByKey("site_logo");
    const fromSettings = resolveLogoUrl(row?.value, platformBaseUrl);
    if (fromSettings) return fromSettings;
  } catch {
    return platformBaseUrl
      ? `${platformBaseUrl}/src/assets/mars_ai_logo.png`
      : "";
  }
  if (platformBaseUrl) return `${platformBaseUrl}/src/assets/mars_ai_logo.png`;
  return "";
}

export async function sendTransactionalEmail({
  to,
  toName,
  subject,
  text,
  html,
  replyTo,
}) {
  const targetEmail = String(to || "").trim();
  if (!targetEmail) {
    const err = new Error("L'email du destinataire est requis");
    err.status = 400;
    throw err;
  }

  const senderEmail = await getBrevoSenderEmailRuntime();
  const senderName = getBrevoSenderName();
  if (!senderEmail) {
    const err = new Error("L'email expéditeur Brevo est requis");
    err.status = 500;
    throw err;
  }
  const client = getBrevoClient();
  const platformBaseUrl = await getPlatformBaseUrlRuntime();
  const logoUrl = await getEmailLogoUrlRuntime(platformBaseUrl);
  const htmlContent = ensureFestivalEmailHtml({
    html,
    text,
    title: String(subject || "marsAI 2026"),
    subtitle: "marsAI 2026 · Festival de courts-métrages IA",
    logoUrl,
  });

  const result = await client.transactionalEmails.sendTransacEmail({
    subject: String(subject || ""),
    textContent: text ? String(text) : undefined,
    htmlContent: htmlContent || undefined,
    sender: {
      email: senderEmail,
      name: senderName,
    },
    to: [
      {
        email: targetEmail,
        name: toName ? String(toName) : undefined,
      },
    ],
    replyTo: replyTo?.email
      ? {
          email: String(replyTo.email),
          name: replyTo.name ? String(replyTo.name) : undefined,
        }
      : undefined,
  });

  return {
    ok: true,
    messageId: result?.messageId || result?.messageIds?.[0] || null,
    result,
  };
}
