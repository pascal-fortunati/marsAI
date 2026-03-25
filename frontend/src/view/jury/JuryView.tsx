import { useEffect, useState, useCallback } from "react";
import { Check, X, RotateCcw, Play, ChevronRight } from "lucide-react";
import type { JuryFilm, JuryStats, VoteAction } from "./juryTypes";
import { formatDuration, getFlag, voteColor } from "./juryHelpers";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

// Token JWT stocké après connextion Google Auth
const getToken = () => localStorage.getItem("jwt_token") ?? "";

export default function JuryView() {
    const [films, setFilms] = useState<JuryFilm[]>([]);
    const [stats, setStats] = useState<JuryStats | null>(null);
    const [selected, setSelected] = useState<JuryFilm | null>(null);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<"all" | "remaining" | "voted">("all");
    const [vote, setVote] = useState<VoteAction | null>(null);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    // Charge les films assignés au jury
    const load = useCallback(async () => {
        const res = await fetch(`${BASE}/jury/films`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        });
        const data = await res.json();
        setFilms(data.films ?? []);
        setStats(data.stats ?? null);
        // Sélectionne le premier film par défaut
        if (!selected && data.films?.length > 0) {
            selectFilm(data.films[0]);
        }
        setLoading(false);
    }, []);

    useEffect(() => { load(); }, [load]);

    const selectFilm = (film: JuryFilm) => {
        setSelected(film);
        setVote(film.my_vote);
        setComment(film.my_comment ?? "");
    };

    // Soumet le vote
    const submitVote = async () => {
        if (!selected || !vote) return;
        setSubmitting(true);
        try {
            await fetch(`${BASE}/api/jury/vote`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({
                    submission_id: selected.id,
                    action: vote,
                    comment: comment || null,
                }),
            });
            await load();
            const nextUnvoted = films.find((f) => f.id !== selected.id && f.my_vote === null);
            if (nextUnvoted) selectFilm(nextUnvoted);
        } finally {
            setSubmitting(false);
        }
    };

    // Films filtrés selon la rechercge et le filtre actif
    const filtered = films.filter((f) => {
        const matchSearch = f.title.toLowerCase().includes(search.toLowerCase());
        const matchFilter =
            filter === "all" ? true :
                filter === "voted" ? f.my_vote !== null :
                    filter === "remaining" ? f.my_vote === null : true;
        return matchSearch && matchFilter;
    });

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--col-bg)" }}>
            <p className="f-mono text-[11px] text-white/30 tracking-widest animate-pulse">
                Chargement...
            </p>
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col" style={{ background: "var(--col-bg)" }}>
            <header className="flex items-center justify-between px-6 h-14 shrink-0" style={{ borderBottom: "1px solid rgba(255, 255, 255, .06)", background: "rgba(5, 3, 13, .9)" }}>
                {/* Stats */}
                <div className="flex items-center gap-6">
                    {stats && [
                        { value: stats.total, label: "Films", color: "text-white" },
                        { value: stats.voted, label: "Votés", color: "text-green-400" },
                        { value: stats.remaining, label: "Restants", color: "text-orange-400" },
                        { value: `${stats.progress}%`, label: "Progression", color: "text-violet-400" },
                    ].map(({ value, label, color }) => (
                        <div key={label} className="flex flex-col items-center">
                            <span className={`f-orb text-lg font-black ${color}`}>{value}</span>
                            <span className="f-mono text-[8px] tracking-widest uppercase text-white/30">{label}</span>
                        </div>
                    ))}
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Contenu de gauche */}
                <aside className="w-72 shrink-0 flex flex-col overflow-hidden" style={{ borderRight: "1px solid rgba(255, 255, 255, .06)" }}>
                    {/* Recherche et filtres */}
                    <div className="p-3 space-y-2 shrink-0" style={{ borderBottom: "1px solid rgba(255, 255, 255, .06)" }}>
                        <input className="submit-input" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} />
                        <div className="flex gap-1">
                            {(["all", "remaining", "voted"] as const).map((f) => (
                                <button key={f} onClick={() => setFilter(f)} className="f-mono text-[8px] tracking-widest uppercase px-2.5 py-1 rounded-full transition-all flex-1" style={{
                                    background: filter === f ? "rgba(125, 113, 251, .2)" : "transparent",
                                    color: filter === f ? "var(--col-vi)" : "rgba(255, 255, 255, .03)",
                                    border: `1px solid ${filter === f ? "rgba(125,113,251,.4)" : "rgba(255,255,255,.08)"}`,
                                }}>
                                    {f === "all" ? "Tous" : f === "remaining" ? "Restants" : "Votés"}
                                </button>
                            ))}
                        </div>

                        {/* Barre de progression */}
                        {stats && (
                            <div className="flex items-center gap-2">
                                <div className="flex-1 h-1 rounded-full" style={{ background: "rgba(255, 255, 255, .08)" }}>
                                    <div className="h-1 rounded-full transition-all" style={{ width: `${stats.progress}%`, background: "rgba(125, 113, 251, 0.8)" }}></div>
                                </div>
                            </div>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    );
}