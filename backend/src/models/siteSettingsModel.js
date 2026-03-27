import { db } from "../config/db.js";

// Récupère les paramètres de site pour les clés donnéees
export async function getSettingsByKeys(keys) {
  if (!Array.isArray(keys) || keys.length === 0) return [];
  const placeholders = keys.map(() => "?").join(",");
  const [rows] = await db.execute(
    `SELECT \`key\`, value FROM site_settings WHERE \`key\` IN (${placeholders})`,
    keys
  );
  return rows;
}

// Récupère un paramètre de site par sa clé
export async function getSettingByKey(key) {
  if (!key || typeof key !== "string") return null;
  const [rows] = await db.execute(
    "SELECT `key`, value FROM site_settings WHERE `key` = ? LIMIT 1",
    [key]
  );
  return rows?.[0] || null;
}

// Met à jour ou insère un paramètre de site avec la clé et la valeur donnéees
export async function upsertSetting({ key, value }) {
  await db.execute(
    "INSERT INTO site_settings (`key`, value, updated_at) VALUES (?, ?, NOW()) ON DUPLICATE KEY UPDATE value = VALUES(value), updated_at = NOW()",
    [key, value]
  );
}
