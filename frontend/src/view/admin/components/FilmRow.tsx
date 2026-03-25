// src/view/admin/components/FilmRow.tsx
// Ligne d'un film dans le tableau admin
import { useState } from "react";
import { ChevronDown, ChevronUp, Mail, Youtube } from "lucide-react";
import StatusBadge from "./StatusBadge";
import DecisionButtons from "./DecisionButtons";
import type { AdminFilm, DecisionAction, BadgeType } from "../AdminTypes";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

function formatDuration(sec: number) {
    return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
}

interface FilmRowProps {
    film: AdminFilm;
    index: number;
    onDecision: (filmId: string, action: DecisionAction, badge?: BadgeType) => Promise<void>;
    onEmail: (filmId: string) => void;
}

export default function FilmRow({ film, index, onDecision, onEmail }: FilmRowProps) {
    const [expanded, setExpanded] = useState(false);

    return (
        <>
            {/* Ligne principale */}
            <tr
                className="border-b transition-colors cursor-pointer"
                style={{
                    borderColor: "rgba(255,255,255,.05)",
                    background: expanded ? "rgba(125,113,251,.05)" : "transparent",
                }}
                onClick={() => setExpanded((v) => !v)}
            >
                {/* # */}
                <td className="px-3 py-3">
                    <span className="f-mono text-[9px] text-white/25">
                        {String(index).padStart(2, "0")}
                    </span>
                </td>

                {/* Film (poster miniature + titre + synopsis) */}
                <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                        {film.poster_url && (
                            <img
                                src={`${BASE}${film.poster_url}`}
                                alt={film.title}
                                className="w-8 h-10 object-cover rounded shrink-0"
                                style={{ border: "1px solid rgba(255,255,255,.08)" }}
                            />
                        )}
                        <div className="min-w-0">
                            <p className="f-mono text-[10px] text-white/85 font-medium truncate max-w-[180px]">
                                {film.title}
                            </p>
                            <p className="f-mono text-[8px] text-white/35 truncate max-w-[180px] mt-0.5">
                                {film.synopsis}
                            </p>
                        </div>
                    </div>
                </td>

                {/* Pays + durée */}
                <td className="px-3 py-3">
                    <p className="f-mono text-[9px] text-white/55">{film.country}</p>
                    <p className="f-mono text-[8px] text-white/30">{formatDuration(film.duration_seconds)}</p>
                </td>

                {/* Réalisateur */}
                <td className="px-3 py-3">
                    <p className="f-mono text-[9px] text-white/55 truncate max-w-[140px]">
                        {film.director_name}
                    </p>
                    <p className="f-mono text-[8px] text-white/25 truncate max-w-[140px]">
                        {film.director_email}
                    </p>
                </td>

                {/* Jury votes */}
                <td className="px-3 py-3 text-center">
                    <span className="f-mono text-[10px] text-white/50">{film.jury_votes}</span>
                </td>

                {/* Statut */}
                <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                    <StatusBadge status={film.status} />
                </td>

                {/* Badge prix */}
                <td className="px-3 py-3">
                    {film.badge === "grand_prix" && (
                        <span className="f-mono text-[8px] text-orange-400">🏆 Grand Prix</span>
                    )}
                    {film.badge === "prix_jury" && (
                        <span className="f-mono text-[8px] text-violet-400">★ Prix du Jury</span>
                    )}
                </td>

                {/* YouTube */}
                <td className="px-3 py-3">
                    {film.youtube_private_id ? (
                        <a
                            href={`https://youtube.com/watch?v=${film.youtube_private_id}`}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1 text-red-400 hover:opacity-70 transition-opacity"
                        >
                            <Youtube size={12} />
                            <span className="f-mono text-[8px]">En ligne</span>
                        </a>
                    ) : (
                        <span className="f-mono text-[8px] text-white/20">—</span>
                    )}
                </td>

                {/* Actions */}
                <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                        <DecisionButtons
                            filmId={film.id}
                            currentBadge={film.badge}
                            onDecision={onDecision}
                        />
                        {/* Envoyer email */}
                        <button
                            title="Envoyer email"
                            onClick={() => onEmail(film.id)}
                            className="w-6 h-6 rounded flex items-center justify-center transition-all hover:opacity-80"
                            style={{
                                background: "rgba(125,113,251,.1)",
                                border: "1px solid rgba(125,113,251,.2)",
                                color: "var(--col-vi)",
                            }}
                        >
                            <Mail size={11} />
                        </button>
                    </div>
                </td>

                {/* Expand */}
                <td className="px-3 py-3">
                    {expanded
                        ? <ChevronUp size={12} className="text-white/30" />
                        : <ChevronDown size={12} className="text-white/30" />
                    }
                </td>
            </tr>

            {/* Ligne détail  */}
            {expanded && (
                <tr style={{ background: "rgba(125,113,251,.03)", borderBottom: "1px solid rgba(255,255,255,.05)" }}>
                    <td colSpan={10} className="px-6 py-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <p className="f-mono text-[8px] tracking-widest uppercase text-white/25 mb-1">Catégorie</p>
                                <p className="f-mono text-[9px] text-white/60">{film.category}</p>
                            </div>
                            <div>
                                <p className="f-mono text-[8px] tracking-widest uppercase text-white/25 mb-1">Outils IA</p>
                                <div className="flex flex-wrap gap-1">
                                    {film.ai_tools.map((t) => (
                                        <span key={t} className="f-mono text-[7px] px-1.5 py-0.5 rounded"
                                            style={{ background: "rgba(125,113,251,.15)", color: "rgba(125,113,251,.9)" }}>
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className="f-mono text-[8px] tracking-widest uppercase text-white/25 mb-1">Soumis le</p>
                                <p className="f-mono text-[9px] text-white/60">
                                    {new Date(film.created_at).toLocaleDateString("fr-FR")}
                                </p>
                            </div>
                            {film.video_url && (
                                <div>
                                    <p className="f-mono text-[8px] tracking-widest uppercase text-white/25 mb-1">Vidéo</p>
                                    <a
                                        href={`${BASE}${film.video_url}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="f-mono text-[9px] underline"
                                        style={{ color: "var(--col-vi)" }}
                                    >
                                        Voir la vidéo →
                                    </a>
                                </div>
                            )}
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
}