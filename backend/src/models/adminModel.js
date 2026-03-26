import { db } from "../config/db.js"

// Tous les films avec stats jury + badge
export async function getAllFilms() {
    const [rows] = await db.execute(`
        SELECT
            s.id, s.title, s.synopsis, s.country, s.year,
            s.duration_seconds, s.category,
            s.director_name, s.director_email,
            s.ai_tools, s.status,
            s.youtube_private_id, s.poster_url, s.video_url,
            s.created_at,
            (
                SELECT u.name
                FROM jury_assignments ja
                JOIN users u ON u.id = ja.jury_user_id
                WHERE ja.submission_id = s.id
                ORDER BY ja.assigned_at DESC
                LIMIT 1
            ) AS assigned_jury_name,
            (
                SELECT u.email
                FROM jury_assignments ja
                JOIN users u ON u.id = ja.jury_user_id
                WHERE ja.submission_id = s.id
                ORDER BY ja.assigned_at DESC
                LIMIT 1
            ) AS assigned_jury_email,
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

export async function getJuryUsers() {
    const defaultJuries = [
        { name: "Pauline Hiez", email: "hiezpauline@gmail.com" },
        { name: "Emmanuelle Dupas-Mahé", email: "emmanuelle.dupas-mahe@laplateforme.io" },
        { name: "Laetitia Quintin", email: "laetitia.quintin@laplateforme.io" },
        { name: "Pascal Fortunati", email: "pascal.fortunati@laplateforme.io" },
        { name: "Sylvain Malbon", email: "sylvain.malbon@laplateforme.io" },
    ];

    await Promise.all(
        defaultJuries.map((jury) =>
            db.execute(
                `INSERT IGNORE INTO users (email, name, role)
                 VALUES (?, ?, 'jury')`,
                [jury.email, jury.name]
            )
        )
    );

    const [rows] = await db.execute(
        `SELECT id, name, email
         FROM users
         WHERE role = 'jury'
         ORDER BY name ASC, email ASC`
    );

    return rows.map((row) => ({
        id: Number(row.id),
        name: row.name,
        email: row.email,
    }));
}

export async function assignFilmsToJury(juryUserId, submissionIds) {
    if (!submissionIds.length) return;

    for (const submissionId of submissionIds) {
        await db.execute(
            `DELETE FROM jury_assignments WHERE submission_id = ?`,
            [submissionId]
        );

        await db.execute(
            `INSERT INTO jury_assignments (jury_user_id, submission_id)
             VALUES (?, ?)
             ON DUPLICATE KEY UPDATE assigned_at = CURRENT_TIMESTAMP`,
            [juryUserId, submissionId]
        );
    }
}

// Insère décision admin + met à jour le statut du film
export async function insertDecision(adminUserId, submissionId, decision, badge) {
    let resolvedAdminUserId = adminUserId;
    if (!resolvedAdminUserId) {
        const [admins] = await db.execute(
            "SELECT id FROM users WHERE role = 'admin' ORDER BY id ASC LIMIT 1"
        );
        if (!admins.length) {
            try {
                await db.execute(
                    "INSERT INTO users (email, name, role) VALUES (?, ?, 'admin')",
                    ["local-admin@marsai.local", "Local Admin"]
                );
            } catch (err) {
                const message = String(err?.message ?? "");
                if (!message.includes("Duplicate")) {
                    throw err;
                }
            }

            const [createdAdmins] = await db.execute(
                "SELECT id FROM users WHERE role = 'admin' ORDER BY id ASC LIMIT 1"
            );
            if (!createdAdmins.length) {
                throw new Error("Impossible de créer/récupérer un utilisateur admin pour enregistrer la décision");
            }
            resolvedAdminUserId = createdAdmins[0].id;
        } else {
            resolvedAdminUserId = admins[0].id;
        }
    }

    const decisionForAudit = ["validated", "refused", "review"].includes(decision)
        ? decision
        : "review";

    await db.execute(`
        INSERT INTO admin_decisions (submission_id, admin_user_id, decision, badge)
        VALUES (?, ?, ?, ?)
        `, [submissionId, resolvedAdminUserId, decisionForAudit, badge ?? null]);

    const statusMap = {
        pending: "pending",
        validated: "validated",
        refused: "refused",
        review: "review",
        selected: "selected",
    };
    await db.execute(
        "UPDATE submissions SET status = ? WHERE id = ?",
        [statusMap[decision], submissionId]
    );
}