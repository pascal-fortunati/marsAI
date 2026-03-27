import { env } from "../config/env.js";
import { getSettingByKey } from "../models/siteSettingsModel.js";
import {
  buildGoogleOAuthState,
  getGoogleAuthRedirectUrl,
  getMe,
  handleGoogleCallback,
  parseGoogleOAuthState,
  safeRedirectPath,
} from "../services/authService.js";

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

async function resolvePreferredOrigin(req, explicitOrigin) {
  const platformSetting = await getSettingByKey("platform_base_url");
  const platformOrigin = normalizeOrigin(platformSetting?.value);
  const fallbackOrigin = normalizeOrigin(env.corsOrigin);
  const trustedOrigins = new Set(
    [platformOrigin, fallbackOrigin, ...env.corsOrigins.map(normalizeOrigin)]
      .filter((v) => typeof v === "string" && v.length > 0),
  );

  const fromExplicit = normalizeOrigin(explicitOrigin);
  if (fromExplicit && trustedOrigins.has(fromExplicit)) return fromExplicit;

  const fromHost = normalizeOrigin(`${req.protocol}://${req.get("host")}`);
  if (fromHost && trustedOrigins.has(fromHost)) return fromHost;

  if (platformOrigin) return platformOrigin;
  if (fallbackOrigin) return fallbackOrigin;
  return fromHost;
}

// Récupère l'URL de redirection pour l'authentification Google
export async function getGoogleAuth(req, res, next) {
  try {
    const redirectPath = safeRedirectPath(req.query.redirect);
    const fallbackOrigin = await resolvePreferredOrigin(req, req.query.origin);
    const oauthState = buildGoogleOAuthState({
      redirectPath,
      origin: fallbackOrigin,
    });
    const url = getGoogleAuthRedirectUrl({ oauthState });
    return res.redirect(url);
  } catch (err) {
    next(err);
  }
}

// Gère le callback d'authentification Google
export async function getGoogleCallback(req, res, next) {
  const stateData = parseGoogleOAuthState(req.query.state);
  const state = stateData.redirectPath;
  const origin = await resolvePreferredOrigin(req, stateData.origin);
  const redirectError = (message, status = 400) => {
    if (state && origin) {
      const target = `${origin}${state}?authError=${encodeURIComponent(message)}`;
      return res.redirect(target);
    }
    return res.status(status).json({ error: message });
  };
  try {
    const providerError = typeof req.query.error === "string" ? req.query.error : "";
    const providerErrorDescription =
      typeof req.query.error_description === "string" ? req.query.error_description : providerError;
    if (providerError) {
      return redirectError(providerErrorDescription || "Google authentication failed", 400);
    }

    const code = req.query.code;
    if (!code || typeof code !== "string") {
      return redirectError("Missing code", 400);
    }

    const result = await handleGoogleCallback({ code });

    if (state && origin) {
      const target = `${origin}${state}#token=${encodeURIComponent(result.token)}`;
      return res.redirect(target);
    }

    return res.json(result);
  } catch (err) {
    if (state && origin) {
      const status = typeof err?.status === "number" ? err.status : 500;
      const message = err instanceof Error ? err.message : "Authentication failed";
      return redirectError(message, status);
    }
    next(err);
  }
}

// Récupère les informations de l'utilisateur authentifié
export async function getAuthMe(req, res, next) {
  try {
    const payload = await getMe({ googleSubId: req.user.sub });
    return res.json({
      user: {
        ...payload.user,
        avatarUrl: typeof req.user.avatarUrl === "string" ? req.user.avatarUrl : null,
      },
    });
  } catch (err) {
    next(err);
  }
}

// Déconnecte l'utilisateur
export function getLogout(_req, res) {
  res.json({ ok: true });
}
