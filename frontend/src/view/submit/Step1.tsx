// Etape 1 - Auteur
import { useState, type ComponentType } from "react";
import { FormField } from "../../components/FormField";
import { Combobox } from "../../components/ui/combobox";
import * as Flags from "country-flag-icons/react/3x2";

interface Step1Props {
    onNext: () => void;
}

const JOBS = ["Réalisateur·rice", "Scénariste", "Producteur·rice", "Monteur·euse", "Autre"];

const HOW_FOUND = ["Réseaux sociaux", "Bouche à oreille", "Presse/Médias", "Partenaires", "Autre"];

const SOCIAL = ["Instagram", "Youtube", "LinkedIn", "X/Twitter", "Facebook", "Tumblr", "Autre"];

const COUNTRY_OPTIONS = [
    { value: "FR", label: "France", EN: "France" },
    { value: "BE", label: "Belgique", EN: "Belgium" },
    { value: "CH", label: "Suisse", EN: "Switzerland" },
    { value: "CA", label: "Canada", EN: "Canada" },
];

const JOB_OPTIONS = JOBS.map((job) => ({ value: job, label: job }));



export default function Step1({ onNext }: Step1Props) {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [address, setAddress] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");
    const [job, setJob] = useState("");
    const [howFound, setHowFound] = useState("");
    const [legalName, setLegalName] = useState("");
    const [legalEmail, setLegalEmail] = useState("");
    const [showValidation, setShowValidation] = useState(false);

    const missing = {
        fullName: !fullName.trim(),
        email: !email.trim(),
        phone: !phone.trim(),
        birthDate: !birthDate.trim(),
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
        <div className="space-y-6 relative overflow-hidden rounded-3xl p-6" style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px  solid rgba(255, 255, 255, 0.07)" }}>

            {/* En-tête */}
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <span className="f-mono text-sm tracking-widest text-white/30">
                    Étape 1 sur 4
                </span>
                <span className="f-mono text-sm tracking-widest uppercase" style={{ color: "var(--col-vi)" }}>
                    Fiche Réalisateur
                </span>
            </div>

            {/* Informations personnelles */}
            {/* Identité et coordonnées */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Nom complet" required>
                    <input
                        className={getInputClassName(missing.fullName)}
                        placeholder="Prénom Nom"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />
                </FormField>

                <FormField label="Email" required>
                    <input
                        className={getInputClassName(missing.email)}
                        placeholder="email@domain.com"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Téléphone" required>
                    <input
                        className={getInputClassName(missing.phone)}
                        placeholder="+33 6 00 00 00 00"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </FormField>

                <FormField label="Date de naissance" required>
                    <input
                        className={getInputClassName(missing.birthDate)}
                        type="date"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                    />
                </FormField>
            </div>

            <FormField label="Adresse" required>
                <input
                    className={getInputClassName(missing.address)}
                    placeholder="Rue, numéro..."
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
            </FormField>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <FormField label="Code postal" required>
                    <input
                        className={getInputClassName(missing.postalCode)}
                        placeholder="13000"
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
                            const Flag = (Flags as Record<string, ComponentType<{ className?: string }>>)[opt.value];
                            return (
                                <span className="flex items-center gap-2">
                                    {Flag && <Flag className="w-4 h-3 rounded-sm" />}
                                    {opt.label}
                                </span>
                            );
                        }}
                        renderValue={(opt) => {
                            const Flag = (Flags as Record<string, ComponentType<{ className?: string }>>)[opt.value];
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div className="rounded-xl p-4 space-y-4" style={{ border: "1px solid var(--col-bg-3)", background: "rgba(255,255,255,.02)" }}>
                <p className="f-mono text-[10px] tracking-widest uppercase" style={{ color: "var(--col-vi)" }}>
                    &gt; Référent légal {" "}

                    <span style={{ color: "var(--col-vi)" }}>
                        (obligatoire par film)
                    </span>
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="Nom du référent légal" required>
                        <input
                            className={getInputClassName(missing.legalName)}
                            placeholder="Prénom Nom"
                            type="text"
                            required
                            value={legalName}
                            onChange={(e) => setLegalName(e.target.value)}
                        />
                    </FormField>
                    <FormField label="Email du référent légal" required>
                        <input
                            className={getInputClassName(missing.legalEmail)}
                            placeholder="email@domain.com"
                            type="email"
                            required
                            value={legalEmail}
                            onChange={(e) => setLegalEmail(e.target.value)}
                        />
                    </FormField>
                </div>
            </div>

            {/* Bouton Suivant */}
            <div className="flex justify-end pt-2">
                <button onClick={handleNext} className="f-mono text-[11px] tracking-widest uppercase px-6 py-3 rounded-xl text-white font-bold transition-all hover:opacity-90 active-scale-95" style={{ background: "linear-gradient(90deg, var(--col-vi), var(--col-or))" }}>
                    Étape suivante →
                </button>
            </div>

        </div>
    )
}