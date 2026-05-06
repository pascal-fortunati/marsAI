import { db } from "../config/db.js";

// Récupère les dernières décisions pour chaque soumission donnée
export async function getLatestDecisionsForSubmissionIds(submissionIds) {
  if (submissionIds.length === 0) return [];
  const placeholders = submissionIds.map(() => "?").join(",");
  const [rows] = await db.execute(
    `SELECT d.submission_id, d.decision, d.comment, d.email_sent, d.badge, d.prize, d.decided_at, u.name AS adminName
     FROM admin_decisions d
     INNER JOIN users u ON u.id = d.admin_user_id
     INNER JOIN (
       SELECT submission_id, MAX(decided_at) AS max_decided_at
       FROM admin_decisions
       WHERE submission_id IN (${placeholders})
       GROUP BY submission_id
     ) t
     ON t.submission_id = d.submission_id AND t.max_decided_at = d.decided_at`,
    submissionIds,
  );
  return rows;
}

// Récupère les derniers badges attribués pour chaque soumission donnée
export async function getLatestBadgesForSubmissionIds(submissionIds) {
  if (submissionIds.length === 0) return [];
  const placeholders = submissionIds.map(() => "?").join(",");
  const [rows] = await db.execute(
    `SELECT d.submission_id, d.badge, d.prize
     FROM admin_decisions d
     INNER JOIN (
       SELECT submission_id, MAX(decided_at) AS max_decided_at
       FROM admin_decisions
       WHERE submission_id IN (${placeholders}) AND badge IS NOT NULL
       GROUP BY submission_id
     ) t
     ON t.submission_id = d.submission_id AND t.max_decided_at = d.decided_at`,
    submissionIds,
  );
  return rows;
}

// Récupère les derniers badges attribués pour toutes les soumissions
export async function getLatestBadgesForAllSubmissions() {
  const [rows] = await db.execute(
    `SELECT d.submission_id, d.badge, d.prize
     FROM admin_decisions d
     INNER JOIN (
       SELECT submission_id, MAX(decided_at) AS max_decided_at
       FROM admin_decisions
       WHERE badge IS NOT NULL
       GROUP BY submission_id
     ) t
     ON t.submission_id = d.submission_id AND t.max_decided_at = d.decided_at`,
  );
  return rows;
}

// Insère une décision d'administration pour une soumission donnée
export async function insertAdminDecision({
  submissionId,
  adminUserId,
  decision,
  comment,
  emailSent,
  badge,
  prize,
}) {
  const [existingRows] = await db.execute(
    `SELECT id
     FROM admin_decisions
     WHERE submission_id = ?
     ORDER BY decided_at DESC, id DESC
     LIMIT 1`,
    [submissionId],
  );

  const existingId = existingRows?.[0]?.id ? Number(existingRows[0].id) : null;

  if (existingId) {
    await db.execute(
      `UPDATE admin_decisions
       SET admin_user_id = ?, decision = ?, comment = ?, email_sent = ?, badge = ?, prize = ?, decided_at = NOW()
       WHERE id = ?`,
      [
        adminUserId,
        decision,
        comment || null,
        Boolean(emailSent),
        badge,
        prize,
        existingId,
      ],
    );
    await db.execute(
      "DELETE FROM admin_decisions WHERE submission_id = ? AND id <> ?",
      [submissionId, existingId],
    );
    return;
  }

  await db.execute(
    "INSERT INTO admin_decisions (submission_id, admin_user_id, decision, comment, email_sent, badge, prize, decided_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())",
    [
      submissionId,
      adminUserId,
      decision,
      comment || null,
      Boolean(emailSent),
      badge,
      prize,
    ],
  );
}

// Récupère la dernière décision d'administration pour une soumission donnée
export async function getLatestDecisionForSubmissionId(submissionId) {
  const [rows] = await db.execute(
    `SELECT id, decision, comment, email_sent, decided_at
     FROM admin_decisions
     WHERE submission_id = ?
     ORDER BY decided_at DESC
     LIMIT 1`,
    [submissionId],
  );
  return rows?.[0] || null;
}

// Marque une décision d'administration comme ayant été envoyée par email
export async function markDecisionEmailSent(decisionId) {
  await db.execute("UPDATE admin_decisions SET email_sent = 1 WHERE id = ?", [
    decisionId,
  ]);
}
