// Helpers purs — pas de données statiques (elles viennent du backend)

/** Formate un nombre sur 2 chiffres : 5 → "05" */
export const pad = (n: number) => String(n).padStart(2, "0");

export type FestivalPhase = 1 | 2 | 3 | 4;

export const PHASE_DATES = {
    phase1Close: new Date("2026-04-02T23:59:59+01:00"),
    phase2Close: new Date("2026-05-02T23:59:59+02:00"),
    phase3Close: new Date("2026-06-02T23:59:59+02:00"),
};

export function getCurrentFestivalPhase(now = new Date()): FestivalPhase {
    const current = now.getTime();

    if (current < PHASE_DATES.phase1Close.getTime()) return 1;
    if (current < PHASE_DATES.phase2Close.getTime()) return 2;
    if (current < PHASE_DATES.phase3Close.getTime()) return 3;
    return 4;
}

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
        case 2: return { text: t.phaseNoticePhase2 ?? "Soumission terminée · Début de la phase 2", cta: null, href: null };
        case 3: return { text: t.phaseNoticePhase3 ?? "Le jury a voté · Début de la phase 3", cta: "Voir le catalogue", href: "/catalogue" };
        case 4: return { text: t.phaseNoticePalmares ?? "Le Grand Prix a été décerné · Merci d'avoir participé !", cta: "Palmarès", href: "/palmares" };
        default: return null;
    }
}

/** Statistiques principales du festival */
export const MAIN_STATS = [
    { value: 120, label: "Pays" },
    { value: 600, label: "Films attendus" },
    { value: 3000, label: "Visiteurs" },
];

/** Phases du festival */
export const PANEL_ROWS = [
    { label: "Sélection officielle", value: "2-15 janvier 2027" },
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