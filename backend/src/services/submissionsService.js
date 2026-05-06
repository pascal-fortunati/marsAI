import { insertSubmission } from "../models/submissionsModel.js";

// Service pour vérifier si une personne est majeure en fonction de sa date de naissance
function isAdult(birthdate) {
  if (!birthdate || typeof birthdate !== "string") return false;
  const birth = new Date(birthdate);
  if (Number.isNaN(birth.getTime())) return false;
  const now = new Date();
  const age =
    now.getFullYear() -
    birth.getFullYear() -
    (now < new Date(now.getFullYear(), birth.getMonth(), birth.getDate())
      ? 1
      : 0);
  return age >= 18;
}

// Service pour parser une durée en secondes à partir d'une chaîne de caractères
function parseDurationSeconds(input) {
  if (typeof input !== "string") return 0;
  const str = input.trim();
  if (!str) return 0;
  if (str.includes(":")) {
    const [m, s] = str.split(":").map((v) => Number(v));
    return (Number.isFinite(m) ? m : 0) * 60 + (Number.isFinite(s) ? s : 0);
  }
  const n = Number(str);
  return Number.isFinite(n) ? n : 0;
}

// Service pour parser une valeur booléenne à partir d'une chaîne de caractères
function parseBool(value) {
  if (typeof value === "boolean") return value;
  if (typeof value !== "string") return false;
  return value === "true" || value === "1" || value.toLowerCase() === "yes";
}

// Service pour parser un tableau JSON à partir d'une chaîne de caractères
function parseJsonArray(value) {
  if (!value || typeof value !== "string") return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Service pour créer une soumission
export async function createSubmission({ id, fields, files }) {
  const title = String(fields.title || "").trim();
  const synopsis = String(fields.synopsis || "").trim();
  const country = String(fields.country || "").trim();
  const language = String(fields.language || "").trim();
  const category = String(fields.category || "").trim();
  const year = Number(fields.year || 0);
  const durationSeconds = parseDurationSeconds(fields.duration);
  const aiTools = parseJsonArray(fields.aiTools)
    .map((t) => String(t))
    .filter(Boolean);
  const semanticTags = parseJsonArray(fields.semanticTags)
    .map((t) => String(t))
    .filter(Boolean);
  const musicCredits = String(fields.musicCredits || "").trim();
  const rightsConfirmed = parseBool(fields.rightsConfirmed);

  const directorName = String(fields.directorName || "").trim();
  const directorEmail = String(fields.directorEmail || "").trim();
  const directorPhone = String(fields.directorPhone || "").trim();
  const directorStreet = String(fields.directorStreet || "").trim();
  const directorZip = String(fields.directorZip || "").trim();
  const directorCity = String(fields.directorCity || "").trim();
  const directorCountry = String(fields.directorCountry || "").trim();
  const directorBirthdate = String(fields.directorBirthdate || "").trim();
  const directorJob = String(fields.directorJob || "").trim();
  const directorSocials = String(fields.directorSocials || "").trim();
  const discoverySource = String(fields.discoverySource || "").trim();

  const legalRefName = String(fields.legalRefName || "").trim();
  const legalRefEmail = String(fields.legalRefEmail || "").trim();

  const consentRules = parseBool(fields.consentRules);
  const consentPromo = parseBool(fields.consentPromo);
  const consentNewsletter = parseBool(fields.consentNewsletter);
  const consentCopyright = parseBool(fields.consentCopyright);

  // Validation des champs obligatoires
  if (!title) {
    const err = new Error("Titre requis");
    err.status = 400;
    throw err;
  }
  // Validation du synopsis
  if (!synopsis) {
    const err = new Error("Synopsis requis");
    err.status = 400;
    throw err;
  }
  if (synopsis.length > 300) {
    const err = new Error("Synopsis trop long");
    err.status = 400;
    throw err;
  }
  // Validation des champs film
  if (!country || !language || !category) {
    const err = new Error("Champs film manquants");
    err.status = 400;
    throw err;
  }
  // Validation de l'année
  if (!Number.isInteger(year) || year < 1900 || year > 2100) {
    const err = new Error("Année invalide");
    err.status = 400;
    throw err;
  }
  // Validation de la durée
  if (!durationSeconds || durationSeconds > 120) {
    const err = new Error("Durée invalide");
    err.status = 400;
    throw err;
  }
  // Validation des outils IA
  if (aiTools.length === 0) {
    const err = new Error("Outils IA requis");
    err.status = 400;
    throw err;
  }
  // Validation des thématiques
  if (semanticTags.length === 0) {
    const err = new Error("Thématiques requises");
    err.status = 400;
    throw err;
  }
  // Validation des mentions musiques
  if (!musicCredits) {
    const err = new Error("Mentions musiques requises");
    err.status = 400;
    throw err;
  }
  // Validation de la confirmation des droits
  if (!rightsConfirmed) {
    const err = new Error("Confirmation des droits requise");
    err.status = 400;
    throw err;
  }
  // Validation des coordonnées réalisateur
  if (!directorName || !directorEmail || !directorPhone) {
    const err = new Error("Coordonnées réalisateur manquantes");
    err.status = 400;
    throw err;
  }
  // Validation de l'email réalisateur
  if (!isValidEmail(directorEmail)) {
    const err = new Error("Email réalisateur invalide");
    err.status = 400;
    throw err;
  }
  // Validation du téléphone réalisateur
  if (!isValidPhone(directorPhone)) {
    const err = new Error("Téléphone réalisateur invalide");
    err.status = 400;
    throw err;
  }
  // Validation du nom et prénom réalisateur
  if (!isValidFullName(directorName)) {
    const err = new Error("Nom et prénom invalides");
    err.status = 400;
    throw err;
  }
  // Validation du code postal réalisateur
  if (!onlyDigits(directorZip)) {
    const err = new Error("Code postal invalide");
    err.status = 400;
    throw err;
  }
  // Validation de l'email référent légal
  if (!isValidEmail(legalRefEmail)) {
    const err = new Error("Email référent légal invalide");
    err.status = 400;
    throw err;
  }
  // Validation de l'adresse réalisateur
  if (!directorStreet || !directorZip || !directorCity || !directorCountry) {
    const err = new Error("Adresse réalisateur manquante");
    err.status = 400;
    throw err;
  }
  // Validation de la date de naissance réalisateur
  if (!directorBirthdate || !isAdult(directorBirthdate)) {
    const err = new Error("Âge invalide");
    err.status = 400;
    throw err;
  }
  // Validation du job et source de découverte réalisateur
  if (!directorJob || !discoverySource) {
    const err = new Error("Informations réalisateur manquantes");
    err.status = 400;
    throw err;
  }
  // Validation du nom et prénom référent légal
  if (!legalRefName || !legalRefEmail) {
    const err = new Error("Référent légal manquant");
    err.status = 400;
    throw err;
  }
  // Validation des consentements
  if (!consentRules || !consentPromo || !consentCopyright) {
    const err = new Error("Consentements obligatoires manquants");
    err.status = 400;
    throw err;
  }
  // Validation des fichiers vidéo et poster
  if (!files.videoUrl || !files.posterUrl) {
    const err = new Error("Fichiers manquants");
    err.status = 400;
    throw err;
  }

  await insertSubmission({
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
    posterUrl: files.posterUrl,
    videoUrl: files.videoUrl,
    subtitlesUrl: files.subtitlesUrl || null,
    youtubePrivateId: files.youtubePrivateId || null,
    consentRules,
    consentPromo,
    consentNewsletter,
    consentCopyright,
  });

  return { id };
}

// Validation de l'email
function isValidEmail(value) {
  const email = String(value || "").trim();
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Validation du code postal
function onlyDigits(value) {
  return /^\d+$/.test(String(value || "").trim());
}

// Validation du téléphone
function isValidPhone(value) {
  const normalized = String(value || "").replace(/[^\d]/g, "");
  return normalized.length >= 6 && normalized.length <= 20;
}

// Validation du nom et prénom
function isValidFullName(value) {
  const normalized = String(value || "")
    .trim()
    .replace(/\s+/g, " ");
  if (!normalized) return false;
  const parts = normalized.split(" ").filter(Boolean);
  if (parts.length < 2) return false;
  return parts.every((part) => part.replace(/[-']/g, "").length >= 2);
}
