import { FormField } from "../../components/FormField";
import { useState } from "react";
import { Combobox } from "../../components/ui/combobox";
import * as Flags from "country-flag-icons/react/3x2";
import type { ComponentType } from "react";
import { FR_COUNTRY_NAMES, getCountryCode, getLanguageFlagCode } from "../../lib/countryMapping";
import { useLocalStorageState } from "../../lib/useLocalStorageState";

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

const CATEGORIES = ["Fiction", "Documentaire", "Expérimental", "Animation", "Poètique", "Contemplatif", "Autre"];

const COUNTRY_NAMES_WITH_FRANCE_FIRST = FR_COUNTRY_NAMES.includes("France")
    ? ["France", ...FR_COUNTRY_NAMES.filter((countryName) => countryName !== "France")]
    : FR_COUNTRY_NAMES;

const COUNTRY_OPTIONS = COUNTRY_NAMES_WITH_FRANCE_FIRST.map((countryName) => ({
    value: countryName,
    label: countryName,
}));
const LANGUAGE_OPTIONS = LANGUAGES.map((language) => ({ value: language, label: language }));
const CATEGORY_OPTIONS = CATEGORIES.map((category) => ({ value: category, label: category }));

export default function Step2({ onNext, onPrev }: Step2Props) {
    const [title, setTitle] = useLocalStorageState("submit.step2.title", "");
    const [duration, setDuration] = useLocalStorageState("submit.step2.duration", "");
    const [synopsis, setSynopsis] = useLocalStorageState("submit.step2.synopsis", "");
    const [selectedTools, setSelectedTools] = useLocalStorageState<string[]>("submit.step2.selectedTools", []);
    const [customTool, setCustomTool] = useLocalStorageState("submit.step2.customTool", "");
    const [selectedTags, setSelectedTags] = useLocalStorageState<string[]>("submit.step2.selectedTags", []);
    const [soundMentions, setSoundMentions] = useLocalStorageState("submit.step2.soundMentions", "");
    const [rights, setRights] = useLocalStorageState("submit.step2.rights", false);
    const [country, setCountry] = useLocalStorageState("submit.step2.country", "");
    const [language, setLanguage] = useLocalStorageState("submit.step2.language", "");
    const [category, setCategory] = useLocalStorageState("submit.step2.category", "");
    const [showValidation, setShowValidation] = useState(false);
    const synopsisLen = synopsis.length;

    const missing = {
        title: !title.trim(),
        duration: !duration.trim(),
        synopsis: !synopsis.trim(),
        country: !country.trim(),
        language: !language.trim(),
        category: !category.trim(),
        tools: selectedTools.length === 0,
        tags: selectedTags.length === 0,
        soundMentions: !soundMentions.trim(),
        rights: !rights,
    };

    const hasMissingRequired = Object.values(missing).some(Boolean);

    const getInputClassName = (hasError: boolean) =>
        `submit-input${showValidation && hasError ? " error" : ""}`;

    const getComboboxTriggerStyle = (hasError: boolean) => {
        if (!(showValidation && hasError)) return undefined;
        return {
            borderColor: "rgba(255, 92, 53, 0.65)",
            background: "rgba(255, 92, 53, 0.04)",
        };
    };

    const handleNext = () => {
        setShowValidation(true);

        if (!hasMissingRequired) {
            onNext();
        }
    };

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
        <div className="space-y-6 relative overflow-hidden rounded-3xl p-6" style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px  solid rgba(255, 255, 255, 0.07)" }}>

            {/* En-tête étape 2 */}
            <div className="flex items-center gap-4 pb-2">
                <span className="f-mono text-[11px] tracking-[0.28em] uppercase shrink-0" style={{ color: "rgba(162, 151, 255, .9)" }}>
                    Étape 2/4
                </span>
                <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, rgba(125,113,251,.55) 0%, rgba(125,113,251,.22) 55%, rgba(5,3,13,0) 100%)" }} />
                <span className="f-orb text-sm md:text-[15px] leading-none tracking-[0.03em] uppercase text-white whitespace-nowrap shrink-0">
                    Fiche Film
                </span>
            </div>

            {/* Titre, durée, synopsis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Titre du film" required>
                    <input
                        className={getInputClassName(missing.title)}
                        placeholder="> Titre de votre court-métrage"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </FormField>
                <FormField label="Durée exacte (ex. 1:30 ou 1')" required>
                    <input
                        className={getInputClassName(missing.duration)}
                        placeholder="> 1:30"
                        type="text"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                    />
                </FormField>
            </div>

            <FormField label="Synopsis (max 180 caractères)" required>
                <div className="relative">
                    <textarea
                        className={`${getInputClassName(missing.synopsis)} resize-none h-28`}
                        placeholder="> Décrivez votre film en quelques lignes..."
                        maxLength={180}
                        value={synopsis}
                        onChange={(e) => setSynopsis(e.target.value)}
                    />
                    <span className="absolute bottom-2 right-3 f-mono text-[9px] text-white/25">
                        {synopsisLen}/180
                    </span>
                </div>
            </FormField>

            {/* Pays de production, langue, catégorie */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField label="Pays" required>
                    <Combobox
                        value={country}
                        onChange={setCountry}
                        triggerStyle={getComboboxTriggerStyle(missing.country)}
                        options={COUNTRY_OPTIONS}
                        placeholder="Sélectionner..."
                        renderOption={(opt) => {
                            const flagCode = getCountryCode(opt.value) ?? "";
                            const Flag = (Flags as Record<string, ComponentType<{ className?: string }>>)[flagCode];
                            return (
                                <span className="flex items-center gap-2">
                                    {Flag && <Flag className="w-4 h-3 rounded-sm" />}
                                    {opt.label}
                                </span>
                            );
                        }}
                        renderValue={(opt) => {
                            const flagCode = getCountryCode(opt.value) ?? "";
                            const Flag = (Flags as Record<string, ComponentType<{ className?: string }>>)[flagCode];
                            return (
                                <span className="flex items-center gap-2">
                                    {Flag && <Flag className="w-4 h-3 rounded-sm" />}
                                    {opt.label}
                                </span>
                            );
                        }}
                    />
                </FormField>
                <FormField label="Langue" required>
                    <Combobox
                        value={language}
                        onChange={setLanguage}
                        triggerStyle={getComboboxTriggerStyle(missing.language)}
                        options={LANGUAGE_OPTIONS}
                        placeholder="Sélectionner..."
                        renderOption={(opt) => {
                            const flagCode = getLanguageFlagCode(opt.value) ?? "";
                            const Flag = (Flags as Record<string, ComponentType<{ className?: string }>>)[flagCode];
                            return (
                                <span className="flex items-center gap-2">
                                    {Flag && <Flag className="w-4 h-3 rounded-sm" />}
                                    {opt.label}
                                </span>
                            );
                        }}
                        renderValue={(opt) => {
                            const flagCode = getLanguageFlagCode(opt.value) ?? "";
                            const Flag = (Flags as Record<string, ComponentType<{ className?: string }>>)[flagCode];
                            return (
                                <span className="flex items-center gap-2">
                                    {Flag && <Flag className="w-4 h-3 rounded-sm" />}
                                    {opt.label}
                                </span>
                            );
                        }}
                    />
                </FormField>
                <FormField label="Catégorie" required>
                    <Combobox
                        value={category}
                        onChange={setCategory}
                        triggerStyle={getComboboxTriggerStyle(missing.category)}
                        options={CATEGORY_OPTIONS}
                        placeholder="Sélectionner..."
                    />
                </FormField>
            </div>

            {/* Outils IA utilisés */}
            <FormField label="Outils IA utilisés" required>
                <div
                    className="rounded-xl p-2"
                    style={showValidation && missing.tools ? { border: "1px solid rgba(255, 92, 53, .65)", background: "rgba(255, 92, 53, .04)" } : undefined}
                >
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
                </div>
            </FormField>

            {/* Tags sémantiques */}
            <FormField label="Tags sémantiques (lien avec 'futurs souhaitables')" required>
                <div
                    className="rounded-xl p-2"
                    style={showValidation && missing.tags ? { border: "1px solid rgba(255, 92, 53, .65)", background: "rgba(255, 92, 53, .04)" } : undefined}
                >
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
                </div>
            </FormField>

            {/* Mentions musiques et sons */}
            <FormField label="Mentions des musiques et sons" required>
                <textarea
                    className={`${getInputClassName(missing.soundMentions)} resize-none h-20`}
                    placeholder="> Ex. Musique générée par Suno AI. Sons : ElevenLabs + bibliothèque libre de droits"
                    value={soundMentions}
                    onChange={(e) => setSoundMentions(e.target.value)}
                />
            </FormField>

            {/* Checkbox droits */}
            <label
                className="flex items-start gap-3 cursor-pointer group rounded-xl px-4 py-3 transition-all"
                style={{
                    border: `1px solid ${showValidation && missing.rights ? "rgba(255, 92, 53, .70)" : "rgba(255, 92, 53, .28)"}`,
                    background: showValidation && missing.rights ? "rgba(255, 92, 53, .12)" : "rgba(255, 92, 53, .05)",
                }}
            >
                <div
                    className="mt-0.5 w-4 h-4 rounded-[4px] border shrink-0 flex items-center justify-center transition-all"
                    style={{
                        borderColor: showValidation && missing.rights ? "rgba(255, 92, 53, .85)" : rights ? "rgba(0,0,0,0)" : "rgba(255,255,255,.2)",
                        background: rights
                            ? "linear-gradient(135deg, rgba(125,113,251,.98) 0%, rgba(255,92,53,.98) 100%)"
                            : showValidation && missing.rights
                                ? "rgba(255, 92, 53, .10)"
                                : "rgba(255,255,255,.01)",
                        boxShadow: rights
                            ? "0 0 0 1px rgba(125,113,251,.28), 0 0 12px rgba(125,113,251,.26)"
                            : "none",
                    }}
                    onClick={() => setRights((r) => !r)}
                >
                    {rights && (
                        <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                            <path d="M1 3L3 5L7 1" stroke="rgba(255,255,255,.98)" strokeWidth="1.6" strokeLinecap="round" />
                        </svg>
                    )}
                </div>
                <span className="f-mono text-[10px] text-white/50 leading-relaxed">
                    Je confirme détenir l'ensemble des droits sur les éléments soumis (images, sons, musiques, voix)
                    et être en mesure de les céder pour la durée du festival.{" "}
                    <span style={{ color: showValidation && missing.rights ? "rgba(255, 92, 53, .95)" : "var(--col-or)" }}>*</span>
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
                <button onClick={handleNext} className="f-mono text-[11px] tracking-widest uppercase px-6 py-3 rounded-xl text-white font-bold transition-all hover:opacity-90 active-scale-95" style={{ background: "linear-gradient(90deg, var(--col-vi), var(--col-or))" }}>
                    Étape suivante →
                </button>

            </div>

            <p className="f-mono text-[9px] text-white/25 tracking-wide text-center">
                Aucune modification possible après soumission · Les champs sont mémorisés sur cet appareil
            </p>

        </div>
    )
}

