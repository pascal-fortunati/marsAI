import { Play } from "lucide-react";
import type { ComponentType } from "react";
import type { CatalogueFilm } from "./CatalogueTypes";
import { BADGE_CONFIG } from "./catalogueHelpers";
import { getCountryCode } from "../../lib/countryMapping";
import { getAIToolDescription } from "../../lib/aiToolsMetadata";
import * as Flags from "country-flag-icons/react/3x2";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

interface FilmCardProps {
    film: CatalogueFilm;
    onClick: (film: CatalogueFilm) => void;
}

export default function FilmCard({ film, onClick }: FilmCardProps) {
    const badge = film.badge ? BADGE_CONFIG[film.badge] : null;
    const posterSrc = film.poster_url
        ? `${BASE}${film.poster_url}`
        : "/placeholder-poster.jpg";
    const posterHeight = "166.5px";
    const durationSeconds = Number(film.duration_seconds ?? 0);
    const durationLabel = durationSeconds > 0
        ? `${Math.floor(durationSeconds / 60)}:${String(durationSeconds % 60).padStart(2, "0")}`
        : null;

    const flagCode = getCountryCode(film.country) ?? "";
    const FlagComponent = (Flags as Record<string, ComponentType<{ className?: string }>>)[flagCode];

    return (
        <div
            onClick={() => onClick(film)}
            className="relative rounded-xl overflow-hidden cursor-pointer group"
            style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,.08)",
                width: "100%",
                maxWidth: "296px",
                height: "321.39px",
            }}
        >
            <FilmStrip side="left" height={posterHeight} />
            <FilmStrip side="right" height={posterHeight} />

            <div className="relative aspect-video overflow-hidden bg-black" style={{ height: posterHeight }}>
                <img
                    src={posterSrc}
                    alt={film.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </div>

            {durationLabel && (
                <div
                    className="absolute font-mono text-[10px] font-semibold text-white px-2 py-0.5 rounded-full z-50 pointer-events-none"
                    style={{
                        top: "146px",
                        right: "24px",
                        background: "rgba(0,0,0,.78)",
                        border: "1px solid rgba(255,255,255,.25)",
                    }}
                >
                    {durationLabel}
                </div>
            )}

            <div
                className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
                style={{ top: "83.25px" }}
            >
                <div
                    className="opacity-0 group-hover:opacity-100 transition-all group-hover:scale-105 flex h-11 w-11 items-center justify-center rounded-full"
                    style={{
                        background: "linear-gradient(135deg, rgb(125, 113, 251), rgb(255, 92, 53))",
                        boxShadow: "rgba(125, 113, 251, 0.5) 0px 0px 28px",
                    }}
                >
                    <Play
                        size={20}
                        className="-translate-x-px"
                        color="#FFFFFF"
                        stroke="#FFFFFF"
                        fill="#FFFFFF"
                        strokeWidth={1.75}
                        strokeLinejoin="miter"
                        strokeLinecap="butt"
                    />
                </div>
            </div>

            <div className="relative flex flex-1 flex-col px-4 pt-3 pb-10" style={{ height: "154.89px" }}>
                <div className="flex items-center gap-1.5 flex-wrap">
                    {FlagComponent && <FlagComponent className="w-4 h-2.5 rounded-sm flex-shrink-0" />}
                    <span className="font-mono text-[8px] tracking-widest uppercase text-white/50">
                        {film.country}
                    </span>
                    <span className="font-mono text-[8px] text-white/30">·</span>
                    <span className="font-mono text-[8px] text-white/50">{film.year}</span>
                    <span className="font-mono text-[8px] text-white/30">·</span>
                    <span className="font-mono text-[8px] text-white/60">
                        {film.director_name}
                    </span>
                </div>

                <h3 className="f-orb text-sm font-bold text-white leading-tight line-clamp-2 mt-2">
                    {film.title}
                </h3>

                <p className="font-mono text-[9px] text-white/40 leading-[1.9] tracking-[0.03em] line-clamp-2 mt-2.5">
                    {film.synopsis}
                </p>

                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between gap-2">
                    <div className="flex gap-1 flex-wrap">
                        {film.ai_tools.slice(0, 2).map((tool) => (
                            <div key={tool} className="relative group">
                                <span
                                    className="font-mono text-[7px] tracking-wider px-1.5 py-0.5 rounded cursor-help hover:bg-violet-500/20 transition-colors"
                                    style={{
                                        background: "rgba(125,113,251,.15)",
                                        color: "rgba(125,113,251,.9)",
                                        border: "1px solid rgba(125,113,251,.2)",
                                    }}
                                >
                                    {tool}
                                </span>
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-[9999]">
                                    <div 
                                        className="px-3 py-1.5 rounded-md bg-violet-950/50 border border-violet-500/60 backdrop-blur-xl text-center whitespace-nowrap"
                                        style={{ boxShadow: "0 0 20px rgba(125, 113, 251, 0.6), 0 0 40px rgba(125, 113, 251, 0.3)" }}
                                    >
                                        <p className="font-mono text-[8px] leading-tight text-white font-semibold">
                                            {getAIToolDescription(tool)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {badge && (
                        <span
                            className="font-mono text-[7px] tracking-wider px-2 py-1 rounded-full font-bold whitespace-nowrap"
                            style={{
                                background: `${badge.color}22`,
                                color: badge.color,
                                border: `1px solid ${badge.color}55`,
                            }}
                        >
                            {badge.icon} {badge.label.toUpperCase()}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

function FilmStrip({ side, height }: { side: "left" | "right"; height: string }) {
    const holes = Array.from({ length: 5 });
    const sideClass = side === "left" ? "left-0" : "right-0";
    const stripGradient =
        "linear-gradient(180deg, rgb(88, 92, 104) 0%, rgb(54, 58, 70) 14%, rgb(28, 31, 40) 32%, rgb(13, 15, 22) 58%, rgb(4, 5, 9) 100%)";

    return (
        <div
            className={`absolute top-0 ${sideClass} flex flex-col justify-around items-center py-2 z-10`}
            style={{
                width: "18px",
                height,
                background: stripGradient,
            }}
        >
            {holes.map((_, i) => (
                <div
                    key={i}
                    className="rounded-none"
                    style={{
                        width: "8px",
                        height: "6px",
                        background: "rgb(255,255,255)",
                    }}
                />
            ))}
        </div>
    );
}
