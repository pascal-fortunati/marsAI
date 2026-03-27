import express from "express";
import { db } from "../config/db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();
const juryRoles = ["jury", "admin", "moderator"];

function toDuration(seconds) {
  const total = Number.parseInt(String(seconds || 0), 10);
  if (!Number.isFinite(total) || total <= 0) return undefined;
  const mm = Math.floor(total / 60);
  const ss = total % 60;
  return `${String(mm)}:${String(ss).padStart(2, "0")}`;
}

function parseJsonArray(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function mapSubmission(row) {
  return {
    id: row.id,
    title: row.title,
    country: row.country || undefined,
    duration: toDuration(row.duration_seconds),
    synopsis: row.synopsis || undefined,
    tags: parseJsonArray(row.semantic_tags),
    year: row.year ? String(row.year) : undefined,
    director: row.director_name || undefined,
    youtubeId: row.youtube_public_id || row.youtube_private_id || undefined,
    voteDecision: row.vote_action || undefined,
    voteComment: row.vote_comment || "",
  };
}

router.get(
  "/api/films",
  requireAuth,
  requireRole(...juryRoles),
  async (req, res, next) => {
    try {
      const userId = Number.parseInt(String(req.auth.sub), 10);
      const role = String(req.auth.role || "");
      const query = String(req.query.search || "").trim();
      const filter = String(req.query.filter || "all").toLowerCase();
      const like = `%${query}%`;

      const [rows] = await db.execute(
        `SELECT
           s.id,
           s.title,
           s.country,
           s.duration_seconds,
           s.synopsis,
           s.semantic_tags,
           s.year,
           s.director_name,
           s.youtube_public_id,
           s.youtube_private_id,
           lv.action AS vote_action,
           lv.comment AS vote_comment
         FROM submissions s
         LEFT JOIN (
           SELECT v.submission_id, v.action, v.comment
           FROM jury_votes v
           INNER JOIN (
             SELECT submission_id, MAX(id) AS max_vote_id
             FROM jury_votes
             WHERE jury_user_id = ?
             GROUP BY submission_id
           ) x ON x.max_vote_id = v.id
         ) lv ON lv.submission_id = s.id
         WHERE
           (
             ? IN ('admin', 'moderator')
             OR EXISTS (
               SELECT 1
               FROM jury_assignments ja
               WHERE ja.submission_id = s.id
               AND ja.jury_user_id = ?
             )
           )
           AND (
             ? = ''
             OR s.title LIKE ?
             OR s.country LIKE ?
             OR s.director_name LIKE ?
           )
         ORDER BY s.created_at DESC`,
        [userId, role, userId, query, like, like, like]
      );

      const films = rows.map(mapSubmission).filter((film) => {
        const voted = Boolean(film.voteDecision);
        if (filter === "voted") return voted;
        if (filter === "remaining") return !voted;
        return true;
      });

      res.json({ films });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/api/films/:id",
  requireAuth,
  requireRole(...juryRoles),
  async (req, res, next) => {
    try {
      const userId = Number.parseInt(String(req.auth.sub), 10);
      const role = String(req.auth.role || "");
      const filmId = String(req.params.id || "");

      const [rows] = await db.execute(
        `SELECT
           s.id,
           s.title,
           s.country,
           s.duration_seconds,
           s.synopsis,
           s.semantic_tags,
           s.year,
           s.director_name,
           s.youtube_public_id,
           s.youtube_private_id,
           lv.action AS vote_action,
           lv.comment AS vote_comment
         FROM submissions s
         LEFT JOIN (
           SELECT v.submission_id, v.action, v.comment
           FROM jury_votes v
           INNER JOIN (
             SELECT submission_id, MAX(id) AS max_vote_id
             FROM jury_votes
             WHERE jury_user_id = ?
             GROUP BY submission_id
           ) x ON x.max_vote_id = v.id
         ) lv ON lv.submission_id = s.id
         WHERE s.id = ?
         AND (
           ? IN ('admin', 'moderator')
           OR EXISTS (
             SELECT 1
             FROM jury_assignments ja
             WHERE ja.submission_id = s.id
             AND ja.jury_user_id = ?
           )
         )
         LIMIT 1`,
        [userId, filmId, role, userId]
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: "Film not found" });
      }

      res.json({ film: mapSubmission(rows[0]) });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/api/vote",
  requireAuth,
  requireRole(...juryRoles),
  async (req, res, next) => {
    try {
      const userId = Number.parseInt(String(req.auth.sub), 10);
      const role = String(req.auth.role || "");

      const filmId = String(req.body?.filmId || "").trim();
      const decision = String(req.body?.decision || "").trim();
      const commentRaw = req.body?.comment;
      const comment =
        typeof commentRaw === "string" && commentRaw.trim().length > 0
          ? commentRaw.trim()
          : null;

      if (!filmId) {
        return res.status(400).json({ error: "filmId is required" });
      }

      if (!["validate", "refuse", "review"].includes(decision)) {
        return res.status(400).json({ error: "Invalid vote decision" });
      }

      const [allowedRows] = await db.execute(
        `SELECT s.id
         FROM submissions s
         WHERE s.id = ?
         AND (
           ? IN ('admin', 'moderator')
           OR EXISTS (
             SELECT 1
             FROM jury_assignments ja
             WHERE ja.submission_id = s.id
             AND ja.jury_user_id = ?
           )
         )
         LIMIT 1`,
        [filmId, role, userId]
      );

      if (allowedRows.length === 0) {
        return res.status(403).json({ error: "Film is not assigned to this jury" });
      }

      await db.execute(
        "INSERT INTO jury_votes (submission_id, jury_user_id, action, comment) VALUES (?, ?, ?, ?)",
        [filmId, userId, decision, comment]
      );

      const nextStatus =
        decision === "validate"
          ? "validated"
          : decision === "refuse"
            ? "refused"
            : "review";
      await db.execute("UPDATE submissions SET status = ? WHERE id = ?", [
        nextStatus,
        filmId,
      ]);

      return res.status(201).json({ ok: true });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
