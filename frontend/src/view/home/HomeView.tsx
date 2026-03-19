import { Upload } from "lucide-react";
import { useCountdown, TimeBlock } from "./homeCounter";
import { MAIN_STATS, PANEL_ROWS, TAGS } from "./homeHelpers";
import { Stats } from "fs";
import { marsaiGradients } from "../../theme/marsai";

export default function HomeView() {
    return (
        <div className="relative z-10 max-w-3xl mx-auto px-4">
            <HeroSection />
            {/* <CountdownSection />
            <StatsSection />
            <TagsSection />
            <PartnersSection /> */}
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
            <h1 className="f-orb font-black lending-none tracking-tight">
                <span className="block text-5xl md:text-7xl text-white">
                    IMAGINEZ
                </span>
                <span className="block text-5xl md:text-7xl" style={{ color: "rgba(255, 255, 255, .3)" }}>
                    DES FUTURS
                </span>
            </h1>
            <p className="block text-5xl md:text-7xl" style={{
                background: "linear-gradient(90deg, var(--col-vi), var(--col-or)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
            }}>
                SOUHAITABLES
            </p>

            {/* Description */}
            <p className="f-mono text-[11px] text-white/35 max-w-sm lending-relaxed">
                Courts-métrages 1-2 min entièrement générés par intelligence artificielle.
                <br />Ouvert à tous. Sans inscription.
            </p>

            {/* Bouton */}
            <a href="/submit" className="f-orb group relative overflow-hidden rounded-full px-8 text-xs font-bold uppercase tracking-widest text-white transition-all duration-300" style={{
                background: marsaiGradients.primaryToAccent,
                animation: "pulseGlow 2.5s ease-in-out infinite",
            }}>
                <Upload size={13} />
                Soumettre un film
            </a>
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
                            MarsAI // Actif
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


                </div>
            </div>
        </section >
    )
}