import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import path from "node:path";
import { env } from "./config/env.js";
import { createOpenApiSpec } from "./swagger.js";
import { authRouter } from "./routes/auth.js";
import { healthRouter } from "./routes/health.js";
import { siteRouter } from "./routes/site.js";
import { adminSiteRouter } from "./routes/adminSite.js";
import { catalogueRouter } from "./routes/catalogue.js";
import { palmaresRouter } from "./routes/palmares.js";
import { juryRouter } from "./routes/jury.js";
import { adminSubmissionsRouter } from "./routes/adminSubmissions.js";
import { adminJuryRouter } from "./routes/adminJury.js";
import { usersRouter } from "./routes/users.js";
import { submissionsRouter } from "./routes/submissions.js";
import { getSettingByKey } from "./models/siteSettingsModel.js";

// Normalise les origines CORS
function normalizeOrigin(value) {
  if (!value || typeof value !== "string") return null;
  const raw = value.trim();
  if (!raw) return null;
  try {
    const parsed = new URL(raw);
    return parsed.origin;
  } catch {
    const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    try {
      return new URL(withProtocol).origin;
    } catch {
      return null;
    }
  }
}

const normalizedCorsOrigins = new Set(
  env.corsOrigins.map(normalizeOrigin).filter(Boolean),
);

let cachedPlatformOrigin = null;
let cachedPlatformOriginAt = 0;

// Récupère l'origine de plateforme (platform_base_url) en cache
async function getPlatformOriginCached() {
  const now = Date.now();
  if (now - cachedPlatformOriginAt < 30_000) return cachedPlatformOrigin;
  cachedPlatformOriginAt = now;
  const row = await getSettingByKey("platform_base_url");
  cachedPlatformOrigin = normalizeOrigin(row?.value);
  return cachedPlatformOrigin;
}

// Vérifie si l'origine de la requête est la même que l'origine de plateforme
function isSameHostOrigin(req, normalizedOrigin) {
  if (!normalizedOrigin) return false;
  try {
    const originUrl = new URL(normalizedOrigin);
    const forwardedHost = String(req.get("x-forwarded-host") || "")
      .split(",")[0]
      .trim()
      .toLowerCase();
    const requestHost = String(req.get("host") || "")
      .trim()
      .toLowerCase();
    const effectiveHost = forwardedHost || requestHost;
    if (!effectiveHost) return false;
    return originUrl.host.toLowerCase() === effectiveHost;
  } catch {
    return false;
  }
}

// Vérifie si la requête est une requête de bootstrap de la plateforme
function isPlatformBootstrapRequest(req) {
  const method = String(req.method || "").toUpperCase();
  return (
    (method === "PUT" || method === "OPTIONS") &&
    String(req.path || "").startsWith("/api/admin/site")
  );
}

// Vérifie si l'origine de la requête est une origine de développement (LAN)
function isLanDevOrigin(origin) {
  const isPrivateLanIp = (host) => {
    if (host === "localhost" || host === "127.0.0.1") return true;
    if (/^10(?:\.\d{1,3}){3}$/.test(host)) return true;
    if (/^192\.168(?:\.\d{1,3}){2}$/.test(host)) return true;
    const match172 = /^172\.(\d{1,3})(?:\.\d{1,3}){2}$/.exec(host);
    if (!match172) return false;
    const secondOctet = Number(match172[1]);
    return secondOctet >= 16 && secondOctet <= 31;
  };

  try {
    const parsed = new URL(origin);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:")
      return false;
    if (parsed.port !== "4001") return false;
    if (isPrivateLanIp(parsed.hostname)) return true;
    const nipMatch =
      /(?:^|\.)(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\.nip\.io$/i.exec(
        parsed.hostname,
      );
    if (!nipMatch) return false;
    return isPrivateLanIp(nipMatch[1]);
  } catch {
    return false;
  }
}

// Service pour créer une instance d'application Express
export function createApp() {
  const app = express();

  app.use(
    cors(async (req, callback) => {
      const origin = req.get("origin");
      if (!origin) return callback(null, { credentials: true, origin: true });

      const normalizedOrigin = normalizeOrigin(origin);
      if (normalizedOrigin && normalizedCorsOrigins.has(normalizedOrigin)) {
        return callback(null, { credentials: true, origin: true });
      }
      if (env.nodeEnv === "development" && isLanDevOrigin(origin)) {
        return callback(null, { credentials: true, origin: true });
      }
      const platformOrigin = await getPlatformOriginCached().catch(() => null);
      if (normalizedOrigin && platformOrigin === normalizedOrigin) {
        return callback(null, { credentials: true, origin: true });
      }
      if (
        !platformOrigin &&
        normalizedOrigin &&
        isPlatformBootstrapRequest(req)
      ) {
        return callback(null, { credentials: true, origin: true });
      }
      if (isSameHostOrigin(req, normalizedOrigin)) {
        return callback(null, { credentials: true, origin: true });
      }
      const err = new Error("Origine CORS non autorisée");
      err.status = 403;
      return callback(err);
    }),
  );

  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true }));

  app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));
  app.use(
    "/partners",
    express.static(
      path.resolve(process.cwd(), "..", "frontend", "public", "partners"),
    ),
  );

  // Serve static files (images, videos, etc) from frontend/public
  // This must be BEFORE API routes and before the 404 handler
  app.use(express.static(
    path.resolve(process.cwd(), "..", "frontend", "public")
  ));

  app.use("/api", healthRouter);
  app.use("/api", authRouter);
  app.use("/api", siteRouter);
  app.use("/api", submissionsRouter);
  app.use("/api", catalogueRouter);
  app.use("/api", palmaresRouter);
  app.use("/api", juryRouter);
  app.use("/api", adminSiteRouter);
  app.use("/api", adminSubmissionsRouter);
  app.use("/api", adminJuryRouter);
  app.use("/api", usersRouter);

  const spec = createOpenApiSpec();
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(spec));

  app.use((req, res) => {
    res.status(404).json({ error: "Route non trouvée" });
  });

  app.use((err, req, res, _next) => {
    const status = Number(err?.status) || 500;
    const baseMessage = err?.message || "Erreur interne du serveur";
    const code = typeof err?.code === "string" ? err.code : null;
    const sqlMessage =
      typeof err?.sqlMessage === "string" ? err.sqlMessage : null;
    const error = code && sqlMessage ? `${code}: ${sqlMessage}` : baseMessage;

    const payload =
      env.nodeEnv === "development"
        ? {
          error,
          stack: err?.stack,
          code,
          errno: typeof err?.errno === "number" ? err.errno : null,
          sqlState: typeof err?.sqlState === "string" ? err.sqlState : null,
          sql: typeof err?.sql === "string" ? err.sql : null,
          meta:
            typeof err?.meta === "object" && err.meta !== null
              ? err.meta
              : null,
        }
        : { error };
    res.status(status).json(payload);
  });

  return app;
}
