import { db } from "../config/db.js"

// Tous les films avec stats jury + badge
export async function getAllFilms() {
    const [rows] = await db.execute(`
        SELECT
            s.id, s.title, s.country, s.year,
            s.duration_seconds, s.category,
            s.director_name, s.director_email,
            s.ai_tools, s.status,
            s.youtube_private_id, s.poster_url, s.video_url,
            s.created_at,
            -- Nombre de vote jury
            (SELECT COUNT(*) FROM jury_votes jv WHERE jv.submission_id = s.id) AS jury_votes,
            -- Dernier badge attribué
            (
                SELECT ad.badge FROM admin_decisions ad
                WHERE ad.submission_id = s.id AND ad.badge IS NOT NULL
                ORDER BY ad.decided_at DESC LIMIT 1
            ) AS badge
            FROM submissions s
            ORDER BY s.created_at DESC
        `);

    return rows.map((r) => ({
        ...r,
        ai_tools: typeof r.ai_tools === "string" ? JSON.parse(r.ai_tools) : (r.ai_tools ?? []),
        jury_votes: Number(r.jury_votes),
        badge: r.badge ?? null,
    }));
}

// Stats header
export async function getAdminStats() {
    const [[row]] = await db.execute(`
        SELECT
        COUNT(*) AS total,
        SUM(status IN ('selected', 'validated')) AS selected,
        SUM(status = 'pending') AS pending,
        SUM(status = 'validated') AS validated,
        SUM(status = 'review') AS review,
        SUM(status = 'refused') AS refused
        FROM submissions
        `);
    return {
        total: Number(row.total),
        selected: Number(row.selected),
        pending: Number(row.pending),
        validated: Number(row.validated),
        review: Number(row.review),
        refused: Number(row.refused),
    };
}

// Insère décision admin + met à jour le statut du film
export async function insertDecision(adminUserId, submissionId, decision, badge) {
    await db.execute(`
        INSERT INTO admin_decisions (submission_id, admin_user_id, decision, badge)
        VALUES (?, ?, ?, ?)
        `, [submission_id, adminUserId, decision, badge ?? null]);

    const statusMap = { validated: "validated", refused: "refused", review: "review" };
    await db.execute(
        "UPDATE submissions SET status = ? WHERE id = ?",
        [statusMap[decision], submissionId]
    );
}