import { useEffect, useState, useCallback, useRef } from "react";
import { Check, X, RotateCcw, ChevronRight, Search, MoonStar } from "lucide-react";
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
        <div className="min-h-screen px-4 md:px-6 py-4 md:py-5" style={{ background: "var(--col-bg)" }}>
            <div className="mx-auto max-w-[1500px] space-y-3">
                <header
                    className="h-14 md:h-16 rounded-xl px-4 md:px-6 flex items-center justify-between"
                    style={{
                        border: "1px solid rgba(255,255,255,.08)",
                        background: "rgba(9, 6, 22, .84)",
                        backdropFilter: "blur(8px)",
                    }}
                >
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ background: "var(--col-or)" }} />
                        <span className="f-orb text-[14px] md:text-[16px] tracking-wide text-white/95 uppercase">
                            MARS<span style={{ color: "var(--col-or)" }}>AI</span> · Jury
                        </span>
                    </div>

                    <div className="hidden md:flex items-center gap-4 lg:gap-6">
                        {stats && [
                            { value: stats.total, label: "Films", color: "text-white" },
                            { value: stats.voted, label: "Votés", color: "text-emerald-300" },
                            { value: stats.remaining, label: "Restants", color: "text-amber-300" },
                            { value: `${stats.progress}%`, label: "Progression", color: "text-violet-300" },
                        ].map(({ value, label, color }) => (
                            <div key={label} className="flex flex-col items-center leading-none">
                                <span className={`f-orb text-[17px] font-black ${color}`}>{value}</span>
                                <span className="f-mono text-[8px] tracking-widest uppercase text-white/35 mt-0.5">{label}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        <LangBadge label="FR" active />
                        <LangBadge label="EN" />
                        <button
                            className="w-7 h-7 rounded-full flex items-center justify-center"
                            style={{ border: "1px solid rgba(255,255,255,.18)", background: "rgba(255,255,255,.03)" }}
                        >
                            <MoonStar size={12} className="text-white/70" />
                        </button>
                    </div>
                </header>

                <section
                    className="rounded-xl px-3 md:px-4 py-3 flex flex-col lg:flex-row lg:items-center gap-3"
                    style={{ border: "1px solid rgba(255,255,255,.08)", background: "rgba(10, 7, 24, .7)" }}
                >
                    <div className="relative flex-1 min-w-0">
                        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                        <input
                            className="submit-input pl-9 h-10"
                            placeholder="Rechercher..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-1.5">
                        {(["all", "remaining", "voted"] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className="f-mono text-[9px] tracking-widest uppercase px-3 py-2 rounded-md transition-all"
                                style={{
                                    background: filter === f ? "rgba(125, 113, 251, .18)" : "rgba(255,255,255,.01)",
                                    color: filter === f ? "rgba(198, 191, 255, .95)" : "rgba(255, 255, 255, .45)",
                                    border: `1px solid ${filter === f ? "rgba(125,113,251,.45)" : "rgba(255,255,255,.1)"}`,
                                }}
                            >
                                {f === "all" ? "Tous" : f === "remaining" ? "Restants" : "Votés"}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-3 lg:ml-auto">
                        <span className="f-mono text-[9px] uppercase tracking-widest text-white/40">
                            Progression
                        </span>
                        <div className="w-32 md:w-40 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,.08)" }}>
                            <div
                                className="h-full rounded-full"
                                style={{
                                    width: `${stats?.progress ?? 0}%`,
                                    background: "linear-gradient(90deg, rgba(125,113,251,.95), rgba(255,92,53,.85))",
                                }}
                            />
                        </div>
                        <span className="f-mono text-[10px] text-white/65 min-w-[48px] text-right">
                            {stats?.voted ?? 0}/{stats?.total ?? 0}
                        </span>
                    </div>
                </section>

                <div className="grid grid-cols-1 xl:grid-cols-[280px_minmax(0,1fr)] gap-3 min-h-[580px] h-[calc(100vh-170px)]">
                    <aside
                        className="rounded-xl overflow-hidden flex flex-col"
                        style={{ border: "1px solid rgba(255,255,255,.08)", background: "rgba(8, 5, 20, .72)" }}
                    >
                        <div className="px-3 py-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,.08)" }}>
                            <p className="f-mono text-[9px] tracking-widest uppercase text-white/80">
                                {filtered.length} film{filtered.length !== 1 ? "s" : ""} assigné{filtered.length !== 1 ? "s" : ""}
                            </p>
                        </div>

                        <div className="overflow-y-auto p-1.5 space-y-1">
                            {filtered.map((film, i) => (
                                <FilmListItem
                                    key={film.id}
                                    film={film}
                                    index={i + 1}
                                    isActive={selected?.id === film.id}
                                    onClick={() => selectFilm(film)}
                                />
                            ))}
                        </div>
                    </aside>

                    <main className="overflow-y-auto pr-1">
                        {selected ? (
                            <div className="space-y-3">
                                <VideoPlayer videoUrl={selected.video_url} />

                                <div
                                    className="rounded-xl p-4 space-y-3"
                                    style={{ border: "1px solid rgba(255,255,255,.08)", background: "rgba(10, 7, 24, .66)" }}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h2 className="f-orb text-[20px] font-bold text-white">{selected.title}</h2>
                                            <p className="f-mono text-[10px] text-white/45 mt-0.5">
                                                {getFlag(selected.country)} {selected.country} · {formatDuration(selected.duration_seconds)}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {selected.my_vote && (
                                                <span className="f-mono text-[9px] px-3 py-1 rounded-md shrink-0" style={voteColor(selected.my_vote)}>
                                                    {selected.my_vote === "validate" ? "✓ Validé" : selected.my_vote === "refuse" ? "✗ Refusé" : "↻ À revoir"}
                                                </span>
                                            )}
                                            <span
                                                className="f-mono text-[9px] px-3 py-1 rounded-md"
                                                style={{
                                                    border: "1px solid rgba(255,255,255,.15)",
                                                    background: "rgba(255,255,255,.03)",
                                                    color: "rgba(255,255,255,.75)",
                                                }}
                                            >
                                                À voter
                                            </span>
                                        </div>
                                    </div>

                                    <p className="f-mono text-[11px] text-white/52 leading-relaxed">{selected.synopsis}</p>

                                    <div className="flex gap-1.5 flex-wrap">
                                        {selected.ai_tools.map((t) => (
                                            <span
                                                key={t}
                                                className="f-mono text-[8px] px-2.5 py-1 rounded-md"
                                                style={{ background: "rgba(125,113,251,.14)", color: "rgba(190,183,255,.92)", border: "1px solid rgba(125,113,251,.28)" }}
                                            >
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div
                                    className="rounded-xl p-4 space-y-4"
                                    style={{ border: "1px solid rgba(255,255,255,.08)", background: "rgba(10, 7, 24, .66)" }}
                                >
                                    <p className="f-mono text-[9px] tracking-widest uppercase text-white/35">Mon vote</p>

                                    <div className="grid grid-cols-3 gap-3">
                                        <VoteButton
                                            action="validate"
                                            label="Valider"
                                            icon={<Check size={16} />}
                                            selected={vote === "validate"}
                                            onClick={() => setVote("validate")}
                                        />
                                        <VoteButton
                                            action="refuse"
                                            label="Refuser"
                                            icon={<X size={16} />}
                                            selected={vote === "refuse"}
                                            onClick={() => setVote("refuse")}
                                        />
                                        <VoteButton
                                            action="review"
                                            label="À revoir"
                                            icon={<RotateCcw size={16} />}
                                            selected={vote === "review"}
                                            onClick={() => setVote("review")}
                                        />
                                    </div>

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

                                    <div className="flex items-center justify-between gap-3">
                                        <button
                                            onClick={() => {
                                                const idx = films.findIndex((f) => f.id === selected.id);
                                                const next = films[idx + 1];
                                                if (next) selectFilm(next);
                                            }}
                                            className="f-mono text-[9px] tracking-widest uppercase text-white/38 flex items-center gap-1 hover:text-white/70 transition-colors"
                                        >
                                            Film suivant <ChevronRight size={12} />
                                        </button>

                                        <button
                                            onClick={submitVote}
                                            disabled={!vote || submitting}
                                            className="f-mono text-[10px] tracking-widest uppercase px-5 py-2 rounded-lg font-bold transition-all"
                                            style={{
                                                background: vote && !submitting ? "linear-gradient(90deg, var(--col-vi), var(--col-or))" : "rgba(255,255,255,.08)",
                                                color: vote && !submitting ? "black" : "rgba(255,255,255,.2)",
                                                cursor: vote && !submitting ? "pointer" : "not-allowed",
                                            }}
                                        >
                                            {submitting ? "Envoi..." : "Envoyer le vote"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div
                                className="h-full rounded-xl flex items-center justify-center"
                                style={{ border: "1px solid rgba(255,255,255,.08)", background: "rgba(10, 7, 24, .66)" }}
                            >
                                <p className="f-mono text-[11px] text-white/25 tracking-widest">Aucun film assigné.</p>
                            </div>
                        )}
                    </main>
                </div>
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
        <button
            onClick={onClick}
            className="w-full text-left px-3.5 py-2.5 rounded-lg transition-all"
            style={{
                background: isActive ? "linear-gradient(90deg, rgba(125,113,251,.14), rgba(125,113,251,.04))" : "rgba(255,255,255,.01)",
                border: `1px solid ${isActive ? "rgba(125,113,251,.35)" : "rgba(255,255,255,.08)"}`,
                boxShadow: isActive ? "inset 2px 0 0 0 var(--col-vi)" : "none",
            }}
        >
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                    <span className="f-mono text-[8px] text-white/28 shrink-0">#{String(index).padStart(2, "0")}</span>
                    <span className="f-mono text-[10px] text-white/85 truncate font-medium">{film.title}</span>
                </div>

                <div className="w-1.5 h-1.5 rounded-full shrink-0 ml-2" style={{ background: dotColor }} />
            </div>
            <p className="f-mono text-[8px] text-white/35 mt-1 ml-6">
                {film.country} · {formatDuration(film.duration_seconds)}
            </p>
        </button>
    );
}

function VideoPlayer({ videoUrl }: { videoUrl: string | null }) {
    const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";
    const src = videoUrl ? `${BASE}${videoUrl}` : null;

    return (
        <div
            className="rounded-xl overflow-hidden flex items-center justify-center"
            style={{
                background: "rgba(1, 1, 2, .88)",
                border: "1px solid rgba(255,255,255,.08)",
                aspectRatio: "16/9",
            }}
        >
            {src ? (
                <video key={src} controls className="w-full h-full object-contain">
                    <source src={src} type="video/mp4" />
                </video>
            ) : (
                <p className="f-mono text-[10px] text-white/30 tracking-widest">Aucune vidéo liée à ce film</p>
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
        <button
            onClick={onClick}
            className="flex flex-col items-center gap-2 py-4 rounded-lg transition-all"
            style={{
                border: `1px solid ${selected ? colors[action].border : "rgba(255,255,255,.1)"}`,
                background: selected ? colors[action].active : "rgba(255,255,255,.015)",
                color: selected ? "white" : "rgba(255,255,255,.42)",
            }}
        >
            {icon}
            <span className="f-mono text-[9px] tracking-widest uppercase">{label}</span>
        </button>
    );
}

function LangBadge({ label, active = false }: { label: string; active?: boolean }) {
    return (
        <button
            className="w-7 h-7 rounded-full f-mono text-[8px] tracking-widest flex items-center justify-center"
            style={{
                border: `1px solid ${active ? "rgba(125,113,251,.8)" : "rgba(255,255,255,.18)"}`,
                color: active ? "rgba(210, 204, 255, .98)" : "rgba(255,255,255,.7)",
                background: active ? "rgba(125,113,251,.17)" : "rgba(255,255,255,.03)",
            }}
        >
            {label}
        </button>
    );
}