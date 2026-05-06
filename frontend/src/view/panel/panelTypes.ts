export type TabKey =
  | "films"
  | "users"
  | "site"
  | "partners"
  | "youtube"
  | "email";
export type Status =
  | "pending"
  | "validated"
  | "refused"
  | "review"
  | "selected";
export type Badge = "grand_prix" | "prix_jury" | null;
export type UserRole = "admin" | "moderator" | "jury";

// Type représentant un film dans le panneau
export type Film = {
  id: string;
  title: string;
  country: string;
  language: string | null;
  category: string | null;
  year: number | null;
  duration: string;
  director: string;
  directorEmail: string;
  directorPhone: string | null;
  directorStreet: string | null;
  directorZip: string | null;
  directorCity: string | null;
  directorCountry: string | null;
  directorBirthdate: string | null;
  directorJob: string | null;
  directorSocials: Record<string, string> | null;
  discoverySource: string | null;
  legalRefName: string | null;
  legalRefEmail: string | null;
  synopsis: string;
  aiTools: string[];
  semanticTags: string[];
  musicCredits: string | null;
  rightsConfirmed: boolean;
  posterUrl: string | null;
  videoUrl: string | null;
  subtitlesUrl: string | null;
  youtubePrivateId: string | null;
  youtubePublicId: string | null;
  consentRules: boolean;
  consentPromo: boolean;
  consentNewsletter: boolean;
  consentCopyright: boolean;
  status: Status;
  badge: Badge;
  prize: string | null;
  assignedJury: { id: number; name: string; email: string }[];
  juryVotes: {
    juryName: string;
    action: "validate" | "refuse" | "review";
    comment: string;
  }[];
  adminDecision: {
    decision: string;
    comment: string;
    emailSent: boolean;
  } | null;
  submittedAt: string;
};

// Type représentant un utilisateur dans le panneau
export type User = {
  id: string;
  googleSubId: string | null;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
};
// Type représentant un utilisateur jury dans le panneau
export type JuryUser = {
  id: string;
  email: string;
  name: string;
  googleSubId: string | null;
};
// Type représentant un logo d'un partenaire dans le panneau
export type PartnerLogo = {
  url: string;
  name?: string | null;
  linkUrl?: string | null;
};
// Type représentant les traductions de la page d'accueil dans le panneau
export type HomeTranslations = {
  fr?: Record<string, unknown>;
  en?: Record<string, unknown>;
} | null;
// Type représentant les paramètres du site dans le panneau
export type SiteSettings = {
  phase1CloseIso: string | null;
  phase2CatalogueIso: string | null;
  phase3PalmaresIso: string | null;
  siteLogo: string | null;
  heroImageUrl: string | null;
  platformBaseUrl: string | null;
  partnersLogos: PartnerLogo[];
  footerText: string | null;
  festivalDescription: string | null;
  submissionCategories: string[];
  submissionLanguages: string[];
  submissionCountries: string[];
  submissionJobs: string[];
  submissionDiscoverySources: string[];
  submissionAiToolSuggestions: string[];
  submissionSemanticTags: string[];
  submissionSocialNetworks: { key: string; label: string }[];
  homeTranslations?: HomeTranslations;
  youtubeChannelId?: string | null;
  youtubeChannelName?: string | null;
  youtubeOauthConnected?: boolean;
  youtubeOauthConnectedAt?: string | null;
  youtubeDefaultPrivacy?: "private" | "unlisted" | "public";
  youtubeAutoCopyrightCheck?: boolean;
  youtubeMoveToS3AfterCheck?: boolean;
  brevoSenderEmail?: string | null;
  emailSubmissionReceivedTemplate?: Record<string, unknown> | null;
  emailDecisionTemplates?: Record<string, unknown> | null;
};
