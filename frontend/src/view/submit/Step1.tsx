// Etape 1 - Auteur
import { FormField } from "../../components/FormField";

interface Step1Props {
    onNext: () => void;
}

const JOBS = ["Réalisateur·rice", "Scénariste", "Producteur·rice", "Monteur·euse", "Autre"];

const HOW_FOUND = ["Réseaux sociaux", "Bouche à oreille", "Presse/Médias", "Partenaires", "Autre"];

const Social = ["Instagram", "Youtube", "LinkedIn", "X/Twitter", "Facebook", "Tumblr", "Autre"];

export default function Step1({ onNext }: Step1Props) {
    return (
        <div className="space-y-6">

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Nom complet" required>
                    <input className="submit-input" placeholder="Prénom Nom" type="text" />
                </FormField>
                <FormField label="Email" required>
                    <input className="submit-input" placeholder="votre@email.com" type="email" />
                </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Téléphone" >
                    <input className="submit-input" placeholder="+33 6 00 00 00 00" type="tel" />
                </FormField>
                <FormField label="Date de naissance" >
                    <input className="submit-input" type="date" />
                </FormField>
            </div>

            <FormField label="Adresse" required>
                <input className="submit-input" placeholder="Rue, numéro..." type="text" />
            </FormField>

        </div>
    )
}