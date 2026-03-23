// Helpers purs — pas de données statiques (elles viennent du backend)

/** Formate un nombre sur 2 chiffres : 5 → "05" */
export const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Calcule le temps restant jusqu'à une date cible.
 * @returns null si la date est invalide ou déjà passée
 */
export function getTimeLeft(isoDate: string | null) {
    if (!isoDate) return null;
    const diff = new Date(isoDate).getTime() - Date.now();
    if (diff <= 0) return null;
    return {
        jours: Math.floor(diff / 86_400_000),
        heures: Math.floor((diff % 86_400_000) / 3_600_000),
        min: Math.floor((diff % 3_600_000) / 60_000),
        sec: Math.floor((diff % 60_000) / 1_000),
    };
}

/** Message et CTA selon la phase courante */
export function getPhaseNotice(phase: number, t: Record<string, string>) {
    switch (phase) {
        case 2: return { text: t.phaseNoticePhase2 ?? "Soumissions terminées · Début de la phase 2", cta: null, href: null };
        case 3: return { text: t.phaseNoticePhase3 ?? "Le jury a voté · Début de la phase 3", cta: "Voir le catalogue", href: "/catalogue" };
        case 4: return { text: t.phaseNoticePalmares ?? "Le Grand Prix a été décerné · Merci !", cta: "Palmarès →", href: "/palmares" };
        default: return null;
    }
}

/** Statistiques principales du festival */
export const MAIN_STATS = [
    { value: 150, label: "Pays" },
    { value: 2500, label: "Films" },
    { value: 1000000, label: "Visiteurs" },
];

/** Phases du festival */
export const PANEL_ROWS = [
    { label: "Sélection du jury", value: "2-15 janvier 2027" },
    { label: "Palmarès", value: "20 janvier 2027" },
];

/** Tags d'intérêt */
export const TAGS = [
    "Science-fiction",
    "Dystopie",
    "Futur positif",
    "Technologie",
    "Humanité",
    "Écologie",
    "Créativité",
];