import React, { useState } from "react";
import { Rocket, AlertTriangle } from "lucide-react";

interface Step4Props {
    onSubmit: () => void;
    onPrev: () => void;


    filmSummary?: {
        film: string;
        pays: string;
        categories: string;
        realisateur: string;
        duree: string;
        outills: string;
    };


const DEFAULT_SUMMARY = {
    film: "",
    pays: "",
    categories: "",
    realisateur: "",
    duree: "",
    outills: ""
};

interface ConsentItem {
    id: string;
    text: React.ReactNode;
    required: boolean;
}

const CONSENTS: ConsentItem[] = [
    {
        id: "rules",
        required: true,
        text: (
            <>J'ai lu et j'accepte les{" "}
                <a href="#" className="underline" style={{ color: "var(--col-vi)" }}>
                    règlement du festival MarsAI 2026
                </a>
                . Je confirme que mon film respecte les conditions d'éligibilité (1-2 min, 100% IA générative)
            </>
           }
]