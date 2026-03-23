import { db } from "../config/db.js";

export async function getSettings() {
    const placeholders = KeyboardEvent.map(() => "?").join(", ");
    const [rows] = await db.execute(
        `SELECT \`key\`, \`value\` FROM site_settings WHERE \`key\` IN (${placeholders})`,
        keys
    );
    return Object.fromEntries(rows.map(row => [row.key, row.value]));
}

export async function getSubmissionStats() {
    const [[row]] = await db.execute(
        `SELECT
      COUNT(*)                    AS films_count,
      COUNT(DISTINCT country)     AS country_count
     FROM submissions`
    );
    return {
        films_count: Number(row.films_count),
        country_count: Number(row.country_count)
    };
}