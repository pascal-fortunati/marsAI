import { useState } from "react";
import type { ComponentType, SVGProps } from "react";
import { useTranslation } from "react-i18next";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
} from "../../components/ui/alert-dialog";
import { Skeleton } from "../../components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import { BADGE_CFG, PER_PAGE } from "./catalogueConfig";
import type { Badge as BadgeType, Film } from "./catalogueTypes";
import { getCountryCode, getLanguageFlagCode } from "../../lib/countryMapping";
import * as Flags from "country-flag-icons/react/3x2";

type FlagComponent = ComponentType<SVGProps<SVGSVGElement>>;

// ─── Helpers ────────────────────────────────────────────────────────────────

function truncateSynopsis(text: string | null | undefined, maxChars = 92) {
  const value = (text ?? "").trim();
  if (value.length <= maxChars) return value;
  return `${value.slice(0, maxChars).trimEnd()}...`;
}

function CountryFlag({ country }: { country: string | null }) {
  const code = country ? getCountryCode(country) : null;
  if (!code) return null;
  const Flag = (Flags as Record<string, FlagComponent>)[code];
  if (!Flag) return null;
  return (
    <span className="inline-flex items-center px-1.5 py-0.5">
      <Flag className="h-3 w-4 rounded-[2px] object-cover" />
    </span>
  );
}

function LanguageFlag({
  language,
  showCode = true,
}: {
  language: string | null;
  showCode?: boolean;
}) {
  const code = language ? getLanguageFlagCode(language) : null;
  if (!code) return null;
  const Flag = (Flags as Record<string, FlagComponent>)[code];
  if (!Flag) return null;
  return (
    <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5">
      <Flag className="h-3 w-4 object-cover" />
      {showCode && (
        <span className="font-mono text-[9px] tracking-widest text-white/50">
          {code}
        </span>
      )}
    </span>
  );
}

// ─── BadgePill ───────────────────────────────────────────────────────────────

export function BadgePill({
  badge,
  prize,
  size = "sm",
}: {
  badge: BadgeType;
  prize?: string | null;
  size?: "sm" | "lg";
}) {
  const { t } = useTranslation();
  const c = BADGE_CFG[badge];

  return (
    <div className="flex items-center gap-2">
      <Badge
        variant="outline"
        className="inline-flex items-center gap-1.5 rounded-md font-mono font-bold uppercase tracking-widest"
        style={{
          fontSize: size === "lg" ? "10px" : "8px",
          padding: size === "lg" ? "3px 8px" : "2px 6px",
          color: c.col,
          background: c.bg,
          border: `1px solid ${c.border}`,
          boxShadow: `0 0 10px ${c.bg}55`,
        }}
      >
        <span style={{ fontSize: size === "lg" ? 13 : 11 }}>{c.icon}</span>
        {t(`common.badges.${badge}`)}
      </Badge>

      {prize && (
        <span className="font-mono text-[9px] text-white/35 leading-tight">
          {prize}
        </span>
      )}
    </div>
  );
}

// ─── FilmModal ───────────────────────────────────────────────────────────────

export function FilmModal({
  film,
  onClose,
}: {
  film: Film;
  onClose: () => void;
}) {
  const { t } = useTranslation();

  return (
    <AlertDialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <AlertDialogContent className="relative mx-auto w-[calc(100vw-1rem)] max-h-[92vh] max-w-3xl overflow-y-auto overflow-x-hidden bg-[#0c0c0e] border border-white/10 p-0 text-white sm:w-full rounded-2xl">
        {/* Bouton fermer */}
        <AlertDialogCancel className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-black/60 text-white/70 hover:text-white hover:bg-black/80 transition-all">
          ✕
        </AlertDialogCancel>

        {/* Zone vidéo */}
        <div className="relative aspect-video bg-black overflow-hidden rounded-t-2xl">
          {/* Perforations pellicule */}
          <FilmPerforations side="left" />
          <FilmPerforations side="right" />

          {film.youtubeId ? (
            <iframe
              src={`https://www.youtube.com/embed/${film.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={film.title}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/35">
                {t("catalogue.videoUnavailable")}
              </span>
            </div>
          )}
        </div>

        {/* Métadonnées */}
        <div className="p-6 space-y-5">
          {/* En-tête : titre + badge */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              {/* Ligne meta */}
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <CountryFlag country={film.country} />
                <LanguageFlag language={film.language} showCode={false} />
                <span className="font-mono text-[10px] text-white/70 uppercase tracking-widest">
                  {film.country}
                </span>
                <MetaDot />
                <span className="font-mono text-[10px] text-white/70 uppercase tracking-widest">
                  {film.language}
                </span>
                <span className="font-mono text-[10px] text-white/70">
                  {film.duration}
                </span>
                <MetaDot />
                <span className="font-mono text-[10px] text-white/70">
                  {film.year}
                </span>
                <MetaDot />
                {/* Réalisateur */}
                <p className="font-mono text-[11px] text-white/70">
                  {film.director}
                </p>
              </div>

              {/* Titre */}
              <h2
                className="font-black text-xl text-white leading-tight tracking-tight"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                {film.title}
              </h2>
            </div>

            {film.badge && (
              <div className="shrink-0 pt-1">
                <BadgePill badge={film.badge} prize={film.prize} size="lg" />
              </div>
            )}
          </div>

          {/* Séparateur */}
          <div className="h-px bg-white/6" />

          {/* Synopsis */}
          <p className="font-mono text-sm text-white/60 leading-relaxed">
            {film.synopsis}
          </p>

          {/* Séparateur */}
          <div className="h-px bg-white/6" />

          {/* Outils IA */}
          <div className="space-y-2">
            <span className="font-mono text-[9px] uppercase tracking-widest text-white/25">
              {t("catalogue.aiTools")}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {film.aiTools.map((tool) => (
                <Badge
                  key={tool}
                  variant="outline"
                  className="font-mono border-[#7d71fb]/25 bg-[#7d71fb]/8 px-2.5 py-1 text-[9px] text-[#7d71fb]/80 rounded-md"
                >
                  {tool}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ─── FilmCard ────────────────────────────────────────────────────────────────

export function FilmCard({
  film,
  index,
  onClick,
}: {
  film: Film;
  index: number;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);
  const [posterLoaded, setPosterLoaded] = useState(false);

  const hasPrize =
    film.badge && ["grand_prix", "prix_jury"].includes(film.badge);
  const showPoster = Boolean(film.posterUrl) && !posterFailed;
  const badgeColor = film.badge ? BADGE_CFG[film.badge].col : null;

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="cursor-pointer group relative flex h-full w-full flex-col overflow-hidden rounded-2xl text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7d71fb]/60"
      style={{
        background: hovered
          ? "var(--catalogue-card-hover-bg)"
          : "var(--catalogue-card-bg)",
        border: hovered
          ? "1px solid rgba(125,113,251,0.3)"
          : hasPrize
            ? `1px solid ${badgeColor}30`
            : "1px solid var(--catalogue-card-border)",
        boxShadow: hovered
          ? "0 8px 32px rgba(125,113,251,0.12)"
          : hasPrize
            ? `0 0 14px ${badgeColor}18`
            : "none",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        animation: `fadeUp 0.4s ease-out ${(index % PER_PAGE) * 0.03}s both`,
      }}
    >
      {/* Ligne de couleur en haut */}
      <div
        className="absolute inset-x-0 top-0 h-px transition-opacity duration-300"
        style={{
          background: film.badge
            ? `linear-gradient(90deg, transparent, ${BADGE_CFG[film.badge].col}70, transparent)`
            : "linear-gradient(90deg, transparent, rgba(125,113,251,0.5), transparent)",
          opacity: hovered || hasPrize ? 1 : 0,
        }}
      />

      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-black">
        <FilmPerforations side="left" compact />
        <FilmPerforations side="right" compact />

        <div className="absolute inset-y-0 left-4 right-4 overflow-hidden">
          {showPoster ? (
            <>
              {!posterLoaded ? (
                <Skeleton className="absolute inset-0 rounded-none bg-white/12" />
              ) : null}
              <img
                src={film.posterUrl || undefined}
                alt={film.title}
                className="absolute inset-0 h-full w-full object-cover transition-[transform,opacity] duration-500"
                style={{
                  transform: hovered ? "scale(1.04)" : "scale(1)",
                  opacity: posterLoaded ? 1 : 0,
                }}
                loading="lazy"
                referrerPolicy="no-referrer"
                onLoad={() => setPosterLoaded(true)}
                onError={() => {
                  setPosterFailed(true);
                  setPosterLoaded(false);
                }}
              />
            </>
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg,
                hsl(${(index * 37 + 260) % 360}, 55%, 11%) 0%,
                hsl(${(index * 37 + 310) % 360}, 45%, 7%) 100%)`,
              }}
            />
          )}

          <div
            className="absolute inset-0 flex items-center justify-center transition-opacity duration-200"
            style={{
              opacity: hovered ? 1 : 0,
              background: "var(--catalogue-overlay-bg)",
            }}
          >
            <div
              className="flex h-11 w-11 items-center justify-center rounded-full"
              style={{
                background: "linear-gradient(135deg, #7d71fb, #ff5c35)",
                boxShadow: "0 0 28px rgba(125,113,251,0.5)",
              }}
            >
              <svg
                className="ml-1 h-4 w-4 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </div>
          </div>

          <span className="absolute bottom-2 right-2 z-10 font-mono rounded bg-black/75 px-1.5 py-0.5 text-[8px] text-white/55 backdrop-blur">
            {film.duration}
          </span>
        </div>
      </div>

      {/* Contenu texte */}
      <div className="relative flex flex-1 flex-col p-4">
        {/* Méta : pays + année */}
        <div className="mb-3 flex items-center gap-1.5">
          <CountryFlag country={film.country} />
          <span className="font-mono text-[9px] uppercase tracking-widest text-white/60">
            {film.country}
          </span>
          <MetaDot />
          <span className="font-mono text-[9px] text-white/60">
            {film.year}
          </span>
          <MetaDot />
          {/* Réalisateur */}
          <p className="font-mono text-[9px] text-white/60">{film.director}</p>
        </div>

        {/* Titre */}
        <h3
          className="line-clamp-2 min-h-[2rem] text-sm font-black leading-tight tracking-tight text-white/90"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          {film.title}
        </h3>

        {/* Synopsis */}
        <p className="min-h-[2.4rem] overflow-hidden font-mono text-[10px] leading-relaxed text-white/60">
          {truncateSynopsis(film.synopsis, 92)}
        </p>

        {/* Outils IA */}
        <TooltipProvider delayDuration={150}>
          <div className="mt-auto flex min-h-[1.4rem] flex-wrap gap-1 pt-2">
            {film.aiTools.slice(0, 3).map((tool) => (
              <Tooltip key={tool}>
                <TooltipTrigger asChild>
                  <span className="cursor-help font-mono rounded border border-[#7d71fb]/18 bg-[#7d71fb]/6 px-1.5 py-0.5 text-[7px] text-[#7d71fb]/60">
                    {tool}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="font-mono text-[10px]">
                  {tool}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>

        {/* Badge (en bas à droite) */}
        {film.badge && (
          <div className="absolute bottom-3 right-3 z-10">
            <BadgePill badge={film.badge} prize={film.prize} />
          </div>
        )}
      </div>
    </button>
  );
}

// ─── Pagination ──────────────────────────────────────────────────────────────

export function Pagination({
  page,
  total,
  perPage,
  onChange,
}: {
  page: number;
  total: number;
  perPage: number;
  onChange: (p: number) => void;
}) {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;

  // Affiche au max 5 pages autour de la page courante
  const pages = buildPageRange(page, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-1.5"
    >
      <PaginationArrow
        direction="prev"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
      />

      {pages.map((p, i) =>
        p === "…" ? (
          <span
            key={`ellipsis-${i}`}
            className="font-mono text-xs text-white/25 px-1 select-none"
          >
            …
          </span>
        ) : (
          <Button
            key={p}
            onClick={() => onChange(p as number)}
            variant="outline"
            size="icon"
            aria-current={page === p ? "page" : undefined}
            className="font-mono h-8 w-8 rounded-xl text-xs transition-all duration-200 cursor-pointer"
            style={{
              background:
                page === p
                  ? "linear-gradient(135deg, #7d71fb, #ff5c35)"
                  : "var(--catalogue-pagination-bg)",
              border:
                page === p
                  ? "1px solid transparent"
                  : "1px solid var(--catalogue-pagination-border)",
              color: page === p ? "#fff" : "var(--catalogue-pagination-text)",
              boxShadow:
                page === p ? "0 0 16px rgba(125,113,251,0.35)" : "none",
            }}
          >
            {p}
          </Button>
        ),
      )}

      <PaginationArrow
        direction="next"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
      />
    </nav>
  );
}

// ─── Sous-composants utilitaires ─────────────────────────────────────────────

/** Pointeur séparateur entre métadonnées */
function MetaDot() {
  return <span className="text-white/15 text-[8px] select-none">·</span>;
}

/** Perforations pellicule cinéma */
function FilmPerforations({
  side,
  compact = false,
  skeleton = false,
}: {
  side: "left" | "right";
  compact?: boolean;
  skeleton?: boolean;
}) {
  const count = compact ? 5 : 6;
  const sideClass = side === "left" ? "left-0" : "right-0";
  const railWidthClass = compact ? "w-4" : "w-6";
  const railEdgeClass = side === "left" ? "border-r" : "border-l";
  const holeClass = compact ? "h-2 w-2 rounded-[2px]" : "h-4 w-3 rounded-[3px]";
  return (
    <div
      className={`absolute ${sideClass} top-0 z-10 flex h-full ${railWidthClass} ${railEdgeClass} flex-col items-center justify-evenly py-2 pointer-events-none`}
      style={{
        borderColor: "var(--film-perf-rail-border)",
        background: skeleton
          ? "var(--film-perf-bg-skeleton)"
          : side === "left"
            ? "var(--film-perf-bg-left)"
            : "var(--film-perf-bg-right)",
      }}
    >
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className={`${holeClass} ${skeleton ? "animate-pulse" : ""}`}
          style={{
            backgroundColor: skeleton
              ? "var(--film-perf-hole-skeleton)"
              : "var(--film-perf-hole)",
          }}
        />
      ))}
    </div>
  );
}

/** Flèches de pagination */
function PaginationArrow({
  direction,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      variant="outline"
      size="icon"
      aria-label={direction === "prev" ? "Page précédente" : "Page suivante"}
      className="cursor-pointer font-mono h-8 w-8 rounded-xl border-white/8 bg-white/3 text-sm text-white/70 hover:border-[#7d71fb]/40 hover:bg-white/5 hover:text-white/70 disabled:opacity-20 transition-all"
    >
      {direction === "prev" ? "←" : "→"}
    </Button>
  );
}

/** Génère la liste de pages avec ellipses */
function buildPageRange(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const range: (number | "…")[] = [1];

  if (current > 3) range.push("…");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) range.push(i);

  if (current < total - 2) range.push("…");

  range.push(total);
  return range;
}
