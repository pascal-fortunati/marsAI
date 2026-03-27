import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { env } from "../config/env.js";
import { getSettingsByKeys, upsertSetting } from "../models/siteSettingsModel.js";
import { decryptSecret, encryptSecret } from "./secretCipherService.js";

// Service pour gérer la connexion à la chaîne YouTube
const keys = {
  youtubeChannelId: "youtube_channel_id",
  youtubeChannelName: "youtube_channel_name",
  youtubeOauthRefreshTokenEnc: "youtube_oauth_refresh_token_enc",
  youtubeOauthConnectedAt: "youtube_oauth_connected_at",
};

// Service pour créer un client OAuth2 pour YouTube
function getOauthClient() {
  if (!env.youtubeClientId || !env.youtubeClientSecret || !env.youtubeRedirectUri) {
    const err = new Error("Configuration OAuth YouTube incomplète");
    err.status = 503;
    throw err;
  }
  return new OAuth2Client({
    clientId: env.youtubeClientId,
    clientSecret: env.youtubeClientSecret,
    redirectUri: env.youtubeRedirectUri,
  });
}

// Service pour encoder et décoder le token d'état OAuth2
function encodeStateToken({ userId, role }) {
  return jwt.sign(
    {
      scope: "youtube_oauth_connect",
      userId: String(userId || ""),
      role: String(role || ""),
    },
    env.jwtSecret,
    { expiresIn: "15m" },
  );
}

// Service pour décoder le token d'état OAuth2
function decodeStateToken(value) {
  const payload = jwt.verify(String(value || ""), env.jwtSecret);
  if (!payload || payload.scope !== "youtube_oauth_connect") {
    const err = new Error("State OAuth YouTube invalide");
    err.status = 400;
    throw err;
  }
  return payload;
}

// Service pour récupérer les tokens stockés chiffrés
async function getStoredTokenMap() {
  const rows = await getSettingsByKeys(Object.values(keys));
  return new Map(rows.map((r) => [r.key, r.value]));
}

// Service pour résoudre le token de rafraîchissement stocké chiffré
async function resolveStoredRefreshToken() {
  const map = await getStoredTokenMap();
  const encrypted = map.get(keys.youtubeOauthRefreshTokenEnc) || "";
  return decryptSecret(encrypted);
}

// Service pour résoudre l'access token OAuth2
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

// Service pour récupérer les informations de la chaîne YouTube connectée
async function fetchConnectedChannel({ accessToken }) {
  const response = await fetch("https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const message = payload?.error?.message || "Impossible de lire la chaîne YouTube connectée";
    const err = new Error(message);
    err.status = 502;
    throw err;
  }
  const first = Array.isArray(payload?.items) ? payload.items[0] : null;
  const channelId = typeof first?.id === "string" ? first.id : "";
  const channelName = typeof first?.snippet?.title === "string" ? first.snippet.title : "";
  if (!channelId) {
    const err = new Error("Aucune chaîne YouTube disponible pour ce compte");
    err.status = 400;
    throw err;
  }
  return { channelId, channelName: channelName || null };
}

// Service pour générer l'URL de connexion OAuth2 YouTube
export function getYoutubeConnectUrl({ userId, role }) {
  const oauthClient = getOauthClient();
  const state = encodeStateToken({ userId, role });
  return oauthClient.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    include_granted_scopes: true,
    scope: [
      "https://www.googleapis.com/auth/youtube.upload",
      "https://www.googleapis.com/auth/youtube.readonly",
    ],
    state,
  });
}

// Service pour gérer le callback d'OAuth2 YouTube
export async function handleYoutubeConnectCallback({ code, state }) {
  decodeStateToken(state);
  const oauthClient = getOauthClient();
  const result = await oauthClient.getToken(String(code || ""));
  const freshRefreshToken = typeof result?.tokens?.refresh_token === "string" ? result.tokens.refresh_token : null;
  const previousRefreshToken = await resolveStoredRefreshToken();
  const refreshToken = freshRefreshToken || previousRefreshToken;
  if (!refreshToken) {
    const err = new Error("Aucun refresh token YouTube reçu");
    err.status = 400;
    throw err;
  }
  oauthClient.setCredentials({ refresh_token: refreshToken });
  const accessToken =
    typeof result?.tokens?.access_token === "string" && result.tokens.access_token
      ? result.tokens.access_token
      : await resolveAccessToken(oauthClient);
  const channel = await fetchConnectedChannel({ accessToken });
  const encryptedRefreshToken = encryptSecret(refreshToken);
  await upsertSetting({ key: keys.youtubeOauthRefreshTokenEnc, value: encryptedRefreshToken });
  await upsertSetting({ key: keys.youtubeOauthConnectedAt, value: new Date().toISOString() });
  await upsertSetting({ key: keys.youtubeChannelId, value: channel.channelId });
  await upsertSetting({ key: keys.youtubeChannelName, value: channel.channelName });
  return {
    connected: true,
    youtubeChannelId: channel.channelId,
    youtubeChannelName: channel.channelName,
  };
}

// Service pour récupérer l'état de connexion YouTube
export async function getYoutubeConnectionStatus() {
  const map = await getStoredTokenMap();
  const encrypted = map.get(keys.youtubeOauthRefreshTokenEnc) || "";
  return {
    connected: Boolean(encrypted && decryptSecret(encrypted)),
    youtubeChannelId: map.get(keys.youtubeChannelId) || null,
    youtubeChannelName: map.get(keys.youtubeChannelName) || null,
    connectedAt: map.get(keys.youtubeOauthConnectedAt) || null,
  };
}

// Service pour déconnecter la connexion YouTube
export async function disconnectYoutubeConnection() {
  await upsertSetting({ key: keys.youtubeOauthRefreshTokenEnc, value: null });
  await upsertSetting({ key: keys.youtubeOauthConnectedAt, value: null });
  await upsertSetting({ key: keys.youtubeChannelId, value: null });
  await upsertSetting({ key: keys.youtubeChannelName, value: null });
  return { ok: true };
}