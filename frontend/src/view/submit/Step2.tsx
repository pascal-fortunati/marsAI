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

const LANGUAGES = ["Français", "Anglais", "Espagnol", "Arabe", "Autre", "Sans dialogue"];

const CATEGORIES = ["Animation", "Documentaire", "Fiction", "Experimental", "Clip"];

const COUNTRIES = ["France", "Belgique", "Suisse", "Canada", "Autre"];

export default function Step2({ onNext, onPrev }: Step2Props) {
    const [synopsisLen, setSynopsisLen] = useState(0);
    const [selectedTools, setSelectedTools] = useState<string[]>([]);
    const [customTool, setCustomTool] = useState("");

    const toggleTool = (tool: string) => {
        setSelectedTools((prev) =>
            prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]
        );
    };

    const addCustomTool = () => {
        if (customTool.trim()) {
            setSelectedTools((prev) => [...prev, customTool.trim()]);
            setCustomTool("");
        }
    };

    return (
        <div className="space-y-6">

            {/* En-tête étape 2 */}
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <span className="f-mono text-sm tracking-widest text-white/30">Étape 2/4</span>
                <span className="f-mono text-sm tracking-widest uppercase" style={{ color: "var(--col-vi)" }}>Fiche Film</span>
            </div>

            {/* Titre, durée, synopsis */}
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

            {/* Pays de production, langue, catégorie */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField label="Pays de production" required>
                    <select className="submit-input">
                        <option value="">Sélectionner...</option>
                        {COUNTRIES.map((country) => (
                            <option key={country} value={country}>
                                {country}
                            </option>
                        ))}
                    </select>
                </FormField>
                <FormField label="Langue" required>
                    <select className="submit-input">
                        <option value="">Sélectionner...</option>
                        {LANGUAGES.map((language) => (
                            <option key={language} value={language}>
                                {language}
                            </option>
                        ))}
                    </select>
                </FormField>
                <FormField label="Catégorie" required>
                    <select className="submit-input">
                        <option value="">Sélectionner...</option>
                        {CATEGORIES.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </FormField>
            </div>

            {/* Outils IA utilisés */}
            <FormField label="Outils IA utilisés" required>
                <div className="flex flex-wrap gap-2 mt-1">
                    {AI_TOOLS.map((tool) => {
                        const active = selectedTools.includes(tool);
                        return (
                            <button key={tool} type="button" onClick={() => toggleTool(tool)} className="f-mono text-[9px] tracking-wider px-2.5 py-1 rounded-full border transition-all" style={{
                                borderColor: active ? "var(--col-vi)" : "rgba(255,255,255,.12)",
                                background: active ? "rgba(125,113,251,.15)" : "rgba(255,255,255,.03)",
                                color: active ? "var(--col-vi)" : "rgba(255,255,255,.45)"
                            }}>
                                {tool}
                            </button>
                        );
                    })}
                </div>
                <div className="flex gap-2 mt-2">
                    <input className="submit-input flex-1" placeholder="> Autre outil IA non listé..." value={customTool}
                        onChange={(e) => setCustomTool(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addCustomTool()} />
                    <button
                        type="button"
                        onClick={addCustomTool}
                        className="f-mono text-[9px] tracking-widest px-3 py-2 rounded-xl border transition-opacity hover:opacity-80"
                        style={{ borderColor: "rgba(125,113,251,.4)", color: "var(--col-vi)" }}
                    >
                        + Ajouter
                    </button>
                </div>
            </FormField>

        </div>
    )
}

