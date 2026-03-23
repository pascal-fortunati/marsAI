import { getHomeData } from "../services/homeService.js";

let cache = null;
let cacheExpiratesAt = 0;
const CACHE_TTL_MS = 60_000;

export async function getHome(req, res) {
    try {
        const now = Date.now();
        if (cache && now < cacheExpiratesAt) {
            return res.json(cache);
        }

        const data = await getHomeData();
        cache = data;
        cacheExpiratesAt = now + CACHE_TTL_MS;

        return res.json(data);
    } catch (err) {
        console.error("[getHome]", err);
        return res.status(500).json({ error: "Erreur serveur" });
    }
}

export function invalidateHomeCache() {
    cache = null;
    cacheExpiratesAt = 0;
}