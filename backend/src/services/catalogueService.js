import { getLatestBadgesForSubmissionIds } from "../models/adminDecisionsModel.js";
import {
  countSelectedSubmissions,
  getSelectedSubmissionPoster,
  listSelectedSubmissionsPaginated,
} from "../models/submissionsModel.js";
import { env } from "../config/env.js";
import path from "node:path";
import {
  getSubmissionFileStreamFromStorage,
  isObjectStorageConfigured,
} from "./objectStorageService.js";
import { formatDuration, clampInt } from "../utils/coerce.js";
import { safeJsonArray } from "../utils/json.js";

// Service pour normaliser le badge d'une soumission
function normalizeBadge(badge) {
  if (badge === "grand_prix" || badge === "prix_jury") return badge;
  return null;
}

function decodeStorageKeyFromPosterUrl(posterUrl) {
  const endpoint = String(env.scalewayEndpoint || "").replace(/\/+$/, "");
  const bucket = encodeURIComponent(
    String(env.scalewayBucketName || "").trim()
  );
  if (!endpoint || !bucket) return null;
  const prefix = `${endpoint}/${bucket}/`;
  if (!String(posterUrl || "").startsWith(prefix)) return null;
  const encodedKey = String(posterUrl).slice(prefix.length);
  if (!encodedKey) return null;
  return encodedKey
    .split("/")
    .map((part) => decodeURIComponent(part))
    .join("/");
}

// Service pour obtenir une page du catalogue de soumissions
export async function getCataloguePage({ page, pageSize }) {
  const safePage = clampInt(page, 1, { min: 1, max: 100000 });
  const safePageSize = clampInt(pageSize, 20, { min: 1, max: 50 });
  const offset = (safePage - 1) * safePageSize;

  const total = await countSelectedSubmissions();
  const rows = await listSelectedSubmissionsPaginated({
    limit: safePageSize,
    offset,
  });

  const ids = rows.map((r) => r.id);
  const decisions = await getLatestBadgesForSubmissionIds(ids);
  const decisionMap = new Map(
    decisions.map((r) => [
      r.submission_id,
      { badge: normalizeBadge(r.badge), prize: r.prize ?? null },
    ])
  );

  const items = rows.map((r) => {
    const decision = decisionMap.get(r.id) || { badge: null, prize: null };
    const youtubeId = r.youtube_public_id || r.youtube_private_id || null;
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
      posterUrl: r.poster_url
        ? `/api/catalogue/${encodeURIComponent(r.id)}/poster`
        : null,
      badge: decision.badge,
      prize: decision.prize,
    };
  });

  return {
    items,
    page: safePage,
    pageSize: safePageSize,
    total,
  };
}

export async function getCataloguePosterPayload({ submissionId }) {
  const row = await getSelectedSubmissionPoster(submissionId);
  if (!row) {
    const err = new Error("Soumission introuvable");
    err.status = 404;
    throw err;
  }
  const posterUrl = String(row.poster_url || "");
  if (!posterUrl) {
    const err = new Error("Poster introuvable");
    err.status = 404;
    throw err;
  }

  if (posterUrl.startsWith("/uploads/")) {
    const absolutePath = path.resolve(
      process.cwd(),
      posterUrl.replace(/^\/+/, "")
    );
    return {
      kind: "file",
      path: absolutePath,
      contentType: "image/jpeg",
    };
  }

  if (isObjectStorageConfigured()) {
    const key = decodeStorageKeyFromPosterUrl(posterUrl);
    if (key) {
      const source = await getSubmissionFileStreamFromStorage({ key });
      return {
        kind: "stream",
        stream: source.stream,
        contentType: source.contentType || "application/octet-stream",
      };
    }
  }

  const err = new Error("Poster non accessible");
  err.status = 404;
  throw err;
}
