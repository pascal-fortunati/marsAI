import { getEditableSettings, updateSettings } from "../models/adminSettingsModel.js";
import { invalidateHomeCache } from "./homeController.js";

function invalidateSiteCache() {
    invalidateHomeCache();
}

// Get api/admin/settings
export async function getSettings(req, res) {
    try {
        const settings = await getEditableSettings();
        return res.json(settings);
    } catch (err) {
        console.error("[getSettings]", err);
        return res.status(500).json({ error: "Erreur serveur" });
    }
}

// POST /api/admin/settings
export async function postSettings(req, res) {
    try {
        await updateSettings(req.body);
        invalidateSiteCache();
        return res.json({ ok: true });
    } catch (err) {
        console.error("[postSettings]", err);
        return res.status(500).json({ error: "Erreur serveur" });
    }
}

// POST /api/admin/settings/invalidate-cache
export function postInvalidateCache(req, res) {
    invalidateSiteCache();
    return res.json({ ok: true });
}