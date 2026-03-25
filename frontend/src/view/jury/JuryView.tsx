import { useEffect, useState, useCallback, useRef } from "react";
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
    const hasInitialized = useRef(false);

    // Charge les films assignés au jury
    const load = useCallback(async () => {
        try {
            const res = await fetch(`${BASE}/jury/films`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (!res.ok) {
                setLoading(false);
                return;
            }
            const data = await res.json();
            setFilms(data.films ?? []);
            setStats(data.stats ?? null);
            // Sélectionne le premier film par défaut
            if (data.films?.length > 0 && !hasInitialized.current) {
                setSelected(data.films[0]);
                setVote(data.films[0].my_vote);
                setComment(data.films[0].my_comment ?? "");
                hasInitialized.current = true;
            }
        } catch (err) {
            console.error("Erreur chargement jury:", err);
        } finally {
            setLoading(false);
        }
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
            <div className="text-center">
                <p className="f-mono text-[11px] text-white/30 tracking-widest animate-pulse">
                    Chargement...
                </p>
                <p className="f-mono text-[9px] text-white/20 mt-2">
                    Token: {getToken() ? "✓" : "✗"} | API: {BASE}
                </p>
            </div>
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
                                    <div className="h-1 rounded-full transition-all" style={{ width: `${stats.progress}%`, background: "rgba(125, 113, 251, 0.8)" }}>
                                        <span className="f-mono text-[8px] text-white/30">
                                            {stats.voted}/{stats.total}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Nombre de films */}
                        <p className="f-mono text-[9px] text-white/30 px-4 py-2 shrink-0">
                            {filtered.length} film{filtered.length !== 1 ? "s" : ""} assigné{filtered.length !== 1 ? "s" : ""}
                        </p>

                        {/* Liste */}
                        <div className="overflow-y-auto flex-1">
                            {filtered.map((film, i) => (
                                <FilmListItem key={film.id} film={film} index={i + 1} isActive={selected?.id === film.id} onClick={() => selectFilm(film)} />
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Contenu principal */}
                <main className="flex-1 overflow-y-auto p-6">
                    {selected ? (
                        <div className="space-y-6">
                            {/* Lecteur vidéo */}
                            <VideoPlayer videoUrl={selected.video_url} />

                            {/* Infos film */}
                            <div className="rounded-xl p-5 space-y-3"
                                style={{ border: "1px solid rgba(255,255,255,.08)", background: "rgba(255,255,255,.02)" }}>
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h2 className="f-orb text-xl font-bold text-white">{selected.title}</h2>
                                        <p className="f-mono text-[10px] text-white/40 mt-0.5">
                                            {getFlag(selected.country)} {selected.country} · {formatDuration(selected.duration_seconds)}
                                        </p>
                                    </div>
                                    {/* Badge vote existant */}
                                    {selected.my_vote && (
                                        <span className="f-mono text-[9px] px-3 py-1 rounded-full shrink-0"
                                            style={voteColor(selected.my_vote)}>
                                            {selected.my_vote === "validate" ? "✓ Validé"
                                                : selected.my_vote === "refuse" ? "✗ Refusé"
                                                    : "↻ À revoir"}
                                        </span>
                                    )}
                                </div>
                                <p className="f-mono text-[11px] text-white/50 leading-relaxed">{selected.synopsis}</p>
                                {/* Outils IA */}
                                <div className="flex gap-2 flex-wrap">
                                    {selected.ai_tools.map((t) => (
                                        <span key={t} className="f-mono text-[8px] px-2 py-0.5 rounded"
                                            style={{ background: "rgba(125,113,251,.15)", color: "rgba(125,113,251,.9)" }}>
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Panneau de vote */}
                            <div className="rounded-xl p-5 space-y-4"
                                style={{ border: "1px solid rgba(255,255,255,.08)", background: "rgba(255,255,255,.02)" }}>
                                <p className="f-mono text-[9px] tracking-widest uppercase text-white/30">Mon vote</p>

                                {/* 3 boutons de vote */}
                                <div className="grid grid-cols-3 gap-3">
                                    <VoteButton action="validate" label="Valider" icon={<Check size={16} />}
                                        selected={vote === "validate"} onClick={() => setVote("validate")} />
                                    <VoteButton action="refuse" label="Refuser" icon={<X size={16} />}
                                        selected={vote === "refuse"} onClick={() => setVote("refuse")} />
                                    <VoteButton action="review" label="À revoir" icon={<RotateCcw size={16} />}
                                        selected={vote === "review"} onClick={() => setVote("review")} />
                                </div>

                                {/* Commentaire */}
                                <div>
                                    <p className="f-mono text-[9px] tracking-widest uppercase text-white/30 mb-1.5">
                                        Commentaire <span className="text-white/15">(optionnel)</span>
                                    </p>
                                    <textarea
                                        className="submit-input resize-none h-20"
                                        placeholder="Votre commentaire..."
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                    />
                                </div>

                                {/* Actions bas */}
                                <div className="flex items-center justify-between">
                                    {/* Film suivant */}
                                    <button
                                        onClick={() => {
                                            const idx = films.findIndex((f) => f.id === selected.id);
                                            const next = films[idx + 1];
                                            if (next) selectFilm(next);
                                        }}
                                        className="f-mono text-[9px] tracking-widest uppercase text-white/30 flex items-center gap-1 hover:text-white/60 transition-colors">
                                        Film suivant <ChevronRight size={12} />
                                    </button>

                                    {/* Bouton voter */}
                                    <button
                                        onClick={submitVote}
                                        disabled={!vote || submitting}
                                        className="f-mono text-[11px] tracking-widest uppercase px-6 py-2.5 rounded-xl font-bold text-black transition-all hover:opacity-90 active:scale-95"
                                        style={{
                                            background: vote && !submitting
                                                ? "linear-gradient(90deg, var(--col-vi), var(--col-or))"
                                                : "rgba(255,255,255,.08)",
                                            color: vote && !submitting ? "black" : "rgba(255,255,255,.2)",
                                            cursor: vote && !submitting ? "pointer" : "not-allowed",
                                        }}>
                                        {submitting ? "Envoi..." : "Voter"}
                                    </button>
                                </div>
                            </div>
                        </div>) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="f-mono text-[11px] text-white/25 tracking-widest">
                                Aucun film assigné.
                            </p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

// Composants internes
function FilmListItem({ film, index, isActive, onClick }: {
    film: JuryFilm; index: number; isActive: boolean; onClick: () => void;
}) {
    const dotColor =
        film.my_vote === "validate" ? "#4ade80" :
            film.my_vote === "refuse" ? "#f87171" :
                film.my_vote === "review" ? "#fb923c" :
                    "rgba(255, 255, 255, .2)";

    return (
        <button onClick={onClick} className="w-full text-left px-4 py-3 transition-all" style={{
            background: isActive ? "rgba(125, 113, 251, .1)" : "transparent",
            borderLeft: isActive ? "2px solid var(--col-vi)" : "2px solid transparent",
            borderBottom: "1px solid rgba(255, 255, 255, .04)",
        }}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                    <span className="f-mono text-[8px] text-white/25 shrink-0">
                        #{String(index).padStart(2, "0")}
                    </span>
                    <span className="f-mono text-[10px] text-white/80 truncate font-medium">
                        {film.title}
                    </span>
                </div>

                {/* Indicateur vote */}
                <div className="w-2 h-2 rounded-full shrink-0 ml-2"
                    style={{ background: dotColor }} />
            </div>
            <p className="f-mono text-[8px] text-white/30 mt-0.5 ml-6">
                {film.country} · {formatDuration(film.duration_seconds)}
            </p>
        </button>
    );
}

function VideoPlayer({ videoUrl }: { videoUrl: string | null }) {
    const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";
    const src = videoUrl ? `${BASE}${videoUrl}` : null;

    return (
        <div className="rounded-xl overflow-hidden flex items-center justify-center"
            style={{
                background: "rgba(0,0,0,.5)",
                border: "1px solid rgba(255,255,255,.08)",
                aspectRatio: "16/9",
            }}>
            {src ? (
                <video key={src} controls className="w-full h-full object-contain">
                    <source src={src} type="video/mp4" />
                </video>
            ) : (
                <p className="f-mono text-[10px] text-white/25 tracking-widest">
                    Aucune vidéo liée à ce film
                </p>
            )}
        </div>
    );
}

function VoteButton({ action, label, icon, selected, onClick }: {
    action: VoteAction; label: string; icon: React.ReactNode;
    selected: boolean; onClick: () => void;
}) {
    const colors: Record<VoteAction, { active: string; border: string }> = {
        validate: { active: "rgba(74,222,128,.15)", border: "rgba(74,222,128,.4)" },
        refuse: { active: "rgba(248,113,113,.15)", border: "rgba(248,113,113,.4)" },
        review: { active: "rgba(251,146,60,.15)", border: "rgba(251,146,60,.4)" },
    };

    return (
        <button onClick={onClick}
            className="flex flex-col items-center gap-2 py-4 rounded-xl transition-all"
            style={{
                border: `1px solid ${selected ? colors[action].border : "rgba(255,255,255,.08)"}`,
                background: selected ? colors[action].active : "rgba(255,255,255,.02)",
                color: selected ? "white" : "rgba(255,255,255,.35)",
            }}>
            {icon}
            <span className="f-mono text-[9px] tracking-widest uppercase">{label}</span>
        </button>
    );
}