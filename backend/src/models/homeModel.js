import { db } from "../config/db.js";

export async function getSettings(keys = []) {
    if (keys.length === 0) return {};
    const placeholders = keys.map(() => "?").join(", ");
    const [rows] = await db.execute(
        `SELECT \`key\`, \`value\` FROM site_settings WHERE \`key\` IN (${placeholders})`,
        keys
    );
    return Object.fromEntries(rows.map(row => [row.key, row.value]));
}

export async function getSubmissionStats() {
    const [[row]] = await db.execute(
        `SELECT
      COUNT(*)                    AS film_count,
      COUNT(DISTINCT country)     AS country_count
     FROM submissions`
    );
    return {
        film_count: Number(row.film_count),
        country_count: Number(row.country_count)
    };
}