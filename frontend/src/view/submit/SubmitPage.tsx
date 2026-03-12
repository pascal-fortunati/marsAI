import React, { useState } from "react";
import Progress from "./Progress";
import Step1 from "./Step1";
import Step2 from "./Step2";

export default function SubmitPage() {
    const [step, setStep] = useState(1);
    const goNext = () => setStep((s) => Math.min(s + 1, 4));
    const goPrev = () => setStep((s) => Math.max(s - 1, 1));

    return (
        <div className="min-h-screen relative overflow-hidden" style={{ background: "var(--col-bg)" }}>

            <div className="pointer-events-none absolute inset-0" style={{
                background: `
            radial-gradient(ellipse 60% 40% at 15% 15%, rgba(125,113,251,0.07) 0%, transparent 70%),
            radial-gradient(ellipse 50% 35% at 85% 85%, rgba(255,92,53,0.05) 0%, transparent 70%)
          `,
            }}>

            </div>

            <div className="relative z-10 max-3xl mx-auto px-4 py-10">

                {/* Soumission - Courts-métrages IA */}
                <div className="flex items-center gap-2 mb-6">
                    <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: "var(--col-vi)" }}></span>

                    <span className="f-mono text-sm tracking-widest uppercase text-white">Soumission - Courts-métrages IA
                    </span>
                </div>

                {/* Titre principal Soumettre */}
                <h1 className="f-orb text-3xl md:text-4xl font-bold tracking-tight mb-1">Soumettre{" "} <span
                    style={{
                        background: "linear-gradient(90deg, var(--col-vi), var(--col-or))",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    UN FILM
                </span></h1>

                <p className="f-mono text-[11px] text-white/25 mb-8 tracking-wide">
                    Aucune inscription. Délai max : 2 minutes.
                </p>

                { /* Barre de progression */}
                <Progress currentStep={step} />

                { /* Formulaire */}
                <div className="rounded-xl p-6 mt-2" style={{ background: "var(--col-bg-2)", border: "1px solid var(--col-bg-3)", backdropFilter: "blur(8px)" }}>

                    {step === 1 && <Step1 onNext={goNext} />}
                    {step === 2 && <Step2 onNext={goNext} onPrev={goPrev} />}
                </div>

            </div>
        </div>

    );
}

