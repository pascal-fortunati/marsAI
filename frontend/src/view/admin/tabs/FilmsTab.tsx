import { useState, useCallback } from "react";
import { Search, RefreshCw } from "lucide-react";
import FilmRow from "../components/FilmRow";
import type { AdminFilm, FilmStatus, DecisionAction, BadgeType } from "../AdminTypes";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";
const getToken = () => localStorage.getItem("jwt_token") ?? "";

const STATUS_FILTERS: { value: FilmStatus | "all"; label: string }[] = [
    { value: "all", label: "Tous" },
    { value: "pending", label: "En attente" },
    { value: "validated", label: "Validés" },
    { value: "review", label: "À revoir" },
    { value: "refused", label: "Refusés" },
    { value: "selected", label: "Sélectionnés" },
];

interface FilmTabProps {
    films: AdminFilm[];
    onRefresh: () => void;
}

export default function FilmsTab({ films, onRefresh }: FilmTabProps) {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<FilmStatus | "all">("all");

    // Films filtrés
    const filtered = films.filter((f) => {
        const matchSearch = [f.title, f.director_name, f.director_email, f.country].join(" ").toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === "all" || f.status == statusFilter;
        return matchSearch && matchStatus;
    });

    // Envoie la décision admin au backend
    const handleDecision = useCallback(async (
        filmId: string,
        action: DecisionAction,
        badge?: BadgeType
    ) => {
        await fetch(`${BASE}/api/admin/decisions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify({ submission_id: filmId, decision: action, badge: badge ?? null }),
        });
        onRefresh();
    }, [onRefresh]);

    // Envoie un email au réalisateur
    const handleEmail = useCallback(async (filmId: string) => {
        await fetch(`${BASE}/api/admin/email/send`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify({ submission_id: filmId }),
        });
        onRefresh();
    }, [onRefresh]);

    return (
        <div className="space-y-4">

            {/* Barre de recherche + filtres */}
            <div className="flex items-center gap-3 flex-wrap">
                <div className="relative flex-1 min-w-48">
                    <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
                    <input className="submit-input pl-8" placeholder="Rechercher par titre, réalisateur, pays..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>

                <select
                    className="submit-input w-auto"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as FilmStatus | "all")}
                >
                    {STATUS_FILTERS.map(({ value, label }) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
                </select>

                <button onClick={onRefresh} className="flex items-center gap-1.5 px-3 rounded-xl f-mono text-[9px] tracking-widest uppercase transition-opacity hover:opacity-70" style={{ border: "1px solid rgba(255,255,255,.1)", color: "rgba(255,255,255,.4)" }}>
                    <RefreshCw size={11} />
                    Actualiser
                </button>
            </div>

            <p className="f-mono text-[9px] text-white/30 tracking-widest">
                Sélection affichée : {filtered.length} / {films.length}
            </p>

            {/* Tableau */}
            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,.08)" }}>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr style={{ borderBottom: "1px solid rgba(255,255,255,.08)", background: "rgba(255,255,255,.03)" }}>
                                {[
                                    "#", "Film / Réalisateur", "Pays / Durée",
                                    "Sous-mission", "Commentaires", "Statut",
                                    "Badge", "Lien YouTube", "F-Mail",
                                ].map((h) => (
                                    <th key={h} className="px-3 py-2.5 text-left">
                                        <span className="f-mono text-[8px] tracking-widest uppercase text-white/30">{h}</span>
                                    </th>
                                ))}
                                <th />
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={10} className="px-6 py-10 text-center">
                                        <p className="f-mono text-[10px] text-white/25 tracking-widest">
                                            Aucun film trouvé
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((film, i) => (
                                    <FilmRow
                                        key={film.id}
                                        film={film}
                                        index={i + 1}
                                        onDecision={handleDecision}
                                        onEmail={handleEmail}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    )

}