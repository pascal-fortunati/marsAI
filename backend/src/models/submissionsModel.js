import { db } from "../config/db.js";

// Récupère le nombre total de soumissions sélectionnées
export async function countSelectedSubmissions() {
  const [[row]] = await db.execute(
    "SELECT COUNT(*) AS total FROM submissions WHERE status = 'selected'",
  );
  return Number(row?.total || 0);
}

// Récupère les soumissions sélectionnées avec pagination
export async function listSelectedSubmissionsPaginated({ limit, offset }) {
  const safeLimit = Math.max(1, Math.min(50, Math.floor(Number(limit) || 0)));
  const safeOffset = Math.max(0, Math.floor(Number(offset) || 0));
  const [rows] = await db.execute(
    `SELECT id, title, synopsis, country, language, year, duration_seconds, ai_tools, director_name, poster_url, youtube_public_id, youtube_private_id
     FROM submissions
     WHERE status = 'selected'
     ORDER BY created_at DESC
     LIMIT ${safeLimit} OFFSET ${safeOffset}`,
  );
  return rows;
}

// Récupère les soumissions sélectionnées avec une limite donnée
export async function listSelectedSubmissionsLimit(limit) {
  const safeLimit = Math.max(1, Math.min(50, Math.floor(Number(limit) || 0)));
  const [rows] = await db.execute(
    `SELECT id, title, synopsis, country, language, year, duration_seconds, ai_tools, director_name, poster_url, youtube_public_id, youtube_private_id
     FROM submissions
     WHERE status = 'selected'
     ORDER BY created_at DESC
     LIMIT ${safeLimit}`,
  );
  return rows;
}

// Récupère les soumissions avec une limite donnée pour l'administration
export async function listAdminSubmissionsLimit(limit) {
  const safeLimit = Math.max(1, Math.min(2000, Math.floor(Number(limit) || 0)));
  const [rows] = await db.execute(
    `SELECT id, title, synopsis, country, language, category, year, duration_seconds, director_name, director_email, director_phone, director_street, director_zip, director_city, director_country, director_birthdate, director_job, director_socials, discovery_source, legal_ref_name, legal_ref_email, poster_url, video_url, subtitles_url, youtube_private_id, youtube_public_id, ai_tools, semantic_tags, music_credits, rights_confirmed, consent_rules, consent_promo, consent_newsletter, consent_copyright, status, created_at
     FROM submissions
     ORDER BY created_at DESC
     LIMIT ${safeLimit}`,
  );
  return rows;
}

// Récupère les emails des réalisateurs abonnés à la newsletter
export async function getSubscribedDirectorsEmails() {
  const [rows] = await db.execute(
    "SELECT DISTINCT director_email, director_name FROM submissions WHERE consent_newsletter = 1",
  );
  return rows;
}

// Met à jour le statut d'une soumission donnée
export async function updateSubmissionStatus({ submissionId, status }) {
  await db.execute("UPDATE submissions SET status = ? WHERE id = ?", [
    status,
    submissionId,
  ]);
}

// Assure que la soumission est sélectionnée
export async function ensureSubmissionSelected({ submissionId }) {
  await db.execute("UPDATE submissions SET status = 'selected' WHERE id = ?", [
    submissionId,
  ]);
}

// Récupère les identifiants YouTube d'une soumission donnée
export async function getSubmissionYoutubeIds(submissionId) {
  const [rows] = await db.execute(
    "SELECT youtube_private_id, youtube_public_id FROM submissions WHERE id = ? LIMIT 1",
    [submissionId],
  );
  return rows?.[0] || null;
}

// Récupère une soumission par son identifiant
export async function findSubmissionById(submissionId) {
  const [rows] = await db.execute(
    "SELECT id FROM submissions WHERE id = ? LIMIT 1",
    [submissionId],
  );
  return rows?.[0] || null;
}

// Récupère l'URL du poster d'une soumission sélectionnée
export async function getSelectedSubmissionPoster(submissionId) {
  const [rows] = await db.execute(
    "SELECT id, poster_url FROM submissions WHERE id = ? AND status = 'selected' LIMIT 1",
    [submissionId],
  );
  return rows?.[0] || null;
}

// Récupère les URLs d'assets d'une soumission donnée
export async function getSubmissionAssetUrlsById(submissionId) {
  const [rows] = await db.execute(
    "SELECT id, video_url, poster_url, subtitles_url FROM submissions WHERE id = ? LIMIT 1",
    [submissionId],
  );
  return rows?.[0] || null;
}

// Récupère les contextes d'administration d'une soumission donnée
export async function getSubmissionAdminEmailContext(submissionId) {
  const [rows] = await db.execute(
    `SELECT id, title, language, country, status, director_name, director_email, youtube_private_id, youtube_public_id
     FROM submissions
     WHERE id = ?
     LIMIT 1`,
    [submissionId],
  );
  return rows?.[0] || null;
}

// Récupère les identifiants d'une liste de soumissions donnéees
export async function listSubmissionIdsByIds(submissionIds) {
  if (!Array.isArray(submissionIds) || submissionIds.length === 0) return [];
  const placeholders = submissionIds.map(() => "?").join(",");
  const [rows] = await db.execute(
    `SELECT id FROM submissions WHERE id IN (${placeholders})`,
    submissionIds,
  );
  return rows;
}

// Met à jour l'identifiant YouTube public d'une soumission donnée
export async function setSubmissionYoutubePublicId({
  submissionId,
  youtubePublicId,
}) {
  await db.execute(
    "UPDATE submissions SET youtube_public_id = ? WHERE id = ?",
    [youtubePublicId, submissionId],
  );
}

// Met à jour l'identifiant YouTube privé d'une soumission donnée
export async function setSubmissionYoutubePrivateId({
  submissionId,
  youtubePrivateId,
}) {
  await db.execute(
    "UPDATE submissions SET youtube_private_id = ?, youtube_public_id = NULL WHERE id = ?",
    [youtubePrivateId, submissionId],
  );
}

// Insère une nouvelle soumission dans la base de données
export async function insertSubmission({
  id,
  title,
  synopsis,
  country,
  language,
  category,
  year,
  durationSeconds,
  aiTools,
  semanticTags,
  musicCredits,
  rightsConfirmed,
  directorName,
  directorEmail,
  directorPhone,
  directorStreet,
  directorZip,
  directorCity,
  directorCountry,
  directorBirthdate,
  directorJob,
  directorSocials,
  discoverySource,
  legalRefName,
  legalRefEmail,
  posterUrl,
  videoUrl,
  subtitlesUrl,
  youtubePrivateId,
  consentRules,
  consentPromo,
  consentNewsletter,
  consentCopyright,
}) {
  await db.execute(
    `INSERT INTO submissions (
      id, title, synopsis, country, language, category, year,
      duration_seconds, ai_tools, semantic_tags, music_credits, rights_confirmed,
      director_name, director_email, director_phone, director_street, director_zip, director_city, director_country, director_birthdate, director_job,
      director_socials, discovery_source,
      legal_ref_name, legal_ref_email,
      poster_url, video_url, subtitles_url, youtube_private_id,
      consent_rules, consent_promo, consent_newsletter, consent_copyright,
      status, created_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?,
      ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?,
      'pending', NOW()
    )`,
    [
      id,
      title,
      synopsis,
      country,
      language,
      category,
      year,
      durationSeconds,
      JSON.stringify(aiTools || []),
      JSON.stringify(semanticTags || []),
      musicCredits,
      Boolean(rightsConfirmed),
      directorName,
      directorEmail,
      directorPhone,
      directorStreet,
      directorZip,
      directorCity,
      directorCountry,
      directorBirthdate,
      directorJob,
      directorSocials || null,
      discoverySource || null,
      legalRefName,
      legalRefEmail,
      posterUrl,
      videoUrl,
      subtitlesUrl,
      youtubePrivateId || null,
      Boolean(consentRules),
      Boolean(consentPromo),
      Boolean(consentNewsletter),
      Boolean(consentCopyright),
    ],
  );
}
