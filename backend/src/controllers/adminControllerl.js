import { assignFilmsToJury, getAllFilms, getAdminStats, getJuryUsers, insertDecision } from "../models/adminModel.js"

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
        const adminUserId = req.user?.id ?? null;

        if (!submission_id || !decision) {
            return res.status(400).json({ error: "submission_id et decision requis" });
        }
        if (!["pending", "validated", "refused", "review", "selected"].includes(decision)) {
            return res.status(400).json({ error: "Décision invalide" });
        }

        await insertDecision(adminUserId, submission_id, decision, badge);
        return res.json({ ok: true });
    } catch (err) {
        console.error("[postDecision]", err);
        return res.status(500).json({ error: "Erreur serveur" })
    }
}

// GET /api/admin/juries
export async function getAdminJuries(req, res) {
    try {
        const juries = await getJuryUsers();
        return res.json({ juries });
    } catch (err) {
        console.error("[getAdminJuries]", err);
        return res.status(500).json({ error: "Erreur serveur" });
    }
}

// POST /api/admin/jury-assignments
export async function postAssignJury(req, res) {
    try {
        const { jury_user_id, submission_ids } = req.body;

        if (!jury_user_id || !Array.isArray(submission_ids) || submission_ids.length === 0) {
            return res.status(400).json({ error: "jury_user_id et submission_ids requis" });
        }

        const normalizedIds = submission_ids.filter((value) => typeof value === "string" && value.trim().length > 0);
        if (!normalizedIds.length) {
            return res.status(400).json({ error: "submission_ids invalide" });
        }

        await assignFilmsToJury(Number(jury_user_id), normalizedIds);
        return res.json({ ok: true, assigned: normalizedIds.length });
    } catch (err) {
        console.error("[postAssignJury]", err);
        return res.status(500).json({ error: "Erreur serveur" });
    }
}