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
import { Check } from "lucide-react";

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
    const [showNotification, setShowNotification] = useState(false);

    const goNext = () => setStep((s) => Math.min(s + 1, 5));
    const goPrev = () => setStep((s) => Math.max(s - 1, 1));

    const handleSubmit = () => {
        setShowNotification(true);
        goNext();
        // Auto-hide after 5 seconds
        setTimeout(() => setShowNotification(false), 5000);
    };

    if (step === 5) {
        return (
            <div className="min-h-screen relative overflow-hidden">
                {/* Notification */}
                {showNotification && (
                    <div
                        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 mx-2 sm:mx-0"
                        style={{
                            animation: "slideInDown 0.3s ease-out forwards",
                        }}
                    >
                        <style>{`
                            @keyframes slideInDown {
                                from {
                                    opacity: 0;
                                    transform: translateY(-20px);
                                }
                                to {
                                    opacity: 1;
                                    transform: translateY(0);
                                }
                            }
                        `}</style>
                        <div
                            className="rounded-lg sm:rounded-xl px-4 py-3 sm:px-5 sm:py-4 flex items-start gap-2 sm:gap-3"
                            style={{
                                border: "1px solid rgba(0, 237, 143, .35)",
                                background: "rgba(0, 237, 143, .08)",
                                backdropFilter: "blur(8px)",
                            }}
                        >
                            <div
                                className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                                style={{ background: "rgba(0, 237, 143, .95)" }}
                            >
                                <Check size={12} className="text-black font-bold" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="f-orb text-[12px] sm:text-[14px] md:text-[15px] font-bold text-white">
                                    Film reçu
                                </p>
                                <p className="f-mono text-[9px] sm:text-[10px] text-white/65">
                                    Votre film est bien enregistré. Un email de confirmation a été envoyé.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
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

            <div className="relative mx-auto max-w-6xl px-4 sm:px-5 py-6 sm:py-10 md:py-12">

                <div className="px-4 sm:px-6">
                    {/* Soumission - Courts-métrages IA */}
                    <div className="flex items-center gap-2 mb-4 sm:mb-6">
                        <span className="inline-block w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full" style={{ background: "var(--col-vi)" }}></span>

                        <span className="f-mono text-xs sm:text-sm tracking-widest uppercase text-white">Soumission - Courts-métrages IA
                        </span>
                    </div>

                    {/* Titre principal Soumettre */}
                    <h1 className="f-orb text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-1 leading-tight">Soumettre{" "}

                        <AccentTitle>
                            UN FILM
                        </AccentTitle>
                    </h1>

                    <p className="f-mono text-[10px] sm:text-[11px] text-white/25 mb-4 sm:mb-8 tracking-wide">
                        Aucune inscription. Délai max : 2 minutes.
                    </p>
                </div>

                { /* Barre de progression */}
                <Progress currentStep={step} />

                { /* Formulaire */}
                <div className="rounded-lg sm:rounded-xl p-4 sm:p-6 mt-2" style={{ background: "var(--col-bg-2)", border: "1px solid var(--col-bg-3)", backdropFilter: "blur(8px)" }}>

                    {step === 1 && <Step1 onNext={goNext} />}
                    {step === 2 && <Step2 onNext={goNext} onPrev={goPrev} />}
                    {step === 3 && <Step3 onNext={goNext} onPrev={goPrev} />}
                    {step === 4 && <Step4 onSubmit={handleSubmit} onPrev={goPrev} />}
                </div>

            </div>

            {/* Notification */}
            {showNotification && (
                <div
                    className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 mx-2 sm:mx-0"
                    style={{
                        animation: "slideInDown 0.3s ease-out forwards",
                    }}
                >
                    <style>{`
                        @keyframes slideInDown {
                            from {
                                opacity: 0;
                                transform: translateY(-20px);
                            }
                            to {
                                opacity: 1;
                                transform: translateY(0);
                            }
                        }
                    `}</style>
                    <div
                        className="rounded-lg sm:rounded-xl px-4 py-3 sm:px-5 sm:py-4 flex items-start gap-2 sm:gap-3"
                        style={{
                            border: "1px solid rgba(0, 237, 143, .35)",
                            background: "rgba(0, 237, 143, .08)",
                            backdropFilter: "blur(8px)",
                        }}
                    >
                        <div
                            className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                            style={{ background: "rgba(0, 237, 143, .95)" }}
                        >
                            <Check size={12} className="text-black font-bold" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="f-orb text-[12px] sm:text-[14px] md:text-[15px] font-bold text-white">
                                Film reçu
                            </p>
                            <p className="f-mono text-[9px] sm:text-[10px] text-white/65">
                                Votre film est bien enregistré. Un email de confirmation a été envoyé.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>

    );
}

