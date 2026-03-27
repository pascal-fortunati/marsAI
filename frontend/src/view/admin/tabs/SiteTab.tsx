import { useCallback, useEffect, useMemo, useState, type ComponentType } from "react";
import { BookOpenText, BriefcaseBusiness, Bot, CalendarDays, Clock3, Eye, Flag, Home, Languages, Lock, RefreshCw, Save, Shapes, SlidersHorizontal, Tag, Telescope, Trophy } from "lucide-react";
import * as Flags from "country-flag-icons/react/3x2";
import { invalidateSiteCache } from "../adminHelpers";
import { resources } from "../../../lib/i18nResources";
import { FR_COUNTRY_NAMES, getCountryCode, getLanguageFlagCode } from "../../../lib/countryMapping";
import { PHASE_DATES } from "../../home/homeHelpers";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";
const getToken = () =>
    localStorage.getItem("jwt_token") ?? localStorage.getItem("marsai_token") ?? "";

type SiteSettings = Record<string, string>;
type Lang = "fr" | "en";
type SiteSection = "home" | "submission" | "festival";

const DEFAULT_HOME_BY_LANG = {
    fr: resources.fr.translation.home,
    en: resources.en.translation.home,
};

const DEFAULT_PLATFORM_URL = "http://marsai.10.24.179.10.nip.io:40";
const DEFAULT_HOME_LOGO_URL = "https://i.postimg.cc/Fzx6mwp1/mars-ai-logo.png";
const DEFAULT_HERO_IMAGE_URL = "";
const DEFAULT_PARTNERS_LOGOS = [
    "/partner/lg-laplateforme.png",
    "/partner/lg-mofilefestival.png",
];
const DEFAULT_SUBMISSION_CATEGORIES = [
    "Fiction",
    "Documentaire",
    "Expérimental",
    "Animation",
    "Poétique",
    "Contemplatif",
    "Autre",
];
const DEFAULT_SUBMISSION_SOCIAL_NETWORKS = [
    "instagram:Instagram",
    "youtube:YouTube",
    "linkedin:LinkedIn",
    "x:X / Twitter",
    "facebook:Facebook",
    "tumblr:Tumblr",
];

// Import submission form defaults from Step1 and Step2
const DEFAULT_SUBMISSION_LANGUAGES = ["Français", "Anglais", "Espagnol", "Arabe", "Autre", "Sans dialogue"];
const DEFAULT_SUBMISSION_COUNTRIES = [
    "France",
    ...FR_COUNTRY_NAMES.filter((countryName: string) => countryName !== "France"),
];
const DEFAULT_SUBMISSION_JOBS = [
    "Réalisateur·rice",
    "Artiste numérique",
    "Designer",
    "Développeur·euse",
    "Etudiant·e",
    "Photographe",
    "Vidéaste",
    "Musicien·ne",
    "Autre",
];
const DEFAULT_SUBMISSION_DISCOVERY_SOURCES = [
    "Réseaux sociaux (Instagram, TikTok...)",
    "Twitter/X",
    "Bouche à oreille",
    "Presse/Médias",
    "Newsletter",
    "La Plateforme",
    "Mobile Film Festival",
    "Moteur de recherche",
    "Autre",
];
const DEFAULT_SUBMISSION_AI_TOOLS = [
    "Sora",
    "MidJourney",
    "RunwayML",
    "Pika",
    "Kling",
    "DALL-E 3",
    "Stable Diffusion",
    "Fluxchlabs",
    "Suno",
    "Udio",
    "Montage",
    "Luma AI",
    "Runway Gen-3",
    "Hygen",
    "D-ID",
    "Synthesia",
    "Autre",
];
const DEFAULT_SUBMISSION_SEMANTIC_TAGS = [
    "Futur souhaitable",
    "Écologie",
    "Humanité & IA",
    "Solidarité",
    "Espoir",
    "Résilience",
    "Utopie",
    "Nature",
    "Paix",
    "Innovation sociale",
    "Diversité",
    "Éducation",
    "Santé",
    "Liberté",
    "Mémoire",
];

const MONTHS_FR = [
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre",
];

const DEFAULT_PHASE1_ISO = PHASE_DATES.phase1Close.toISOString();
const DEFAULT_PHASE2_ISO = PHASE_DATES.phase2Close.toISOString();
const DEFAULT_PHASE3_ISO = PHASE_DATES.phase3Close.toISOString();

type FormState = {
    phase1_close_iso: string;
    phase2_catalogue_iso: string;
    phase3_palmares_iso: string;
    home_logo: string;
    home_hero_image_url: string;
    platform_url: string;
    partners_logos: string[];
    home_eyebrow: string;
    home_terminal: string;
    hero_title1: string;
    hero_title2: string;
    hero_title3: string;
    hero_text: string;
    cta_submit: string;
    cta_catalogue: string;
    theme_title: string;
    theme_quote: string;
    feature_text: string;
    feature_cta: string;
    feature_tags: string[];
    submission_categories: string[];
    submission_languages: string[];
    submission_countries: string[];
    submission_jobs: string[];
    submission_discovery_sources: string[];
    submission_ai_tool_suggestions: string[];
    submission_semantic_tags: string[];
    submission_social_networks: string;
    festival_theme_title: string;
    festival_theme_quote: string;
    festival_keywords: string[];
    festival_description: string;
};

const EMPTY_FORM: FormState = {
    phase1_close_iso: "",
    phase2_catalogue_iso: "",
    phase3_palmares_iso: "",
    home_logo: "",
    home_hero_image_url: "",
    platform_url: "",
    partners_logos: [],
    home_eyebrow: "",
    home_terminal: "",
    hero_title1: "",
    hero_title2: "",
    hero_title3: "",
    hero_text: "",
    cta_submit: "",
    cta_catalogue: "",
    theme_title: "",
    theme_quote: "",
    feature_text: "",
    feature_cta: "",
    feature_tags: [],
    submission_categories: [],
    submission_languages: [],
    submission_countries: [],
    submission_jobs: [],
    submission_discovery_sources: [],
    submission_ai_tool_suggestions: [],
    submission_semantic_tags: [],
    submission_social_networks: "",
    festival_theme_title: "",
    festival_theme_quote: "",
    festival_keywords: [],
    festival_description: "",
};

function parseJsonValue<T>(raw: string | undefined, fallback: T): T {
    if (!raw) return fallback;
    try {
        return JSON.parse(raw) as T;
    } catch {
        return fallback;
    }
}

function parseStringArray(raw: string | undefined): string[] {
    const arr = parseJsonValue<unknown[]>(raw, []);
    return Array.isArray(arr) ? arr.filter((item): item is string => typeof item === "string") : [];
}

function pickString(value: unknown, fallback: string) {
    return typeof value === "string" && value.trim().length > 0 ? value : fallback;
}

function toDatetimeLocal(value: string) {
    if (!value) return "";
    const dt = new Date(value);
    if (Number.isNaN(dt.getTime())) return "";
    return dt.toISOString().slice(0, 16);
}

function toIsoOrEmpty(value: string) {
    if (!value) return "";
    const dt = new Date(value);
    if (Number.isNaN(dt.getTime())) return "";
    return dt.toISOString();
}

function getTranslationRoot(obj: unknown): Record<string, unknown> {
    return typeof obj === "object" && obj !== null ? (obj as Record<string, unknown>) : {};
}

function getHomeTranslationByLang(translation: unknown, lang: Lang) {
    const root = getTranslationRoot(translation);
    const langNode = getTranslationRoot(root[lang]);
    const langHome = getTranslationRoot(langNode.home);
    if (Object.keys(langHome).length > 0) return langHome;
    return getTranslationRoot(root.home);
}

export default function SiteTab() {
    const [settings, setSettings] = useState<SiteSettings>({});
    const [form, setForm] = useState<FormState>(EMPTY_FORM);
    const [lang, setLang] = useState<Lang>("fr");
    const [activeSection, setActiveSection] = useState<SiteSection>("home");
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [previewUrl, setPreviewUrl] = useState("");

    const load = useCallback(async () => {
        const res = await fetch(`${BASE}/api/admin/settings`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        });
        const data = (await res.json()) as SiteSettings;
        const translationRaw = data.home_translation || data.home_translations || "{}";
        const translationObj = parseJsonValue<Record<string, unknown>>(translationRaw, {});
        const homeTr = getHomeTranslationByLang(translationObj, "fr");
        const homeDefaults = DEFAULT_HOME_BY_LANG.fr;
        const parsedPartners = parseStringArray(data.partners_logos);

        setSettings(data);
        setForm({
            phase1_close_iso: (data.phase1_close_iso && data.phase1_close_iso.trim().length > 0) ? data.phase1_close_iso : DEFAULT_PHASE1_ISO,
            phase2_catalogue_iso: (data.phase2_catalogue_iso && data.phase2_catalogue_iso.trim().length > 0) ? data.phase2_catalogue_iso : DEFAULT_PHASE2_ISO,
            phase3_palmares_iso: (data.phase3_palmares_iso && data.phase3_palmares_iso.trim().length > 0) ? data.phase3_palmares_iso : DEFAULT_PHASE3_ISO,
            home_logo: data.home_logo?.trim() ? data.home_logo : DEFAULT_HOME_LOGO_URL,
            home_hero_image_url: data.home_hero_image_url?.trim() ? data.home_hero_image_url : DEFAULT_HERO_IMAGE_URL,
            platform_url: data.platform_url?.trim() ? data.platform_url : DEFAULT_PLATFORM_URL,
            partners_logos: parsedPartners.length > 0 ? parsedPartners : DEFAULT_PARTNERS_LOGOS,
            home_eyebrow: pickString(homeTr.eyebrow, homeDefaults.eyebrow),
            home_terminal: pickString(homeTr.terminal, homeDefaults.terminal),
            hero_title1: pickString(homeTr.title1, homeDefaults.title1),
            hero_title2: pickString(homeTr.title2, homeDefaults.title2),
            hero_title3: pickString(homeTr.title3, homeDefaults.title3),
            hero_text: pickString(homeTr.heroText, homeDefaults.heroText),
            cta_submit: pickString(homeTr.ctaSubmit, homeDefaults.ctaSubmit),
            cta_catalogue: pickString(homeTr.ctaCatalogue, homeDefaults.ctaCatalogue),
            theme_title: pickString(homeTr.themeTitle, homeDefaults.themeTitle),
            theme_quote: pickString(homeTr.themeQuote, homeDefaults.themeQuote),
            feature_text: pickString(homeTr.featureText, homeDefaults.featureText),
            feature_cta: pickString(homeTr.featureCta, homeDefaults.featureCta),
            feature_tags: Array.isArray(homeTr.featureTags)
                ? homeTr.featureTags.filter((item): item is string => typeof item === "string")
                : [...homeDefaults.featureTags],
            submission_categories: (() => {
                const parsedCategories = parseStringArray(data.submission_categories);
                return parsedCategories.length > 0 ? parsedCategories : DEFAULT_SUBMISSION_CATEGORIES;
            })(),
            submission_languages: (() => {
                const parsedLanguages = parseStringArray(data.submission_languages);
                return parsedLanguages.length > 0 ? parsedLanguages : DEFAULT_SUBMISSION_LANGUAGES;
            })(),
            submission_countries: (() => {
                const parsedCountries = parseStringArray(data.submission_countries);
                return parsedCountries.length > 0 ? parsedCountries : DEFAULT_SUBMISSION_COUNTRIES;
            })(),
            submission_jobs: (() => {
                const parsedJobs = parseStringArray(data.submission_jobs);
                return parsedJobs.length > 0 ? parsedJobs : DEFAULT_SUBMISSION_JOBS;
            })(),
            submission_discovery_sources: (() => {
                const parsedSources = parseStringArray(data.submission_discovery_sources);
                return parsedSources.length > 0 ? parsedSources : DEFAULT_SUBMISSION_DISCOVERY_SOURCES;
            })(),
            submission_ai_tool_suggestions: (() => {
                const parsedTools = parseStringArray(data.submission_ai_tool_suggestions);
                return parsedTools.length > 0 ? parsedTools : DEFAULT_SUBMISSION_AI_TOOLS;
            })(),
            submission_semantic_tags: (() => {
                const parsedTags = parseStringArray(data.submission_semantic_tags);
                return parsedTags.length > 0 ? parsedTags : DEFAULT_SUBMISSION_SEMANTIC_TAGS;
            })(),
            submission_social_networks: (() => {
                const fallbackSocialNetworks = DEFAULT_SUBMISSION_SOCIAL_NETWORKS.join("\n");
                const raw = parseJsonValue<unknown>(data.submission_social_networks, []);
                if (!raw) return fallbackSocialNetworks;
                if (Array.isArray(raw)) {
                    const mapped = raw
                        .map((entry) => {
                            if (typeof entry !== "object" || entry === null) return "";
                            const e = entry as Record<string, unknown>;
                            const key = typeof e.key === "string" ? e.key : "";
                            const label = typeof e.label === "string" ? e.label : "";
                            return key || label ? `${key}:${label}` : "";
                        })
                        .filter(Boolean);
                    return mapped.length > 0 ? mapped.join("\n") : fallbackSocialNetworks;
                }
                if (typeof raw === "object") {
                    const mapped = Object.entries(raw)
                        .map(([key, value]) => `${key}:${String(value)}`)
                        .filter((line) => line.trim() !== ":");
                    return mapped.length > 0 ? mapped.join("\n") : fallbackSocialNetworks;
                }
                if (typeof raw === "string" && raw.trim().length > 0) return raw;
                return fallbackSocialNetworks;
            })(),
            festival_theme_title: data.festival_theme_title ?? "",
            festival_theme_quote: data.festival_theme_quote ?? "",
            festival_keywords: parseStringArray(data.festival_keywords),
            festival_description: data.festival_description ?? "",
        });
        setPreviewUrl(`${BASE.replace("4000", "4001")}/`);
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const langTranslation = useMemo(() => {
        const root = parseJsonValue<Record<string, unknown>>(settings.home_translation || settings.home_translations || "{}", {});
        return getHomeTranslationByLang(root, lang);
    }, [lang, settings.home_translation, settings.home_translations]);

    useEffect(() => {
        const langDefaults = DEFAULT_HOME_BY_LANG[lang];
        setForm((prev) => ({
            ...prev,
            home_eyebrow: pickString(langTranslation.eyebrow, langDefaults.eyebrow),
            home_terminal: pickString(langTranslation.terminal, langDefaults.terminal),
            hero_title1: pickString(langTranslation.title1, langDefaults.title1),
            hero_title2: pickString(langTranslation.title2, langDefaults.title2),
            hero_title3: pickString(langTranslation.title3, langDefaults.title3),
            hero_text: pickString(langTranslation.heroText, langDefaults.heroText),
            cta_submit: pickString(langTranslation.ctaSubmit, langDefaults.ctaSubmit),
            cta_catalogue: pickString(langTranslation.ctaCatalogue, langDefaults.ctaCatalogue),
            theme_title: pickString(langTranslation.themeTitle, langDefaults.themeTitle),
            theme_quote: pickString(langTranslation.themeQuote, langDefaults.themeQuote),
            feature_text: pickString(langTranslation.featureText, langDefaults.featureText),
            feature_cta: pickString(langTranslation.featureCta, langDefaults.featureCta),
            feature_tags: Array.isArray(langTranslation.featureTags)
                ? langTranslation.featureTags.filter((item): item is string => typeof item === "string")
                : [...langDefaults.featureTags],
        }));
    }, [langTranslation]);

    const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const save = async () => {
        setSaving(true);
        try {
            const currentTranslation = parseJsonValue<Record<string, unknown>>(settings.home_translation || settings.home_translations || "{}", {});
            const root = { ...currentTranslation } as Record<string, unknown>;
            const langNode = getTranslationRoot(root[lang]);
            const homeNode = { ...getHomeTranslationByLang(root, lang) } as Record<string, unknown>;

            homeNode.eyebrow = form.home_eyebrow;
            homeNode.terminal = form.home_terminal;
            homeNode.title1 = form.hero_title1;
            homeNode.title2 = form.hero_title2;
            homeNode.title3 = form.hero_title3;
            homeNode.heroText = form.hero_text;
            homeNode.ctaSubmit = form.cta_submit;
            homeNode.ctaCatalogue = form.cta_catalogue;
            homeNode.themeTitle = form.theme_title;
            homeNode.themeQuote = form.theme_quote;
            homeNode.featureText = form.feature_text;
            homeNode.featureCta = form.feature_cta;
            homeNode.featureTags = form.feature_tags;

            root[lang] = {
                ...langNode,
                home: homeNode,
            };

            const socialNetworks = form.submission_social_networks
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean)
                .map((line) => {
                    const [key, ...rest] = line.split(":");
                    return {
                        key: key?.trim() ?? "",
                        label: rest.join(":").trim(),
                    };
                })
                .filter((item) => item.key || item.label);

            const payload: SiteSettings = {
                phase1_close_iso: form.phase1_close_iso,
                phase2_catalogue_iso: form.phase2_catalogue_iso,
                phase3_palmares_iso: form.phase3_palmares_iso,
                home_logo: form.home_logo,
                home_hero_image_url: form.home_hero_image_url,
                platform_url: form.platform_url,
                partners_logos: JSON.stringify(form.partners_logos),
                home_translation: JSON.stringify(root),
                submission_categories: JSON.stringify(form.submission_categories),
                submission_languages: JSON.stringify(form.submission_languages),
                submission_countries: JSON.stringify(form.submission_countries),
                submission_jobs: JSON.stringify(form.submission_jobs),
                submission_discovery_sources: JSON.stringify(form.submission_discovery_sources),
                submission_ai_tool_suggestions: JSON.stringify(form.submission_ai_tool_suggestions),
                submission_semantic_tags: JSON.stringify(form.submission_semantic_tags),
                submission_social_networks: JSON.stringify(socialNetworks),
                festival_theme_title: form.festival_theme_title,
                festival_theme_quote: form.festival_theme_quote,
                festival_keywords: JSON.stringify(form.festival_keywords),
                festival_description: form.festival_description,
            };

            const res = await fetch(`${BASE}/api/admin/settings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("save-failed");

            await invalidateSiteCache(BASE, getToken);
            setSettings((prev) => ({ ...prev, ...payload }));
            setSaved(true);
            setTimeout(() => setSaved(false), 1800);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.22fr)_minmax(0,0.86fr)] gap-6 h-full">
            <div className="overflow-y-auto pr-1">
                <div className="rounded-2xl px-4 py-4 md:px-5 md:py-5 space-y-4" style={{ border: "1px solid rgba(255,255,255,.10)", background: "#070518" }}>
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 className="f-orb text-[32px] leading-none text-white/90">Éditeur du site</h2>
                            <p className="f-mono text-[11px] text-white/35 mt-1">Organisation compacte par section</p>
                        </div>
                        <button
                            onClick={save}
                            disabled={saving}
                            className="flex items-center gap-2 px-5 py-3 rounded-2xl f-mono text-[11px] tracking-wide font-bold text-white transition-all hover:opacity-90 disabled:opacity-60"
                            style={{ background: "#8b6cff" }}
                        >
                            <Save size={14} />
                            {saved ? "Sauvegardé" : saving ? "Sauvegarde..." : "Sauvegarder"}
                        </button>
                    </div>

                    <div className="flex items-center gap-8 border-b border-white/10 pb-3">
                        {[
                            { id: "home", label: "Home", icon: <Home size={13} /> },
                            { id: "submission", label: "Soumission", icon: <SlidersHorizontal size={13} /> },
                            { id: "festival", label: "Festival", icon: <CalendarDays size={13} /> },
                        ].map((tab) => {
                            const isActive = activeSection === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveSection(tab.id as SiteSection)}
                                    className="inline-flex items-center gap-2 f-mono text-[11px] tracking-wide uppercase pb-2"
                                    style={{ color: isActive ? "#fff" : "rgba(255,255,255,.55)", borderBottom: isActive ? "2px solid #7d71fb" : "2px solid transparent" }}
                                >
                                    <span style={{ color: isActive ? "rgba(255,255,255,.95)" : "rgba(255,255,255,.68)" }}>{tab.icon}</span>
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    {activeSection === "home" ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <Field label="Logo du site">
                                    <input className="submit-input" value={form.home_logo} onChange={(e) => setField("home_logo", e.target.value)} placeholder="https://..." />
                                </Field>
                                <Field label="URL image Hero">
                                    <input className="submit-input" value={form.home_hero_image_url} onChange={(e) => setField("home_hero_image_url", e.target.value)} placeholder="https://..." />
                                </Field>
                                <Field label="URL plateforme">
                                    <input className="submit-input" value={form.platform_url} onChange={(e) => setField("platform_url", e.target.value)} placeholder="http://..." />
                                </Field>
                            </div>

                            <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,.10)", background: "rgba(255,255,255,.02)" }}>
                                <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between gap-3">
                                    <div>
                                        <p className="f-orb text-[36px] leading-none text-white/92">Textes Home</p>
                                        <p className="f-mono text-[12px] text-white/42 mt-1">Modifiez à la volée les contenus FR/EN de la page d'accueil</p>
                                    </div>
                                    <div className="rounded-xl p-1 flex gap-2" style={{ border: "1px solid rgba(255,255,255,.18)", background: "rgba(255,255,255,.03)" }}>
                                        {(["fr", "en"] as const).map((entry) => {
                                            const active = lang === entry;
                                            return (
                                                <button
                                                    key={entry}
                                                    className="rounded-lg px-3 py-1.5 f-mono text-[10px] uppercase tracking-widest"
                                                    style={{ background: active ? "rgba(255,255,255,.18)" : "transparent", color: active ? "#fff" : "rgba(255,255,255,.55)" }}
                                                    onClick={() => setLang(entry)}
                                                >
                                                    {entry === "fr" ? "FR Français" : "GB Anglais"}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="px-5 py-3 border-b border-[#1f2d66] bg-[#081134]">
                                    <p className="f-mono text-[11px] tracking-wide text-white/82">
                                        {lang.toUpperCase()} <span className="text-white/35">ÉDITION EN COURS · {lang === "fr" ? "FRANÇAIS" : "ANGLAIS"}</span>
                                    </p>
                                </div>

                                <div className="p-5 space-y-4">
                                    <Field label="Bandeau d'introduction"><input className="submit-input" value={form.home_eyebrow} onChange={(e) => setField("home_eyebrow", e.target.value)} /></Field>
                                    <Field label="Texte style terminal"><input className="submit-input" value={form.home_terminal} onChange={(e) => setField("home_terminal", e.target.value)} /></Field>
                                    <Field label="Titre principal — ligne 1"><input className="submit-input" value={form.hero_title1} onChange={(e) => setField("hero_title1", e.target.value)} /></Field>
                                    <Field label="Titre principal — ligne 2"><input className="submit-input" value={form.hero_title2} onChange={(e) => setField("hero_title2", e.target.value)} /></Field>
                                    <Field label="Titre principal — ligne 3"><input className="submit-input" value={form.hero_title3} onChange={(e) => setField("hero_title3", e.target.value)} /></Field>
                                    <Field label="Texte hero"><textarea className="submit-input resize-none" rows={3} value={form.hero_text} onChange={(e) => setField("hero_text", e.target.value)} /></Field>
                                    <Field label="CTA Soumission"><input className="submit-input" value={form.cta_submit} onChange={(e) => setField("cta_submit", e.target.value)} /></Field>
                                    <Field label="CTA Catalogue"><input className="submit-input" value={form.cta_catalogue} onChange={(e) => setField("cta_catalogue", e.target.value)} /></Field>
                                    <Field label="Description section festival">
                                        <textarea className="submit-input resize-none" rows={3} value={form.feature_text} onChange={(e) => setField("feature_text", e.target.value)} />
                                    </Field>
                                    <Field label="Action section festival"><input className="submit-input" value={form.feature_cta} onChange={(e) => setField("feature_cta", e.target.value)} /></Field>
                                    <Field label="Titre du thème"><input className="submit-input" value={form.theme_title} onChange={(e) => setField("theme_title", e.target.value)} /></Field>
                                    <Field label="Citation du thème">
                                        <textarea className="submit-input resize-none" rows={2} value={form.theme_quote} onChange={(e) => setField("theme_quote", e.target.value)} />
                                    </Field>
                                    <IndexedListInput
                                        label="Mots-clés de la section festival"
                                        values={form.feature_tags}
                                        placeholder="Ex : Futur souhaitable"
                                        onChange={(values) => setField("feature_tags", values)}
                                    />
                                </div>
                            </div>
                        </>
                    ) : null}

                    {activeSection === "submission" ? (
                        <>
                            <SubmissionOptionsSection
                                categories={form.submission_categories}
                                languages={form.submission_languages}
                                countries={form.submission_countries}
                                jobs={form.submission_jobs}
                                discoverySources={form.submission_discovery_sources}
                                aiTools={form.submission_ai_tool_suggestions}
                                semanticTags={form.submission_semantic_tags}
                                onCategoriesChange={(values) => setField("submission_categories", values)}
                                onLanguagesChange={(values) => setField("submission_languages", values)}
                                onCountriesChange={(values) => setField("submission_countries", values)}
                                onJobsChange={(values) => setField("submission_jobs", values)}
                                onDiscoverySourcesChange={(values) => setField("submission_discovery_sources", values)}
                                onAiToolsChange={(values) => setField("submission_ai_tool_suggestions", values)}
                                onSemanticTagsChange={(values) => setField("submission_semantic_tags", values)}
                            />

                            <SocialNetworksSection
                                value={form.submission_social_networks}
                                onChange={(value) => setField("submission_social_networks", value)}
                            />
                        </>
                    ) : null}

                    {activeSection === "festival" ? (
                        <FestivalPhasesSection
                            phase1Iso={form.phase1_close_iso}
                            phase2Iso={form.phase2_catalogue_iso}
                            phase3Iso={form.phase3_palmares_iso}
                            onPhase1Change={(value) => setField("phase1_close_iso", value)}
                            onPhase2Change={(value) => setField("phase2_catalogue_iso", value)}
                            onPhase3Change={(value) => setField("phase3_palmares_iso", value)}
                        />
                    ) : null}
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <div
                    className="rounded-2xl px-4 py-4 md:px-5 md:py-5 flex items-center justify-between gap-3"
                    style={{ border: "1px solid rgba(255,255,255,.1)", background: "#070518" }}
                >
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ border: "1px solid rgba(255,255,255,.14)", background: "rgba(255,255,255,.03)" }}
                        >
                            <Eye size={15} style={{ color: "rgba(255,255,255,.82)" }} />
                        </div>
                        <div>
                            <p className="f-orb text-[15px] leading-none text-white/92">Aperçu en direct</p>
                            <p className="f-mono text-[8px] text-white/42 mt-1">Rendu Home réel avec vos brouillons en direct</p>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            const iframe = document.getElementById("site-preview") as HTMLIFrameElement;
                            if (iframe) iframe.src = iframe.src;
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl f-mono text-[10px] tracking-wide text-white/72 hover:text-white transition-colors"
                        style={{ border: "1px solid rgba(125,113,251,.58)", background: "rgba(125,113,251,.12)" }}
                    >
                        <RefreshCw size={11} />
                        Rafraîchir
                    </button>
                </div>

                <div
                    className="rounded-xl overflow-hidden"
                    style={{ border: "1px solid rgba(255,255,255,.08)", background: "#070518" }}
                >
                    {previewUrl ? (
                        <iframe
                            id="site-preview"
                            src={previewUrl}
                            className="w-full"
                            style={{ height: "2400px", border: "none", overflow: "hidden" }}
                            title="Aperçu du site"
                            scrolling="no"
                        />
                    ) : (
                        <div className="flex items-center justify-center min-h-[600px]">
                            <p className="f-mono text-[10px] text-white/20">Chargement de l'aperçu...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
    return (
        <div className="rounded-xl p-5 space-y-4" style={{ border: "1px solid rgba(255,255,255,.08)", background: "rgba(255,255,255,.02)" }}>
            <div>
                <p className="f-mono text-[10px] text-white/70 font-medium">{title}</p>
                {hint ? <p className="f-mono text-[8px] text-white/25 mt-0.5">{hint}</p> : null}
            </div>
            {children}
        </div>
    );
}

function toLocalParts(iso: string) {
    const now = new Date();
    const parsed = iso ? new Date(iso) : null;
    const safe = parsed && !Number.isNaN(parsed.getTime()) ? parsed : now;
    return {
        day: String(safe.getDate()).padStart(2, "0"),
        month: String(safe.getMonth()),
        year: String(safe.getFullYear()),
        hour: String(safe.getHours()).padStart(2, "0"),
        minute: String(safe.getMinutes()).padStart(2, "0"),
    };
}

function buildIsoFromParts(parts: { day: string; month: string; year: string; hour: string; minute: string }) {
    const mm = String(Number(parts.month) + 1).padStart(2, "0");
    return `${parts.year}-${mm}-${parts.day}T${parts.hour}:${parts.minute}:00`;
}

function formatFrenchDate(parts: { day: string; month: string; year: string; hour: string; minute: string }) {
    const monthName = MONTHS_FR[Number(parts.month)] ?? MONTHS_FR[0];
    return `${parts.day} ${monthName} ${parts.year} à ${parts.hour}:${parts.minute}`;
}

function FestivalPhasesSection({
    phase1Iso,
    phase2Iso,
    phase3Iso,
    onPhase1Change,
    onPhase2Change,
    onPhase3Change,
}: {
    phase1Iso: string;
    phase2Iso: string;
    phase3Iso: string;
    onPhase1Change: (value: string) => void;
    onPhase2Change: (value: string) => void;
    onPhase3Change: (value: string) => void;
}) {
    return (
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,.10)", background: "rgba(5,6,28,.8)" }}>
            <div className="px-5 py-4 border-b border-white/10">
                <p className="f-orb text-[34px] leading-none text-white/92">Dates des phases</p>
                <p className="f-mono text-[11px] text-white/38 mt-1">Dates de transition entre les phases du festival</p>
            </div>

            <div className="p-4 space-y-4">
                <PhaseDateCard
                    title="Clôture des soumissions"
                    badge="Phase 1 · Clôture"
                    badgeColor="rgba(125,113,251,.88)"
                    value={phase1Iso}
                    onChange={onPhase1Change}
                    icon={<Lock size={13} />}
                />

                <PhaseDateCard
                    title="Ouverture catalogue"
                    badge="Phase 2 · Catalogue"
                    badgeColor="rgba(240,177,38,.92)"
                    value={phase2Iso}
                    onChange={onPhase2Change}
                    icon={<BookOpenText size={13} />}
                />

                <PhaseDateCard
                    title="Palmarès"
                    badge="Phase 3 · Palmarès"
                    badgeColor="rgba(245,110,83,.92)"
                    value={phase3Iso}
                    onChange={onPhase3Change}
                    icon={<Trophy size={13} />}
                />
            </div>
        </div>
    );
}

function PhaseDateCard({
    title,
    badge,
    badgeColor,
    value,
    onChange,
    icon,
}: {
    title: string;
    badge: string;
    badgeColor: string;
    value: string;
    onChange: (value: string) => void;
    icon: React.ReactNode;
}) {
    const parts = toLocalParts(value);
    const years = [2025, 2026, 2027, 2028];

    const updatePart = (key: "day" | "month" | "year" | "hour" | "minute", next: string) => {
        const nextParts = { ...parts, [key]: next };
        onChange(buildIsoFromParts(nextParts));
    };

    return (
        <div className="rounded-2xl p-3" style={{ border: "1px solid rgba(255,255,255,.12)", background: "rgba(255,255,255,.02)" }}>
            <div className="flex items-center justify-between gap-3 px-1 pb-3">
                <div className="inline-flex items-center gap-2">
                    <span style={{ color: badgeColor }}>{icon}</span>
                    <p className="f-mono text-[10px] tracking-[0.18em] uppercase" style={{ color: badgeColor }}>{title}</p>
                </div>
                <span
                    className="f-mono text-[10px] tracking-[0.16em] uppercase px-3 py-1 rounded-lg"
                    style={{ border: `1px solid ${badgeColor}`, color: badgeColor, background: "rgba(255,255,255,.02)" }}
                >
                    {badge}
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="rounded-xl p-3" style={{ border: "1px solid rgba(255,255,255,.1)", background: "rgba(6,7,30,.52)" }}>
                    <p className="f-mono text-[9px] tracking-[0.14em] uppercase text-white/36 mb-2 inline-flex items-center gap-1.5"><CalendarDays size={11} /> Sélectionner une date</p>
                    <div className="grid grid-cols-[88px_1fr_96px] gap-2">
                        <select className="submit-input" value={parts.day} onChange={(e) => updatePart("day", e.target.value)}>
                            {Array.from({ length: 31 }, (_, idx) => String(idx + 1).padStart(2, "0")).map((day) => (
                                <option key={day} value={day}>{day}</option>
                            ))}
                        </select>
                        <select className="submit-input" value={parts.month} onChange={(e) => updatePart("month", e.target.value)}>
                            {MONTHS_FR.map((month, idx) => (
                                <option key={month} value={String(idx)}>{month}</option>
                            ))}
                        </select>
                        <select className="submit-input" value={parts.year} onChange={(e) => updatePart("year", e.target.value)}>
                            {years.map((year) => (
                                <option key={year} value={String(year)}>{year}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="rounded-xl p-3" style={{ border: "1px solid rgba(255,255,255,.1)", background: "rgba(6,7,30,.52)" }}>
                    <p className="f-mono text-[9px] tracking-[0.14em] uppercase text-white/36 mb-2 inline-flex items-center gap-1.5"><Clock3 size={11} /> Heure</p>
                    <div className="grid grid-cols-2 gap-2">
                        <select className="submit-input" value={parts.hour} onChange={(e) => updatePart("hour", e.target.value)}>
                            {Array.from({ length: 24 }, (_, idx) => String(idx).padStart(2, "0")).map((hour) => (
                                <option key={hour} value={hour}>{hour} h</option>
                            ))}
                        </select>
                        <select className="submit-input" value={parts.minute} onChange={(e) => updatePart("minute", e.target.value)}>
                            {Array.from({ length: 60 }, (_, idx) => String(idx).padStart(2, "0")).map((minute) => (
                                <option key={minute} value={minute}>{minute} min</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="mt-3 rounded-lg px-3 py-2" style={{ border: "1px solid rgba(255,255,255,.08)", background: "rgba(4,6,24,.66)" }}>
                <p className="f-mono text-[10px] text-white/55">Date (FR) : <span className="text-white/82">{formatFrenchDate(parts)}</span></p>
            </div>
        </div>
    );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <label className="f-mono text-[9px] tracking-widest uppercase text-white/40">
                {label}
                {required ? <span className="ml-1" style={{ color: "var(--col-or)" }}>*</span> : null}
            </label>
            {children}
        </div>
    );
}

function TagInput({ label, values, onChange }: { label: string; values: string[]; onChange: (values: string[]) => void }) {
    const [input, setInput] = useState("");

    const addTag = () => {
        const value = input.trim();
        if (!value) return;
        if (values.includes(value)) {
            setInput("");
            return;
        }
        onChange([...values, value]);
        setInput("");
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <label className="f-mono text-[9px] tracking-widest uppercase text-white/40">{label}</label>
                <span className="f-mono text-[8px] text-white/35">{values.length}</span>
            </div>
            <div className="flex gap-2">
                <input
                    className="submit-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            addTag();
                        }
                    }}
                />
                <button
                    type="button"
                    onClick={addTag}
                    className="px-3 rounded-lg f-mono text-[10px] uppercase tracking-widest"
                    style={{ border: "1px solid rgba(125,113,251,.45)", color: "#fff", background: "rgba(125,113,251,.22)" }}
                >
                    Ajouter
                </button>
            </div>
            <div className="flex flex-wrap gap-2">
                {values.map((value) => (
                    <span
                        key={value}
                        className="group inline-flex items-center gap-2 px-2 py-1 rounded-lg f-mono text-[9px]"
                        style={{ border: "1px solid rgba(255,255,255,.12)", background: "rgba(255,255,255,.04)", color: "rgba(255,255,255,.82)" }}
                    >
                        {value}
                        <button
                            type="button"
                            onClick={() => onChange(values.filter((entry) => entry !== value))}
                            className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-400"
                        >
                            ×
                        </button>
                    </span>
                ))}
            </div>
        </div>
    );
}

function IndexedListInput({
    label,
    values,
    onChange,
    placeholder,
}: {
    label: string;
    values: string[];
    onChange: (values: string[]) => void;
    placeholder?: string;
}) {
    const [input, setInput] = useState("");

    const addEntry = () => {
        const value = input.trim();
        if (!value) return;
        if (values.includes(value)) {
            setInput("");
            return;
        }
        onChange([...values, value]);
        setInput("");
    };

    const removeAt = (index: number) => {
        onChange(values.filter((_, idx) => idx !== index));
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label className="f-mono text-[9px] tracking-wide text-white/55">{label}</label>
                <span className="f-mono text-[9px] px-2.5 py-1 rounded-lg text-white/75" style={{ border: "1px solid rgba(255,255,255,.10)", background: "rgba(255,255,255,.04)" }}>
                    {values.length} entrées
                </span>
            </div>

            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,.10)" }}>
                {values.map((value, index) => (
                    <div
                        key={`${value}-${index}`}
                        className="group h-14 px-5 flex items-center justify-between"
                        style={{
                            borderTop: index === 0 ? "none" : "1px solid rgba(255,255,255,.08)",
                            background: "rgba(8, 9, 31, .65)",
                        }}
                    >
                        <div className="flex items-center gap-5 min-w-0">
                            <span className="f-mono text-[10px] text-white/35 w-4 text-right">{index + 1}</span>
                            <span className="f-mono text-[14px] text-white/82 truncate">{value}</span>
                        </div>
                        <button type="button" onClick={() => removeAt(index)} className="f-mono text-[16px] leading-none opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-400" aria-label="Supprimer">
                            ×
                        </button>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-[1fr_auto] gap-2">
                <input
                    className="submit-input"
                    value={input}
                    placeholder={placeholder}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            addEntry();
                        }
                    }}
                />
                <button
                    type="button"
                    onClick={addEntry}
                    className="px-4 rounded-lg f-mono text-[11px] tracking-wide text-white/75"
                    style={{ border: "1px solid rgba(255,255,255,.10)", background: "rgba(255,255,255,.04)" }}
                >
                    + Ajouter
                </button>
            </div>
        </div>
    );
}

type SubmissionOption = "categories" | "languages" | "countries" | "jobs" | "discovery" | "aiTools" | "semantic";

function FlagGridInput({
    values,
    onChange,
    items,
    getFlagCode,
    label,
}: {
    values: string[];
    onChange: (values: string[]) => void;
    items: string[];
    getFlagCode: (item: string) => string | null;
    label: string;
}) {
    const [searchTerm, setSearchTerm] = useState("");
    const filteredItems = items.filter((item) => item.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleToggle = (item: string) => {
        onChange(values.includes(item) ? values.filter((v) => v !== item) : [...values, item]);
    };

    const handleSelectAll = () => {
        if (values.length === items.length) {
            onChange([]);
        } else {
            onChange([...items]);
        }
    };

    const handleDeselectAll = () => {
        onChange([]);
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <p className="f-mono text-[12px] tracking-wide text-white/72">{label}</p>
                <p className="f-mono text-[12px] text-white/50">{values.length} / {items.length} sélectionnés</p>
            </div>
            <input
                type="text"
                placeholder="Ex : Français"
                className="w-full px-4 py-2.5 rounded-xl f-mono text-[12px] transition-all"
                style={{
                    border: "1px solid rgba(255,255,255,.10)",
                    background: "rgba(255,255,255,.01)",
                    color: "rgba(255,255,255,.72)",
                }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="flex gap-3">
                <button
                    onClick={handleSelectAll}
                    className="px-3 py-2 rounded-lg f-mono text-[11px] transition-all"
                    style={{
                        border: "1px solid rgba(125,113,251,.35)",
                        background: "rgba(125,113,251,.12)",
                        color: "rgba(255,255,255,.72)",
                    }}
                >
                    ✓ Tout cocher
                </button>
                <button
                    onClick={handleDeselectAll}
                    className="px-3 py-2 rounded-lg f-mono text-[11px] transition-all"
                    style={{
                        border: "1px solid transparent",
                        background: "transparent",
                        color: "rgba(255,255,255,.72)",
                    }}
                >
                    Tout décocher
                </button>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
                {filteredItems.map((item) => {
                    const flagCode = getFlagCode(item);
                    const FlagComponent = flagCode ? (Flags as Record<string, ComponentType<{ className?: string }>>)[flagCode] : null;
                    const isSelected = values.includes(item);
                    return (
                        <label
                            key={item}
                            className="flex items-center gap-2 px-2 py-1 rounded-lg cursor-pointer transition-all"
                            style={{
                                border: "1px solid transparent",
                                background: "transparent",
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleToggle(item)}
                                className="rounded w-4 h-4 cursor-pointer"
                                style={{ accentColor: "#7d71fb" }}
                            />
                            {FlagComponent && <FlagComponent className="w-4 h-3 rounded-sm flex-shrink-0" />}
                            <span className="f-mono text-[11px] text-white/72 truncate">{item}</span>
                        </label>
                    );
                })}
            </div>
        </div>
    );
}

function SubmissionOptionsSection({
    categories,
    languages,
    countries,
    jobs,
    discoverySources,
    aiTools,
    semanticTags,
    onCategoriesChange,
    onLanguagesChange,
    onCountriesChange,
    onJobsChange,
    onDiscoverySourcesChange,
    onAiToolsChange,
    onSemanticTagsChange,
}: {
    categories: string[];
    languages: string[];
    countries: string[];
    jobs: string[];
    discoverySources: string[];
    aiTools: string[];
    semanticTags: string[];
    onCategoriesChange: (values: string[]) => void;
    onLanguagesChange: (values: string[]) => void;
    onCountriesChange: (values: string[]) => void;
    onJobsChange: (values: string[]) => void;
    onDiscoverySourcesChange: (values: string[]) => void;
    onAiToolsChange: (values: string[]) => void;
    onSemanticTagsChange: (values: string[]) => void;
}) {
    const [activeOption, setActiveOption] = useState<SubmissionOption>("categories");

    const options: Array<{ id: SubmissionOption; label: string; count: number; icon: React.ReactNode }> = [
        { id: "categories", label: "Catégories", count: categories.length, icon: <Shapes size={13} /> },
        { id: "languages", label: "Langues", count: languages.length, icon: <Languages size={13} /> },
        { id: "countries", label: "Pays", count: countries.length, icon: <Flag size={13} /> },
        { id: "jobs", label: "Métiers", count: jobs.length, icon: <BriefcaseBusiness size={13} /> },
        { id: "discovery", label: "Sources découverte", count: discoverySources.length, icon: <Telescope size={13} /> },
        { id: "aiTools", label: "Outils IA", count: aiTools.length, icon: <Bot size={13} /> },
        { id: "semantic", label: "Tags sémantiques", count: semanticTags.length, icon: <Tag size={13} /> },
    ];

    const handleChange = (values: string[]) => {
        switch (activeOption) {
            case "categories":
                onCategoriesChange(values);
                break;
            case "languages":
                onLanguagesChange(values);
                break;
            case "countries":
                onCountriesChange(values);
                break;
            case "jobs":
                onJobsChange(values);
                break;
            case "discovery":
                onDiscoverySourcesChange(values);
                break;
            case "aiTools":
                onAiToolsChange(values);
                break;
            case "semantic":
                onSemanticTagsChange(values);
                break;
        }
    };

    const getCurrentValues = (): string[] => {
        switch (activeOption) {
            case "categories":
                return categories;
            case "languages":
                return languages;
            case "countries":
                return countries;
            case "jobs":
                return jobs;
            case "discovery":
                return discoverySources;
            case "aiTools":
                return aiTools;
            case "semantic":
                return semanticTags;
        }
    };

    return (
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,.10)", background: "rgba(255,255,255,.02)" }}>
            <div className="px-5 py-4 border-b border-white/10">
                <p className="f-orb text-[34px] leading-none text-white/92">Options soumission</p>
                <p className="f-mono text-[11px] text-white/42 mt-1">Éditez une liste à la fois pour garder un écran court</p>
            </div>

            <div className="px-4 py-4 border-b border-white/10">
                <div className="rounded-2xl px-3 py-3" style={{ border: "1px solid rgba(255,255,255,.10)", background: "rgba(255,255,255,.03)" }}>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5">
                        {options.slice(0, 4).map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => setActiveOption(opt.id)}
                                className="w-full f-mono text-[12px] tracking-wide px-4 py-2.5 rounded-xl transition-all inline-flex items-center gap-2"
                                style={{
                                    border: activeOption === opt.id ? "1px solid rgba(125,113,251,.78)" : "1px solid transparent",
                                    background: activeOption === opt.id ? "rgba(125,113,251,.28)" : "transparent",
                                    color: activeOption === opt.id ? "rgba(255,255,255,.96)" : "rgba(255,255,255,.72)",
                                }}
                            >
                                <span style={{ color: activeOption === opt.id ? "rgba(255,255,255,.9)" : "rgba(255,255,255,.62)" }}>{opt.icon}</span>
                                <span>{opt.label}</span>
                                <span className="ml-auto px-2 py-0.5 rounded-md f-mono text-[11px]" style={{ background: "rgba(125,113,251,.35)", color: "rgba(255,255,255,.92)" }}>{opt.count}</span>
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 mt-2.5">
                        {options.slice(4).map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => setActiveOption(opt.id)}
                                className="w-full f-mono text-[12px] tracking-wide px-4 py-2.5 rounded-xl transition-all inline-flex items-center gap-2"
                                style={{
                                    border: activeOption === opt.id ? "1px solid rgba(125,113,251,.78)" : "1px solid transparent",
                                    background: activeOption === opt.id ? "rgba(125,113,251,.28)" : "transparent",
                                    color: activeOption === opt.id ? "rgba(255,255,255,.96)" : "rgba(255,255,255,.72)",
                                }}
                            >
                                <span style={{ color: activeOption === opt.id ? "rgba(255,255,255,.9)" : "rgba(255,255,255,.62)" }}>{opt.icon}</span>
                                <span>{opt.label}</span>
                                <span className="ml-auto px-2 py-0.5 rounded-md f-mono text-[11px]" style={{ background: "rgba(125,113,251,.35)", color: "rgba(255,255,255,.92)" }}>{opt.count}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="px-4 py-4">
                {activeOption === "languages" ? (
                    <FlagGridInput
                        label="Sélectionnez les langues disponibles"
                        values={languages}
                        onChange={onLanguagesChange}
                        items={DEFAULT_SUBMISSION_LANGUAGES}
                        getFlagCode={(lang) => getLanguageFlagCode(lang) ?? null}
                    />
                ) : activeOption === "countries" ? (
                    <FlagGridInput
                        label="Sélectionnez les pays disponibles"
                        values={countries}
                        onChange={onCountriesChange}
                        items={DEFAULT_SUBMISSION_COUNTRIES}
                        getFlagCode={(country) => getCountryCode(country) ?? null}
                    />
                ) : (
                    <IndexedListInput
                        label={options.find((o) => o.id === activeOption)?.label ?? ""}
                        values={getCurrentValues()}
                        onChange={handleChange}
                        placeholder={`Ex : ${activeOption === "categories" ? "Fiction" : activeOption === "jobs" ? "Réalisateur" : activeOption === "discovery" ? "Réseaux sociaux" : activeOption === "aiTools" ? "ChatGPT" : "IA"}`}
                    />
                )}
            </div>
        </div>
    );
}

function SocialNetworksSection({ value, onChange }: { value: string; onChange: (value: string) => void }) {
    const [identifierInput, setIdentifierInput] = useState("");
    const [labelInput, setLabelInput] = useState("");

    const entries = value
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
            const [key, ...rest] = line.split(":");
            return { key: key?.trim() ?? "", label: rest.join(":").trim() };
        });

    const commitEntries = (nextEntries: Array<{ key: string; label: string }>) => {
        onChange(nextEntries.map((entry) => `${entry.key}:${entry.label}`).join("\n"));
    };

    const addEntry = () => {
        const key = identifierInput.trim();
        const label = labelInput.trim();
        if (!key || !label) return;
        if (entries.some((entry) => entry.key.toLowerCase() === key.toLowerCase())) return;

        commitEntries([...entries, { key, label }]);
        setIdentifierInput("");
        setLabelInput("");
    };

    const removeEntry = (index: number) => {
        commitEntries(entries.filter((_, idx) => idx !== index));
    };

    return (
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,.10)", background: "rgba(255,255,255,.02)" }}>
            <div className="px-5 py-4 border-b border-white/10">
                <p className="f-orb text-[34px] leading-none text-white/92">Réseaux sociaux</p>
                <p className="f-mono text-[11px] text-white/42 mt-1">Réseaux proposés dans le formulaire de soumission</p>
            </div>

            <div className="px-4 py-4">
                <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,.10)" }}>
                    <div className="h-12 px-4 grid grid-cols-[160px_1fr_24px] items-center" style={{ borderBottom: "1px solid rgba(255,255,255,.08)", background: "rgba(255,255,255,.03)" }}>
                        <span className="f-mono text-[10px] tracking-widest text-white/45 uppercase">Identifiant</span>
                        <span className="f-mono text-[10px] tracking-widest text-white/45 uppercase">Libellé affiché</span>
                        <span />
                    </div>

                    {entries.map((entry, index) => (
                        <div
                            key={`${entry.key}-${index}`}
                            className="group h-14 px-4 grid grid-cols-[160px_1fr_24px] items-center"
                            style={{ borderTop: index === 0 ? "none" : "1px solid rgba(255,255,255,.06)" }}
                        >
                            <span className="inline-flex items-center justify-center h-8 px-3 rounded-lg f-mono text-[11px] text-white/88" style={{ border: "1px solid rgba(255,255,255,.16)", background: "rgba(255,255,255,.02)" }}>
                                {entry.key}
                            </span>
                            <span className="f-mono text-[14px] text-white/82 pl-3 truncate">{entry.label}</span>
                            <button
                                type="button"
                                onClick={() => removeEntry(index)}
                                className="f-mono text-[16px] opacity-0 group-hover:opacity-100 transition-opacity text-white/35 hover:text-red-400"
                                aria-label="Supprimer"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-[170px_1fr_auto] gap-2 mt-3">
                    <input
                        className="submit-input"
                        value={identifierInput}
                        onChange={(event) => setIdentifierInput(event.target.value)}
                        placeholder="instagram"
                    />
                    <input
                        className="submit-input"
                        value={labelInput}
                        onChange={(event) => setLabelInput(event.target.value)}
                        placeholder="Instagram"
                        onKeyDown={(event) => {
                            if (event.key === "Enter") addEntry();
                        }}
                    />
                    <button
                        type="button"
                        onClick={addEntry}
                        className="px-5 rounded-xl f-mono text-[11px] tracking-wide text-white/85"
                        style={{ border: "1px solid rgba(255,255,255,.10)", background: "rgba(255,255,255,.04)" }}
                    >
                        + Ajouter
                    </button>
                </div>
            </div>
        </div>
    );
}