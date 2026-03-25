import type { FilmStatus } from "../AdminTypes";

const STATUS_STYLES: Record<FilmStatus, React.CSSProperties> = {
    pending: {
        background: "rgba(255,255,255,.06)",
        color: "rgba(255,255,255,.7)",
        border: "1px solid rgba(255,255,255,.14)",
    },
    validated: {
        background: "rgba(74,222,128,.14)",
        color: "#4ade80",
        border: "1px solid rgba(74,222,128,.35)",
    },
    review: {
        background: "rgba(251,146,60,.14)",
        color: "#fb923c",
        border: "1px solid rgba(251,146,60,.35)",
    },
    refused: {
        background: "rgba(248,113,113,.14)",
        color: "#f87171",
        border: "1px solid rgba(248,113,113,.35)",
    },
    selected: {
        background: "rgba(125,113,251,.16)",
        color: "rgba(202,195,255,.95)",
        border: "1px solid rgba(125,113,251,.4)",
    },
};

const LABELS: Record<FilmStatus, string> = {
    pending: "En attente",
    validated: "Validé",
    review: "À revoir",
    refused: "Refusé",
    selected: "Sélectionné",
};

export default function StatusBadge({ status }: { status: FilmStatus }) {
    return (
        <span className="f-mono text-[8px] tracking-widest uppercase px-2 py-1 rounded-md" style={STATUS_STYLES[status]}>
            {LABELS[status]}
        </span>
    );
}
