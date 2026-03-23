import { getSettings, getSubmissionStats } from "../models/homeModel.js";

const SETTING_KEYS = [
    "phase1_close_iso",
    "phase2_catalogue_iso",
    "phase3_palmares_iso",
    "home_translation",
    "partners_logos",
    "home_logo",
    "submission_categories",
    "submission_ai_tool_suggestions",
    "submission_semantic_tags",
    "submission_countries",
    "submission_languages",
    "submission_jobs",
    "submission_discovery_sources",
    "submission_social_networks",
];

function Phase(settings) {
    const now = Date.now();
    const p1 = new Date(settings.phase1_close_iso).getTime();
    const p2 = new Date(settings.phase2_catalogue_iso).getTime();
    const p3 = new Date(settings.phase3_palmares_iso).getTime();

    if (isNaN(p1)) return 1;

    if (now < p1) return 1;
    if (now < p2) return 2;
    if (now < p3) return 3;
    return 4;
}

export async function getHomeData() {
    const [settings, stats] = await Promise.all([
        getSettings(SETTING_KEYS),
        getSubmissionStats(),
    ]);

    const phase = Phase(settings);

    const safeJson = (val, fallback) => {
        try { return val ? JSON.parse(val) : fallback; }
        catch { return fallback; }
    };

    return {
        phase,
        dates: {
            phase1_close: settings.phase1_close_iso ?? null,
            phase2_catalogue: settings.phase2_catalogue_iso ?? null,
            phase3_palmares: settings.phase3_palmares_iso ?? null,
        },

        stats: {
            countries: stats.country_count,
            films: stats.film_count,
            visitors: 3000,
        },

        translation: safeJson(settings.home_translation, {}),

        home_logo: settings.home_logo ?? null,
        partners_logos: safeJson(settings.partners_logos, []),

        form_options: {
            categories: safeJson(settings.submission_categories, []),
            ai_tool_suggestions: safeJson(settings.submission_ai_tool_suggestions, []),
            semantic_tags: safeJson(settings.submission_semantic_tags, []),
            countries: safeJson(settings.submission_countries, []),
            languages: safeJson(settings.submission_languages, []),
            jobs: safeJson(settings.submission_jobs, []),
            discovery_sources: safeJson(settings.submission_discovery_sources, []),
            social_networks: safeJson(settings.submission_social_networks, {}),
        }
    }
}