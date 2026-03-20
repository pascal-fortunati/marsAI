import { Upload } from "lucide-react";
import { useCountdown, TimeBlock } from "./homeCounter";
import { MAIN_STATS, PANEL_ROWS, TAGS } from "./homeHelpers";
import { marsaiGradients } from "../../theme/marsai";
import { Button } from "../../components/ui/button";

export default function HomeView() {
    return (
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-10 min-h-screen">
            <HeroSection />
            <CountdownSection />
            <StatsSection />
            <ShowcaseSection />
            <PartnersSection />
        </div>
    );
}

function HeroSection() {
    return (
        <section className="flex flex-col items-center text-center pt-6 md:pt-10 pb-10 md:pb-14 gap-5">
            <div
                className="flex items-center gap-2 px-5 py-2 rounded-full border"
                style={{
                    background: "rgba(125,113,251,.1)",
                    borderColor: "rgba(125,113,251,.5)",
                    boxShadow: "0 0 14px rgba(125,113,251,.18)",
                }}
            >
                <span className="f-mono text-[9px] tracking-[0.26rem] uppercase text-white/70">
                    Appel à films ouvert · Marseille 2026
                </span>
            </div>

            <div
                className="f-mono mb-2 text-[10px] tracking-[0.35rem] text-white/25 uppercase"
                data-preview-target="home.terminal"
                style={{
                    opacity: 0,
                    transform: "translateY(12px)",
                    animation: "fadeUp 0.7s ease-out 0.3s both",
                }}
            >
                {`> FESTIVAL_IA_V1.0 // INITIATING`}
                <span style={{ animation: "blink 1s step-end infinite" }}>▮</span>
            </div>

            <h1 className="f-orb font-black leading-[0.88] tracking-tight">
                <span className="block text-[3.5rem] md:text-[7rem] text-white">
                    IMAGINEZ
                </span>
                <span className="block text-[3.5rem] md:text-[7rem]" style={{ color: "rgba(255, 255, 255, .26)" }}>
                    DES FUTURS
                </span>
                <span
                    className="block text-[3.5rem] md:text-[7rem]"
                    style={{
                        background: "linear-gradient(90deg, #7d71fb 0%, #b867d2 45%, #ff6f76 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    SOUHAITABLES
                </span>
            </h1>

            <p className="f-mono text-[11px] text-white/35 max-w-lg leading-relaxed">
                Courts-métrages 1-2 min entièrement générés par intelligence artificielle.
                <br />Ouvert à tous. Sans inscription.
            </p>

            <Button
                asChild
                className="f-orb group relative overflow-hidden rounded-full px-9 py-6 text-xs font-bold uppercase tracking-widest text-white transition-all duration-300"
                style={{
                    background: marsaiGradients.primaryToAccent,
                    animation: "pulseGlow 2.5s ease-in-out infinite",
                }}
            >
                <a href="/submit">
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                    <Upload size={13} className="relative" />
                    <span className="relative">Soumettre un film</span>
                </a>
            </Button>
        </section>
    );
}

function CountdownSection() {
    const time = useCountdown();
    const timelineRows = [
        {
            id: "01",
            label: "Appel à films",
            detail: "1-2 min · 100% IA · International",
            status: "En cours",
            active: true,
        },
        ...PANEL_ROWS.map((row, index) => ({
            id: `0${index + 2}`,
            label: row.label,
            detail: row.value,
            status: "À venir",
            active: false,
        })),
    ];

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
                            Phase_01 // Actif
                        </span>
                        <span className="f-orb text-xl text-white/85">
                            APPEL À FILMS
                        </span>
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                        <TimeBlock value={time.jours} label="Jours" />
                        <TimeBlock value={time.heures} label="Heures" />
                        <TimeBlock value={time.min} label="Min" />
                        <TimeBlock value={time.sec} label="Sec" />
                    </div>
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
                                    className="f-mono text-[8px] rounded-md px-2 py-1"
                                    style={{
                                        background: row.active ? "rgba(255,92,53,.9)" : "rgba(255,255,255,.06)",
                                        color: row.active ? "#fff" : "rgba(255,255,255,.35)",
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
                    <div key={label} className="flex flex-col items-center gap-1 min-w-[84px]">
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
                    <span className="absolute left-1/2 top-1.5 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-white/50" />
                </span>
            </div>
        </section>
    );
}

function ShowcaseSection() {
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
                        }}
                    >
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--col-or)" }} />
                        La Plateforme × Mobile Film Festival
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

                    <p className="f-mono text-sm text-white/42 leading-relaxed max-w-2xl">
                        MarsAI place l'humain au coeur de la création assistée par IA.
                        Stimulez votre créativité via le format court et rejoignez une
                        communauté internationale autour de l'IA générative.
                    </p>

                    <div className="flex flex-wrap gap-2 pt-1">
                        {TAGS.map((tag) => (
                            <span
                                key={tag}
                                className="f-mono text-[8px] tracking-wider px-3 py-1.5 rounded-full"
                                style={{
                                    border: "1px solid rgba(255, 255, 255, .12)",
                                    background: "rgba(255, 255, 255, .03)",
                                    color: "rgba(255, 255, 255, .45)",
                                }}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-4 flex flex-col gap-3">
                    {MAIN_STATS.map(({ value, label }, index) => (
                        <div
                            key={label}
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
                        <p className="f-mono text-[8px] tracking-[0.2rem] uppercase text-orange-300/70 mb-2">Thème 2026</p>
                        <p
                            className="f-orb text-xl font-bold leading-tight"
                            style={{
                                background: "linear-gradient(90deg, #ffffff, #d8cfff)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            "Imaginez des futurs souhaitables"
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

