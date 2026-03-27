import { Upload } from "lucide-react";
import { useCountdown, TimeBlock } from "./homeCounter";
import { MAIN_STATS, PANEL_ROWS, TAGS, getCurrentFestivalPhase, getPhaseNotice, PHASE_DATES } from "./homeHelpers";
import { marsaiGradients } from "../../theme/marsai";
import { Button } from "../../components/ui/button";
import { useEffect, useState } from "react";
import { getHomeData, type HomeData } from "../../lib/api";

type HomePreviewField =
    | "home_logo"
    | "home_hero_image_url"
    | "home_eyebrow"
    | "home_terminal"
    | "hero_title1"
    | "hero_title2"
    | "hero_title3"
    | "hero_text"
    | "cta_submit"
    | "cta_catalogue"
    | "cta_palmares"
    | "feature_text"
    | "feature_cta"
    | "theme_title"
    | "theme_quote"
    | "feature_tags";

type HomePreviewValues = Record<HomePreviewField, string>;

type HomePreviewSyncValues = Partial<HomePreviewValues> & {
    phase1_close_iso?: string;
    phase2_catalogue_iso?: string;
    phase3_palmares_iso?: string;
};

const DEFAULT_PREVIEW_VALUES: HomePreviewValues = {
    home_logo: "",
    home_hero_image_url: "",
    home_eyebrow: "Appel à films ouvert · Marseille 2026",
    home_terminal: "> FESTIVAL_IA_V1.0 // INITIATING{{cursor}}",
    hero_title1: "IMAGINEZ",
    hero_title2: "DES FUTURS",
    hero_title3: "SOUHAITABLES",
    hero_text: "Courts-métrages 1-2 min entièrement générés par intelligence artificielle.\nOuvert à tous. Sans inscription.",
    cta_submit: "Soumettre un film",
    cta_catalogue: "Voir le catalogue",
    cta_palmares: "Palmarès",
    feature_text: "MarsAI place l'humain au coeur de la création assistée par IA. Stimulez votre créativité via le format court et rejoignez une communauté internationale autour de l'IA générative.",
    feature_cta: "La Plateforme × Mobile Film Festival",
    theme_title: "Thème 2026",
    theme_quote: "Imaginez des futurs souhaitables",
    feature_tags: "Science-fiction|Dystopie|Futur positif|Technologie|Humanité|Écologie|Créativité",
};

const focusedStyle = {
    outline: "2px solid rgba(125,113,251,.9)",
    outlineOffset: "4px",
    borderRadius: "12px",
    boxShadow: "0 0 0 10px rgba(125,113,251,.18)",
} as const;

export default function HomeView() {

    const [tick, setTick] = useState(0);
    const [runtimeData, setRuntimeData] = useState<HomeData | null>(null);
    const [adminPreviewMode, setAdminPreviewMode] = useState(false);
    const [selectedField, setSelectedField] = useState<HomePreviewField | null>(null);
    const [previewValues, setPreviewValues] = useState<HomePreviewValues>(DEFAULT_PREVIEW_VALUES);
    const [previewRuntimeDates, setPreviewRuntimeDates] = useState<HomeData["dates"] | null>(null);

    const resolvePhaseFromDates = (dates?: HomeData["dates"] | null, fallbackPhase?: 1 | 2 | 3 | 4): 1 | 2 | 3 | 4 => {
        if (!dates) return fallbackPhase ?? getCurrentFestivalPhase();

        const now = Date.now();
        const p1 = dates.phase1_close ? new Date(dates.phase1_close).getTime() : NaN;
        const p2 = dates.phase2_catalogue ? new Date(dates.phase2_catalogue).getTime() : NaN;
        const p3 = dates.phase3_palmares ? new Date(dates.phase3_palmares).getTime() : NaN;

        if (Number.isNaN(p1) || Number.isNaN(p2) || Number.isNaN(p3)) {
            return fallbackPhase ?? getCurrentFestivalPhase();
        }

        if (now < p1) return 1;
        if (now < p2) return 2;
        if (now < p3) return 3;
        return 4;
    };

    const effectiveDates = adminPreviewMode && previewRuntimeDates ? previewRuntimeDates : runtimeData?.dates;
    const phase = resolvePhaseFromDates(effectiveDates, runtimeData?.phase);

    useEffect(() => {
        const interval = setInterval(() => setTick((t) => t + 1), 500);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get("adminPreview") === "1") setAdminPreviewMode(true);

        const handler = (event: MessageEvent) => {
            const raw = event.data as unknown;
            if (!raw || typeof raw !== "object") return;
            const data = raw as {
                type?: string;
                payload?: {
                    selectedField?: HomePreviewField | null;
                    values?: HomePreviewSyncValues;
                };
            };

            if (data.type !== "marsai-admin-preview-sync") return;
            setAdminPreviewMode(true);
            setSelectedField(data.payload?.selectedField ?? null);
            if (data.payload?.values) {
                const syncValues = data.payload.values;
                setPreviewValues((prev) => ({ ...prev, ...(syncValues as Partial<HomePreviewValues>) }));
                setPreviewRuntimeDates((prev) => ({
                    phase1_close: typeof syncValues.phase1_close_iso === "string" ? syncValues.phase1_close_iso : (prev?.phase1_close ?? null),
                    phase2_catalogue: typeof syncValues.phase2_catalogue_iso === "string" ? syncValues.phase2_catalogue_iso : (prev?.phase2_catalogue ?? null),
                    phase3_palmares: typeof syncValues.phase3_palmares_iso === "string" ? syncValues.phase3_palmares_iso : (prev?.phase3_palmares ?? null),
                }));
            }
        };

        window.addEventListener("message", handler);
        return () => window.removeEventListener("message", handler);
    }, []);

    useEffect(() => {
        let cancelled = false;

        const getTranslationRoot = (obj: unknown): Record<string, unknown> =>
            typeof obj === "object" && obj !== null ? (obj as Record<string, unknown>) : {};

        const getHomeTranslationByLang = (translation: unknown, lang: "fr" | "en") => {
            const root = getTranslationRoot(translation);
            const langNode = getTranslationRoot(root[lang]);
            const langHome = getTranslationRoot(langNode.home);
            if (Object.keys(langHome).length > 0) return langHome;
            return getTranslationRoot(root.home);
        };

        void getHomeData()
            .then((data) => {
                if (cancelled) return;
                setRuntimeData(data);

                const lang = (localStorage.getItem("marsai_lang") === "en" ? "en" : "fr") as "fr" | "en";
                const translationSource = data.translation ?? data.translations ?? {};
                const homeTr = getHomeTranslationByLang(translationSource, lang);

                const parseString = (value: unknown, fallback: string) =>
                    typeof value === "string" && value.trim().length > 0 ? value : fallback;

                const tagArray = Array.isArray(homeTr.featureTags)
                    ? homeTr.featureTags.filter((item): item is string => typeof item === "string")
                    : TAGS;

                setPreviewValues((prev) => ({
                    ...prev,
                    home_logo: parseString(data.home_logo ?? data.site_logo, prev.home_logo),
                    home_eyebrow: parseString(homeTr.eyebrow, prev.home_eyebrow),
                    home_terminal: parseString(homeTr.terminal, prev.home_terminal),
                    hero_title1: parseString(homeTr.title1, prev.hero_title1),
                    hero_title2: parseString(homeTr.title2, prev.hero_title2),
                    hero_title3: parseString(homeTr.title3, prev.hero_title3),
                    hero_text: parseString(homeTr.heroText, prev.hero_text),
                    cta_submit: parseString(homeTr.ctaSubmit, prev.cta_submit),
                    cta_catalogue: parseString(homeTr.ctaCatalogue, prev.cta_catalogue),
                    cta_palmares: parseString(homeTr.ctaPalmares, prev.cta_palmares),
                    feature_text: parseString(homeTr.featureText, prev.feature_text),
                    feature_cta: parseString(homeTr.featureCta, prev.feature_cta),
                    theme_title: parseString(homeTr.themeTitle, prev.theme_title),
                    theme_quote: parseString(homeTr.themeQuote, prev.theme_quote),
                    feature_tags: tagArray.join("|"),
                }));
            })
            .catch((error) => {
                console.error("[HomeView] runtime settings", error);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const updateValue = (field: HomePreviewField, value: string) => {
        setPreviewValues((prev) => ({ ...prev, [field]: value }));
        if (window.parent !== window) {
            window.parent.postMessage(
                {
                    type: "marsai-admin-preview-input",
                    payload: { field, value },
                },
                "*"
            );
        }
    };

    return (
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-10 min-h-screen">
            <HeroSection
                tick={tick}
                phase={phase}
                adminPreviewMode={adminPreviewMode}
                selectedField={selectedField}
                values={previewValues}
                onValueChange={updateValue}
            />
            <CountdownSection phase={phase} runtimeDates={effectiveDates} />
            <StatsSection />
            <ShowcaseSection
                adminPreviewMode={adminPreviewMode}
                selectedField={selectedField}
                values={previewValues}
                onValueChange={updateValue}
            />
            <PartnersSection />
        </div>
    );
}

function HeroSection({
    tick,
    phase,
    adminPreviewMode,
    selectedField,
    values,
    onValueChange,
}: {
    tick: number;
    phase: 1 | 2 | 3 | 4;
    adminPreviewMode: boolean;
    selectedField: HomePreviewField | null;
    values: HomePreviewValues;
    onValueChange: (field: HomePreviewField, value: string) => void;
}) {
    const phaseNotice = phase > 1 ? getPhaseNotice(phase, {}) : null;
    const phaseCta = phase === 3 ? values.cta_catalogue : phase === 4 ? values.cta_palmares : values.cta_submit;

    return (
        <section className="flex flex-col items-center text-center pt-6 md:pt-10 pb-10 md:pb-14 gap-5">
            {(values.home_hero_image_url || (adminPreviewMode && selectedField === "home_hero_image_url")) ? (
                <div className="flex flex-col items-center gap-2" style={selectedField === "home_hero_image_url" ? focusedStyle : undefined}>
                    {values.home_hero_image_url ? (
                        <img
                            src={values.home_hero_image_url}
                            alt="Hero"
                            className="w-24 h-24 rounded-2xl object-cover"
                            onError={(e) => {
                                (e.currentTarget as HTMLImageElement).style.display = "none";
                            }}
                        />
                    ) : (
                        <div className="w-24 h-24 rounded-2xl border border-white/15 bg-white/5 flex items-center justify-center f-mono text-[9px] text-white/45">
                            IMAGE HERO
                        </div>
                    )}
                    {adminPreviewMode && selectedField === "home_hero_image_url" ? (
                        <input
                            className="submit-input w-[360px] max-w-[90vw]"
                            value={values.home_hero_image_url}
                            onChange={(e) => onValueChange("home_hero_image_url", e.target.value)}
                            placeholder="https://..."
                        />
                    ) : null}
                </div>
            ) : null}

            <div
                className="flex items-center gap-3 px-4 py-2.5 rounded-full border"
                style={{
                    background: "rgba(30, 20, 60, 0.5)",
                    borderColor: "rgba(125, 113, 251, 0.8)",
                    boxShadow: "0 0 30px rgba(125, 113, 251, 0.3), inset 0 0 20px rgba(125, 113, 251, 0.1)",
                }}
            >
                <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#7d71fb] opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#7d71fb]" />
                </span>
                <span className="f-mono text-[9px] tracking-[0.26rem] uppercase leading-none" style={{
                    fontWeight: 500,
                    color: "rgba(200, 190, 255, 0.85)",
                    ...(selectedField === "home_eyebrow" ? focusedStyle : {}),
                }}>
                    <span
                        suppressContentEditableWarning
                        contentEditable={adminPreviewMode && selectedField === "home_eyebrow"}
                        onInput={(e) => onValueChange("home_eyebrow", e.currentTarget.textContent ?? "")}
                    >
                        {values.home_eyebrow}
                    </span>
                </span>
            </div>

            <div
                className="f-mono mb-2 text-[10px] tracking-[0.35rem] text-white/25 uppercase"
                data-preview-target="home.terminal"
                style={{
                    opacity: 0,
                    transform: "translateY(12px)",
                    animation: "fadeUp 0.7s ease-out 0.3s both",
                    ...(selectedField === "home_terminal" ? focusedStyle : {}),
                }}
                suppressContentEditableWarning
                contentEditable={adminPreviewMode && selectedField === "home_terminal"}
                onInput={(e) => onValueChange("home_terminal", e.currentTarget.textContent ?? "")}
            >
                {values.home_terminal.replace("{{cursor}}", tick % 2 === 0 ? "▮" : " ")}
            </div>

            <h1 className="f-orb font-black leading-[0.88] tracking-tight">
                <span
                    className="block text-[3.5rem] md:text-[7rem] text-white"
                    style={selectedField === "hero_title1" ? focusedStyle : undefined}
                    suppressContentEditableWarning
                    contentEditable={adminPreviewMode && selectedField === "hero_title1"}
                    onInput={(e) => onValueChange("hero_title1", e.currentTarget.textContent ?? "")}
                >
                    {values.hero_title1}
                </span>
                <span
                    className="block text-[3.5rem] md:text-[7rem]"
                    style={{ color: "rgba(255, 255, 255, .26)", ...(selectedField === "hero_title2" ? focusedStyle : {}) }}
                    suppressContentEditableWarning
                    contentEditable={adminPreviewMode && selectedField === "hero_title2"}
                    onInput={(e) => onValueChange("hero_title2", e.currentTarget.textContent ?? "")}
                >
                    {values.hero_title2}
                </span>
                <span
                    className="block text-[3.5rem] md:text-[7rem]"
                    style={{
                        background: "linear-gradient(90deg, #7d71fb 0%, #b867d2 45%, #ff6f76 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        ...(selectedField === "hero_title3" ? focusedStyle : {}),
                    }}
                    suppressContentEditableWarning
                    contentEditable={adminPreviewMode && selectedField === "hero_title3"}
                    onInput={(e) => onValueChange("hero_title3", e.currentTarget.textContent ?? "")}
                >
                    {values.hero_title3}
                </span>
            </h1>

            <p
                className="f-mono text-[11px] text-white/35 max-w-lg leading-relaxed"
                style={selectedField === "hero_text" ? focusedStyle : undefined}
                suppressContentEditableWarning
                contentEditable={adminPreviewMode && selectedField === "hero_text"}
                onInput={(e) => onValueChange("hero_text", e.currentTarget.innerText)}
            >
                {values.hero_text}
            </p>

            {phase === 1 ? (
                <Button
                    asChild
                    className="f-orb group relative overflow-hidden rounded-full px-9 py-6 text-xs font-bold uppercase tracking-widest text-white transition-all duration-300"
                    style={{
                        background: marsaiGradients.primaryToAccent,
                        animation: "pulseGlow 2.5s ease-in-out infinite",
                        ...(selectedField === "cta_submit" ? focusedStyle : {}),
                    }}
                >
                    <a href="/submit" onClick={(e) => adminPreviewMode && e.preventDefault()}>
                        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                        <Upload size={13} className="relative" />
                        <span
                            className="relative"
                            suppressContentEditableWarning
                            contentEditable={adminPreviewMode && selectedField === "cta_submit"}
                            onInput={(e) => onValueChange("cta_submit", e.currentTarget.textContent ?? "")}
                        >
                            {values.cta_submit}
                        </span>
                    </a>
                </Button>
            ) : (
                <div className="flex flex-col items-center gap-3">
                    <p className="f-orb text-xl md:text-2xl text-white/90 uppercase tracking-wide">
                        {phaseNotice?.text}
                    </p>
                    {phaseNotice?.cta && phaseNotice?.href ? (
                        <Button
                            asChild
                            className="f-orb rounded-full px-9 py-3 text-xs font-bold uppercase tracking-widest text-white transition-all duration-300"
                            style={{
                                background: marsaiGradients.primaryToAccent,
                                ...((phase === 3 && selectedField === "cta_catalogue") || (phase === 4 && selectedField === "cta_palmares") ? focusedStyle : {}),
                            }}
                        >
                            <a href={phaseNotice.href} onClick={(e) => adminPreviewMode && e.preventDefault()}>
                                <span
                                    suppressContentEditableWarning
                                    contentEditable={adminPreviewMode && ((phase === 3 && selectedField === "cta_catalogue") || (phase === 4 && selectedField === "cta_palmares"))}
                                    onInput={(e) => onValueChange(phase === 3 ? "cta_catalogue" : "cta_palmares", e.currentTarget.textContent ?? "")}
                                >
                                    {phaseCta}
                                </span>
                            </a>
                        </Button>
                    ) : null}
                </div>
            )}
        </section>
    );
}

function CountdownSection({ phase, runtimeDates }: { phase: 1 | 2 | 3 | 4; runtimeDates?: HomeData["dates"] }) {
    const phaseTimelineIndex = Math.min(phase, 3);
    const p1Date = runtimeDates?.phase1_close ? new Date(runtimeDates.phase1_close) : PHASE_DATES.phase1Close;
    const p2Date = runtimeDates?.phase2_catalogue ? new Date(runtimeDates.phase2_catalogue) : PHASE_DATES.phase2Close;
    const p3Date = runtimeDates?.phase3_palmares ? new Date(runtimeDates.phase3_palmares) : PHASE_DATES.phase3Close;
    const targetDate = phase === 1 ? p1Date : phase === 2 ? p2Date : p3Date;
    const time = useCountdown(targetDate);

    const timelineRows = [
        {
            id: "01",
            label: "Appel à films",
            detail: "1-2 min · 100% IA · International",
        },
        ...PANEL_ROWS.map((row, index) => ({
            id: `0${index + 2}`,
            label: row.label,
            detail: row.value,
        })),
    ].map((row, index) => {
        const rowIndex = index + 1;
        return {
            ...row,
            active: rowIndex === phaseTimelineIndex,
            status: rowIndex < phaseTimelineIndex ? "Clos" : rowIndex === phaseTimelineIndex ? "En cours" : "À venir",
        };
    });

    return (
        <section className="pb-8 md:pb-12">
            <div className="relative mb-6">
                <div className="h-px w-full" style={{ background: "rgba(255,255,255,.12)" }} />
                <span
                    className="f-mono absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-4 text-[8px] tracking-[0.2rem] uppercase"
                    style={{ background: "var(--col-bg)", color: "rgba(255,255,255,.32)" }}
                >
                    Timeline · Festival 2026
                </span>
            </div>

            <div className="grid lg:grid-cols-2 gap-4">
                <div
                    className="rounded-2xl p-5 space-y-5"
                    style={{
                        border: "1px solid rgba(125,113,251,.4)",
                        background: "rgba(15, 10, 36, .72)",
                        boxShadow: "inset 0 0 20px rgba(125,113,251,.12)",
                    }}
                >
                    <div className="flex items-center justify-between">
                        <span className="f-mono text-[8px] tracking-widest uppercase text-white/42">
                            {`Phase_0${phase} // Actif`}
                        </span>
                        <span className="f-orb text-xl text-white/85">
                            {phase === 4 ? "PALMARÈS" : "APPEL À FILMS"}
                        </span>
                    </div>

                    {phase === 4 ? (
                        <div className="rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-6 text-center">
                            <p className="f-mono text-[9px] uppercase tracking-[0.2rem] text-red-400">&gt; SUBMISSIONS_CLOSED</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-4 gap-3">
                            <TimeBlock value={time.jours} label="Jours" />
                            <TimeBlock value={time.heures} label="Heures" />
                            <TimeBlock value={time.min} label="Min" />
                            <TimeBlock value={time.sec} label="Sec" />
                        </div>
                    )}
                </div>

                <div className="space-y-3">
                    {timelineRows.map((row) => (
                        <div
                            key={row.id}
                            className="rounded-xl px-4 py-3 flex items-center justify-between"
                            style={{
                                border: row.active
                                    ? "1px solid rgba(125,113,251,.6)"
                                    : "1px solid rgba(255,255,255,.09)",
                                background: row.active
                                    ? "rgba(35, 22, 78, .58)"
                                    : "rgba(255,255,255,.02)",
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <span
                                    className="f-mono text-[8px] rounded-md p-1 flex items-center justify-center w-8 h-8"
                                    style={{
                                        background: row.active ? "linear-gradient(135deg, #7d71fb, #ff5c35)" : "rgba(255,255,255,.06)",
                                        color: row.active ? "#fff" : "rgba(255,255,255,.35)",
                                        boxShadow: row.active ? "0 0 20px rgba(125, 113, 251, 0.4)" : "none",
                                    }}
                                >
                                    {row.id}
                                </span>
                                <div>
                                    <p className="f-orb text-sm text-white/88 uppercase">{row.label}</p>
                                    <p className="f-mono text-[8px] text-white/38 tracking-wide">{row.detail}</p>
                                </div>
                            </div>
                            <span
                                className="f-mono text-[8px] px-2.5 py-1 rounded-full uppercase tracking-wider"
                                style={{
                                    background: row.active ? "rgba(125,113,251,.22)" : "rgba(255,255,255,.07)",
                                    color: row.active ? "var(--col-vi)" : "rgba(255,255,255,.34)",
                                }}
                            >
                                {row.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function StatsSection() {
    return (
        <section className="pb-12">
            <div className="flex items-center justify-center gap-10 md:gap-14 text-center">
                {MAIN_STATS.map(({ value, label }, index) => (
                    <div key={index} className="flex flex-col items-center gap-1 min-w-[84px]">
                        <span
                            className="f-orb text-3xl md:text-4xl font-black"
                            style={{
                                color: index === 1 ? "#ff6a47" : "#8f7cff",
                                textShadow:
                                    index === 1
                                        ? "0 0 14px rgba(255,106,71,.18)"
                                        : "0 0 14px rgba(143,124,255,.2)",
                            }}
                        >
                            {index < 2 ? `${value}+` : value}
                        </span>
                        <span className="f-mono text-[9px] tracking-[0.2rem] uppercase text-white/35">
                            {label}
                        </span>
                    </div>
                ))}
            </div>

            <div className="pt-10 flex flex-col items-center gap-2 text-white/40">
                <span className="f-mono text-[8px] tracking-[0.3rem] uppercase">Scroll</span>
                <span className="block h-7 w-3 rounded-full border border-white/25 relative">
                    <span className="absolute left-1/2 top-1.5 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-white/50" style={{
                        animation: "float 1.2s ease-in-out infinite",
                    }} />
                </span>
            </div>
        </section>
    );
}

function ShowcaseSection({
    adminPreviewMode,
    selectedField,
    values,
    onValueChange,
}: {
    adminPreviewMode: boolean;
    selectedField: HomePreviewField | null;
    values: HomePreviewValues;
    onValueChange: (field: HomePreviewField, value: string) => void;
}) {
    const tags = values.feature_tags
        .split("|")
        .map((item) => item.trim())
        .filter(Boolean);

    const updateTagAt = (index: number, value: string) => {
        const nextTags = [...tags];
        nextTags[index] = value;
        onValueChange("feature_tags", nextTags.join("|"));
    };

    return (
        <section className="pb-24">
            <div className="grid lg:grid-cols-12 gap-4">
                <div
                    className="lg:col-span-8 rounded-3xl p-8 space-y-5"
                    style={{
                        border: "1px solid rgba(255, 255, 255, .09)",
                        background: "linear-gradient(120deg, rgba(255,255,255,.02) 0%, rgba(255,255,255,.02) 65%, rgba(255,92,53,.09) 100%)",
                    }}
                >
                    <p
                        className="f-mono text-[8px] tracking-[0.2rem] uppercase inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
                        style={{
                            background: "rgba(255,255,255,.03)",
                            border: "1px solid rgba(255,255,255,.08)",
                            color: "rgba(255,255,255,.45)",
                            ...(selectedField === "feature_cta" ? focusedStyle : {}),
                        }}
                        suppressContentEditableWarning
                        contentEditable={adminPreviewMode && selectedField === "feature_cta"}
                        onInput={(e) => onValueChange("feature_cta", e.currentTarget.textContent ?? "")}
                    >
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--col-or)" }} />
                        {values.feature_cta}
                    </p>

                    <h2 className="f-orb text-3xl md:text-5xl font-bold text-white leading-snug">
                        L'IA au service
                    </h2>
                    <h2
                        className="f-orb text-3xl md:text-5xl font-bold leading-snug"
                        style={{
                            background: "linear-gradient(90deg, var(--col-vi), #cf72be, var(--col-or))",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        de la création cinématographique
                    </h2>

                    <p
                        className="f-mono text-sm text-white/42 leading-relaxed max-w-2xl"
                        style={selectedField === "feature_text" ? focusedStyle : undefined}
                        suppressContentEditableWarning
                        contentEditable={adminPreviewMode && selectedField === "feature_text"}
                        onInput={(e) => onValueChange("feature_text", e.currentTarget.textContent ?? "")}
                    >
                        {values.feature_text}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-1" style={selectedField === "feature_tags" ? focusedStyle : undefined}>
                        {tags.map((tag, index) => (
                            <span
                                key={index}
                                className="f-mono text-[8px] tracking-wider px-3 py-1.5 rounded-full"
                                style={{
                                    border: "1px solid rgba(255, 255, 255, .12)",
                                    background: "rgba(255, 255, 255, .03)",
                                    color: "rgba(255, 255, 255, .45)",
                                }}
                                suppressContentEditableWarning
                                contentEditable={adminPreviewMode && selectedField === "feature_tags"}
                                onInput={(e) => updateTagAt(index, e.currentTarget.textContent ?? "")}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-4 flex flex-col gap-3">
                    {MAIN_STATS.map(({ value, label }, index) => (
                        <div
                            key={index}
                            className="rounded-2xl flex flex-col items-center justify-center py-5"
                            style={{
                                border: "1px solid rgba(255,255,255,.09)",
                                background: index === 1
                                    ? "rgba(255, 92, 53, .08)"
                                    : "rgba(255,255,255,.03)",
                            }}
                        >
                            <span
                                className="f-orb text-5xl font-black"
                                style={{
                                    color: index === 1 ? "#ff6a47" : "#8f7cff",
                                    textShadow:
                                        index === 1
                                            ? "0 0 16px rgba(255,106,71,.2)"
                                            : "0 0 16px rgba(143,124,255,.22)",
                                }}
                            >
                                {index < 2 ? `${value}+` : value}
                            </span>
                            <span className="f-mono text-[10px] tracking-[0.22rem] uppercase text-white/30 mt-1">
                                {label}
                            </span>
                        </div>
                    ))}

                    <div
                        className="rounded-2xl px-5 py-4"
                        style={{
                            background: "rgba(255, 92, 53, .08)",
                            border: "1px solid rgba(255, 92, 53, .24)",
                        }}
                    >
                        <p
                            className="f-mono text-[8px] tracking-[0.2rem] uppercase text-orange-300/70 mb-2"
                            style={selectedField === "theme_title" ? focusedStyle : undefined}
                            suppressContentEditableWarning
                            contentEditable={adminPreviewMode && selectedField === "theme_title"}
                            onInput={(e) => onValueChange("theme_title", e.currentTarget.textContent ?? "")}
                        >
                            {values.theme_title}
                        </p>
                        <p
                            className="f-orb text-xl font-bold leading-tight"
                            style={{
                                background: "linear-gradient(90deg, #ffffff, #d8cfff)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                ...(selectedField === "theme_quote" ? focusedStyle : {}),
                            }}
                            suppressContentEditableWarning
                            contentEditable={adminPreviewMode && selectedField === "theme_quote"}
                            onInput={(e) => onValueChange("theme_quote", e.currentTarget.textContent ?? "")}
                        >
                            {values.theme_quote}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

function PartnersSection() {
    return (
        <section className="pt-4 pb-16">
            <div
                className="w-full h-px mb-12"
                style={{ background: "rgba(255, 255, 255, .06)" }}
            />

            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12">
                <img
                    src="/partner/lg-laplateforme.png"
                    alt="La Plateforme"
                    className="h-8 sm:h-9 w-auto opacity-85 hover:opacity-100 transition-all duration-300"
                    style={{
                        filter:
                            "brightness(0) saturate(100%) invert(50%) sepia(70%) saturate(1190%) hue-rotate(218deg) brightness(102%) contrast(99%) drop-shadow(0 0 10px rgba(125, 113, 251, .25))",
                    }}
                    loading="lazy"
                />

                <img
                    src="/partner/lg-mofilefestival.png"
                    alt="Mobile Film Festival"
                    className="h-8 sm:h-9 w-auto opacity-90 hover:opacity-100 transition-all duration-300"
                    style={{
                        filter:
                            "brightness(0) saturate(100%) invert(58%) sepia(79%) saturate(3365%) hue-rotate(345deg) brightness(101%) contrast(103%) drop-shadow(0 0 10px rgba(255, 92, 53, .25))",
                    }}
                    loading="lazy"
                />
            </div>
        </section>
    );
}

