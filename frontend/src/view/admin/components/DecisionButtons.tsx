import type { BadgeType, DecisionAction } from "../AdminTypes";

interface DecisionButtonsProps {
    filmId: string;
    currentBadge: BadgeType;
    onDecision: (filmId: string, action: DecisionAction, badge?: BadgeType) => Promise<void>;
}

export default function DecisionButtons({ filmId, currentBadge, onDecision }: DecisionButtonsProps) {
    return (
        <div className="flex items-center gap-1.5">
            <button
                onClick={() => onDecision(filmId, "validated", currentBadge)}
                className="f-mono text-[8px] uppercase px-2 py-1 rounded"
                style={{ border: "1px solid rgba(74,222,128,.4)", color: "#4ade80", background: "rgba(74,222,128,.12)" }}
            >
                ✓
            </button>
            <button
                onClick={() => onDecision(filmId, "review", currentBadge)}
                className="f-mono text-[8px] uppercase px-2 py-1 rounded"
                style={{ border: "1px solid rgba(251,146,60,.4)", color: "#fb923c", background: "rgba(251,146,60,.12)" }}
            >
                ↻
            </button>
            <button
                onClick={() => onDecision(filmId, "refused", currentBadge)}
                className="f-mono text-[8px] uppercase px-2 py-1 rounded"
                style={{ border: "1px solid rgba(248,113,113,.4)", color: "#f87171", background: "rgba(248,113,113,.12)" }}
            >
                ✕
            </button>
        </div>
    );
}
