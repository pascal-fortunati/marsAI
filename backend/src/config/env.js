import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = path.dirname(currentFilePath);
const backendEnvPath = path.resolve(currentDirPath, "../../.env");

dotenv.config({ path: backendEnvPath });

// Vérifie si une variable d'environnement requise est présente
function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Fichier .env manquant la variable: ${name}`);
  }
  return value;
}

// Récupère une variable d'environnement facultative avec une valeur par défaut
function optional(name, fallback = undefined) {
  const value = process.env[name];
  return value ?? fallback;
}

// Récupère l'environnement de l'application (par défaut : développement)
const nodeEnv = optional("NODE_ENV", "development");
const defaultCorsOrigin =
  nodeEnv === "development" ? "http://localhost:4001" : "";
const corsOrigins = String(optional("CORS_ORIGIN", defaultCorsOrigin))
  .split(",")
  .map((value) => value.trim().replace(/\/$/, ""))
  .filter(Boolean);

// Exporte les variables d'environnement nécessaires
export const env = {
  nodeEnv,
  port: Number(optional("PORT", "4000")),

  jwtSecret:
    process.env.JWT_SECRET ||
    (nodeEnv === "development"
      ? "dev_secret_change_me"
      : required("JWT_SECRET")),

  corsOrigin: corsOrigins[0] || "",
  corsOrigins,

  dbHost: optional("DB_HOST", "127.0.0.1"),
  dbPort: Number(optional("DB_PORT", "3306")),
  dbUser: optional("DB_USER", "root"),
  dbPassword: optional("DB_PASSWORD", ""),
  dbName: optional("DB_NAME", "marsai"),

  googleClientId: optional("GOOGLE_CLIENT_ID", ""),
  googleClientSecret: optional("GOOGLE_CLIENT_SECRET", ""),
  googleRedirectUri: optional("GOOGLE_REDIRECT_URI", ""),
  youtubeClientId: optional(
    "YOUTUBE_CLIENT_ID",
    optional("GOOGLE_CLIENT_ID", ""),
  ),
  youtubeClientSecret: optional(
    "YOUTUBE_CLIENT_SECRET",
    optional("GOOGLE_CLIENT_SECRET", ""),
  ),
  youtubeRedirectUri: optional(
    "YOUTUBE_REDIRECT_URI",
    optional("GOOGLE_REDIRECT_URI", ""),
  ),
  youtubeRefreshToken: optional(
    "YOUTUBE_REFRESH_TOKEN",
    optional("GOOGLE_REFRESH_TOKEN", ""),
  ),
  ffprobePath: optional("FFPROBE_PATH", "ffprobe"),

  brevoApiKey: optional("BREVO_API_KEY", ""),
  brevoSenderEmail: optional("BREVO_SENDER_EMAIL", ""),
  brevoSenderName: optional("BREVO_SENDER_NAME", "marsAI"),
  brevoTimeoutSeconds: Number(optional("BREVO_TIMEOUT_SECONDS", "60")),
  brevoMaxRetries: Number(optional("BREVO_MAX_RETRIES", "2")),

  scalewayAccessKey: optional(
    "SCALEWAY_ACCESS_KEY",
    optional("S3_ACCESS_KEY", ""),
  ),
  scalewaySecretKey: optional(
    "SCALEWAY_SECRET_KEY",
    optional("S3_SECRET_KEY", ""),
  ),
  scalewayEndpoint: optional("SCALEWAY_ENDPOINT", optional("S3_ENDPOINT", "")),
  scalewayBucketName: optional(
    "SCALEWAY_BUCKET_NAME",
    optional("S3_BUCKET_NAME", ""),
  ),
  scalewayRegion: optional("SCALEWAY_REGION", optional("S3_REGION", "")),
  scalewayFolder: optional("SCALEWAY_FOLDER", optional("S3_FOLDER", "")),
};
