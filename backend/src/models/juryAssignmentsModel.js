import { db } from "../config/db.js";

// Récupère les soumissions assignées à un jury donné
export async function listAssignedSubmissionsForJuryUser(juryUserId) {
  const [rows] = await db.execute(
    `SELECT s.id, s.title, s.synopsis, s.country, s.duration_seconds, s.ai_tools, s.youtube_private_id, s.youtube_public_id
     FROM jury_assignments a
     INNER JOIN submissions s ON s.id = a.submission_id
     WHERE a.jury_user_id = ?
     ORDER BY a.assigned_at DESC`,
    [juryUserId],
  );
  return rows;
}

// Récupère les assignations de jury pour chaque soumission donnée
export async function listAssignmentsForSubmissionIds(submissionIds) {
  if (submissionIds.length === 0) return [];
  const placeholders = submissionIds.map(() => "?").join(",");
  const [rows] = await db.execute(
    `SELECT a.submission_id, a.jury_user_id, u.name, u.email
     FROM jury_assignments a
     INNER JOIN users u ON u.id = a.jury_user_id
     WHERE a.submission_id IN (${placeholders})
     ORDER BY a.assigned_at DESC`,
    submissionIds,
  );
  return rows;
}

// Insère une assignation de jury pour une soumission donnée
export async function insertJuryAssignment({ juryUserId, submissionId }) {
  const [result] = await db.execute(
    "INSERT IGNORE INTO jury_assignments (jury_user_id, submission_id, assigned_at) VALUES (?, ?, NOW())",
    [juryUserId, submissionId],
  );
  return { inserted: Number(result.affectedRows || 0) > 0 };
}

// Remplace les assignations de jury pour une soumission donnée
export async function replaceAssignmentsForSubmission({ submissionId, juryUserIds }) {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    await conn.execute("DELETE FROM jury_assignments WHERE submission_id = ?", [submissionId]);
    for (const juryUserId of juryUserIds) {
      await conn.execute(
        "INSERT INTO jury_assignments (jury_user_id, submission_id, assigned_at) VALUES (?, ?, NOW())",
        [juryUserId, submissionId],
      );
    }
    await conn.commit();
  } catch (err) {
    try {
      await conn.rollback();
    } catch {
      void 0;
    }
    throw err;
  } finally {
    conn.release();
  }
  return { ok: true };
}

// Remplace les assignations de jury pour plusieurs soumissions en une seule transaction
export async function replaceAssignmentsForSubmissionsBulk({ submissionIds, juryUserIds }) {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    if (submissionIds.length > 0) {
      const placeholders = submissionIds.map(() => "?").join(",");
      await conn.execute(`DELETE FROM jury_assignments WHERE submission_id IN (${placeholders})`, submissionIds);
    }

    const pairs = [];
    for (const submissionId of submissionIds) {
      for (const juryUserId of juryUserIds) {
        pairs.push({ submissionId, juryUserId });
      }
    }

    const chunkSize = 1000;
    for (let i = 0; i < pairs.length; i += chunkSize) {
      const chunk = pairs.slice(i, i + chunkSize);
      const valuesSql = chunk.map(() => "(?, ?, NOW())").join(",");
      const params = [];
      for (const p of chunk) {
        params.push(p.juryUserId, p.submissionId);
      }
      await conn.execute(`INSERT INTO jury_assignments (jury_user_id, submission_id, assigned_at) VALUES ${valuesSql}`, params);
    }

    await conn.commit();
  } catch (err) {
    try {
      await conn.rollback();
    } catch {
      void 0;
    }
    throw err;
  } finally {
    conn.release();
  }

  return { ok: true };
}