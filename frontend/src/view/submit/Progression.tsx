import React from "react";

interface ProgressionProps {
    currentEtape: number;
}

export default function Progression({ currentEtape }: ProgressionProps) {
    const etapes = [
        { num: 1, label: "Auteure/Auteur" },
        { num: 2, label: "Film" },
        { num: 3, label: "Fichiers" },
        { num: 4, label: "Consentements" },
    ];

    return (
        <div className="flex items-center justify-between mb-6 px-4">
            {etapes.map((etape, index) => (
                <React.Fragment key={etape.num}>
                    {/* Cercle de l'étape */}
                    <div className="flex flex-col items-center gap-2">
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${currentEtape === etape.num
                                ? "bg-gradient-to-r from-[var(--col-vi)] to-[var(--col-or)] text-white scale-110"
                                : currentEtape > etape.num
                                    ? "bg-white/10 text-white/70"
                                    : "bg-white/5 text-white/30"
                                }`}
                        >
                            {etape.num}
                        </div>
                        <span
                            className={`f-mono text-xs ${currentEtape === etape.num ? "text-white" : "text-white/40"
                                }`}
                        >
                            {etape.label}
                        </span>
                    </div>

                    {/* Ligne de connexion */}
                    {index < etapes.length - 1 && (
                        <div className="flex-1 h-0.5 mx-2 bg-white/10">
                            <div
                                className="h-full bg-gradient-to-r from-[var(--col-vi)] to-[var(--col-or)] transition-all"
                                style={{
                                    width: currentEtape > etape.num ? "100%" : "0%",
                                }}
                            ></div>
                        </div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
}
