import { db } from "../config/db.js";

// Clés éditables depuis l'onglet Site
const EDITABLE_KEYS = [
    "phase1_close_iso",
    "phase2_catalogue_iso",
    "phase3_palmares_iso",
    "home_translation",
    "home_translations",
    "home_logo",
    "partners_logos",
    "submission_categories",
    "submission_ai_tool_suggestions",
    "submission_semantic_tags",
    "submission_countries",
    "submission_languages",
    "submission_jobs",
    "submission_discovery_sources",
    "submission_social_networks",
    "festival_theme_title",
    "festival_theme_quote",
    "festival_keywords",
    "festival_description",
    "home_hero_image_url",
    "platform_url",
];

export async function getEditableSettings() {
    const placeholders = EDITABLE_KEYS.map(() => "?").join(", ");
    const [rows] = await db.execute(
        `
        SELECT \`key\`, \`value\` FROM site_settings WHERE \`key\` IN (${placeholders})
        `,
        EDITABLE_KEYS
    );
    return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

export async function updateSettings(updates) {
    const conn = await db.getConnection();
    await conn.beginTransaction();
    try {
        for (const [key, value] of Object.entries(updates)) {
            if (!EDITABLE_KEYS.includes(key)) continue;
            await conn.execute(
                `INSERT INTO site_settings (\`key\`, \`value\`) 
                VALUES (?, ?) 
                ON DUPLICATE KEY UPDATE \`value\` = VALUES(\`value\`)`,
                [key, value]
            );
        }
        await conn.commit();
    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
}