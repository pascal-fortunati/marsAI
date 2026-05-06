import {
  getLatestDecisionForSubmissionId,
  getLatestDecisionsForSubmissionIds,
  insertAdminDecision,
  markDecisionEmailSent,
} from "../models/adminDecisionsModel.js";
import {
  listAssignmentsForSubmissionIds,
  replaceAssignmentsForSubmission,
  replaceAssignmentsForSubmissionsBulk,
} from "../models/juryAssignmentsModel.js";
import { listVotesForSubmissionIds } from "../models/juryVotesModel.js";
import {
  ensureSubmissionSelected,
  findSubmissionById,
  getSubmissionAdminEmailContext,
  getSubmissionAssetUrlsById,
  getSubmissionYoutubeIds,
  listAdminSubmissionsLimit,
  listSubmissionIdsByIds,
  setSubmissionYoutubePrivateId,
  setSubmissionYoutubePublicId,
  updateSubmissionStatus,
} from "../models/submissionsModel.js";
import { findUserById } from "../models/usersModel.js";
import { formatDuration } from "../utils/coerce.js";
import { safeJsonArray } from "../utils/json.js";
import { sendSubmissionDecisionEmail } from "./decisionEmailService.js";
import { env } from "../config/env.js";
import path from "node:path";
import {
  getSubmissionFileStreamFromStorage,
  isObjectStorageConfigured,
} from "./objectStorageService.js";

function safeJsonObject(value) {
  if (!value) return null;
  if (typeof value === "object" && !Array.isArray(value)) return value;
  if (typeof value !== "string") return null;
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? parsed
      : null;
  } catch {
    return null;
  }
}

// Service pour normaliser le badge d'une décision admin
function normalizeBadge(badge) {
  if (badge === "grand_prix" || badge === "prix_jury") return badge;
  return null;
}

function normalizeYoutubeVideoId(value) {
  const raw = String(value || "").trim();
  if (!raw) return null;
  const direct = /^[A-Za-z0-9_-]{11}$/.test(raw) ? raw : null;
  if (direct) return direct;
  try {
    const url = new URL(raw);
    const byQuery = url.searchParams.get("v");
    if (byQuery && /^[A-Za-z0-9_-]{11}$/.test(byQuery)) return byQuery;
    const parts = url.pathname.split("/").filter(Boolean);
    const last = parts[parts.length - 1] || "";
    if (/^[A-Za-z0-9_-]{11}$/.test(last)) return last;
    return null;
  } catch {
    return null;
  }
}

function decodeStorageKeyFromObjectStorageUrl(fileUrl) {
  const endpoint = String(env.scalewayEndpoint || "").replace(/\/+$/, "");
  const bucket = encodeURIComponent(String(env.scalewayBucketName || "").trim());
  if (!endpoint || !bucket) return null;
  const prefix = `${endpoint}/${bucket}/`;
  if (!String(fileUrl || "").startsWith(prefix)) return null;
  const encodedKey = String(fileUrl).slice(prefix.length);
  if (!encodedKey) return null;
  return encodedKey
    .split("/")
    .map((part) => decodeURIComponent(part))
    .join("/");
}

function inferContentTypeFromUrl(fileUrl) {
  const ext = path.extname(String(fileUrl || "")).toLowerCase();
  if (ext === ".mp4") return "video/mp4";
  if (ext === ".mov") return "video/quicktime";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  if (ext === ".gif") return "image/gif";
  if (ext === ".svg") return "image/svg+xml";
  if (ext === ".srt") return "application/x-subrip";
  if (ext === ".vtt") return "text/vtt";
  return "application/octet-stream";
}

// Service pour lister les soumissions admin avec pagination sécurisée
export async function listAdminSubmissions() {
  const submissions = await listAdminSubmissionsLimit(1000);
  const ids = submissions.map((s) => s.id);

  const assignments = await listAssignmentsForSubmissionIds(ids);
  const assignedJuryBySubmission = new Map();
  for (const a of assignments) {
    if (!assignedJuryBySubmission.has(a.submission_id))
      assignedJuryBySubmission.set(a.submission_id, []);
    assignedJuryBySubmission.get(a.submission_id).push({
      id: a.jury_user_id,
      name: a.name,
      email: a.email,
    });
  }

  const votes = await listVotesForSubmissionIds(ids);
  const votesBySubmission = new Map();
  for (const v of votes) {
    if (!votesBySubmission.has(v.submission_id))
      votesBySubmission.set(v.submission_id, []);
    votesBySubmission.get(v.submission_id).push({
      juryName: v.juryName,
      action: v.action,
      comment: v.comment || "",
    });
  }

  const decisions = await getLatestDecisionsForSubmissionIds(ids);
  const decisionMap = new Map(
    decisions.map((d) => [
      d.submission_id,
      {
        decision: d.decision,
        comment: d.comment || "",
        emailSent: Boolean(d.email_sent),
        badge: normalizeBadge(d.badge),
        prize: d.prize ?? null,
        decidedAt: d.decided_at,
        adminName: d.adminName,
      },
    ]),
  );

  const items = submissions.map((s) => {
    const decision = decisionMap.get(s.id) || null;
    const juryVotes = votesBySubmission.get(s.id) || [];
    let status = s.status;
    if (status === "pending" && juryVotes.length > 0) {
      const actions = juryVotes.map((v) => v.action);
      const allValidate = actions.every((a) => a === "validate");
      const allRefuse = actions.every((a) => a === "refuse");
      if (allValidate) status = "validated";
      else if (allRefuse) status = "refused";
      else status = "review";
    }
    return {
      id: s.id,
      title: s.title,
      country: s.country,
      language: s.language,
      category: s.category,
      year: s.year,
      duration: formatDuration(s.duration_seconds),
      director: s.director_name,
      directorEmail: s.director_email,
      directorPhone: s.director_phone || null,
      directorStreet: s.director_street || null,
      directorZip: s.director_zip || null,
      directorCity: s.director_city || null,
      directorCountry: s.director_country || null,
      directorBirthdate: s.director_birthdate || null,
      directorJob: s.director_job || null,
      directorSocials: safeJsonObject(s.director_socials),
      discoverySource: s.discovery_source || null,
      legalRefName: s.legal_ref_name || null,
      legalRefEmail: s.legal_ref_email || null,
      synopsis: s.synopsis,
      aiTools: safeJsonArray(s.ai_tools),
      semanticTags: safeJsonArray(s.semantic_tags),
      musicCredits: s.music_credits || null,
      rightsConfirmed: Boolean(s.rights_confirmed),
      posterUrl: s.poster_url || null,
      videoUrl: s.video_url || null,
      subtitlesUrl: s.subtitles_url || null,
      youtubePrivateId: s.youtube_private_id || null,
      youtubePublicId: s.youtube_public_id || null,
      consentRules: Boolean(s.consent_rules),
      consentPromo: Boolean(s.consent_promo),
      consentNewsletter: Boolean(s.consent_newsletter),
      consentCopyright: Boolean(s.consent_copyright),
      status,
      badge: decision?.badge || null,
      prize: decision?.prize || null,
      assignedJury: assignedJuryBySubmission.get(s.id) || [],
      juryVotes,
      adminDecision: decision
        ? {
            decision: decision.decision,
            comment: decision.comment,
            emailSent: decision.emailSent,
          }
        : null,
      submittedAt: s.created_at,
    };
  });

  return { items };
}

// Service pour assigner un jury à une soumission admin
export async function assignSubmissionToJury({ submissionId, juryUserIds }) {
  if (!submissionId || typeof submissionId !== "string") {
    const err = new Error("Invalid submission id");
    err.status = 400;
    throw err;
  }

  if (!Array.isArray(juryUserIds)) {
    const err = new Error("Invalid jury user ids");
    err.status = 400;
    throw err;
  }

  const unique = Array.from(
    new Set(
      juryUserIds
        .map((v) => Number(v))
        .filter((v) => Number.isInteger(v) && v > 0),
    ),
  );
  if (juryUserIds.length > 0 && unique.length === 0) {
    const err = new Error("Invalid jury user ids");
    err.status = 400;
    throw err;
  }

  const exists = await findSubmissionById(submissionId);
  if (!exists) {
    const err = new Error("Submission not found");
    err.status = 404;
    throw err;
  }

  for (const juryUserId of unique) {
    const user = await findUserById(juryUserId);
    if (!user || user.role !== "jury") {
      const err = new Error("Invalid jury user id");
      err.status = 400;
      throw err;
    }
  }

  await replaceAssignmentsForSubmission({ submissionId, juryUserIds: unique });
  return { ok: true, assignedCount: unique.length };
}

// Service pour assigner un jury à plusieurs soumissions admin
export async function assignSubmissionsToJuryBulk({
  submissionIds,
  juryUserIds,
}) {
  if (!Array.isArray(submissionIds) || submissionIds.length === 0) {
    const err = new Error("Invalid submission ids");
    err.status = 400;
    throw err;
  }
  if (!Array.isArray(juryUserIds)) {
    const err = new Error("Invalid jury user ids");
    err.status = 400;
    throw err;
  }

  const uniqueSubmissions = Array.from(
    new Set(
      submissionIds.map((v) => String(v).trim()).filter((v) => v.length > 0),
    ),
  );
  if (uniqueSubmissions.length === 0) {
    const err = new Error("Invalid submission ids");
    err.status = 400;
    throw err;
  }

  const uniqueJury = Array.from(
    new Set(
      juryUserIds
        .map((v) => Number(v))
        .filter((v) => Number.isInteger(v) && v > 0),
    ),
  );
  if (juryUserIds.length > 0 && uniqueJury.length === 0) {
    const err = new Error("Invalid jury user ids");
    err.status = 400;
    throw err;
  }

  const rows = await listSubmissionIdsByIds(uniqueSubmissions);
  const existing = new Set(rows.map((r) => r.id));
  if (existing.size !== uniqueSubmissions.length) {
    const err = new Error("Submission not found");
    err.status = 404;
    throw err;
  }

  for (const juryUserId of uniqueJury) {
    const user = await findUserById(juryUserId);
    if (!user || user.role !== "jury") {
      const err = new Error("Invalid jury user id");
      err.status = 400;
      throw err;
    }
  }

  await replaceAssignmentsForSubmissionsBulk({
    submissionIds: uniqueSubmissions,
    juryUserIds: uniqueJury,
  });
  return {
    ok: true,
    submissionsCount: uniqueSubmissions.length,
    assignedJuryCount: uniqueJury.length,
  };
}

export async function getAdminSubmissionAssetPayload({ submissionId, assetType }) {
  const row = await getSubmissionAssetUrlsById(submissionId);
  if (!row) {
    const err = new Error("Soumission introuvable");
    err.status = 404;
    throw err;
  }

  const normalizedAssetType =
    assetType === "video" || assetType === "poster" || assetType === "subtitles"
      ? assetType
      : null;
  if (!normalizedAssetType) {
    const err = new Error("Type de fichier invalide");
    err.status = 400;
    throw err;
  }

  const fileUrl =
    normalizedAssetType === "video"
      ? String(row.video_url || "")
      : normalizedAssetType === "poster"
        ? String(row.poster_url || "")
        : String(row.subtitles_url || "");

  if (!fileUrl) {
    const err = new Error("Fichier introuvable");
    err.status = 404;
    throw err;
  }

  if (fileUrl.startsWith("/uploads/")) {
    return {
      kind: "file",
      path: path.resolve(process.cwd(), fileUrl.replace(/^\/+/, "")),
      contentType: inferContentTypeFromUrl(fileUrl),
    };
  }

  if (isObjectStorageConfigured()) {
    const key = decodeStorageKeyFromObjectStorageUrl(fileUrl);
    if (key) {
      const source = await getSubmissionFileStreamFromStorage({ key });
      return {
        kind: "stream",
        stream: source.stream,
        contentType: source.contentType || inferContentTypeFromUrl(fileUrl),
      };
    }
  }

  const err = new Error("Fichier non accessible");
  err.status = 404;
  throw err;
}

// Service pour mettre à jour le statut d'une soumission admin
export async function setSubmissionStatus({
  adminUserId,
  submissionId,
  status,
  comment,
}) {
  await updateSubmissionStatus({ submissionId, status });

  const decisionMap = {
    validated: "validated",
    refused: "refused",
    review: "review",
    selected: "validated",
    pending: "review",
  };

  const decision = decisionMap[status];

  await insertAdminDecision({
    submissionId,
    adminUserId,
    decision,
    comment,
    emailSent: false,
    badge: null,
    prize: null,
  });

  return { ok: true };
}

// Service pour ajouter un badge à une soumission admin
export async function setSubmissionBadge({
  adminUserId,
  submissionId,
  badge,
  prize,
}) {
  if (badge) {
    await ensureSubmissionSelected({ submissionId });
  }

  await insertAdminDecision({
    submissionId,
    adminUserId,
    decision: "validated",
    comment: null,
    emailSent: false,
    badge,
    prize,
  });

  return { ok: true };
}

// Service pour publier une soumission admin
export async function publishSubmission({ submissionId }) {
  const ids = await getSubmissionYoutubeIds(submissionId);
  if (!ids) {
    const err = new Error("Submission not found");
    err.status = 404;
    throw err;
  }
  if (!ids.youtube_private_id) {
    const err = new Error("Missing youtube_private_id");
    err.status = 400;
    throw err;
  }

  if (ids.youtube_public_id) {
    return { ok: true, youtubePublicId: ids.youtube_public_id };
  }

  const youtubePublicId = ids.youtube_private_id;
  await setSubmissionYoutubePublicId({ submissionId, youtubePublicId });
  return { ok: true, youtubePublicId };
}

export async function setSubmissionYoutubePrivate({
  submissionId,
  youtubePrivateId,
}) {
  if (!submissionId || typeof submissionId !== "string") {
    const err = new Error("Invalid submission id");
    err.status = 400;
    throw err;
  }
  const exists = await findSubmissionById(submissionId);
  if (!exists) {
    const err = new Error("Submission not found");
    err.status = 404;
    throw err;
  }
  const normalized = normalizeYoutubeVideoId(youtubePrivateId);
  if (!normalized) {
    const err = new Error("Invalid YouTube video id");
    err.status = 400;
    throw err;
  }
  await setSubmissionYoutubePrivateId({
    submissionId,
    youtubePrivateId: normalized,
  });
  return { ok: true, youtubePrivateId: normalized };
}

// Service pour construire le motif de la décision jury à partir des votes
function buildJuryReason(votes) {
  const comments = (votes || [])
    .map((v) => String(v.comment || "").trim())
    .filter(Boolean);
  if (comments.length === 0) return "";
  return comments.map((c, idx) => `${idx + 1}. ${c}`).join("\n");
}

// Service pour envoyer un email de décision à une soumission admin
export async function sendSubmissionStatusEmail({ submissionId }) {
  if (!submissionId || typeof submissionId !== "string") {
    const err = new Error("Invalid submission id");
    err.status = 400;
    throw err;
  }

  const submission = await getSubmissionAdminEmailContext(submissionId);
  if (!submission) {
    const err = new Error("Submission not found");
    err.status = 404;
    throw err;
  }

  const latestDecision = await getLatestDecisionForSubmissionId(submissionId);
  const votes = await listVotesForSubmissionIds([submissionId]);
  const juryReason = buildJuryReason(votes);
  const status = submission.status || latestDecision?.decision || "pending";

  await sendSubmissionDecisionEmail({
    to: submission.director_email,
    directorName: submission.director_name,
    filmTitle: submission.title,
    language: submission.language,
    status,
    juryReason,
  });

  if (latestDecision?.id) {
    await markDecisionEmailSent(latestDecision.id);
  }

  return { ok: true };
}
