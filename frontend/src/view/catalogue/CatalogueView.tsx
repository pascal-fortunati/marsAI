import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, Play, ChevronLeft, ChevronRight } from "lucide-react";
import type { ComponentType } from "react";
import { getCatalogue, getFilmById } from "../../lib/catalogueApi";
import type { CatalogueFilm, CatalogueFilmDetail, CataloguePagination } from "./CatalogueTypes";
import FilmCard from "./FilmCard";
import { getCountryCode } from "../../lib/countryMapping";
import * as Flags from "country-flag-icons/react/3x2";

const PER_PAGE = 20;
const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";


// Helpers 

function formatDuration(secs: number): string {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
}

function posterSrc(film: CatalogueFilm): string {
    if (!film.poster_url) {
        return `https://placehold.co/400x225/0d0d1a/555?text=${encodeURIComponent(film.title)}`;
    }

    if (/^https?:\/\//i.test(film.poster_url)) {
        return film.poster_url;
    }

    const normalizedBase = API_BASE.replace(/\/$/, "");
    const normalizedPath = film.poster_url.startsWith("/") ? film.poster_url : `/${film.poster_url}`;
    return `${normalizedBase}${normalizedPath}`;
}

function mediaSrc(pathOrUrl: string): string {
    if (/^https?:\/\//i.test(pathOrUrl)) {
        return pathOrUrl;
    }

    const normalizedBase = API_BASE.replace(/\/$/, "");
    const normalizedPath = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
    return `${normalizedBase}${normalizedPath}`;
}

// FilmModal 

function FilmModal({ filmId, onClose }: { filmId: string; onClose: () => void }) {
    const [film, setFilm] = useState<CatalogueFilmDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getFilmById(filmId)
            .then(setFilm)
            .finally(() => setLoading(false));
    }, [filmId]);

    // Close on Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    const youtubeEmbed = film?.youtube_public_id
        ? `https://www.youtube.com/embed/${film.youtube_public_id}?autoplay=1&rel=0`
        : null;
    const uploadedVideo = film?.video_url ? mediaSrc(film.video_url) : null;
    const flagCode = getCountryCode(film?.country ?? "") ?? "";
    const FlagComponent = (Flags as Record<string, ComponentType<{ className?: string }>>)[flagCode];
    const durationLabel = film?.duration_seconds ? formatDuration(Number(film.duration_seconds)) : null;

    return createPortal(
        <div
            className="fixed inset-0 z-[80] flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/55 backdrop-blur-[1px]" />

            {/* Panel */}
            <div className="relative z-10 w-full max-w-[760px] rounded-2xl overflow-hidden
                      border border-white/15 bg-[#070812] shadow-2xl
                      max-h-[86vh] overflow-y-auto">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 z-50 w-8 h-8 rounded-md border border-white/30
                     bg-black/45 hover:bg-black/65 flex items-center justify-center transition-colors"
                >
                    <X className="w-4 h-4 text-white" />
                </button>

                {loading && (
                    <div className="flex items-center justify-center h-64">
                        <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                )}

                {film && (
                    <>
                        {/* Video player */}
                        <div className="relative aspect-video bg-black">
                            <ModalFilmStrip side="left" />
                            <ModalFilmStrip side="right" />

                            {youtubeEmbed ? (
                                <iframe
                                    src={youtubeEmbed}
                                    className="w-full h-full"
                                    allow="autoplay; fullscreen"
                                    allowFullScreen
                                />
                            ) : uploadedVideo ? (
                                <video
                                    src={uploadedVideo}
                                    className="w-full h-full object-contain"
                                    controls
                                    playsInline
                                    preload="metadata"
                                />
                            ) : film.poster_url ? (
                                <img src={posterSrc(film)} alt={film.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-black/50">
                                    <Play className="w-12 h-12 text-white/20" />
                                </div>
                            )}
                        </div>

                        {/* Meta */}
                        <div className="px-6 pt-4 pb-6">
                            <div className="flex items-center justify-between gap-3 mb-4">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                    {FlagComponent && <FlagComponent className="w-4 h-3 rounded-sm flex-shrink-0" />}
                                    {film.country && (
                                        <span className="font-mono text-[10px] tracking-widest uppercase text-white/55">
                                            {film.country}
                                        </span>
                                    )}
                                    {durationLabel && <span className="font-mono text-[10px] text-white/30">·</span>}
                                    {durationLabel && (
                                        <span className="font-mono text-[10px] text-white/65">{durationLabel}</span>
                                    )}
                                    {film.year && <span className="font-mono text-[10px] text-white/30">·</span>}
                                    {film.year && (
                                        <span className="font-mono text-[10px] text-white/55">{film.year}</span>
                                    )}
                                    {film.director_name && <span className="font-mono text-[10px] text-white/30">·</span>}
                                    {film.director_name && (
                                        <span className="font-mono text-[10px] text-white/58">{film.director_name}</span>
                                    )}
                                </div>

                                {film.prize && (
                                    <span
                                        className="font-mono text-[10px] tracking-wider px-3 py-1 rounded-lg font-bold whitespace-nowrap"
                                        style={{
                                            background: "rgba(255,255,255,0.06)",
                                            color: "rgba(255,255,255,0.8)",
                                            border: "1px solid rgba(255,255,255,0.25)",
                                        }}
                                    >
                                        ★ {film.prize.toUpperCase()}
                                    </span>
                                )}
                            </div>

                            <h2 className="f-orb font-black text-[26px] leading-tight text-white mb-4">{film.title}</h2>

                            <div className="h-px w-full mb-4" style={{ background: "rgba(255,255,255,0.09)" }} />

                            <p className="font-mono text-[15px] text-white/70 leading-[1.85] tracking-[0.03em] mb-4">
                                {film.synopsis}
                            </p>

                            <div className="h-px w-full mb-6" style={{ background: "rgba(255,255,255,0.09)" }} />

                            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/28 mb-2">
                                Outils IA :
                            </p>

                            <div className="flex flex-wrap gap-1.5">
                                {film.ai_tools?.map((tool) => (
                                    <span
                                        key={tool}
                                        className="font-mono text-[10px] tracking-wider px-2 py-1 rounded-md"
                                        style={{
                                            background: "rgba(125, 113, 251, 0.16)",
                                            color: "rgba(154, 145, 255, 0.95)",
                                            border: "1px solid rgba(125, 113, 251, 0.35)",
                                        }}
                                    >
                                        {tool}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>,
        document.body
    );
}

// Pagination 

function Pagination({ pagination, onPage }: { pagination: CataloguePagination; onPage: (p: number) => void }) {
    const { page, total_pages } = pagination;
    if (total_pages <= 1) return null;

    const pages = Array.from({ length: total_pages }, (_, i) => i + 1);

    return (
        <div className="flex items-center justify-center gap-2 mt-10">
            <button
                onClick={() => onPage(page - 1)}
                disabled={page === 1}
                className="w-7 h-7 rounded flex items-center justify-center border border-white/10
                   text-white/40 hover:text-white hover:border-white/30 disabled:opacity-20
                   disabled:cursor-not-allowed transition-colors"
            >
                <ChevronLeft className="w-4 h-4" />
            </button>

            {pages.map((p) => (
                <button
                    key={p}
                    onClick={() => onPage(p)}
                    className={`w-7 h-7 rounded text-xs font-mono transition-colors border
            ${p === page
                            ? "bg-violet-600 border-violet-500 text-white"
                            : "border-white/10 text-white/40 hover:border-white/30 hover:text-white"}`}
                >
                    {p}
                </button>
            ))}

            <button
                onClick={() => onPage(page + 1)}
                disabled={page === total_pages}
                className="w-7 h-7 rounded flex items-center justify-center border border-white/10
                   text-white/40 hover:text-white hover:border-white/30 disabled:opacity-20
                   disabled:cursor-not-allowed transition-colors"
            >
                <ChevronRight className="w-4 h-4" />
            </button>

            <span className="text-[10px] font-mono text-white/20 ml-2">
                Page {page} / {total_pages}
            </span>
        </div>
    );
}

function ModalFilmStrip({ side }: { side: "left" | "right" }) {
    const holes = Array.from({ length: 6 });
    const sideClass = side === "left" ? "left-0" : "right-0";

    return (
        <div
            className={`absolute inset-y-0 ${sideClass} z-10 w-[20px] flex flex-col justify-around items-center py-3 pointer-events-none`}
            style={{
                background:
                    "linear-gradient(180deg, rgb(88, 92, 104) 0%, rgb(54, 58, 70) 14%, rgb(28, 31, 40) 32%, rgb(13, 15, 22) 58%, rgb(4, 5, 9) 100%)",
            }}
        >
            {holes.map((_, i) => (
                <div
                    key={i}
                    style={{
                        width: "8px",
                        height: "14px",
                        background: "rgba(255,255,255,0.72)",
                        borderRadius: "2px",
                    }}
                />
            ))}
        </div>
    );
}

// CatalogueView 

export default function CatalogueView() {
    const [films, setFilms] = useState<CatalogueFilm[]>([]);
    const [pagination, setPagination] = useState<CataloguePagination | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [page, setPage] = useState(1);
    const [category, setCategory] = useState("");
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // categories extraites des films chargés
    const [categories, setCategories] = useState<string[]>([]);

    const load = useCallback(async (p: number, cat: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getCatalogue({
                page: p,
                per_page: PER_PAGE,
                category: cat || undefined,
            });
            setFilms(data.films);
            setPagination(data.pagination);
            if (p === 1 && !cat) {
                const cats = [...new Set(data.films.map((f) => f.category).filter(Boolean))];
                setCategories(cats);
            }
        } catch (e) {
            setError("Impossible de charger le catalogue.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load(page, category);
    }, [page, category, load]);

    const handleCategory = (cat: string) => {
        setCategory(cat);
        setPage(1);
    };

    return (
        <div className="relative z-10 max-w-5xl mx-auto px-4 py-10">

            {/* Header */}
            <div className="mb-8">
                <p
                    className="f-mono text-[10px] tracking-[0.28em] uppercase mb-2 opacity-85 flex items-center gap-2"
                    style={{ color: "var(--col-vi)" }}
                >
                    <span className="relative inline-flex h-2.5 w-2.5 flex-shrink-0">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#7d71fb] opacity-75" />
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#7d71fb]" />
                    </span>
                    <span>SÉLECTION OFFICIELLE · FESTIVAL MARSAI 2026</span>
                </p>
                <h1 className="f-orb font-black text-[48px] leading-none text-white mb-2">
                    Catalogue <span className="text-gradient-flow-ltr">2026</span>
                </h1>
            </div>
            <div className="mt-6 mb-8 h-px w-full" style={{ background: "linear-gradient(90deg, transparent, rgba(125, 113, 251, 0.6), transparent)" }}></div>

            {/* Grid */}
            {loading && (
                <div className="flex items-center justify-center py-24">
                    <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                </div>
            )}

            {error && (
                <div className="text-center py-24 text-white/30 font-mono text-sm">{error}</div>
            )}

            {!loading && !error && films.length === 0 && (
                <div className="text-center py-24 text-white/30 font-mono text-sm">Aucun film trouvé.</div>
            )}

            {!loading && !error && films.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {films.map((film) => (
                        <FilmCard
                            key={film.id}
                            film={film}
                            onClick={() => setSelectedId(film.id)}
                        />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {pagination && (
                <Pagination pagination={pagination} onPage={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
            )}

            {/* Modal */}
            {selectedId && (
                <FilmModal filmId={selectedId} onClose={() => setSelectedId(null)} />
            )}
        </div>
    );
}