import {
  getSettingsByKeys,
  upsertSetting,
} from "../models/siteSettingsModel.js";

// Service pour obtenir les paramètres du site
const keys = {
  phase1CloseIso: "phase1_close_iso",
  phase2CatalogueIso: "phase2_catalogue_iso",
  phase3PalmaresIso: "phase3_palmares_iso",
  siteLogo: "site_logo",
  heroImageUrl: "hero_image_url",
  platformBaseUrl: "platform_base_url",
  partners: "partners",
  partnersLogos: "partners_logos",
  footerText: "footer_text",
  festivalDescription: "festival_description",
  submissionCategories: "submission_categories",
  submissionLanguages: "submission_languages",
  submissionCountries: "submission_countries",
  submissionJobs: "submission_jobs",
  submissionDiscoverySources: "submission_discovery_sources",
  submissionAiToolSuggestions: "submission_ai_tool_suggestions",
  submissionSemanticTags: "submission_semantic_tags",
  submissionSocialNetworks: "submission_social_networks",
  homeTranslations: "home_translations",
  youtubeChannelId: "youtube_channel_id",
  youtubeChannelName: "youtube_channel_name",
  youtubeOauthRefreshTokenEnc: "youtube_oauth_refresh_token_enc",
  youtubeOauthConnectedAt: "youtube_oauth_connected_at",
  youtubeDefaultPrivacy: "youtube_default_privacy",
  youtubeAutoCopyrightCheck: "youtube_auto_copyright_check",
  youtubeMoveToS3AfterCheck: "youtube_move_to_s3_after_check",
  brevoSenderEmail: "brevo_sender_email",
  emailSubmissionReceivedTemplate: "email_submission_received_template",
  emailDecisionTemplates: "email_decision_templates",
};

const defaultEmailSubmissionReceivedTemplate = {
  fr: {
    subject: "marsAI 2026 · Confirmation de soumission : {{filmTitle}}",
    text: [
      "Bonjour {{directorName}},",
      "",
      "Nous confirmons la réception de votre soumission.",
      "Identifiant de soumission : {{submissionId}}",
      "",
      "Aucune modification n'est possible après envoi.",
      "",
      "Cordialement,",
      "Équipe marsAI",
    ].join("\n"),
    html: "<p>Bonjour {{directorName}},</p><p>Nous confirmons la réception de votre soumission.</p><p><strong>Identifiant de soumission :</strong> {{submissionId}}</p><p>Aucune modification n'est possible après envoi.</p><p>Cordialement,<br/>Équipe marsAI</p>",
  },
  en: {
    subject: "marsAI 2026 · Submission confirmation: {{filmTitle}}",
    text: [
      "Hello {{directorName}},",
      "",
      "We confirm that your submission has been received.",
      "Submission ID: {{submissionId}}",
      "",
      "No edits are allowed after submission.",
      "",
      "Kind regards,",
      "marsAI team",
    ].join("\n"),
    html: "<p>Hello {{directorName}},</p><p>We confirm that your submission has been received.</p><p><strong>Submission ID:</strong> {{submissionId}}</p><p>No edits are allowed after submission.</p><p>Kind regards,<br/>marsAI team</p>",
  },
};

const defaultEmailDecisionTemplates = {
  selected: {
    fr: {
      subject: "marsAI 2026 · Film sélectionné : {{filmTitle}}",
      title: "Votre film est sélectionné pour le festival",
      body: "Nous avons le plaisir de vous annoncer que votre film fait partie de la sélection officielle.",
    },
    en: {
      subject: "marsAI 2026 · Film selected: {{filmTitle}}",
      title: "Your film is selected for the festival",
      body: "We are pleased to announce that your film is part of the official selection.",
    },
  },
  refused: {
    fr: {
      subject: "marsAI 2026 · Décision jury : {{filmTitle}}",
      title: "Votre film n'a pas été retenu",
      body: "Après délibération, le jury n'a pas retenu votre film pour la sélection officielle.",
    },
    en: {
      subject: "marsAI 2026 · Jury decision: {{filmTitle}}",
      title: "Your film was not selected",
      body: "After deliberation, the jury did not select your film for the official selection.",
    },
  },
  review: {
    fr: {
      subject: "marsAI 2026 · Film en revue : {{filmTitle}}",
      title: "Votre film reste en phase de revue",
      body: "Le jury demande une revue complémentaire avant décision finale.",
    },
    en: {
      subject: "marsAI 2026 · Film under review: {{filmTitle}}",
      title: "Your film remains under review",
      body: "The jury requests an additional review before the final decision.",
    },
  },
  validated: {
    fr: {
      subject: "marsAI 2026 · Film validé : {{filmTitle}}",
      title: "Votre film est validé",
      body: "Votre film est validé par le jury.",
    },
    en: {
      subject: "marsAI 2026 · Film validated: {{filmTitle}}",
      title: "Your film is validated",
      body: "Your film has been validated by the jury.",
    },
  },
  pending: {
    fr: {
      subject: "marsAI 2026 · Mise à jour : {{filmTitle}}",
      title: "Statut de votre film mis à jour",
      body: "Le statut de votre film a été mis à jour dans l'interface d'administration.",
    },
    en: {
      subject: "marsAI 2026 · Update: {{filmTitle}}",
      title: "Your film status has been updated",
      body: "Your film status has been updated in the admin interface.",
    },
  },
};

// Service pour obtenir les paramètres par défaut du site
const defaults = {
  submissionCategories: [],
  submissionLanguages: [],
  submissionCountries: [],
  submissionJobs: [],
  submissionDiscoverySources: [],
  submissionAiToolSuggestions: [],
  submissionSemanticTags: [],
  submissionSocialNetworks: [],
  youtubeDefaultPrivacy: "private",
  youtubeAutoCopyrightCheck: true,
  youtubeMoveToS3AfterCheck: false,
  brevoSenderEmail: null,
  emailSubmissionReceivedTemplate: defaultEmailSubmissionReceivedTemplate,
  emailDecisionTemplates: defaultEmailDecisionTemplates,
};

// Service pour valider si une chaîne est une date ISO valide ou nulle
function isValidIsoOrNull(value) {
  if (value === undefined) return true;
  if (value === null) return true;
  if (typeof value !== "string") return false;
  const ms = Date.parse(value);
  return Number.isFinite(ms);
}

// Service pour valider si une chaîne est une chaîne valide ou nulle
function isValidStringOrNullOrUndefined(value) {
  if (value === undefined) return true;
  if (value === null) return true;
  return typeof value === "string";
}

// Service pour valider et normaliser les paramètres booléens
function parseBooleanSetting(value, fallback) {
  if (typeof value !== "string" || value.trim() === "") return fallback;
  if (value === "1" || value.toLowerCase() === "true") return true;
  if (value === "0" || value.toLowerCase() === "false") return false;
  return fallback;
}

// Service pour normaliser les paramètres booléens en "1" ou "0"
function normalizeBooleanSetting(input) {
  if (input === undefined) return { ok: true, value: undefined };
  if (typeof input !== "boolean")
    return { ok: false, error: "Invalid boolean" };
  return { ok: true, value: input ? "1" : "0" };
}

function normalizePlatformBaseUrlSetting(input) {
  if (input === undefined) return { ok: true, value: undefined };
  if (input === null) return { ok: true, value: null };
  if (typeof input !== "string") return { ok: false, error: "Invalid type" };

  const raw = input.trim();
  if (!raw) return { ok: true, value: null };

  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `http://${raw}`;
  try {
    const parsed = new URL(withProtocol);
    if (!parsed.hostname) return { ok: false, error: "Invalid URL" };
    return { ok: true, value: parsed.origin };
  } catch {
    return { ok: false, error: "Invalid URL" };
  }
}

// Service pour valider et normaliser les paramètres JSON de tableaux de chaînes
function parseStringArrayJson(value, fallback) {
  if (typeof value !== "string" || value.trim() === "") return fallback;
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return fallback;
    const cleaned = parsed.map((v) => String(v).trim()).filter(Boolean);
    return cleaned.length > 0 ? cleaned : fallback;
  } catch {
    return fallback;
  }
}

// Service pour valider et normaliser les paramètres JSON de tableaux d'objets de réseaux sociaux
function parseSocialNetworksJson(value, fallback) {
  if (typeof value !== "string" || value.trim() === "") return fallback;
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return fallback;
    const cleaned = parsed
      .map((v) => ({
        key: typeof v?.key === "string" ? v.key.trim() : "",
        label: typeof v?.label === "string" ? v.label.trim() : "",
      }))
      .filter((v) => v.key && v.label);
    return cleaned.length > 0 ? cleaned : fallback;
  } catch {
    return fallback;
  }
}

// Service pour valider et normaliser les paramètres JSON de tableaux d'objets de partenaires de logotype
function parsePartnersLogosJson(value, fallback) {
  if (typeof value !== "string" || value.trim() === "") return fallback;
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return fallback;
    return parsed
      .map((v) => ({
        url: typeof v?.url === "string" ? v.url.trim() : "",
        name: typeof v?.name === "string" ? v.name.trim() : null,
        linkUrl: typeof v?.linkUrl === "string" ? v.linkUrl.trim() : null,
      }))
      .filter((v) => v.url);
  } catch {
    return fallback;
  }
}

// Service pour normaliser les paramètres JSON de tableaux de chaînes en JSON.stringify
function normalizeStringArraySetting(input) {
  if (input === undefined) return { ok: true, value: undefined };
  if (input === null) return { ok: true, value: null };
  if (Array.isArray(input)) {
    const cleaned = input.map((v) => String(v).trim()).filter(Boolean);
    return { ok: true, value: JSON.stringify(cleaned) };
  }
  if (typeof input === "string") {
    try {
      const parsed = JSON.parse(input);
      if (!Array.isArray(parsed))
        return { ok: false, error: "Invalid JSON array" };
      const cleaned = parsed.map((v) => String(v).trim()).filter(Boolean);
      return { ok: true, value: JSON.stringify(cleaned) };
    } catch {
      return { ok: false, error: "Invalid JSON" };
    }
  }
  return { ok: false, error: "Invalid type" };
}

// Service pour normaliser les paramètres JSON de tableaux d'objets de réseaux sociaux en JSON.stringify
function normalizeSocialNetworksSetting(input) {
  if (input === undefined) return { ok: true, value: undefined };
  if (input === null) return { ok: true, value: null };
  if (Array.isArray(input)) {
    const cleaned = input
      .map((v) => ({
        key:
          typeof v?.key === "string"
            ? v.key.trim()
            : String(v?.key || "").trim(),
        label:
          typeof v?.label === "string"
            ? v.label.trim()
            : String(v?.label || "").trim(),
      }))
      .filter((v) => v.key && v.label);
    return { ok: true, value: JSON.stringify(cleaned) };
  }
  if (typeof input === "string") {
    try {
      const parsed = JSON.parse(input);
      if (!Array.isArray(parsed))
        return { ok: false, error: "Invalid JSON array" };
      const cleaned = parsed
        .map((v) => ({
          key: typeof v?.key === "string" ? v.key.trim() : "",
          label: typeof v?.label === "string" ? v.label.trim() : "",
        }))
        .filter((v) => v.key && v.label);
      return { ok: true, value: JSON.stringify(cleaned) };
    } catch {
      return { ok: false, error: "Invalid JSON" };
    }
  }
  return { ok: false, error: "Invalid type" };
}

// Service pour normaliser les paramètres JSON de tableaux d'objets de partenaires de logotype en JSON.stringify
function normalizePartnersLogosSetting(input) {
  if (input === undefined) return { ok: true, value: undefined };
  if (input === null) return { ok: true, value: null };

  let parsed = input;
  if (typeof input === "string") {
    try {
      parsed = JSON.parse(input);
    } catch {
      return { ok: false, error: "Invalid JSON" };
    }
  }

  if (!Array.isArray(parsed)) return { ok: false, error: "Invalid JSON array" };

  const cleaned = parsed
    .map((v) => ({
      url: typeof v?.url === "string" ? v.url.trim() : "",
      name: typeof v?.name === "string" ? v.name.trim() : null,
      linkUrl: typeof v?.linkUrl === "string" ? v.linkUrl.trim() : null,
    }))
    .filter((v) => v.url);

  return { ok: true, value: JSON.stringify(cleaned) };
}

// Service pour valider et normaliser les paramètres JSON de traductions de la page d'accueil
function parseHomeTranslationsJson(value) {
  if (typeof value !== "string" || value.trim() === "") return null;
  try {
    const parsed = JSON.parse(value);
    if (!parsed || typeof parsed !== "object") return null;
    const fr = parsed?.fr;
    const en = parsed?.en;
    const normalizedFr = fr && typeof fr === "object" ? fr : {};
    const normalizedEn = en && typeof en === "object" ? en : {};
    return { fr: normalizedFr, en: normalizedEn };
  } catch {
    return null;
  }
}

// Service pour normaliser les paramètres JSON de traductions de la page d'accueil en JSON.stringify
function normalizeHomeTranslationsSetting(input) {
  if (input === undefined) return { ok: true, value: undefined };
  if (input === null) return { ok: true, value: null };

  let parsed = input;
  if (typeof input === "string") {
    try {
      parsed = JSON.parse(input);
    } catch {
      return { ok: false, error: "Invalid JSON" };
    }
  }

  if (!parsed || typeof parsed !== "object")
    return { ok: false, error: "Invalid type" };
  const fr = parsed?.fr;
  const en = parsed?.en;
  if (
    (fr !== undefined && (fr === null || typeof fr !== "object")) ||
    (en !== undefined && (en === null || typeof en !== "object"))
  ) {
    return { ok: false, error: "Invalid locale objects" };
  }
  const normalized = {
    fr: fr && typeof fr === "object" ? fr : {},
    en: en && typeof en === "object" ? en : {},
  };
  return { ok: true, value: JSON.stringify(normalized) };
}

function parseEmailTemplateObjectJson(value, fallback) {
  if (typeof value !== "string" || value.trim() === "") return fallback;
  try {
    const parsed = JSON.parse(value);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
      return fallback;
    return parsed;
  } catch {
    return fallback;
  }
}

function normalizeEmailTemplateObjectSetting(input) {
  if (input === undefined) return { ok: true, value: undefined };
  if (input === null) return { ok: true, value: null };

  let parsed = input;
  if (typeof input === "string") {
    try {
      parsed = JSON.parse(input);
    } catch {
      return { ok: false, error: "Invalid JSON" };
    }
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return { ok: false, error: "Invalid template object" };
  }
  return { ok: true, value: JSON.stringify(parsed) };
}

// Service pour obtenir les paramètres de configuration du festival
export async function getFestivalSettings() {
  const wanted = Object.values(keys);
  const rows = await getSettingsByKeys(wanted);
  const map = new Map(rows.map((r) => [r.key, r.value]));
  return {
    phase1CloseIso: map.get(keys.phase1CloseIso) || null,
    phase2CatalogueIso: map.get(keys.phase2CatalogueIso) || null,
    phase3PalmaresIso: map.get(keys.phase3PalmaresIso) || null,
    siteLogo: map.get(keys.siteLogo) || null,
    heroImageUrl: map.get(keys.heroImageUrl) || null,
    platformBaseUrl: map.get(keys.platformBaseUrl) || null,
    partners: map.get(keys.partners) || null,
    partnersLogos: parsePartnersLogosJson(map.get(keys.partnersLogos), []),
    footerText: map.get(keys.footerText) || null,
    festivalDescription: map.get(keys.festivalDescription) || null,
    submissionCategories: parseStringArrayJson(
      map.get(keys.submissionCategories),
      defaults.submissionCategories,
    ),
    submissionLanguages: parseStringArrayJson(
      map.get(keys.submissionLanguages),
      defaults.submissionLanguages,
    ),
    submissionCountries: parseStringArrayJson(
      map.get(keys.submissionCountries),
      defaults.submissionCountries,
    ),
    submissionJobs: parseStringArrayJson(
      map.get(keys.submissionJobs),
      defaults.submissionJobs,
    ),
    submissionDiscoverySources: parseStringArrayJson(
      map.get(keys.submissionDiscoverySources),
      defaults.submissionDiscoverySources,
    ),
    submissionAiToolSuggestions: parseStringArrayJson(
      map.get(keys.submissionAiToolSuggestions),
      defaults.submissionAiToolSuggestions,
    ),
    submissionSemanticTags: parseStringArrayJson(
      map.get(keys.submissionSemanticTags),
      defaults.submissionSemanticTags,
    ),
    submissionSocialNetworks: parseSocialNetworksJson(
      map.get(keys.submissionSocialNetworks),
      defaults.submissionSocialNetworks,
    ),
    homeTranslations: parseHomeTranslationsJson(map.get(keys.homeTranslations)),
    youtubeChannelId: map.get(keys.youtubeChannelId) || null,
    youtubeChannelName: map.get(keys.youtubeChannelName) || null,
    youtubeOauthConnected: Boolean(map.get(keys.youtubeOauthRefreshTokenEnc)),
    youtubeOauthConnectedAt: map.get(keys.youtubeOauthConnectedAt) || null,
    youtubeDefaultPrivacy: ["private", "unlisted", "public"].includes(
      map.get(keys.youtubeDefaultPrivacy),
    )
      ? map.get(keys.youtubeDefaultPrivacy)
      : defaults.youtubeDefaultPrivacy,
    youtubeAutoCopyrightCheck: parseBooleanSetting(
      map.get(keys.youtubeAutoCopyrightCheck),
      defaults.youtubeAutoCopyrightCheck,
    ),
    youtubeMoveToS3AfterCheck: parseBooleanSetting(
      map.get(keys.youtubeMoveToS3AfterCheck),
      defaults.youtubeMoveToS3AfterCheck,
    ),
    brevoSenderEmail:
      map.get(keys.brevoSenderEmail) || defaults.brevoSenderEmail,
    emailSubmissionReceivedTemplate: parseEmailTemplateObjectJson(
      map.get(keys.emailSubmissionReceivedTemplate),
      defaults.emailSubmissionReceivedTemplate,
    ),
    emailDecisionTemplates: parseEmailTemplateObjectJson(
      map.get(keys.emailDecisionTemplates),
      defaults.emailDecisionTemplates,
    ),
  };
}

// Service pour mettre à jour les paramètres de configuration du festival
export async function updateFestivalSettings({
  phase1CloseIso,
  phase2CatalogueIso,
  phase3PalmaresIso,
  siteLogo,
  heroImageUrl,
  platformBaseUrl,
  partners,
  partnersLogos,
  footerText,
  festivalDescription,
  submissionCategories,
  submissionLanguages,
  submissionCountries,
  submissionJobs,
  submissionDiscoverySources,
  submissionAiToolSuggestions,
  submissionSemanticTags,
  submissionSocialNetworks,
  homeTranslations,
  youtubeChannelId,
  youtubeChannelName,
  youtubeDefaultPrivacy,
  youtubeAutoCopyrightCheck,
  youtubeMoveToS3AfterCheck,
  brevoSenderEmail,
  emailSubmissionReceivedTemplate,
  emailDecisionTemplates,
}) {
  const normCats = normalizeStringArraySetting(submissionCategories);
  const normLangs = normalizeStringArraySetting(submissionLanguages);
  const normCountries = normalizeStringArraySetting(submissionCountries);
  const normJobs = normalizeStringArraySetting(submissionJobs);
  const normDiscovery = normalizeStringArraySetting(submissionDiscoverySources);
  const normAiTools = normalizeStringArraySetting(submissionAiToolSuggestions);
  const normTags = normalizeStringArraySetting(submissionSemanticTags);
  const normSocials = normalizeSocialNetworksSetting(submissionSocialNetworks);
  const normPartnersLogos = normalizePartnersLogosSetting(partnersLogos);
  const normHomeTranslations =
    normalizeHomeTranslationsSetting(homeTranslations);
  const normYoutubeAutoCopyrightCheck = normalizeBooleanSetting(
    youtubeAutoCopyrightCheck,
  );
  const normYoutubeMoveToS3AfterCheck = normalizeBooleanSetting(
    youtubeMoveToS3AfterCheck,
  );
  const normEmailSubmissionReceivedTemplate =
    normalizeEmailTemplateObjectSetting(emailSubmissionReceivedTemplate);
  const normEmailDecisionTemplates = normalizeEmailTemplateObjectSetting(
    emailDecisionTemplates,
  );
  const normPlatformBaseUrl = normalizePlatformBaseUrlSetting(platformBaseUrl);

  const invalid =
    !isValidIsoOrNull(phase1CloseIso) ||
    !isValidIsoOrNull(phase2CatalogueIso) ||
    !isValidIsoOrNull(phase3PalmaresIso) ||
    !isValidStringOrNullOrUndefined(siteLogo) ||
    !isValidStringOrNullOrUndefined(heroImageUrl) ||
    !normPlatformBaseUrl.ok ||
    !isValidStringOrNullOrUndefined(partners) ||
    !isValidStringOrNullOrUndefined(footerText) ||
    !isValidStringOrNullOrUndefined(festivalDescription) ||
    !normCats.ok ||
    !normLangs.ok ||
    !normCountries.ok ||
    !normJobs.ok ||
    !normDiscovery.ok ||
    !normAiTools.ok ||
    !normTags.ok ||
    !normSocials.ok ||
    !normPartnersLogos.ok ||
    !normHomeTranslations.ok ||
    !isValidStringOrNullOrUndefined(youtubeChannelId) ||
    !isValidStringOrNullOrUndefined(youtubeChannelName) ||
    (youtubeDefaultPrivacy !== undefined &&
      !["private", "unlisted", "public"].includes(youtubeDefaultPrivacy)) ||
    !isValidStringOrNullOrUndefined(brevoSenderEmail) ||
    !normYoutubeAutoCopyrightCheck.ok ||
    !normYoutubeMoveToS3AfterCheck.ok ||
    !normEmailSubmissionReceivedTemplate.ok ||
    !normEmailDecisionTemplates.ok;
  if (invalid) {
    const err = new Error("Invalid settings payload");
    err.status = 400;
    throw err;
  }

  if (phase1CloseIso !== undefined)
    await upsertSetting({ key: keys.phase1CloseIso, value: phase1CloseIso });
  if (phase2CatalogueIso !== undefined)
    await upsertSetting({
      key: keys.phase2CatalogueIso,
      value: phase2CatalogueIso,
    });
  if (phase3PalmaresIso !== undefined)
    await upsertSetting({
      key: keys.phase3PalmaresIso,
      value: phase3PalmaresIso,
    });

  if (siteLogo !== undefined)
    await upsertSetting({ key: keys.siteLogo, value: siteLogo });
  if (heroImageUrl !== undefined)
    await upsertSetting({ key: keys.heroImageUrl, value: heroImageUrl });
  if (normPlatformBaseUrl.value !== undefined)
    await upsertSetting({
      key: keys.platformBaseUrl,
      value: normPlatformBaseUrl.value,
    });
  if (partners !== undefined)
    await upsertSetting({ key: keys.partners, value: partners });
  if (normPartnersLogos.value !== undefined)
    await upsertSetting({
      key: keys.partnersLogos,
      value: normPartnersLogos.value,
    });
  if (footerText !== undefined)
    await upsertSetting({ key: keys.footerText, value: footerText });
  if (festivalDescription !== undefined)
    await upsertSetting({
      key: keys.festivalDescription,
      value: festivalDescription,
    });

  if (normCats.value !== undefined)
    await upsertSetting({
      key: keys.submissionCategories,
      value: normCats.value,
    });
  if (normLangs.value !== undefined)
    await upsertSetting({
      key: keys.submissionLanguages,
      value: normLangs.value,
    });
  if (normCountries.value !== undefined)
    await upsertSetting({
      key: keys.submissionCountries,
      value: normCountries.value,
    });
  if (normJobs.value !== undefined)
    await upsertSetting({ key: keys.submissionJobs, value: normJobs.value });
  if (normDiscovery.value !== undefined)
    await upsertSetting({
      key: keys.submissionDiscoverySources,
      value: normDiscovery.value,
    });
  if (normAiTools.value !== undefined)
    await upsertSetting({
      key: keys.submissionAiToolSuggestions,
      value: normAiTools.value,
    });
  if (normTags.value !== undefined)
    await upsertSetting({
      key: keys.submissionSemanticTags,
      value: normTags.value,
    });
  if (normSocials.value !== undefined)
    await upsertSetting({
      key: keys.submissionSocialNetworks,
      value: normSocials.value,
    });
  if (normHomeTranslations.value !== undefined)
    await upsertSetting({
      key: keys.homeTranslations,
      value: normHomeTranslations.value,
    });
  if (youtubeChannelId !== undefined)
    await upsertSetting({
      key: keys.youtubeChannelId,
      value: youtubeChannelId,
    });
  if (youtubeChannelName !== undefined)
    await upsertSetting({
      key: keys.youtubeChannelName,
      value: youtubeChannelName,
    });
  if (youtubeDefaultPrivacy !== undefined)
    await upsertSetting({
      key: keys.youtubeDefaultPrivacy,
      value: youtubeDefaultPrivacy,
    });
  if (normYoutubeAutoCopyrightCheck.value !== undefined) {
    await upsertSetting({
      key: keys.youtubeAutoCopyrightCheck,
      value: normYoutubeAutoCopyrightCheck.value,
    });
  }
  if (normYoutubeMoveToS3AfterCheck.value !== undefined) {
    await upsertSetting({
      key: keys.youtubeMoveToS3AfterCheck,
      value: normYoutubeMoveToS3AfterCheck.value,
    });
  }
  if (brevoSenderEmail !== undefined) {
    await upsertSetting({
      key: keys.brevoSenderEmail,
      value: brevoSenderEmail,
    });
  }
  if (normEmailSubmissionReceivedTemplate.value !== undefined) {
    await upsertSetting({
      key: keys.emailSubmissionReceivedTemplate,
      value: normEmailSubmissionReceivedTemplate.value,
    });
  }
  if (normEmailDecisionTemplates.value !== undefined) {
    await upsertSetting({
      key: keys.emailDecisionTemplates,
      value: normEmailDecisionTemplates.value,
    });
  }

  return getFestivalSettings();
}

// Service pour mettre à jour les paramètres de configuration des partenaires de logotype
export async function updatePartnersLogos(partnersLogos) {
  const norm = normalizePartnersLogosSetting(partnersLogos);
  if (!norm.ok) {
    const err = new Error("Invalid partners logos payload");
    err.status = 400;
    throw err;
  }

  await upsertSetting({ key: keys.partnersLogos, value: norm.value });
  return getFestivalSettings();
}

// Service pour obtenir les paramètres de configuration des options de soumission
export async function getSubmissionOptions() {
  const wanted = [
    keys.submissionCategories,
    keys.submissionLanguages,
    keys.submissionCountries,
    keys.submissionJobs,
    keys.submissionDiscoverySources,
    keys.submissionAiToolSuggestions,
    keys.submissionSemanticTags,
    keys.submissionSocialNetworks,
  ];
  const rows = await getSettingsByKeys(wanted);
  const map = new Map(rows.map((r) => [r.key, r.value]));

  return {
    categories: parseStringArrayJson(
      map.get(keys.submissionCategories),
      defaults.submissionCategories,
    ),
    languages: parseStringArrayJson(
      map.get(keys.submissionLanguages),
      defaults.submissionLanguages,
    ),
    countries: parseStringArrayJson(
      map.get(keys.submissionCountries),
      defaults.submissionCountries,
    ),
    jobs: parseStringArrayJson(
      map.get(keys.submissionJobs),
      defaults.submissionJobs,
    ),
    discoverySources: parseStringArrayJson(
      map.get(keys.submissionDiscoverySources),
      defaults.submissionDiscoverySources,
    ),
    aiToolSuggestions: parseStringArrayJson(
      map.get(keys.submissionAiToolSuggestions),
      defaults.submissionAiToolSuggestions,
    ),
    semanticTags: parseStringArrayJson(
      map.get(keys.submissionSemanticTags),
      defaults.submissionSemanticTags,
    ),
    socialNetworks: parseSocialNetworksJson(
      map.get(keys.submissionSocialNetworks),
      defaults.submissionSocialNetworks,
    ),
  };
}
