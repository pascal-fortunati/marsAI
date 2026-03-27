import { OAuth2Client } from "google-auth-library";
import { env } from "../config/env.js";
import { getSettingsByKeys } from "../models/siteSettingsModel.js";
import { decryptSecret } from "./secretCipherService.js";

const settingsKeys = {
  youtubeOauthRefreshTokenEnc: "youtube_oauth_refresh_token_enc",
};

function getYoutubeOauthClient(refreshToken) {
  const client = new OAuth2Client(
    env.youtubeClientId,
    env.youtubeClientSecret,
    env.youtubeRedirectUri || undefined
  );
  client.setCredentials({ refresh_token: refreshToken });
  return client;
}

function normalizePrivacyStatus(value) {
  if (value === "private" || value === "unlisted" || value === "public")
    return value;
  return "private";
}

function normalizeTags(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((v) => String(v || "").trim())
    .filter(Boolean)
    .slice(0, 15);
}

function sanitizeText(value, fallback, maxLength) {
  const normalized = String(value || "").trim();
  const source = normalized || fallback;
  return source.slice(0, maxLength);
}

export function getYoutubeUploadConfigurationIssues() {
  const missing = [];
  if (!env.youtubeClientId) missing.push("YOUTUBE_CLIENT_ID");
  if (!env.youtubeClientSecret) missing.push("YOUTUBE_CLIENT_SECRET");
  if (!env.youtubeRedirectUri) missing.push("YOUTUBE_REDIRECT_URI");
  return missing;
}

export function isYoutubeUploadConfigured() {
  return getYoutubeUploadConfigurationIssues().length === 0;
}

async function resolveAccessToken(oauthClient) {
  const token = await oauthClient.getAccessToken();
  const value = typeof token === "string" ? token : token?.token;
  if (!value) {
    const err = new Error("Impossible de récupérer un access token YouTube");
    err.status = 503;
    throw err;
  }
  return value;
}

async function resolveRefreshToken() {
  const rows = await getSettingsByKeys([settingsKeys.youtubeOauthRefreshTokenEnc]);
  const map = new Map(rows.map((r) => [r.key, r.value]));
  const encrypted = map.get(settingsKeys.youtubeOauthRefreshTokenEnc) || "";
  const tokenFromSettings = decryptSecret(encrypted);
  const token = tokenFromSettings || env.youtubeRefreshToken || "";
  if (!token) {
    const err = new Error("Aucun refresh token YouTube configuré");
    err.status = 503;
    throw err;
  }
  return token;
}

export async function uploadSubmissionVideoToYoutube({
  title,
  description,
  tags,
  privacyStatus,
  videoStream,
  videoMimeType,
  videoSize,
}) {
  const missing = getYoutubeUploadConfigurationIssues();
  if (missing.length > 0) {
    const err = new Error(
      `Configuration YouTube incomplète (${missing.join(", ")})`
    );
    err.status = 503;
    throw err;
  }
  if (!videoStream) {
    const err = new Error("Flux vidéo YouTube manquant");
    err.status = 500;
    throw err;
  }

  const refreshToken = await resolveRefreshToken();
  const oauthClient = getYoutubeOauthClient(refreshToken);
  const accessToken = await resolveAccessToken(oauthClient);
  const safePrivacy = normalizePrivacyStatus(privacyStatus);
  const safeTags = normalizeTags(tags);
  const safeTitle = sanitizeText(title, "marsAI Submission", 100);
  const safeDescription = sanitizeText(
    description,
    "marsAI Festival submission",
    5000
  );
  const safeMime = String(videoMimeType || "video/mp4");
  const size = Number.isFinite(Number(videoSize))
    ? Math.max(0, Math.floor(Number(videoSize)))
    : null;

  const initHeaders = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json; charset=UTF-8",
    "X-Upload-Content-Type": safeMime,
    ...(size !== null ? { "X-Upload-Content-Length": String(size) } : {}),
  };

  const initRes = await fetch(
    "https://www.googleapis.com/upload/youtube/v3/videos?part=snippet,status&uploadType=resumable",
    {
      method: "POST",
      headers: initHeaders,
      body: JSON.stringify({
        snippet: {
          title: safeTitle,
          description: safeDescription,
          tags: safeTags,
          categoryId: "1",
        },
        status: {
          privacyStatus: safePrivacy,
          selfDeclaredMadeForKids: false,
        },
      }),
    }
  );

  if (!initRes.ok) {
    const details = await initRes.text().catch(() => "");
    const err = new Error(
      `YouTube init upload failed: ${initRes.status} ${details}`
    );
    err.status = 502;
    throw err;
  }

  const uploadUrl = initRes.headers.get("location");
  if (!uploadUrl) {
    const err = new Error("YouTube upload URL manquante");
    err.status = 502;
    throw err;
  }

  const uploadRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": safeMime,
      ...(size !== null ? { "Content-Length": String(size) } : {}),
    },
    body: videoStream,
    duplex: "half",
  });

  if (!uploadRes.ok) {
    const details = await uploadRes.text().catch(() => "");
    const err = new Error(
      `YouTube upload failed: ${uploadRes.status} ${details}`
    );
    err.status = 502;
    throw err;
  }

  const payload = await uploadRes.json().catch(() => null);
  const youtubeVideoId = typeof payload?.id === "string" ? payload.id : null;
  if (!youtubeVideoId) {
    const err = new Error("YouTube video id manquant");
    err.status = 502;
    throw err;
  }

  return {
    youtubeVideoId,
    payload,
  };
}
