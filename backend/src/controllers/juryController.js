import { getAssignedFilms, upsertVote } from "../models/juryModel.js";


// GET /api/jury/films
export async function getJuryFilms(req, res) {
    try {
        const films = await getAssignedFilms(req.user.id);

        // Calcule les stats depuis la liste
        const voted = films.filter((f) => f.my_vote !== null).length;
        const total = films.length;
        const remaining = total - voted;
        const progress = total > 0 ? Math.round((voted / total) * 100) : 0;

        return res.json({ films, stats: { total, voted, remaining, progress } });
    } catch (err) {
        console.error("[getJuryFilms]", err);
        return res.status(500).json({ error: "Erreur serveur" });
    }
}

// POST /api/jury/vote
export async function postVote(req, res) {
    try {
        const { submission_id, action, comment } = req.body;

        if (!submission_id || !action) {
            return res.status(400).json({ error: "submission_id et action requis" });
        }
        if (!["validate", "refuse", "review"].includes(action)) {
            return res.status(400).json({ error: "Action invalide" });
        }

        await upsertVote(req.user_id, submission_id, action, comment);
        return res.json({ ok: true });
    } catch (err) {
        console.error("[postVote]", err);
        return res.status(500).json({ error: "Erreur serveur" });
    }
}