import { FormField } from "../../components/FormField";
import { useState } from "react";

interface Step2Props {
    onNext: () => void;
    onPrev: () => void;
}

const AI_TOOLS = [
    "Sora", "MidJourney", "RunwayML", "Pika", "Kling", "DALL-E 3",
    "Stable Diffusion", "Fluxchlabs", "Suno", "Udio", "Montage",
    "Luma AI", "Runway Gen-3", "Hygen", "D-ID", "Synthesia", "Autre"
];

const TAGS = [
    "Futur souhaitable", "Écologie", "Humanité & IA", "Solidarité",
    "Espoir", "Résilience", "Utopie", "Nature", "Paix",
    "Innovation sociale", "Diversité", "Éducation", "Santé", "Liberté", "Mémoire"
];

const LANGUAGE = ["Français", "Anglais", "Espagnol", "Arabe", "Autre", "Sans dialogue"];

const CATEGORIES = ["Animation", "Documentaire", "Fiction", "Experimental", "Clip"];

const COUNTRIES = ["France", "Belgique", "Suisse", "Canada", "Autre"];

export default function Step2({ onNext, onPrev }: Step2Props) {
    const [synopsisLen, setSynopsisLen] = useState(0);

    return (
        <div className="space-y-6">

            {/* En-tête étape 2 */}
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <span className="f-mono text-sm tracking-widest text-white/30">Étape 2/4</span>
                <span className="f-mono text-sm tracking-widest uppercase" style={{ color: "var(--col-vi)" }}>Fiche Film</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Titre du film" required>
                    <input className="submit-input" placeholder="> Titre de votre court-métrage" type="text" />
                </FormField>
                <FormField label="Durée exacte (ex. 1:30 ou 1')" required>
                    <input className="submit-input" placeholder="> 1:30" type="text" />
                </FormField>
            </div>

            <FormField label="Synopsis (max 180 caractères)" required>
                <div className="relative">
                    <textarea
                        className="submit-input resize-none h-28"
                        placeholder="> Décrivez votre film en quelques lignes..."
                        maxLength={180}
                        onChange={(e) => setSynopsisLen(e.target.value.length)}
                    />
                    <span className="absolute bottom-2 right-3 f-mono text-[9px] text-white/25">
                        {synopsisLen}/180
                    </span>
                </div>
            </FormField>

        </div>
    )
}

