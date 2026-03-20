import { Upload } from "lucide-react";
import { useCountdown, TimeBlock } from "./homeCounter";
import { MAIN_STATS, PANEL_ROWS, TAGS } from "./homeHelpers";
import { marsaiGradients } from "../../theme/marsai";
import { Button } from "../../components/ui/button";

export default function HomeView() {
    return (
        <div className="relative z-10 max-w-3xl mx-auto px-4 py-20 min-h-screen">
            <HeroSection />
            <CountdownSection />
            <StatsSection />
            <TagsSection />
            <PartnersSection />
        </div>
    );
}

// Hero
function HeroSection() {
    return (
        <section className="flex flex-col items-center text-center pt-20 pb-14 gap-6">
            {/* Appel à films ouvert */}
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full" style={{ background: "var(--col-vi)" }}>
                <span className="f-mono text-[9px] tracking-[0.2rem] uppercase text-white/60">
                    Appel à films ouvert · Marseille 2026
                </span>
            </div>

            {/* Sous-titre */}
            <p className="f-mono text-[9px] tracking-[0.2rem] uppercase text-white/25">
                Festiavl MarsAI // Courts-métrages
            </p>

            {/* Titre principal */}
            <h1 className="f-orb font-black leading-none tracking-tight">
                <span className="block text-5xl md:text-7xl text-white">
                    IMAGINEZ
                </span>
                <span className="block text-5xl md:text-7xl" style={{ color: "rgba(255, 255, 255, .3)" }}>
                    DES FUTURS
                </span>
            </h1>
            <p className="block text-5xl md:text-7xl" style={{
                background: "linear-gradient(90deg, var(--col-vi), var(--col-or))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
            }}>
                SOUHAITABLES
            </p>

            {/* Description */}
            <p className="f-mono text-[11px] text-white/35 max-w-sm leading-relaxed">
                Courts-métrages 1-2 min entièrement générés par intelligence artificielle.
                <br />Ouvert à tous. Sans inscription.
            </p>

            {/* Bouton */}
            <Button
                asChild
                className="f-orb group relative overflow-hidden rounded-full px-8 text-xs font-bold uppercase tracking-widest text-white transition-all duration-300"
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
    )
}

// Compteur
function CountdownSection() {
    const time = useCountdown();
    return (
        <section className="pb-16">
            <div className="grid md:grid-cols-2 gap-4">

                {/* Compte à rebours */}
                <div className="rounded-xl p-5 space-y-5" style={{
                    border: "1px solid rgba(255,255, 255, .08)",
                    background: "rgba(255,255,255,.03)"
                }}>
                    <div className="flex items-center justify-between">
                        <span className="f-mono text-[8px] tracking-widest uppercase text-white/30">
                            Phase_01 // Actif
                        </span>
                        <span className="f-mono text-[8px] tracking-widest uppercase text-white/25">
                            Appel à films
                        </span>
                    </div>

                    <div className="flex justify-around">
                        <TimeBlock value={time.jours} label="Jours" />
                        <TimeBlock value={time.heures} label="Heures" />
                        <TimeBlock value={time.min} label="Min" />
                        <TimeBlock value={time.sec} label="Sec" />
                    </div>

                    <div className="rounded-xl p-5 space-y-3 border border-white/10" style={{
                        border: "1px solid rgba(125,113,251,.2)",
                        background: "rgba(125,113,251,.05)"
                    }}>
                        <div>
                            <span className="f-mono text-[8px] tracking-widest uppercase" style={{
                                color: "var(--col-vi)"
                            }}>
                                Appel à films
                            </span>
                            <span className="f-mono text-[8px] px-2 py-0.5 rounded-full" style={{
                                background: "rgba(125,113,251,.2)",
                                color: "var(--col-vi)",
                            }}>
                                En cours
                            </span>
                        </div>

                        {PANEL_ROWS.map(({ label, value }) => (
                            <div key={label}
                                className="flex items-center justify-between py-2 border-b"
                                style={{
                                    borderColor: "rgba(255,255,255,.06)"
                                }}>
                                <span className="f-mono text-[9px] text-white/35">
                                    {label}
                                </span>
                                <span className="f-mono text-[9px] text-white/35">
                                    {value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section >
    );
}

// Stats
function StatsSection() {
    return (
        <section className="pb-16">
            <div className="grid grid-cols-3 gap-4 text-center">
                {MAIN_STATS.map(({ value, label }) => (
                    <div key={label} className="flex flex-col items-center gap-1">
                        <span
                            className="f-orb text-3xl md:text-4xl font-black"
                            style={{
                                background: "linear-gradient(90deg, var(--col-vi), var(--col-or))",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            {value}
                        </span>
                        <span className="f-mono text-[9px] tracking-widest uppercase text-white/30">
                            {label}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
}

// Tags
function TagsSection() {
    return (
        <section className="pb-20">
            <div className="grid md:grid-cols-2 gap-4">

                {/* Colonne gauche */}
                <div className="rounded-xl p-6 space-y-5" style={{
                    border: "1px solid rgba(255, 255, 255, .07)",
                    background: "rgba(255, 255, 255, .02)"
                }}>
                    <p className="f-mono text-[8px] tracking-widest uppercase text-white/25">
                        La Plateforme · Mobile Film Festival
                    </p>
                    <h2 className="f-orb text-xl font-bold text-white leading-snug">
                        L'IA au service de
                    </h2>
                    <h2 className="f-orb text-xl font-bold leading-snug" style={{
                        background: "linear-gradient(90deg, var(--col-vi), var(--col-or))",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}>
                        La création cinématographique
                    </h2>
                </div>

                {/* Description */}
                <p className="f-mono text-[10px] text-white/40 leading-relaxed">
                    MarsAI place l'humain au coeur de la création assistée par IA.
                    Stimulez votre créativité via le format court et rejoignez une communauté internationale autour de l'IA générative.
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                    {TAGS.map((tag) => (
                        <span
                            key={tag}
                            className="f-mono text-[8px] tracking-wider px-2.5 py-1 rounded-full"
                            style={{
                                border: "1 px solid rgba(255, 255, 255, .1)",
                                background: "rgba(255, 255, 255, .03)",
                                color: "rgba(255, 255, 255, .4)"
                            }}>
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* Colonne de droite */}
            <div className="flex flex-col gap-3">
                {MAIN_STATS.map(({ value, label }) => (
                    <div
                        key={label}
                        className="flex-1 rounded-xl flex flex-col items-center justify-center py-5"
                        style={{
                            border: "1px solid rgba(255,255,255,.07)",
                            background: "rgba(255,255,255,.02)",
                        }}
                    >
                        <span
                            className="f-orb text-3xl font-black"
                            style={{
                                background: "linear-gradient(90deg, var(--col-vi), var(--col-or))",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            {value}
                        </span>
                        <span className="f-mono text-[8px] tracking-widest uppercase text-white/30 mt-1">
                            {label}
                        </span>
                    </div>
                ))}

                <div className="rounded-xl px-5 py-4" style={{
                    background: "rgba(125,113,251,.02)",
                    border: "1 px solid rgba(125,113,251,.07)",
                }}>
                    <p className="f-orb text-[10px] font-bold tracking-wider" style={{
                        background: "linear-gradient(90deg, var(--col-vi), var(--col-or))",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}>
                        "IMAGINEZ DES FUTURS SOUHAITABLES"
                    </p>
                </div>
            </div>
        </section>
    )
}

// Partenaires
function PartnersSection() {
    return (
        <section className="pb-16">
            <div className="w-full h-px mb-10" style={{
                background: "rgba(255, 255, 255, .06)"
            }}>
                <div className="flex flex-col sm-flex-row items-center justify-center gap-10">

                    {/* Logo La Plateforme */}
                    <div className="flex items-center gap-2 opacity-50 hover:opacity-80 transition-opacity cursor-pointer">
                        <span className="f-orb text-base font-bold text-white tracking-wide">

                        </span>
                    </div>

                    <div className="hidden sm:block w-px h-8" style={{
                        background: "rgba(255, 255, 255, .1)"
                    }}>

                        {/* Logo Mobile Film Festival */}
                        <div className="flex items-center gap-2 opacity-50 hover:opacity-80 transition-opacity cursor-pointer">
                            <div className="flex items-center gap-2 opacity-50 hover:opacity-80transition-opacity cursor-pointer" style={{
                                background: "linear-gradient(135deg, var(--col-vi), var(--col-or))",
                            }}>
                                <span className="f-orb text-[10px] font-black text-black">

                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

