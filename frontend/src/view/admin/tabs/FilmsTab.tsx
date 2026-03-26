import { useState, useCallback } from "react";
import { Search, RefreshCw, ChevronsUpDown } from "lucide-react";
import FilmRow, { FilmRowModal } from "../components/FilmRow.tsx";
import type { AdminFilm, FilmStatus, DecisionAction, BadgeType } from "../AdminTypes";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";
const getToken = () => localStorage.getItem("jwt_token") ?? "";

const STATUS_FILTERS: { value: FilmStatus | "all"; label: string }[] = [
    { value: "all", label: "Tous statuts" },
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
    const [showComments, setShowComments] = useState(false);
    const [selectedFilmId, setSelectedFilmId] = useState<string | null>(null);

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
            <div className="grid grid-cols-[minmax(0,1fr)_260px_160px] items-center gap-3 w-full">
                <div className="relative min-w-0">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                        className="submit-input h-12 pr-4"
                        style={{ paddingLeft: "2.5rem" }}
                        placeholder="Rechercher par titre, réalisateur, pays ou ID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="relative">
                    <select
                        className="submit-input h-12 !w-full appearance-none pl-4 pr-10"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as FilmStatus | "all")}
                    >
                        {STATUS_FILTERS.map(({ value, label }) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                    <ChevronsUpDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/40" />
                </div>

                <button onClick={onRefresh} className="h-12 px-5 rounded-xl f-mono text-[10px] tracking-widest uppercase inline-flex items-center justify-center gap-2 transition-opacity hover:opacity-80" style={{ border: "1px solid rgba(125,113,251,.35)", color: "rgba(202,195,255,.95)", background: "rgba(125,113,251,.08)" }}>
                    <RefreshCw size={11} />
                    Rafraîchir
                </button>
            </div>

            {/* Barre de progression sélection officielle */}
            <div className="pt-2 pb-1 px-1">
                <div className="flex items-center gap-4">
                    <span className="f-mono text-[15px] text-white/60 tracking-widest">Sélection officielle</span>
                    <div className="flex-1 flex items-center">
                        <div className="w-full h-2 rounded-full bg-white/10 relative overflow-hidden">
                            <div
                                className="absolute left-0 top-0 h-2 rounded-full bg-[#a892fd]"
                                style={{ width: `${Math.min((films.filter(f => f.status === "selected").length / 50) * 100, 100)}%`, transition: 'width 0.4s cubic-bezier(.4,1.2,.4,1)' }}
                            />
                        </div>
                    </div>
                    <span className="f-orb text-[18px] text-[#a892fd] font-bold ml-4">{films.filter(f => f.status === "selected").length}/50</span>
                </div>
            </div>


            {/* Tableau */}
            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,.08)" }}>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr style={{ borderBottom: "1px solid rgba(255,255,255,.08)", background: "rgba(255,255,255,.03)" }}>
                                {[
                                    "", "Film · Réalisateur", "Pays · Durée",
                                    "Jury assigné", "Commentaires", "Statut",
                                    "Badge", "Lien YouTube", "E-mail",
                                ].map((h) => (
                                    <th key={h} className="px-3 py-2.5 text-left">
                                        <span className="f-mono text-[8px] tracking-widest uppercase text-white/30">{h}</span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="px-6 py-10 text-center">
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
                                        onCommentClick={() => {
                                            setSelectedFilmId(film.id);
                                            setShowComments(true);
                                        }}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedFilmId && (
                <FilmRowModal
                    film={films.find((f) => f.id === selectedFilmId)!}
                    open={showComments}
                    onClose={() => {
                        setShowComments(false);
                        setSelectedFilmId(null);
                    }}
                />
            )}
        </div >
    )

}