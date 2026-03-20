import { useNavigate, useLocation } from "react-router-dom";
import marsAiLogo from "../assets/mars_ai_logo.png";

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

    const isSubmit = location.pathname.startsWith("/submit");

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
                >
                    <img src={marsAiLogo} alt="logo MarsAI" className="w-10 h-10 object-contain" />
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

