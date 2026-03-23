import { useEffect, useState, useCallback } from "react";
import { Search, X, Play, Globe, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { getCatalogue, getFilmById } from "../../lib/catalogueApi";
import type { CatalogueFilm, CatalogueFilmDetail, CataloguePagination } from "./CatalogueTypes";

const PER_PAGE = 20;

// Helpers
function formatDuration(secs: number): string {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}'${String(s).padStart(2, "0")}"`;
}

function posterSrc(film: CatalogueFilm): string {
    return film.poster_url ?? `https://placehold.co/400x225/0d0d1a/555?text=${encodeURIComponent(film.title)}`;
}

// Cards
function FilmCard({ film, onClick }: { film: CatalogueFilm; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="group relative text-left w-full rounded-lg overflow-hidden border border-white/5
                 bg-white/3 hover:border-violet-500/40 transition-all duration-300 hover:-translate-y-0.5"
        >
            {/* Poster */}
            <div className="relative aspect-video overflow-hidden bg-black">
                <img
                    src={posterSrc(film)}
                    alt={film.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                />
                {/* Play overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300
                        flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300
                          w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30
                          flex items-center justify-center">
                        <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                    </div>
                </div>
                {/* Badge durée */}
                <span className="absolute bottom-1.5 right-1.5 text-[9px] font-mono text-white/70
                         bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded">
                    {formatDuration(film.duration_seconds)}
                </span>
                {/* Badge */}
                {film.prize && (
                    <span className="absolute top-1.5 left-1.5 text-[9px] font-mono uppercase tracking-wider
                           bg-amber-500/90 text-black px-2 py-0.5 rounded font-bold">
                        {film.prize}
                    </span>
                )}
                {film.badge && !film.prize && (
                    <span className="absolute top-1.5 left-1.5 text-[9px] font-mono uppercase tracking-wider
                           bg-violet-600/90 text-white px-2 py-0.5 rounded">
                        {film.badge}
                    </span>
                )}
            </div>

            {/* Info */}
            <div className="p-3">
                <h3 className="f-orb font-semibold text-white text-sm leading-tight mb-0.5 line-clamp-1">
                    {film.title}
                </h3>
                <p className="text-white/40 text-[11px] font-mono mb-1.5">{film.director_name}</p>
                <p className="text-white/50 text-[11px] leading-relaxed line-clamp-2 mb-2">
                    {film.synopsis}
                </p>
                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                    {film.semantic_tags?.slice(0, 2).map((tag) => (
                        <span key={tag}
                            className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded
                         bg-violet-500/10 text-violet-400 border border-violet-500/20">
                            {tag}
                        </span>
                    ))}
                    {film.ai_tools?.slice(0, 1).map((tool) => (
                        <span key={tool}
                            className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded
                         bg-orange-500/10 text-orange-400 border border-orange-500/20">
                            {tool}
                        </span>
                    ))}
                </div>
            </div>
        </button>
    );
}