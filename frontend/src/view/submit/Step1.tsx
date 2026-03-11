// Etape 1 - Auteur
import { FormField } from "../../components/FormField";

interface Step1Props {
    onNext: () => void;
}

const JOBS = ["Réalisateur·rice", "Scénariste", "Producteur·rice", "Monteur·euse", "Autre"];

const HOW_FOUND = ["Réseaux sociaux", "Bouche à oreille", "Presse/Médias", "Partenaires", "Autre"];

