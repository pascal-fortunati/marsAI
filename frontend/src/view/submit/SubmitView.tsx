import React, { useState } from "react";
import Progress from "./Progress";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Confirmation from "./Confirmation";
import { Combobox } from "../../components/ui/combobox";
import * as Flags from "country-flag-icons/react/3x2";
import { marsaiGradients } from "../../theme/marsai";

function AccentTitle({ children }: { children: React.ReactNode }) {
    return (
        <span
            className="bg-clip-text text-transparent"
            style={{
                backgroundImage: marsaiGradients.primaryToAccent,
                backgroundSize: "200% auto",
                animation: "shimText 3s linear infinite",
            }}
        >
            {children}
        </span>
    );
}

export function SubmitView() {
    const [step, setStep] = useState(1);
    const goNext = () => setStep((s) => Math.min(s + 1, 5));
    const goPrev = () => setStep((s) => Math.max(s - 1, 1));

    if (step === 5) {
        return (
            <div className="min-h-screen relative overflow-hidden">
                <Confirmation
                    submissionId="9adf0ea3-59d3-4eb1-9324-1519e4f11152"
                    email="pauline.alex@laplateforme.io"
                    onHome={() => setStep(1)}
                    onSubmitAnother={() => setStep(1)}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen relative overflow-hidden">

            <div className="relative mx-auto max-w-6xl px-5 py-12">

                {/* Soumission - Courts-métrages IA */}
                <div className="flex items-center gap-2 mb-6">
                    <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: "var(--col-vi)" }}></span>

                    <span className="f-mono text-sm tracking-widest uppercase text-white">Soumission - Courts-métrages IA
                    </span>
                </div>

                {/* Titre principal Soumettre */}
                <h1 className="f-orb text-3xl md:text-4xl font-bold tracking-tight mb-1">Soumettre{" "}

                    <AccentTitle>
                        UN FILM
                    </AccentTitle>
                </h1>

                <p className="f-mono text-[11px] text-white/25 mb-8 tracking-wide">
                    Aucune inscription. Délai max : 2 minutes.
                </p>

                { /* Barre de progression */}
                <Progress currentStep={step} />

                { /* Formulaire */}
                <div className="rounded-xl p-6 mt-2" style={{ background: "var(--col-bg-2)", border: "1px solid var(--col-bg-3)", backdropFilter: "blur(8px)" }}>

                    {step === 1 && <Step1 onNext={goNext} />}
                    {step === 2 && <Step2 onNext={goNext} onPrev={goPrev} />}
                    {step === 3 && <Step3 onNext={goNext} onPrev={goPrev} />}
                    {step === 4 && <Step4 onSubmit={goNext} onPrev={goPrev} />}
                </div>

            </div>
        </div>

    );
}

