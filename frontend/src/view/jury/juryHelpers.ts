import type { VoteAction } from "./juryTypes";

export const formatDuration = (sec: number) =>
    `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;

export const getFlag = (country: string): string => {
    const flags: Record<string, string> = {
        "France": "🇫🇷", "Belgique": "🇧🇪", "Suisse": "🇨🇭",
        "Canada": "🇨🇦", "Maroc": "🇲🇦", "Italie": "🇮🇹",
        "Japon": "🇯🇵", "Portugal": "🇵🇹", "Espagne": "🇪🇸",
        "Allemagne": "🇩🇪", "Autre": "🌍",
    };
    return flags[country] ?? "🌍";
};

// Couleurs du badge vote
export const voteColor = (action: VoteAction): React.CSSProperties => {
    const map: Record<VoteAction, React.CSSProperties> = {
        validate: { background: "rgba(74,222,128,.15)", color: "#4ade80", border: "1px solid rgba(74,222,128,.3)" },
        refuse: { background: "rgba(248,113,113,.15)", color: "#f87171", border: "1px solid rgba(248,113,113,.3)" },
        review: { background: "rgba(251,146,60,.15)", color: "#fb923c", border: "1px solid rgba(251,146,60,.3)" },
    };
    return map[action];
}