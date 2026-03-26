import { useMemo, useState } from "react";
import { Mail, X } from "lucide-react";
import type { AdminFilm, DecisionAction, BadgeType, FilmStatus } from "../AdminTypes";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

function formatDuration(sec: number) {
    return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
}

interface FilmRowProps {
    film: AdminFilm;
    index: number;
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

export default function FilmRow({ film, index, onDecision, onEmail, onCommentClick }: FilmRowProps) {
    const statusStyle = useMemo(() => STATUS_STYLE[film.status], [film.status]);

    const handleStatusChange = async (nextStatus: FilmStatus) => {
        if (nextStatus === film.status) return;
        if (nextStatus === "selected") return;

        const decisionMap: Record<Exclude<FilmStatus, "selected">, DecisionAction> = {
            pending: "review",
            validated: "validated",
            refused: "refused",
            review: "review",
        };

        await onDecision(film.id, decisionMap[nextStatus], film.badge);
    };

    const handleBadgeChange = async (nextBadgeValue: string) => {
        const nextBadge = nextBadgeValue === "grand_prix" || nextBadgeValue === "prix_jury" ? nextBadgeValue : null;
        await onDecision(film.id, "validated", nextBadge);
    };

    return (
        <>
            <tr
                className="border-b"
                style={{
                    borderColor: "rgba(255,255,255,.06)",
                    background: "rgba(5,3,13,.45)",
                }}
            >
                <td className="px-3 py-3 align-top">
                    <input
                        type="checkbox"
                        className="w-5 h-5 rounded border"
                        style={{ accentColor: "#7d71fb", borderColor: "rgba(255,255,255,.25)", background: "transparent" }}
                    />
                </td>

                <td className="px-3 py-3 align-top">
                    <div className="flex items-start gap-3">
                        {film.poster_url && (
                            <img
                                src={`${BASE}${film.poster_url}`}
                                alt={film.title}
                                className="w-6 h-8 object-cover rounded-md shrink-0"
                                style={{ border: "1px solid rgba(255,255,255,.12)" }}
                            />
                        )}
                        <div className="min-w-0">
                            <p className="f-orb text-[12px] leading-none text-white/10 -mb-1">{String(index).padStart(2, "0")}</p>
                            <p className="f-orb text-[14px] leading-tight text-white font-bold truncate max-w-[240px]">
                                {film.title}
                            </p>
                            <p className="f-mono text-[11px] text-white/60 mt-0.5 truncate max-w-[240px]">
                                {film.director_name}
                            </p>
                            <p className="f-mono text-[8px] text-white/30 mt-0.5 break-all max-w-[280px]">
                                {film.id}
                            </p>
                        </div>
                    </div>
                </td>

                <td className="px-3 py-3 align-top">
                    <p className="f-orb text-[12px] leading-none text-white">{film.country}</p>
                    <p className="f-mono text-[11px] mt-1 text-white/70">{formatDuration(film.duration_seconds)}</p>
                </td>

                <td className="px-3 py-3 align-top">
                    <p className="f-orb text-[12px] leading-none text-white truncate max-w-[230px]">
                        {film.director_name}
                    </p>
                    <p className="f-mono text-[9px] mt-1 text-white/35 truncate max-w-[230px]">
                        {film.director_email}
                    </p>
                </td>

                <td className="px-3 py-3 align-top">
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

                <td className="px-3 py-3 align-top">
                    <select
                        value={film.status}
                        onChange={(e) => void handleStatusChange(e.target.value as FilmStatus)}
                        className="h-8 min-w-[110px] rounded-lg px-2 f-mono text-[10px] appearance-none"
                        style={statusStyle}
                    >
                        {STATUS_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </td>

                <td className="px-3 py-3 align-top">
                    <select
                        value={film.badge ?? ""}
                        onChange={(e) => void handleBadgeChange(e.target.value)}
                        className="h-8 min-w-[120px] rounded-lg px-2 f-mono text-[10px] appearance-none"
                        style={{
                            color: film.badge ? "#f5d147" : "rgba(255,255,255,.55)",
                            border: film.badge ? "1px solid rgba(245,209,71,.45)" : "1px solid rgba(255,255,255,.18)",
                            background: film.badge ? "rgba(245,209,71,.09)" : "rgba(255,255,255,.03)",
                        }}
                    >
                        {BADGE_OPTIONS.map((option) => (
                            <option key={option.label} value={option.value ?? ""}>{option.label}</option>
                        ))}
                    </select>
                </td>

                <td className="px-3 py-3 align-top">
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

                <td className="px-3 py-3 align-top">
                    <button
                        title="Envoyer email"
                        onClick={() => onEmail(film.id)}
                        className="h-8 min-w-[100px] rounded-lg px-3 f-mono text-[10px] text-white/75 inline-flex items-center justify-center gap-1"
                        style={{
                            background: "rgba(125,113,251,.1)",
                            border: "1px solid rgba(125,113,251,.35)",
                        }}
                    >
                        <Mail size={12} /> Email
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