import { useEffect, useMemo, useState } from "react";
import { Check, X } from "lucide-react";
import type { AdminFilm, DecisionAction, BadgeType, FilmStatus } from "../AdminTypes";
import { Combobox } from "../../../components/ui/combobox";

function formatDuration(sec: number) {
    return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
}

interface FilmRowProps {
    film: AdminFilm;
    selected: boolean;
    onToggleSelect: (filmId: string, selected: boolean) => void;
    onDecision: (filmId: string, action: DecisionAction, badge?: BadgeType) => Promise<void>;
    onEmail: (filmId: string) => void;
    onCommentClick: () => void;
}

const STATUS_OPTIONS: { value: FilmStatus; label: string }[] = [
    { value: "pending", label: "En attente" },
    { value: "validated", label: "Validé" },
    { value: "refused", label: "Refusé" },
    { value: "review", label: "À revoir" },
    { value: "selected", label: "Sélectionné" },
];

const STATUS_STYLE: Record<FilmStatus, React.CSSProperties> = {
    pending: {
        color: "rgba(255,255,255,.75)",
        border: "1px solid rgba(255,255,255,.18)",
        background: "rgba(255,255,255,.04)",
    },
    validated: {
        color: "#22c55e",
        border: "1px solid rgba(34,197,94,.35)",
        background: "rgba(34,197,94,.1)",
    },
    refused: {
        color: "#f87171",
        border: "1px solid rgba(248,113,113,.35)",
        background: "rgba(248,113,113,.1)",
    },
    review: {
        color: "#c084fc",
        border: "1px solid rgba(192,132,252,.35)",
        background: "rgba(192,132,252,.1)",
    },
    selected: {
        color: "#8b7bff",
        border: "1px solid rgba(125,113,251,.4)",
        background: "rgba(125,113,251,.12)",
    },
};

const BADGE_OPTIONS: { value: BadgeType; label: string }[] = [
    { value: null, label: "—" },
    { value: "grand_prix", label: "🏆 Grand Prix" },
    { value: "prix_jury", label: "⭐ Prix du Jury" },
];

const BADGE_STYLE: Record<Exclude<BadgeType, null>, React.CSSProperties> = {
    grand_prix: {
        color: "#f5d147",
        border: "1px solid rgba(245,209,71,.45)",
        background: "rgba(245,209,71,.1)",
    },
    prix_jury: {
        color: "rgba(255,255,255,.75)",
        border: "1px solid rgba(125,113,251,.35)",
        background: "rgba(8,7,24,.8)",
    },
};

const STATUS_COMBO_OPTIONS = STATUS_OPTIONS.map((option) => ({
    value: option.value,
    label: option.label,
}));

const BADGE_COMBO_OPTIONS = BADGE_OPTIONS.map((option) => ({
    value: option.value ?? "",
    label: option.label,
}));

export default function FilmRow({ film, selected, onToggleSelect, onDecision, onEmail, onCommentClick }: FilmRowProps) {
    const isAlreadyAssigned = Boolean(film.assigned_jury_name);
    const [localStatus, setLocalStatus] = useState<FilmStatus>(film.status);
    const [localBadge, setLocalBadge] = useState<BadgeType>(film.badge);

    useEffect(() => {
        setLocalStatus(film.status);
        setLocalBadge(film.badge);
    }, [film.status, film.badge]);

    const statusStyle = useMemo(() => STATUS_STYLE[localStatus], [localStatus]);
    const badgeStyle = useMemo<React.CSSProperties>(() => {
        if (!localBadge) {
            return {
                color: "rgba(255,255,255,.75)",
                border: "1px solid rgba(125,113,251,.35)",
                background: "rgba(8,7,24,.8)",
            };
        }
        return BADGE_STYLE[localBadge];
    }, [localBadge]);

    const handleStatusChange = async (nextStatus: FilmStatus) => {
        if (nextStatus === localStatus) return;

        const previousStatus = localStatus;
        setLocalStatus(nextStatus);

        try {
            await onDecision(film.id, nextStatus, localBadge);
        } catch (err) {
            console.error("[FilmRow] status update failed", err);
            setLocalStatus(previousStatus);
        }
    };

    const handleBadgeChange = async (nextBadgeValue: string) => {
        const nextBadge = nextBadgeValue === "grand_prix" || nextBadgeValue === "prix_jury" ? nextBadgeValue : null;

        const previousBadge = localBadge;
        setLocalBadge(nextBadge);

        try {
            await onDecision(film.id, localStatus, nextBadge);
        } catch (err) {
            console.error("[FilmRow] badge update failed", err);
            setLocalBadge(previousBadge);
        }
    };

    return (
        <>
            <tr
                className="border-b"
                style={{
                    borderColor: "rgba(255,255,255,.06)",
                    background: "#070518",
                }}
            >
                <td className="px-3 py-3 align-middle">
                    <label className={`relative inline-flex items-center justify-center ${isAlreadyAssigned ? "cursor-not-allowed opacity-45" : "cursor-pointer"}`}>
                        <input
                            type="checkbox"
                            aria-label={`Sélectionner ${film.title}`}
                            className="peer sr-only"
                            checked={selected}
                            disabled={isAlreadyAssigned}
                            onChange={(event) => onToggleSelect(film.id, event.target.checked)}
                        />
                        <span
                            className="h-5 w-5 rounded-md border bg-white/[0.04] transition-all duration-200 peer-checked:border-[#988dff] peer-checked:bg-[#7d71fb]"
                            style={{
                                borderColor: "rgba(255,255,255,.28)",
                                boxShadow: "inset 0 0 0 1px rgba(255,255,255,.04)",
                            }}
                        />
                        <Check
                            size={13}
                            strokeWidth={3}
                            className="pointer-events-none absolute text-white opacity-0 transition-opacity duration-150 peer-checked:opacity-100"
                        />
                    </label>
                </td>

                <td className="px-3 py-3 align-middle">
                    <div className="flex items-start">
                        <div className="min-w-0">
                            <p className="f-orb text-[14px] leading-tight text-white font-bold truncate max-w-[240px]">
                                {film.title}
                            </p>
                            <p className="f-mono text-[11px] text-white/60 mt-0.5 truncate max-w-[240px]">
                                {film.director_name}
                            </p>
                            <p className="f-mono text-[8px] text-white/30 mt-0.5 truncate max-w-[280px]">
                                {film.id}
                            </p>
                        </div>
                    </div>
                </td>

                <td className="px-3 py-3 align-middle">
                    <p className="f-orb text-[12px] leading-none text-white">{film.country}</p>
                    <p className="f-mono text-[11px] mt-1 text-white/70">{formatDuration(film.duration_seconds)}</p>
                </td>

                <td className="px-3 py-3 align-middle">
                    {film.assigned_jury_name ? (
                        <>
                            <p className="f-orb text-[12px] leading-none text-white truncate max-w-[230px]">
                                {film.assigned_jury_name}
                            </p>
                            <p className="f-mono text-[9px] mt-1 text-white/35 truncate max-w-[230px]">
                                {film.assigned_jury_email}
                            </p>
                        </>
                    ) : null}
                </td>

                <td className="px-3 py-3 align-middle">
                    {film.jury_votes > 0 ? (
                        <button
                            onClick={onCommentClick}
                            className="h-8 px-3 rounded-xl f-mono text-[10px] text-white/75"
                            style={{ border: "1px solid rgba(125,113,251,.35)", background: "rgba(125,113,251,.1)" }}
                        >
                            Commentaires ({film.jury_votes})
                        </button>
                    ) : (
                        <span className="f-mono text-[9px] text-white/22">Aucun commentaire jury</span>
                    )}
                </td>

                <td className="px-3 py-3 align-middle">
                    <Combobox
                        value={localStatus}
                        onChange={(value) => void handleStatusChange(value as FilmStatus)}
                        options={STATUS_COMBO_OPTIONS}
                        placeholder="Statut"
                        searchable={false}
                        className="h-9 w-[170px] max-w-full rounded-xl px-3 f-mono text-[11px]"
                        contentClassName="rounded-xl border border-white/15 bg-[#07051a]"
                        triggerStyle={{
                            color: statusStyle.color,
                            border: statusStyle.border,
                            background: statusStyle.background,
                        }}
                    />
                </td>

                <td className="px-3 py-3 align-middle">
                    <Combobox
                        value={localBadge ?? ""}
                        onChange={(value) => void handleBadgeChange(value)}
                        options={BADGE_COMBO_OPTIONS}
                        placeholder="Badge"
                        searchable={false}
                        className="h-9 w-[170px] max-w-full rounded-xl px-3 f-mono text-[11px]"
                        contentClassName="rounded-xl border border-white/15 bg-[#07051a]"
                        triggerStyle={badgeStyle}
                    />
                </td>

                <td className="px-3 py-3 align-middle">
                    {film.youtube_private_id ? (
                        <a
                            href={`https://youtube.com/watch?v=${film.youtube_private_id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="f-mono text-[11px] text-violet-400 underline hover:opacity-80"
                        >
                            Lien YouTube ↗
                        </a>
                    ) : (
                        <span className="f-mono text-[11px] text-white/20">—</span>
                    )}
                    <p className="f-mono text-[10px] text-emerald-400 mt-1">● En ligne</p>
                </td>

                <td className="px-3 py-3 align-middle">
                    <button
                        title="Envoyer email"
                        onClick={() => onEmail(film.id)}
                        className="h-8 min-w-[100px] rounded-lg px-3 f-mono text-[10px] text-white/75 inline-flex items-center justify-center gap-1"
                        style={{
                            background: "rgba(125,113,251,.1)",
                            border: "1px solid rgba(125,113,251,.35)",
                        }}
                    >
                        Envoyer email
                    </button>
                </td>
            </tr>

        </>
    );
}

export function FilmRowModal({ film, open, onClose }: {
    film: AdminFilm;
    open: boolean;
    onClose: () => void;
}) {
    if (!open) return null;
    
    return (
        <>
            <div className="fixed inset-0 z-40 bg-black/55" onClick={onClose} />
            <div
                className="fixed z-50 left-1/2 top-[40%] -translate-x-1/2 w-[580px] max-w-[90vw] rounded-2xl p-4"
                style={{
                    border: "1px solid rgba(255,255,255,.14)",
                    background: "rgba(9,8,16,.98)",
                    boxShadow: "0 30px 80px rgba(0,0,0,.45)",
                }}
            >
                <button
                    onClick={onClose}
                    className="absolute right-3 top-3 w-6 h-6 rounded-full border flex items-center justify-center text-white/70"
                    style={{ borderColor: "rgba(125,113,251,.6)", background: "rgba(125,113,251,.12)" }}
                >
                    <X size={14} />
                </button>
                <h3 className="f-orb text-[24px] text-white mb-2">Commentaires du jury</h3>
                <div className="rounded-xl p-3" style={{ border: "1px solid rgba(255,255,255,.12)", background: "rgba(255,255,255,.04)" }}>
                    <p className="f-mono text-[11px] text-white/45 mb-1">{film.director_name} · review</p>
                    <p className="f-mono text-[13px] text-white/85">Vidéo très intéressante !</p>
                </div>
            </div>
        </>
    );
}