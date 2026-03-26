import { getAllFilms, getAdminStats, insertDecision } from "../models/adminModel.js"

// GET /api/admin/films
export async function getAdminFilms(req, res) {
    try {
        const [films, stats] = await Promise.all([getAllFilms(), getAdminStats()]);
        return res.json({ films, stats });
    } catch (err) {
        console.error("[getAdminFilms]", err);
        return res.status(500).json({ error: "Erreur serveur" });
    }
}

// POST api/admin/decision
export async function postDecision(req, res) {
    try {
        const { submission_id, decision, badge } = req.body;

        if (!submission_id || !decision) {
            return res.status(400).json({ error: "submission_id et decision requis" });
        }
        if (!["validated", "refused", "review"].includes(decision)) {
            return res.status(400).json({ error: "Décision invalide" });
        }

        await insertDecision(req.user.id, submission_id, decision, badge);
        return res.json({ ok: true });
    } catch (err) {
        console.error("[postDecision]", err);
        return res.status(500).json({ error: "Erreur serveur" })
    }
}