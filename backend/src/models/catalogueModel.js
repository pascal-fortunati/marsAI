import { db } from "../config/db.js";

function buildCatalogueFilters({ category, q } = {}) {
    const conditions = [
        "s.status IN ('selected', 'validated')",
        "((s.youtube_public_id IS NOT NULL AND s.youtube_public_id <> '') OR (s.video_url IS NOT NULL AND s.video_url <> ''))",
    ];
    const params = [];

    if (category) {
        conditions.push("s.category = ?");
        params.push(category);
    }
    if (q) {
        conditions.push("(s.title LIKE ? OR s.director_name LIKE ?)");
        params.push(`%${q}%`, `%${q}%`);
    }

    return {
        where: `WHERE ${conditions.join(" AND ")}`,
        params,
    };
}

const CATALOGUE_SELECT = `SELECT
    s.id,
    s.title,
    s.synopsis,
    s.country,
    s.language,
    s.category,
    s.year,
    s.duration_seconds,
    s.ai_tools,
    s.semantic_tags,
    s.director_name,
    s.poster_url,
    s.video_url,
    s.youtube_public_id,
    s.status,
    ad.badge,
    ad.prize
  FROM submissions s
  LEFT JOIN admin_decisions ad
    ON ad.submission_id = s.id
    AND ad.decision = 'validated'`;

/**
 * Récupère la liste paginée des films publics (status selected/validated).
 * @param {{ page: number, perPage: number, category?: string, q?: string }} opts
 * @returns {{ films: object[], total: number }}
 */
export async function findCatalogueFilms({ page, perPage, category, q }) {
    const safePage = Number.isFinite(page) ? Number(page) : 1;
    const safePerPage = Number.isFinite(perPage) ? Number(perPage) : 20;
    const offset = Math.max(0, (safePage - 1) * safePerPage);

    const { where, params } = buildCatalogueFilters({ category, q });
    const countParams = [...params];
    const listParams = [...params, safePerPage, offset];

    const [[{ total }]] = await db.execute(
        `SELECT COUNT(*) AS total FROM submissions s ${where}`,
        countParams
    );

    const [rows] = await db.execute(
        `${CATALOGUE_SELECT}
    ${where}
    ORDER BY s.created_at DESC
    LIMIT ? OFFSET ?`,
        listParams
    );

    return { rows, total };
}

export async function findAllCatalogueFilms({ category, q }) {
    const { where, params } = buildCatalogueFilters({ category, q });

    const [rows] = await db.execute(
        `${CATALOGUE_SELECT}
    ${where}
    ORDER BY s.created_at DESC`,
        params
    );

    return rows;
}

/**
 * Récupère le détail complet d'un film par son UUID.
 * @param {string} id
 * @returns {object|null}
 */
export async function findFilmById(id) {
    const [[film]] = await db.execute(
        `SELECT
      s.*,
      ad.badge,
      ad.prize,
      ad.comment AS admin_comment
    FROM submissions s
    LEFT JOIN admin_decisions ad
      ON ad.submission_id = s.id
      AND ad.decision = 'validated'
    WHERE s.id = ?
      AND s.status IN ('selected', 'validated')
      AND ((s.youtube_public_id IS NOT NULL AND s.youtube_public_id <> '') OR (s.video_url IS NOT NULL AND s.video_url <> ''))`,
        [id]
    );

    return film ?? null;
}