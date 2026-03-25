import { db } from "../config/db.js";

export async function getAssignedFilms(juryUserId) {
    const [rows] = await db.execute(
        `Select
        s.id,
        s.title,
        s.synopsis,
        s.country,
        s.year,
        s.duration_seconds,
        s.category,
        s.director_name,
        s.video_url,
        s.ai_tools,
        jv.action AS my_vote,
        jv.comment AS my_comment
        FROM jury_assignments ja
        JOIN submissions s ON s.id = ja.submission_id
        LEFT JOIN jury_voytesjv
        ON jv.submission_id = ja.submission_id
        AND jv.jury_user_id = ja.jury_user_id
        WHERE ja.jury_user_id = ?
        ORDER BY s.title ASC`
        [juryUserId]
    );

    return rows.map((r) => ({
        ...r,
        ai_tools: typeof r.ai_tools === "string" ? JSON.parse(r.ai_tools) : (r.ai_tools ?? []),
        my_vote: r.my_vote ?? null,
        my_comment: r.my_comment ?? null,
    }));
}

export async function upsertVote(jusryUserId, submissionId, action, comment) {
    await db.execute(
        `INSERT INTO jury_votes (submission_id, jury_user_id, action, comment)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        action = VALUES(action),
        comment = VALUES(comment),
        voted_at = CURRENT_TIMESTAMP,`
        [submissionId, juryUserId, action, comment ?? null]
    );
}