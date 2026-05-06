import crypto from "node:crypto";
import { env } from "../config/env.js";

// Service pour chiffrer et déchiffrer des secrets
function getEncryptionKey() {
  return crypto
    .createHash("sha256")
    .update(`${env.jwtSecret}:marsai:youtube-oauth`)
    .digest();
}

// Chiffrer un secret
export function encryptSecret(plainText) {
  const text = String(plainText || "");
  if (!text) return null;
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `v1.${iv.toString("base64")}.${tag.toString("base64")}.${encrypted.toString("base64")}`;
}

// Déchiffrer un secret
export function decryptSecret(payload) {
  const value = String(payload || "");
  if (!value) return null;
  const parts = value.split(".");
  if (parts.length !== 4 || parts[0] !== "v1") return null;
  try {
    const iv = Buffer.from(parts[1], "base64");
    const tag = Buffer.from(parts[2], "base64");
    const encrypted = Buffer.from(parts[3], "base64");
    const key = getEncryptionKey();
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(tag);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
    return decrypted || null;
  } catch {
    return null;
  }
}