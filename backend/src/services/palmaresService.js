import { getLatestBadgesForAllSubmissions } from "../models/adminDecisionsModel.js";
import { listSelectedSubmissionsLimit } from "../models/submissionsModel.js";
import { formatDuration } from "../utils/coerce.js";
import { safeJsonArray } from "../utils/json.js";

// Service pour obtenir le palmarès des soumissions sélectionnées
function badgeRank(badge) {
  return (
    {
      grand_prix: 1,
      prix_jury: 2,
    }[badge] || 999
  );
}

// Service pour normaliser les badges en "grand_prix" ou "prix_jury"
function normalizeBadge(badge) {
  if (badge === "grand_prix" || badge === "prix_jury") return badge;
  return null;
}

// Service pour obtenir le palmarès des soumissions sélectionnées
export async function getPalmares() {
  const decisions = await getLatestBadgesForAllSubmissions();
  const decisionMap = new Map(decisions.map((r) => [r.submission_id, { badge: r.badge ?? null, prize: r.prize ?? null }]));

  const rows = await listSelectedSubmissionsLimit(50);

  const mapped = rows.map((r) => {
    const decision = decisionMap.get(r.id) || { badge: null, prize: null };
    const youtubeId = r.youtube_public_id || r.youtube_private_id || null;
    const badge = normalizeBadge(decision.badge);
    return {
      id: r.id,
      title: r.title,
      director: r.director_name,
      country: r.country,
      duration: formatDuration(r.duration_seconds),
      year: r.year,
      synopsis: r.synopsis,
      aiTools: safeJsonArray(r.ai_tools),
      youtubeId,
      posterUrl: r.poster_url ? `/api/catalogue/${encodeURIComponent(r.id)}/poster` : null,
      badge,
      prize: decision.prize,
    };
  });

  const laureats = mapped
    .filter((f) => f.badge === "grand_prix" || f.badge === "prix_jury")
    .sort((a, b) => badgeRank(a.badge) - badgeRank(b.badge));

  const selection = mapped.filter((f) => !f.badge);

  return { laureats, selection };
}
