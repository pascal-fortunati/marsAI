// Données srariques et helpers
// Modification pour mettre à jour le contenu sans toucher aux composants
import type { StatItem, PanelRow } from './homeTypes';

// Date de clôture - Mettre à jour ici pour chaque phase
export const FESTIVAL_CLOSE_DATE = new Date("2026-05-01T00:00:00");

// Stats principales 
export const MAIN_STATS: StatItem[] = [
    { value: "120", label: "Pays" },
    { value: "600", label: "Films soumis" },
    { value: "3 000", label: "Spectateurs" },
];

// Sections du panel d'accueil
export const PANEL_ROWS: PanelRow[] = [
    { label: "Sélection officielle", value: "Marseille 2026" },
    { label: "Palmares", value: "Mai 2026" }
];

// Tags
export const TAGS = [
    "IA & cinéma",
    "La Communauté",
    "Jury International",
    "Partenaires",
    "Mobilité",
];

// Affichage 2 chiffres
export const pad = (n: number) => String(n).padStart(2, '0');