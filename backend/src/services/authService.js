import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { env } from "../config/env.js";
import { findUserByEmail, findUserByGoogleSubId, updateUserGoogleIdentity } from "../models/usersModel.js";

// Service pour obtenir le client OAuth2 Google
function getOauthClient() {
  if (!env.googleClientId || !env.googleClientSecret || !env.googleRedirectUri) {
    return null;
  }

  return new OAuth2Client({
    clientId: env.googleClientId,
    clientSecret: env.googleClientSecret,
    redirectUri: env.googleRedirectUri,
  });
}

// Service pour valider et sécuriser le chemin de redirection Google
export function safeRedirectPath(value) {
  if (!value || typeof value !== "string") return null;
  if (!value.startsWith("/")) return null;
  if (value.startsWith("//")) return null;
  if (value.includes("\n") || value.includes("\r")) return null;
  return value;
}

export function safeAllowedOrigin(value) {
  if (!value || typeof value !== "string") return null;
  const rawValue = value.trim();
  if (!rawValue) return null;
  try {
    const parsed = new URL(rawValue);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
    const raw = `${parsed.protocol}//${parsed.host}`;
    if (env.corsOrigins.includes(raw)) return raw;
    if (env.nodeEnv !== "development") return null;
    const host = parsed.hostname;
    if (host === "localhost" || host === "127.0.0.1") return raw;
    if (/^10(?:\.\d{1,3}){3}$/.test(host)) return raw;
    if (/^192\.168(?:\.\d{1,3}){2}$/.test(host)) return raw;
    const match172 = /^172\.(\d{1,3})(?:\.\d{1,3}){2}$/.exec(host);
    if (match172) {
      const secondOctet = Number(match172[1]);
      if (secondOctet >= 16 && secondOctet <= 31) return raw;
    }
    const nipMatch =
      /(?:^|\.)(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\.nip\.io$/i.exec(host);
    if (!nipMatch) return null;
    const ip = nipMatch[1];
    if (/^10(?:\.\d{1,3}){3}$/.test(ip)) return raw;
    if (/^192\.168(?:\.\d{1,3}){2}$/.test(ip)) return raw;
    const m172 = /^172\.(\d{1,3})(?:\.\d{1,3}){2}$/.exec(ip);
    if (!m172) return null;
    const so = Number(m172[1]);
    return so >= 16 && so <= 31 ? raw : null;
  } catch {
    return null;
  }
}

function encodeOAuthState(value) {
  return Buffer.from(JSON.stringify(value), "utf8").toString("base64url");
}

function decodeOAuthState(value) {
  try {
    const json = Buffer.from(String(value || ""), "base64url").toString("utf8");
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function buildGoogleOAuthState({ redirectPath, origin }) {
  const payload = {};
  if (redirectPath) payload.redirectPath = redirectPath;
  if (origin) payload.origin = origin;
  if (!payload.redirectPath && !payload.origin) return null;
  return encodeOAuthState(payload);
}

export function parseGoogleOAuthState(rawState) {
  const decoded = decodeOAuthState(rawState);
  if (decoded && typeof decoded === "object") {
    return {
      redirectPath: safeRedirectPath(decoded.redirectPath),
      origin: safeAllowedOrigin(decoded.origin),
    };
  }
  return {
    redirectPath: safeRedirectPath(rawState),
    origin: null,
  };
}

// Service pour générer l'URL de redirection Google OAuth
export function getGoogleAuthRedirectUrl({ oauthState }) {
  const oauthClient = getOauthClient();
  if (!oauthClient) {
    const err = new Error("Google OAuth n'est pas configuré");
    err.status = 503;
    throw err;
  }

  return oauthClient.generateAuthUrl({
    access_type: "offline",
    scope: ["openid", "email", "profile"],
    prompt: "consent",
    ...(oauthState ? { state: oauthState } : {}),
  });
}

// Service pour traiter le callback Google OAuth
export async function handleGoogleCallback({ code }) {
  const oauthClient = getOauthClient();
  if (!oauthClient) {
    const err = new Error("Google OAuth n'est pas configuré");
    err.status = 503;
    throw err;
  }

  const { tokens } = await oauthClient.getToken(code);
  const idToken = tokens.id_token;
  const accessToken = tokens.access_token;
  if (!idToken) {
    const err = new Error("id_token manquant");
    err.status = 400;
    throw err;
  }

  const ticket = await oauthClient.verifyIdToken({
    idToken,
    audience: env.googleClientId,
  });

  const payload = ticket.getPayload();
  const googleSubId = payload?.sub;
  const email = payload?.email;
  const name = payload?.name;

  if (!googleSubId || !email || !name) {
    const err = new Error("Profil Google invalide");
    err.status = 400;
    throw err;
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  let user = await findUserByGoogleSubId(googleSubId);
  if (!user) {
    const emailMatch = await findUserByEmail(normalizedEmail);
    if (emailMatch) {
      await updateUserGoogleIdentity({ userId: emailMatch.id, googleSubId, name });
      user = { ...emailMatch, google_sub_id: googleSubId, name };
    } else {
      const err = new Error("Accès non autorisé");
      err.status = 403;
      throw err;
    }
  }

  let avatarUrl = null;
  if (accessToken) {
    try {
      const res = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        const userInfo = await res.json();
        if (userInfo && typeof userInfo.picture === "string") {
          avatarUrl = userInfo.picture;
        }
      }
    } catch {
      avatarUrl = null;
    }
  }

  const token = jwt.sign(
    { sub: user.google_sub_id, role: user.role, userId: user.id, avatarUrl },
    env.jwtSecret,
    { expiresIn: "7d" },
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatarUrl,
    },
  };
}

// Service pour obtenir les informations de l'utilisateur connecté
export async function getMe({ googleSubId }) {
  const user = await findUserByGoogleSubId(googleSubId);
  if (!user) {
    const err = new Error("Utilisateur non trouvé");
    err.status = 404;
    throw err;
  }

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  };
}
