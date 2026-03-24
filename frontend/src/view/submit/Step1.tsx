// Etape 1 - Auteur
import { useState, type ComponentType } from "react";
import { FormField } from "../../components/FormField";
import { Combobox } from "../../components/ui/combobox";
import { DatePicker } from "../../components/ui/date-picker";
import { Button } from "../../components/ui/button";
import * as Flags from "country-flag-icons/react/3x2";
import { FR_COUNTRY_NAMES, getCountryCode } from "../../lib/countryMapping";
import { useLocalStorageState } from "../../lib/useLocalStorageState";
import { marsaiGradients } from "../../theme/marsai";

interface Step1Props {
    onNext: () => void;
}

// Fonction pour calculer l'âge
const calculateAge = (birthDate: string): number => {
    if (!birthDate) return 0;
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
};

// Fonction pour valider l'âge minimum
const isAgeValid = (birthDate: string): boolean => {
    return calculateAge(birthDate) >= 18;
};

const JOBS = ["Réalisateur·rice", "Artiste numérique", "Designer", "Développeur·euse", "Etudiant·e", "Photographe", "Vidéaste", "Musicien·ne", "Autre"];

const HOW_FOUND = ["Réseaux sociaux (Instagram, TikTok...)", "Twitter/X", "Bouche à oreille", "Presse/Médias", "Newsletter", "La Plateforme", "Mobile Film Festival", "Moteur de recherche", "Autre"];

const SOCIAL = ["Instagram", "Youtube", "LinkedIn", "X/Twitter", "Facebook", "Tumblr", "Autre"];

const COUNTRY_NAMES_WITH_FRANCE_FIRST = FR_COUNTRY_NAMES.includes("France")
    ? ["France", ...FR_COUNTRY_NAMES.filter((countryName) => countryName !== "France")]
    : FR_COUNTRY_NAMES;

const COUNTRY_OPTIONS = COUNTRY_NAMES_WITH_FRANCE_FIRST.map((countryName) => ({
    value: countryName,
    label: countryName,
}));

const JOB_OPTIONS = JOBS.map((job) => ({ value: job, label: job }));



export default function Step1({ onNext }: Step1Props) {
    const [fullName, setFullName] = useLocalStorageState("submit.step1.fullName", "");
    const [email, setEmail] = useLocalStorageState("submit.step1.email", "");
    const [phone, setPhone] = useLocalStorageState("submit.step1.phone", "");
    const [birthDate, setBirthDate] = useLocalStorageState("submit.step1.birthDate", "");
    const [address, setAddress] = useLocalStorageState("submit.step1.address", "");
    const [postalCode, setPostalCode] = useLocalStorageState("submit.step1.postalCode", "");
    const [city, setCity] = useLocalStorageState("submit.step1.city", "");
    const [country, setCountry] = useLocalStorageState("submit.step1.country", "");
    const [job, setJob] = useLocalStorageState("submit.step1.job", "");
    const [howFound, setHowFound] = useLocalStorageState("submit.step1.howFound", "");
    const [legalName, setLegalName] = useLocalStorageState("submit.step1.legalName", "");
    const [legalEmail, setLegalEmail] = useLocalStorageState("submit.step1.legalEmail", "");
    const [showValidation, setShowValidation] = useState(false);

    const missing = {
        fullName: !fullName.trim(),
        email: !email.trim(),
        phone: !phone.trim(),
        birthDate: !birthDate.trim(),
        age: birthDate.trim() ? !isAgeValid(birthDate) : false,
        address: !address.trim(),
        postalCode: !postalCode.trim(),
        city: !city.trim(),
        country: !country.trim(),
        job: !job.trim(),
        howFound: !howFound.trim(),
        legalName: !legalName.trim(),
        legalEmail: !legalEmail.trim(),
    };

    const hasMissingRequired = Object.values(missing).some(Boolean);

    const birthDateHasError = missing.age || (showValidation && missing.birthDate);

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

    return (
        <div className="space-y-4 sm:space-y-6 relative overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-6" style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px  solid rgba(255, 255, 255, 0.07)" }}>

            {/* En-tête */}
            <div className="flex items-center gap-4 pb-2">
                <span className="f-mono text-[11px] tracking-[0.28em] uppercase shrink-0" style={{ color: "rgba(162, 151, 255, .9)" }}>
                    Étape 1/4
                </span>
                <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, rgba(125,113,251,.55) 0%, rgba(125,113,251,.22) 55%, rgba(5,3,13,0) 100%)" }} />
                <span className="f-orb text-sm md:text-[15px] leading-none tracking-[0.03em] uppercase text-white whitespace-nowrap shrink-0">
                    Fiche Réalisateur
                </span>
            </div>

            {/* Informations personnelles */}
            {/* Identité et coordonnées */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <FormField label="Nom complet" required>
                    <input
                        className={getInputClassName(missing.fullName)}
                        placeholder="> Prénom Nom"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />
                </FormField>

                <FormField label="Email" required>
                    <input
                        className={getInputClassName(missing.email)}
                        placeholder="> email@domain.com"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <FormField label="Téléphone" required>
                    <input
                        className={getInputClassName(missing.phone)}
                        placeholder="> +33 6 00 00 00 00"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </FormField>

                <FormField label="Date de naissance" required>
                    <div className="relative">
                        <DatePicker
                            value={birthDate}
                            onChange={setBirthDate}
                            placeholder="> Sélectionnez une date"
                            className={`${getInputClassName(birthDateHasError)} submit-input`}
                            triggerStyle={getComboboxTriggerStyle(birthDateHasError)}
                        />
                        {birthDate.trim() && missing.age && (
                            <p className="text-[12px] mt-1" style={{ color: "rgba(255, 92, 53, 0.8)" }}>
                                Vous devez avoir au moins 18 ans
                            </p>
                        )}
                    </div>
                </FormField>
            </div>

            <FormField label="Adresse" required>
                <input
                    className={getInputClassName(missing.address)}
                    placeholder="> Rue, numéro..."
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <FormField label="Code postal" required>
                    <input
                        className={getInputClassName(missing.postalCode)}
                        placeholder="> 13000"
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                    />
                </FormField>
                <FormField label="Ville" required>
                    <input
                        className={getInputClassName(missing.city)}
                        placeholder="Marseille"
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                </FormField>
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
            </div>

            {/* Profession + Réseaux sociaux */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <FormField label="Métier actuel" required>
                    <Combobox
                        value={job}
                        onChange={setJob}
                        triggerStyle={getComboboxTriggerStyle(missing.job)}
                        options={JOB_OPTIONS}
                        placeholder="Sélectionner..."
                    />
                </FormField>
                <FormField label="Comment avez-vous connu MarsAI ?" required>
                    <Combobox
                        value={howFound}
                        onChange={setHowFound}
                        triggerStyle={getComboboxTriggerStyle(missing.howFound)}
                        options={HOW_FOUND.map((method) => ({ value: method, label: method }))}
                        placeholder="Sélectionner..."
                    />
                </FormField>
            </div>

            <div className="space-y-3">
                <p className="f-mono text-[10px] tracking-widest uppercase text-white/30">Réseaux sociaux <span className="text-white/15">(Optionnel)</span></p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {SOCIAL.map((net) => (
                        <div key={net} className="flex items-center gap-2">
                            <span className="f-mono text-[10px] text-white/30 w-20 shrink-0 uppercase">
                                {net}
                            </span>
                            <input className="submit-input" placeholder="@username" type="text" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Infos complémentaires et */}
            <FormField label="Informations complémentaires">
                <textarea className="submit-input resize-none h-24" placeholder="Notes, contexte de création" />
            </FormField>

            <div
                className="rounded-lg sm:rounded-2xl px-4 sm:px-5 py-4 sm:py-5 space-y-3 sm:space-y-4"
                style={{
                    border: "1px solid rgba(125,113,251,.28)",
                    background: "rgba(16,10,38,.42)",
                }}
            >
                <p className="f-mono text-[10px] tracking-[0.26em] uppercase" style={{ color: "rgba(162,151,255,.92)" }}>
                    &gt; Référent légal
                    <span className="ml-2" style={{ color: "rgba(162,151,255,.72)" }}>
                        (obligatoire par film)
                    </span>
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
                    <FormField label="Nom du référent légal" required>
                        <input
                            className={getInputClassName(missing.legalName)}
                            placeholder="> Prénom Nom"
                            type="text"
                            required
                            value={legalName}
                            onChange={(e) => setLegalName(e.target.value)}
                        />
                    </FormField>
                    <FormField label="Email du référent légal" required>
                        <input
                            className={getInputClassName(missing.legalEmail)}
                            placeholder="> email@domain.com"
                            type="email"
                            required
                            value={legalEmail}
                            onChange={(e) => setLegalEmail(e.target.value)}
                        />
                    </FormField>
                </div>
            </div>

            {/* Bouton Suivant */}
            <div className="flex justify-end gap-2 pt-2 sm:pt-4">
                <Button
                    type="button"
                    onClick={handleNext}
                    className="f-orb group relative overflow-hidden rounded-full px-8 text-xs font-bold uppercase tracking-widest text-white transition-all duration-300"
                    style={{ background: marsaiGradients.primaryToAccent }}
                >
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                    <span className="relative">Étape suivante →</span>
                </Button>
            </div>

            <p className="f-mono text-[9px] text-white/25 tracking-wide text-center">
                Aucune modification possible après soumission · Les champs sont mémorisés sur cet appareil
            </p>

        </div>
    )
}