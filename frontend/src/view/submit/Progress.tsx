import React from "react";
import { User, Clapperboard, Folder, ClipboardCheck, Check } from "lucide-react";

interface ProgressProps {
    currentStep: number;
}

export default function Progress({ currentStep }: ProgressProps) {
    const etapes = [
        { num: 1, label: "Auteure / Auteur", Icon: User },
        { num: 2, label: "Film", Icon: Clapperboard },
        { num: 3, label: "Fichiers", Icon: Folder },
        { num: 4, label: "Consentements", Icon: ClipboardCheck },
    ];

    return (
        <div className="mb-5 sm:mb-7 px-2 sm:px-4 md:px-8 lg:px-[4.5rem]">
            <div className="relative flex items-start">
                {etapes.map((step, index) => {
                    const isActive = currentStep === step.num;
                    const isCompleted = currentStep > step.num;
                    const Icon = step.Icon;

                    return (
                        <React.Fragment key={step.num}>
                            <div className="relative z-10 w-7 sm:w-8 md:w-10 shrink-0 flex flex-col items-center gap-1.5 sm:gap-2.5">
                                <div
                                    className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-[12px] sm:rounded-[14px] flex items-center justify-center transition-all"
                                    style={{
                                        border: isCompleted
                                            ? "1px solid rgba(255,255,255,.06)"
                                            : isActive
                                                ? "1px solid rgba(125,113,251,.95)"
                                                : "1px solid rgba(255,255,255,.14)",
                                        background: isCompleted
                                            ? "linear-gradient(135deg, rgba(125,113,251,.95) 0%, rgba(255,92,53,.95) 100%)"
                                            : isActive
                                                ? "rgba(125,113,251,.2)"
                                                : "rgba(255,255,255,.02)",
                                        boxShadow: isCompleted
                                            ? "0 0 0 2px rgba(125,113,251,.14), 0 0 18px rgba(255,92,53,.25)"
                                            : isActive
                                                ? "0 0 0 2px rgba(125,113,251,.11), 0 0 16px rgba(125,113,251,.26)"
                                                : "none",
                                    }}
                                >
                                    {isCompleted ? (
                                        <Check size={12} strokeWidth={2.7} style={{ color: "rgba(255,255,255,.98)" }} />
                                    ) : (
                                        <Icon
                                            size={12}
                                            strokeWidth={2.2}
                                            style={{
                                                color: isActive ? "rgba(255,255,255,.96)" : "rgba(255,255,255,.72)",
                                            }}
                                        />
                                    )}
                                </div>

                                <span
                                    className="f-mono text-[7px] sm:text-[8px] md:text-[9px] tracking-[0.22em] uppercase text-center whitespace-nowrap"
                                    style={{
                                        color: isCompleted
                                            ? "rgba(255,255,255,.36)"
                                            : isActive
                                                ? "rgba(163,151,255,.98)"
                                                : "rgba(255,255,255,.24)",
                                    }}
                                >
                                    {step.label}
                                </span>
                            </div>

                            {index < etapes.length - 1 && (
                                <div
                                    className="flex-1 h-px mt-3.5 sm:mt-5 mx-2 sm:mx-4 md:mx-6"
                                    style={{
                                        background:
                                            currentStep > step.num
                                                ? "linear-gradient(90deg, rgba(125,113,251,.95) 0%, rgba(255,92,53,.95) 100%)"
                                                : "rgba(255,255,255,.11)",
                                    }}
                                />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
}
