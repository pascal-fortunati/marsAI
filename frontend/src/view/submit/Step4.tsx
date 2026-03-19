import React, { useState } from "react";
import { Rocket, AlertTriangle, Loader2 } from "lucide-react";

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
}

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
      <>
        J'ai lu et j'accepte le{" "}
        <a href="#" className="underline" style={{ color: "var(--col-vi)" }}>
          règlement du festival marsAI 2026
        </a>
        . Je confirme que mon film respecte les conditions d'éligibilité (1–2 min, 100% IA générative).
      </>
    ),
  },
  {
    id: "promo",
    required: true,
    text: "J'autorise l'organisation MarsAI (La Plateforme . Mobile Film Festival) à utiliser des extraits de mon film à des fins promotionnelles (réseaux sociaux, presse, site web) pendant la durée du festival.",
  },
  {
    id: "diffusion",
    required: true,
    text: "Je délègue les droits de diffusion de mon film à l'organisation MarsAI pour la durée du festival (projection publique, mise en ligne sur la chaîne Youtube officielle MarsAI).",
  },
  {
    id: "newsletter",
    required: false,
    text: "J'accepte de recvoir la newsletter MarsAI et les communication du festival (optionnel).",
  },
];

export default function Step4({
  onSubmit,
  onPrev,
  filmSummary = DEFAULT_SUMMARY,
}: Step4Props) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [showValidation, setShowValidation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggle = (id: string) =>
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  // Tous les consentements obligatoires doivent être cochés
  const canSubmit = CONSENTS.filter((c) => c.required).every((c) => checked[c.id]);

  const handleSubmit = () => {
    setShowValidation(true);

    if (canSubmit) {
      setIsSubmitting(true);
      onSubmit();
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">

      <style>{`
        @keyframes submitHaloPulse {
          0% {
            box-shadow: 0 0 0 0 rgba(255,255,255,.2), 0 0 0 0 rgba(125,113,251,.38), 0 0 12px 2px rgba(255,255,255,.18);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(255,255,255,0), 0 0 0 16px rgba(125,113,251,0), 0 0 30px 8px rgba(255,255,255,.28);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(255,255,255,.2), 0 0 0 0 rgba(125,113,251,.38), 0 0 12px 2px rgba(255,255,255,.18);
          }
        }
      `}</style>

      {/* En-tête étape */}
      <div className="flex items-center gap-3 sm:gap-4 pb-2">
        <span className="f-mono text-[10px] sm:text-[11px] tracking-[0.28em] uppercase shrink-0" style={{ color: "rgba(162, 151, 255, .9)" }}>
          Étape 4/4
        </span>
        <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, rgba(125,113,251,.55) 0%, rgba(125,113,251,.22) 55%, rgba(5,3,13,0) 100%)" }} />
        <span className="f-orb text-xs sm:text-sm md:text-[15px] leading-none tracking-[0.03em] uppercase text-white whitespace-nowrap shrink-0">
          Consentements
        </span>
      </div>

      {/* Récapitulatif du film */}
      <div
        className="rounded-lg sm:rounded-xl px-3 sm:px-5 py-3 sm:py-4 space-y-2"
        style={{ border: "1px solid rgba(255,255,255,.08)", background: "rgba(255,255,255,.02)" }}
      >
        <p className="f-mono text-[8px] sm:text-[9px] tracking-widest uppercase text-white/25 mb-2 sm:mb-3">
          &gt; Récapitulatif de soumission
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-2 sm:gap-y-3 gap-x-3 sm:gap-x-6">
          {[
            ["Film", filmSummary.film],
            ["Réalisateur", filmSummary.realisateur],
            ["Durée", filmSummary.duree],
            ["Pays", filmSummary.pays],
            ["Catégorie", filmSummary.categories],
            ["Outils IA", filmSummary.outills],
          ].map(([key, val]) => (
            <div key={key}>
              <span className="f-mono text-[8px] tracking-widest uppercase text-white/25 block">
                {key}
              </span>
              <span className="f-mono text-[10px] text-white/65">{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Checkboxes de consentement */}
      <div className="space-y-2 sm:space-y-3">
        {CONSENTS.map((consent) => (
          (() => {
            const missingRequired = consent.required && !checked[consent.id];

            return (
              <label
                key={consent.id}
                onClick={() => toggle(consent.id)}
                className="flex items-start gap-2 sm:gap-3 cursor-pointer rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 transition-all"
                style={{
                  border: `1px solid ${showValidation && missingRequired ? "rgba(255, 92, 53, .65)" : checked[consent.id] ? "rgba(125,113,251,.25)" : "rgba(255,255,255,.07)"}`,
                  background: checked[consent.id] ? "rgba(125,113,251,.05)" : showValidation && missingRequired ? "rgba(255, 92, 53, .04)" : "rgba(255,255,255,.02)",
                }}
              >
                {/* Case à cocher custom */}
                <div
                  className="mt-0.5 w-4 h-4 rounded-[4px] border shrink-0 flex items-center justify-center transition-all"
                  style={{
                    borderColor: showValidation && missingRequired ? "rgba(255, 92, 53, .8)" : checked[consent.id] ? "transparent" : "rgba(255,255,255,.2)",
                    background: checked[consent.id] ? "linear-gradient(135deg, rgba(125,113,251,.98) 0%, rgba(255,92,53,.98) 100%)" : showValidation && missingRequired ? "rgba(255, 92, 53, .08)" : "transparent",
                  }}
                >
                  {checked[consent.id] && (
                    <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                      <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  )}
                </div>

                <span className="f-mono text-[9px] sm:text-[10px] text-white/50 leading-relaxed">
                  {consent.text}
                  {consent.required && (
                    <span className="ml-1" style={{ color: showValidation && missingRequired ? "rgba(255, 92, 53, .95)" : "var(--col-or)" }}>*</span>
                  )}
                </span>
              </label>
            );
          })()
        ))}
      </div>

      {/* Avertissement final */}
      <div
        className="flex items-start gap-2 sm:gap-3 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3"
        style={{ border: "1px solid rgba(255,255,255,.07)", background: "rgba(255,255,255,.02)" }}
      >
        <AlertTriangle size={13} className="shrink-0 mt-0.5" style={{ color: "var(--col-or)" }} />
        <p className="f-mono text-[8px] sm:text-[9px] text-white/35 leading-relaxed">
          Un email de confirmation sera envoyé à{" "}
          <span style={{ color: "var(--col-vi)" }}>pauline.alex@laplateforme.io</span>.
          Votre film sera examiné par le jury international marsAI 2025.
        </p>
      </div>

      {/* Navigation */}
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center pt-2 sm:pt-4">
        <button
          onClick={onPrev}
          className="f-mono text-[10px] sm:text-[9px] tracking-widest uppercase px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-opacity hover:opacity-70 w-full sm:w-auto"
          style={{ border: "1px solid rgba(255,255,255,.15)", color: "rgba(255,255,255,.4)" }}
        >
          ← Précédent
        </button>
        <div className="relative w-full sm:w-auto">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="relative z-10 f-mono text-[10px] sm:text-[11px] tracking-widest uppercase px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold transition-all hover:opacity-90 active:scale-95 flex items-center justify-center gap-2 w-full sm:w-auto"
            style={{
              background: !isSubmitting
                ? "linear-gradient(90deg, var(--col-vi), var(--col-or))"
                : "rgba(255,255,255,.1)",
              color: !isSubmitting ? "white" : "rgba(255,255,255,.3)",
              cursor: !isSubmitting ? "pointer" : "not-allowed",
              animation: !isSubmitting ? "submitHaloPulse 3.6s cubic-bezier(0.4, 0, 0.2, 1) infinite" : "none",
            }}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={13} className="animate-spin" /> SOUMISSION...
              </>
            ) : (
              <>
                <Rocket size={13} /> Soumettre le film
              </>
            )}
          </button>
        </div>
      </div>

      <p className="f-mono text-[9px] text-white/25 tracking-wide text-center">
        Aucune modification possible après soumission · Les champs sont mémorisés sur cet appareil
      </p>

    </div>
  );
}