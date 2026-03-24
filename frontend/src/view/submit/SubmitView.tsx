import React, { useEffect, useState } from "react";
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
import { submitFilm } from "../../lib/api";
import type { Step3Data } from "./submitType";

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
    const [confirmation, setConfirmation] = useState<{ id: string; email: string } | null>(null);

    useEffect(() => {
        const parsePossiblyEncoded = (raw: string) => {
            let current: unknown = raw;
            for (let i = 0; i < 4; i++) {
                if (typeof current !== "string") break;
                try {
                    current = JSON.parse(current);
                } catch {
                    break;
                }
            }
            return current;
        };

        const expectedBooleanKeys = new Set([
            "submit.step2.rights",
        ]);

        const expectedArrayKeys = new Set([
            "submit.step2.selectedTools",
            "submit.step2.selectedTags",
        ]);

        const expectedStringKeys = new Set([
            "submit.step1.fullName",
            "submit.step1.email",
            "submit.step1.phone",
            "submit.step1.birthDate",
            "submit.step1.address",
            "submit.step1.postalCode",
            "submit.step1.city",
            "submit.step1.country",
            "submit.step1.job",
            "submit.step1.howFound",
            "submit.step1.legalName",
            "submit.step1.legalEmail",
            "submit.step2.title",
            "submit.step2.duration",
            "submit.step2.synopsis",
            "submit.step2.customTool",
            "submit.step2.soundMentions",
            "submit.step3.videoUrl",
            "submit.step3.posterUrl",
            "submit.step3.subtitlesUrl",
            "submit.step3.submissionId",
        ]);

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (!key || !key.startsWith("submit.step")) continue;

            const raw = localStorage.getItem(key);
            if (raw === null) continue;

            const parsed = parsePossiblyEncoded(raw);
            let normalized: unknown = parsed;

            if (expectedBooleanKeys.has(key)) {
                normalized = parsed === true;
            } else if (expectedArrayKeys.has(key)) {
                normalized = Array.isArray(parsed)
                    ? parsed.filter((item) => typeof item === "string")
                    : [];
            } else if (expectedStringKeys.has(key)) {
                normalized = typeof parsed === "string" ? parsed : String(parsed ?? "");
            }

            const serialized = JSON.stringify(normalized);
            if (serialized !== raw) {
                localStorage.setItem(key, serialized);
            }
        }
    }, []);

    const goNext = () => setStep((s) => Math.min(s + 1, 5));
    const goPrev = () => setStep((s) => Math.max(s - 1, 1));

    const handleStep3Next = (data: Step3Data) => {
        localStorage.setItem("submit.step3.submissionId", JSON.stringify(data.submission_id));
        localStorage.setItem("submit.step3.videoUrl", JSON.stringify(data.video_url));
        localStorage.setItem("submit.step3.posterUrl", JSON.stringify(data.poster_url));
        localStorage.setItem("submit.step3.subtitlesUrl", JSON.stringify(data.subtitles_url));
        goNext();
    };

    const toDurationSeconds = (raw: string) => {
        const value = raw.trim();
        if (!value) return 0;

        if (value.includes(":")) {
            const [minutesRaw, secondsRaw] = value.split(":");
            const minutes = Number.parseInt(minutesRaw, 10);
            const seconds = Number.parseInt(secondsRaw, 10);
            if (Number.isFinite(minutes) && Number.isFinite(seconds)) {
                return Math.max(0, minutes * 60 + seconds);
            }
        }

        if (value.endsWith("'")) {
            const minutes = Number.parseInt(value.replace("'", ""), 10);
            if (Number.isFinite(minutes)) return Math.max(0, minutes * 60);
        }

        const asNumber = Number.parseInt(value, 10);
        return Number.isFinite(asNumber) ? Math.max(0, asNumber) : 0;
    };

    const readStored = (key: string) => {
        try {
            const raw = localStorage.getItem(key);
            if (raw === null) return "";
            const parsed = JSON.parse(raw);
            return typeof parsed === "string" ? parsed : String(parsed ?? "");
        } catch {
            return "";
        }
    };

    const readStoredBoolean = (key: string) => {
        try {
            const raw = localStorage.getItem(key);
            if (raw === null) return false;
            const parsed = JSON.parse(raw);
            return parsed === true;
        } catch {
            return false;
        }
    };

    const readStoredJsonArray = (key: string) => {
        try {
            const raw = localStorage.getItem(key);
            if (!raw) return [] as string[];
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
        } catch {
            return [] as string[];
        }
    };

    const handleSubmit = async () => {
        const payload = {
            submission_id: readStored("submit.step3.submissionId"),
            director_name: readStored("submit.step1.fullName"),
            director_email: readStored("submit.step1.email"),
            director_phone: readStored("submit.step1.phone"),
            director_birthdate: readStored("submit.step1.birthDate"),
            director_street: readStored("submit.step1.address"),
            director_zip: readStored("submit.step1.postalCode"),
            director_city: readStored("submit.step1.city"),
            director_country: readStored("submit.step1.country"),
            director_job: readStored("submit.step1.job"),
            discovery_source: readStored("submit.step1.howFound"),
            legal_ref_name: readStored("submit.step1.legalName"),
            legal_ref_email: readStored("submit.step1.legalEmail"),
            title: readStored("submit.step2.title"),
            synopsis: readStored("submit.step2.synopsis"),
            duration_seconds: toDurationSeconds(readStored("submit.step2.duration")),
            country: readStored("submit.step2.country"),
            language: readStored("submit.step2.language"),
            category: readStored("submit.step2.category"),
            ai_tools: readStoredJsonArray("submit.step2.selectedTools"),
            semantic_tags: readStoredJsonArray("submit.step2.selectedTags"),
            music_credits: readStored("submit.step2.soundMentions"),
            rights_confirmed: readStoredBoolean("submit.step2.rights"),
            video_url: readStored("submit.step3.videoUrl"),
            poster_url: readStored("submit.step3.posterUrl"),
            subtitles_url: readStored("submit.step3.subtitlesUrl"),
            consent_rules: true,
            consent_promo: true,
            consent_newsletter: false,
            consent_copyright: true,
        };

        const result = await submitFilm(payload);
        setConfirmation(result);
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
                    submissionId={confirmation?.id ?? ""}
                    email={confirmation?.email ?? ""}
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
                    {step === 3 && <Step3 onNext={handleStep3Next} onPrev={goPrev} />}
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

