import { FormField } from "../../components/FormField";
import { useState } from "react";
import { Combobox } from "../../components/ui/combobox";

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

const COUNTRY_OPTIONS = COUNTRIES.map((country) => ({ value: country, label: country }));
const LANGUAGE_OPTIONS = LANGUAGES.map((language) => ({ value: language, label: language }));
const CATEGORY_OPTIONS = CATEGORIES.map((category) => ({ value: category, label: category }));

export default function Step2({ onNext, onPrev }: Step2Props) {
    const [synopsisLen, setSynopsisLen] = useState(0);
    const [selectedTools, setSelectedTools] = useState<string[]>([]);
    const [customTool, setCustomTool] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [rights, setRights] = useState(false);
    const [productionCountry, setProductionCountry] = useState("");
    const [language, setLanguage] = useState("");
    const [category, setCategory] = useState("");

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

    const toggleTag = (tag: string) => {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]
        );
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
                    <Combobox
                        value={productionCountry}
                        onChange={setProductionCountry}
                        options={COUNTRY_OPTIONS}
                        placeholder="Sélectionner..."
                    />
                </FormField>
                <FormField label="Langue" required>
                    <Combobox
                        value={language}
                        onChange={setLanguage}
                        options={LANGUAGE_OPTIONS}
                        placeholder="Sélectionner..."
                    />
                </FormField>
                <FormField label="Catégorie" required>
                    <Combobox
                        value={category}
                        onChange={setCategory}
                        options={CATEGORY_OPTIONS}
                        placeholder="Sélectionner..."
                    />
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

            {/* Tags sémantiques */}
            <FormField label="Tags sémantiques (lien avec 'futurs souhaitables')" required>
                <div className="flex flex-wrap gap-2 mt-1">
                    {TAGS.map((tag) => {
                        const active = selectedTags.includes(tag);
                        return (
                            <button
                                key={tag}
                                type="button"
                                onClick={() => toggleTag(tag)}
                                className="f-mono text-[9px] tracking-wider px-2.5 py-1 rounded-full border transition-all"
                                style={{
                                    borderColor: active ? "var(--col-or)" : "rgba(255,255,255,.12)",
                                    background: active ? "rgba(255,92,53,.12)" : "rgba(255,255,255,.03)",
                                    color: active ? "var(--col-or)" : "rgba(255,255,255,.45)",
                                }}
                            >
                                {tag}
                            </button>
                        );
                    })}
                </div>
            </FormField>

            {/* Mentions musiques et sons */}
            <FormField label="Mentions des musiques et sons" required>
                <textarea
                    className="submit-input resize-none h-20"
                    placeholder="> Ex. Musique générée par Suno AI. Sons : ElevenLabs + bibliothèque libre de droits"
                />
            </FormField>

            {/* Checkbox droits */}
            <label className="flex items-start gap-3 cursor-pointer group">
                <div
                    className="mt-0.5 w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-all"
                    style={{
                        borderColor: rights ? "var(--col-vi)" : "rgba(255,255,255,.2)",
                        background: rights ? "rgba(125,113,251,.2)" : "transparent",
                    }}
                    onClick={() => setRights((r) => !r)}
                >
                    {rights && (
                        <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                            <path d="M1 3L3 5L7 1" stroke="var(--col-vi)" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    )}
                </div>
                <span className="f-mono text-[10px] text-white/50 leading-relaxed">
                    Je confirme détenir l'ensemble des droits sur les éléments soumis (images, sons, musiques, voix)
                    et être en mesure de les céder pour la durée du festival.{" "}
                    <span style={{ color: "var(--col-or)" }}>*</span>
                </span>
            </label>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-2">
                <button
                    onClick={onPrev}
                    className="f-mono text-[10px] tracking-widest uppercase px-5 py-2.5 rounded-xl transition-opacity hover:opacity-70"
                    style={{ border: "1px solid rgba(255,255,255,.15)", color: "rgba(255,255,255,.4)" }}
                >
                    ← Précédent
                </button>
                <button onClick={onNext} className="f-mono text-[11px] tracking-widest uppercase px-6 py-3 rounded-xl text-white font-bold transition-all hover:opacity-90 active-scale-95" style={{ background: "linear-gradient(90deg, var(--col-vi), var(--col-or))" }}>
                    Étape suivante →
                </button>

            </div>

        </div>
    )
}

