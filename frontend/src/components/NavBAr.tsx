import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import marsAiLogo from "../assets/mars_ai_logo.png";
import { getHomeData } from "../lib/api";

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

const LANGS = [
    { code: "fr", label: "FR", flagUrl: "https://flagcdn.com/w40/fr.png" },
    { code: "en", label: "EN", flagUrl: "https://flagcdn.com/w40/gb.png" },
];

interface NavbarProps {
    lang?: "fr" | "en";
    onLangChange?: (lang: "fr" | "en") => void;
}

export default function Navbar({ lang = "fr", onLangChange }: NavbarProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const [adminPreviewMode, setAdminPreviewMode] = useState(false);
    const [selectedField, setSelectedField] = useState<HomePreviewField | null>(null);
    const [logoUrl, setLogoUrl] = useState(marsAiLogo);

    const isSubmit = location.pathname.startsWith("/submit");

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
                    values?: { home_logo?: string };
                };
            };

            if (data.type !== "marsai-admin-preview-sync") return;
            setAdminPreviewMode(true);
            setSelectedField(data.payload?.selectedField ?? null);
            const nextLogo = data.payload?.values?.home_logo;
            if (typeof nextLogo === "string" && nextLogo.trim().length > 0) {
                setLogoUrl(nextLogo);
            }
        };

        window.addEventListener("message", handler);
        return () => window.removeEventListener("message", handler);
    }, []);

    useEffect(() => {
        let cancelled = false;
        void getHomeData()
            .then((data) => {
                if (cancelled) return;
                const persistedLogo = data.home_logo ?? data.site_logo;
                if (typeof persistedLogo === "string" && persistedLogo.trim().length > 0) {
                    setLogoUrl(persistedLogo);
                }
            })
            .catch((error) => {
                console.error("[Navbar] runtime logo", error);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const updateLogo = (value: string) => {
        setLogoUrl(value || marsAiLogo);
        if (window.parent !== window) {
            window.parent.postMessage(
                {
                    type: "marsai-admin-preview-input",
                    payload: { field: "home_logo", value },
                },
                "*"
            );
        }
    };

    return (
        <nav
            className="fixed top-0 left-0 right-0 z-50 h-20"
            style={{
                background: "rgba(5, 3, 13, 0.85)",
                borderBottom: "1px solid rgba(255, 255, 255, 0.04)",
                backdropFilter: "blur(12px)",
            }}
        >
            <div className="relative h-full w-full max-w-[1500px] mx-auto px-6 flex items-center justify-between">
                <div
                    className="pointer-events-none absolute left-48 right-[17rem] top-1/2 -translate-y-1/2 h-px"
                    style={{
                        background:
                            "linear-gradient(90deg, rgba(255,255,255,0.08), rgba(255,255,255,0.08) 80%, rgba(255,92,53,0.42))",
                    }}
                />

                <button
                    onClick={() => navigate("/")}
                    className="relative z-10 flex items-center gap-2 hover:opacity-90 transition-opacity"
                    style={selectedField === "home_logo" ? {
                        outline: "3px solid rgba(125,113,251,1)",
                        outlineOffset: "5px",
                        borderRadius: "12px",
                        background: "rgba(125,113,251,.14)",
                        boxShadow: "0 0 0 12px rgba(125,113,251,.26)",
                    } : undefined}
                >
                    <img src={logoUrl} alt="logo MarsAI" className="w-10 h-10 object-contain" onError={() => setLogoUrl(marsAiLogo)} />
                    <div className="flex flex-col leading-none">
                        <span className="f-orb text-[24px] font-black tracking-tight leading-none">
                            <span className="text-white">MARS</span>
                            <span className="text-orange-500">AI</span>
                        </span>
                        <span className="f-mono text-[9px] tracking-[0.16em] uppercase text-white/80 mt-0.5 inline-flex items-center gap-1">
                            FESTIVAL
                            <span className="text-white/45 blink-cursor">▮</span>
                        </span>
                    </div>
                </button>

                {adminPreviewMode && selectedField === "home_logo" ? (
                    <div className="absolute left-6 top-[4.7rem] z-20 w-[360px] max-w-[42vw]">
                        <input
                            className="submit-input"
                            value={logoUrl === marsAiLogo ? "" : logoUrl}
                            placeholder="https://..."
                            onChange={(e) => updateLogo(e.target.value)}
                        />
                    </div>
                ) : null}

                <span className="relative z-10 f-mono text-[10px] tracking-[0.2em] text-white/32 hidden md:inline-flex items-center gap-1 whitespace-nowrap">
                    SYS:MARS_AI_2026 // STATUS:OPEN
                </span>

                <div className="relative z-10 flex items-center gap-6">
                    <button
                        onClick={() => navigate("/submit")}
                        className="f-mono text-[14px] tracking-[0.14em] uppercase text-white/90 relative"
                    >
                        SOUMETTRE
                        {isSubmit && (
                            <span
                                className="absolute -bottom-1 left-0 right-0 h-px"
                                style={{ background: "linear-gradient(90deg, var(--col-vi), var(--col-or))" }}
                            />
                        )}
                    </button>

                    <div className="flex items-center gap-2">
                        {LANGS.map(({ code, flagUrl, label }) => (
                            <button
                                key={code}
                                onClick={() => onLangChange?.(code as "fr" | "en")}
                                className="flex flex-col items-center gap-0.5 transition-opacity hover:opacity-100"
                                style={{ opacity: lang === code ? 1 : 0.75 }}
                            >
                                <span
                                    className="w-8 h-8 rounded-full border-2 p-[2px] flex items-center justify-center"
                                    style={{
                                        borderColor:
                                            lang === code ? "rgba(125, 113, 251, 0.95)" : "rgba(255, 255, 255, 0.35)",
                                        boxShadow: lang === code ? "0 0 12px rgba(125, 113, 251, 0.35)" : "none",
                                        background: "rgba(5, 3, 13, 0.6)",
                                    }}
                                >
                                    <img src={flagUrl} alt={`Drapeau ${label}`} className="w-full h-full rounded-full object-cover" />
                                </span>
                                <span className="f-mono text-[9px] tracking-[0.08em] text-white/85 -mt-0.5">{label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
}

