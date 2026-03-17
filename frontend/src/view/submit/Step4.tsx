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
 
  const toggle = (id: string) =>
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
 
  // Tous les consentements obligatoires doivent être cochés
  const canSubmit = CONSENTS.filter((c) => c.required).every((c) => checked[c.id]);
 
  return (
    <div className="space-y-6">
 
      {/* En-tête étape */}
      <div className="flex justify-between items-center border-b border-white/10 pb-3">
        <span className="f-mono text-[9px] tracking-widest text-white/30">ÉTAPE 4/4</span>
        <span className="f-mono text-[9px] tracking-widest uppercase" style={{ color: "var(--col-vi)" }}>
          Consentements
        </span>
      </div>
 
      {/* Récapitulatif du film */}
      <div
        className="rounded-xl px-5 py-4 space-y-2"
        style={{ border: "1px solid rgba(255,255,255,.08)", background: "rgba(255,255,255,.02)" }}
      >
        <p className="f-mono text-[9px] tracking-widest uppercase text-white/25 mb-3">
          &gt; Récapitulatif de soumission
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6">
          {[
            ["Film",        filmSummary.film],
            ["Réalisateur", filmSummary.realisateur],
            ["Durée",       filmSummary.duree],
            ["Pays",        filmSummary.pays],
            ["Catégorie",   filmSummary.categories],
            ["Outils IA",   filmSummary.outills],
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
      <div className="space-y-3">
        {CONSENTS.map((consent) => (
          <label
            key={consent.id}
            onClick={() => toggle(consent.id)}
            className="flex items-start gap-3 cursor-pointer rounded-xl px-4 py-3 transition-all"
            style={{
              border: `1px solid ${checked[consent.id] ? "rgba(125,113,251,.25)" : "rgba(255,255,255,.07)"}`,
              background: checked[consent.id] ? "rgba(125,113,251,.05)" : "rgba(255,255,255,.02)",
            }}
          >
            {/* Case à cocher custom */}
            <div
              className="mt-0.5 w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-all"
              style={{
                borderColor: checked[consent.id] ? "var(--col-vi)" : "rgba(255,255,255,.2)",
                background: checked[consent.id] ? "rgba(125,113,251,.2)" : "transparent",
              }}
            >
              {checked[consent.id] && (
                <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                  <path d="M1 3L3 5L7 1" stroke="var(--col-vi)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              )}
            </div>
 
            <span className="f-mono text-[10px] text-white/50 leading-relaxed">
              {consent.text}
              {consent.required && (
                <span className="ml-1" style={{ color: "var(--col-or)" }}>*</span>
              )}
            </span>
          </label>
        ))}
      </div>
 
      {/* Avertissement final */}
      <div
        className="flex items-start gap-3 rounded-xl px-4 py-3"
        style={{ border: "1px solid rgba(255,92,53,.2)", background: "rgba(255,92,53,.04)" }}
      >
        <AlertTriangle size={14} className="shrink-0 mt-0.5" style={{ color: "var(--col-or)" }} />
        <p className="f-mono text-[9px] text-white/35 leading-relaxed">
          Aucune modification ne sera possible après soumission. Un email de confirmation sera envoyé à{" "}
          <span style={{ color: "var(--col-vi)" }}>pauline.alex@laplateforme.io</span>.
          Votre film sera examiné par le jury international marsAI 2025.
        </p>
      </div>
 
      {/* Navigation */}
      <div className="flex justify-between items-center pt-2">
        <button
          onClick={onPrev}
          className="f-mono text-[10px] tracking-widest uppercase px-5 py-2.5 rounded-xl transition-opacity hover:opacity-70"
          style={{ border: "1px solid rgba(255,255,255,.15)", color: "rgba(255,255,255,.4)" }}
        >
          ← Précédent
        </button>
        <button
          onClick={onSubmit}
          disabled={!canSubmit}
          className="f-mono text-[11px] tracking-widest uppercase px-6 py-3 rounded-xl font-bold transition-all hover:opacity-90 active:scale-95 flex items-center justify-center gap-2"
          style={{
            background: canSubmit 
              ? "linear-gradient(90deg, var(--col-vi), var(--col-or))" 
              : "rgba(255,255,255,.1)",
            color: canSubmit ? "white" : "rgba(255,255,255,.3)",
            cursor: canSubmit ? "pointer" : "not-allowed",
          }}
        >
          <Rocket size={14} /> Soumettre le film
        </button>
      </div>
 
    </div>
  );
}