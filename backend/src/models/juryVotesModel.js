import { db } from "../config/db.js";

// Récupère les votes de jury pour chaque soumission donnée
export async function listVotesForSubmissionIds(submissionIds) {
  if (submissionIds.length === 0) return [];
  const placeholders = submissionIds.map(() => "?").join(",");
  const [rows] = await db.execute(
    `SELECT v.submission_id, v.action, v.comment, u.name AS juryName
     FROM jury_votes v
     INNER JOIN users u ON u.id = v.jury_user_id
     WHERE v.submission_id IN (${placeholders})
     ORDER BY v.voted_at ASC`,
    submissionIds,
  );
  return rows;
}

// Récupère les votes de jury les plus récents pour chaque soumission donnée
export async function listLatestVotesForJuryUser({ juryUserId, submissionIds }) {
  if (submissionIds.length === 0) return [];
  const placeholders = submissionIds.map(() => "?").join(",");
  const [rows] = await db.execute(
    `SELECT v.submission_id, v.action, v.comment
     FROM jury_votes v
     INNER JOIN (
       SELECT submission_id, MAX(voted_at) AS max_voted_at
       FROM jury_votes
       WHERE jury_user_id = ? AND submission_id IN (${placeholders})
       GROUP BY submission_id
     ) t
     ON t.submission_id = v.submission_id AND t.max_voted_at = v.voted_at
     WHERE v.jury_user_id = ?`,
    [juryUserId, ...submissionIds, juryUserId],
  );
  return rows;
}

// Insère un vote de jury pour une soumission donnée, en évitant les doublons
export async function insertJuryVoteOnce({ juryUserId, submissionId, action, comment }) {
  const [result] = await db.execute(
    `INSERT INTO jury_votes (submission_id, jury_user_id, action, comment, voted_at)
     SELECT ?, ?, ?, ?, NOW()
     WHERE NOT EXISTS (
       SELECT 1
       FROM jury_votes
       WHERE submission_id = ? AND jury_user_id = ?
     )`,
    [submissionId, juryUserId, action, comment || null, submissionId, juryUserId],
  );
  return { inserted: Number(result.affectedRows || 0) > 0 };
}