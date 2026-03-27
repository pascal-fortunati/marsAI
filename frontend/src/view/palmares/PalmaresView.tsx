import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ApiError, apiFetchJson } from "../../lib/api";
import { PageHeader } from "../../components/PageHeader";
import { PageShell } from "../../components/PageShell";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
} from "../../components/ui/alert-dialog";
import { PalmaresSkeleton } from "../../skeletons/PalmaresSkeleton";
import { BADGE_CFG } from "./palmaresConfig";
import type { Film, PalmaresResponse } from "./palmaresTypes";

// Composant représentant une étiquette avec une couleur et du texte
function Tag({ color, children }: { color: string; children: ReactNode }) {
  return (
    <Badge
      variant="outline"
      className="f-mono inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold"
      style={{
        color,
        background: `${color}18`,
        border: `1px solid ${color}35`,
      }}
    >
      {children}
    </Badge>
  );
}

// Composant représentant une division horizontale avec un label
function SectionDivider({
  label,
  color = "rgba(255,255,255,.2)",
}: {
  label: string;
  color?: string;
}) {
  return (
    <div className="flex items-center gap-5 my-12">
      <div
        className="flex-1 h-px"
        style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
      />
      <span
        className="f-mono text-xs uppercase tracking-[.28em]"
        style={{ color }}
      >
        {label}
      </span>
      <div
        className="flex-1 h-px"
        style={{ background: `linear-gradient(270deg, ${color}, transparent)` }}
      />
    </div>
  );
}

function FilmPerforations({ side }: { side: "left" | "right" }) {
  const sideClass = side === "left" ? "left-0" : "right-0";
  const railEdgeClass =
    side === "left" ? "border-r border-white/30" : "border-l border-white/30";
  return (
    <div
      className={`pointer-events-none absolute ${sideClass} top-0 z-10 flex h-full w-6 ${railEdgeClass} flex-col items-center justify-evenly py-2`}
      style={{
        background:
          side === "left"
            ? "var(--film-perf-bg-left)"
            : "var(--film-perf-bg-right)",
      }}
    >
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-4 w-3 rounded-[3px] bg-white/40" />
      ))}
    </div>
  );
}

// Composant représentant une fenêtre modale affichant les détails d'un film
function FilmModal({ film, onClose }: { film: Film; onClose: () => void }) {
  const { t } = useTranslation();
  const cfg = BADGE_CFG[film.badge ?? "prix_jury"];

  return (
    <AlertDialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <AlertDialogContent className="relative mx-auto w-[calc(100vw-1rem)] max-h-[92vh] max-w-3xl overflow-y-auto overflow-x-hidden rounded-2xl border border-white/10 bg-[#0c0c0e] p-0 text-white sm:w-full">
        <AlertDialogCancel className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-black/60 text-white/70 transition-all hover:bg-black/80 hover:text-white">
          ✕
        </AlertDialogCancel>
        <div className="relative aspect-video overflow-hidden rounded-t-2xl bg-black">
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
              <span className="f-mono text-xs uppercase tracking-[0.2em] text-white/35">
                {t("palmares.videoUnavailable")}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-5 p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 space-y-1.5">
              <div className="f-mono text-[11px] uppercase tracking-widest text-white/70">
                {film.id} · {film.country} · {film.duration} · {film.year}
              </div>
              <h2 className="f-orb text-2xl font-black leading-tight tracking-tight text-white">
                {film.title}
              </h2>
              <p className="f-mono text-[11px] text-white/70">
                {film.director}
              </p>
            </div>
            <div className="shrink-0 pt-1">
              <Tag color={cfg.color}>
                {cfg.icon}{" "}
                {film.badge
                  ? t(`common.badges.${film.badge}`)
                  : t("palmares.specialPrizes")}
              </Tag>
            </div>
          </div>

          {film.prize ? (
            <div
              className="f-orb text-2xl font-black"
              style={{ color: cfg.color }}
            >
              {film.prize}
            </div>
          ) : null}

          <div className="h-px bg-white/6" />

          <p className="f-mono text-sm leading-relaxed text-white/60">
            {film.synopsis}
          </p>

          <div className="h-px bg-white/6" />

          <div className="flex flex-wrap gap-1.5">
            {film.aiTools.map((tool) => (
              <Badge
                key={tool}
                variant="outline"
                className="rounded-md border-[#7d71fb]/25 bg-[#7d71fb]/8 px-2.5 py-1 font-mono text-[9px] text-[#7d71fb]/80"
              >
                {tool}
              </Badge>
            ))}
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Composant représentant une carte affichant les détails d'un grand prix
function PosterThumb({
  film,
  ringColor,
  size = "md",
}: {
  film: Film;
  ringColor: string;
  size?: "sm" | "md" | "lg";
}) {
  const [failed, setFailed] = useState(false);
  const sizeClass =
    size === "lg" ? "h-24 w-24" : size === "sm" ? "h-14 w-14" : "h-20 w-20";
  if (film.posterUrl && !failed) {
    return (
      <img
        src={film.posterUrl}
        alt={film.title}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className={`${sizeClass} rounded-full object-cover`}
        style={{
          border: `3px solid ${ringColor}`,
          boxShadow: `0 0 0 3px rgba(0,0,0,.45), 0 0 14px ${ringColor}55`,
        }}
      />
    );
  }
  return (
    <div
      className={`${sizeClass} rounded-full`}
      style={{
        border: `3px solid ${ringColor}`,
        boxShadow: `0 0 0 3px rgba(0,0,0,.45), 0 0 14px ${ringColor}55`,
        background: "linear-gradient(135deg, #20222f, #0f1017)",
      }}
    />
  );
}

function PodiumCard({
  film,
  rank,
  color,
  featured,
  onClick,
}: {
  film: Film;
  rank: number;
  color: string;
  featured?: boolean;
  onClick: (film: Film) => void;
}) {
  return (
    <button
      onClick={() => onClick(film)}
      className={`relative rounded-2xl border px-6 py-5 text-left transition-all duration-300 hover:translate-y-[-2px] ${featured ? "md:min-h-[220px]" : "md:min-h-[200px]"}`}
      style={{
        border: `1px solid ${color}${featured ? "aa" : "55"}`,
        background: featured
          ? `linear-gradient(180deg, ${color}20, hsl(var(--card)) 35%)`
          : "linear-gradient(180deg, hsl(var(--secondary) / 0.55), hsl(var(--card)))",
        boxShadow: featured ? `0 0 30px ${color}35` : `0 0 16px ${color}20`,
      }}
    >
      <div
        className="absolute right-3 top-3 f-orb flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-xs font-black text-white"
        style={{ background: color }}
      >
        {rank}
      </div>
      <div className="flex items-center gap-4">
        <PosterThumb
          film={film}
          ringColor={color}
          size={featured ? "lg" : "md"}
        />
        <div className="min-w-0">
          <div
            className={`f-orb truncate font-black text-white ${featured ? "text-2xl" : "text-xl"}`}
          >
            {film.title}
          </div>
          <div className="f-mono mt-1 text-sm text-white/65">
            {film.director}
          </div>
          <div className="f-mono mt-1 text-xs text-white/40">
            {film.country}
          </div>
        </div>
      </div>
      <div
        className="mt-4 inline-flex items-center rounded-full px-3 py-1 f-mono text-xs font-bold"
        style={{ background: `${color}22`, color }}
      >
        ⚡ {film.duration}
      </div>
    </button>
  );
}

function GrandPrixCard({
  grandPrix,
  podiumSides,
  onClick,
}: {
  grandPrix: Film;
  podiumSides: Film[];
  onClick: (film: Film) => void;
}) {
  const left = podiumSides[0] || null;
  const right = podiumSides[1] || null;
  return (
    <div className="grid gap-4 md:grid-cols-3 md:items-end">
      {left ? (
        <PodiumCard film={left} rank={2} color="#aeaeae" onClick={onClick} />
      ) : (
        <div className="hidden md:block" />
      )}
      <PodiumCard
        film={grandPrix}
        rank={1}
        color="#ffd966"
        featured
        onClick={onClick}
      />
      {right ? (
        <PodiumCard film={right} rank={3} color="#c77f60" onClick={onClick} />
      ) : (
        <div className="hidden md:block" />
      )}
    </div>
  );
}
function SelectionGrid({
  films,
  onClick,
}: {
  films: Film[];
  onClick: (f: Film) => void;
}) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? films : films.slice(0, 12);
  const cfg = BADGE_CFG.prix_jury;

  return (
    <div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((film) => (
          <button
            key={film.id}
            onClick={() => onClick(film)}
            className="group flex items-center gap-4 rounded-xl border border-white/6 bg-white/[.025] px-5 py-4 text-left transition-all"
            style={{
              borderColor: `${cfg.color}22`,
              background: `${cfg.color}08`,
            }}
          >
            <PosterThumb film={film} ringColor={cfg.color} size="sm" />
            <div className="min-w-0 flex-1">
              <div className="f-orb text-sm font-bold text-white/85 truncate">
                {film.title}
              </div>
              <div className="f-mono text-xs text-white/35 mt-0.5">
                {film.director} · {film.country}
              </div>
            </div>
            <span className="f-mono text-xs text-white/25 shrink-0">
              {film.duration}
            </span>
          </button>
        ))}
      </div>
      {films.length > 12 && (
        <div className="mt-6 text-center">
          <Button
            onClick={() => setExpanded((e) => !e)}
            variant="outline"
            className="f-mono rounded-xl border-white/10 bg-white/4 px-8 text-sm text-white/45 hover:border-white/18 hover:bg-white/5 hover:text-white/65"
          >
            {expanded
              ? t("palmares.selectionLess")
              : t("palmares.selectionMore", { count: films.length - 12 })}
          </Button>
        </div>
      )}
    </div>
  );
}

// Composant représentant la vue des palmarès
export function PalmaresView() {
  const { t } = useTranslation();
  const [activeFilm, setActiveFilm] = useState<Film | null>(null);
  const [laureats, setLaureats] = useState<Film[]>([]);
  const [selection, setSelection] = useState<Film[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    Promise.resolve().then(() => {
      setLoading(true);
      setError(null);
    });
    apiFetchJson<PalmaresResponse>("/api/palmares", { signal: ac.signal })
      .then((r) => {
        setLaureats(r.laureats ?? []);
        setSelection(r.selection ?? []);
      })
      .catch((e: unknown) => {
        if (ac.signal.aborted) return;
        if (e instanceof ApiError && (e.status === 401 || e.status === 403))
          return;
        setError(e instanceof Error ? e.message : t("palmares.error"));
        setLaureats([]);
        setSelection([]);
      })
      .finally(() => {
        if (!ac.signal.aborted) setLoading(false);
      });
    return () => ac.abort();
  }, [t]);

  const grandPrix = laureats.find((f) => f.badge === "grand_prix") ?? null;
  const prixJuryFilms = [
    ...laureats.filter((f) => f.badge === "prix_jury"),
    ...selection,
  ].filter(
    (film, index, arr) => arr.findIndex((f) => f.id === film.id) === index,
  );
  const podiumSides = prixJuryFilms.slice(0, 2);
  const total = laureats.length + selection.length;

  return (
    <PageShell size="screen" px="px-8" py="py-16">
      <PageHeader
        eyebrow={t("palmares.eyebrow")}
        title={t("palmares.title")}
        subtitle={
          loading
            ? t("common.loading")
            : t("palmares.subtitle", { total, laureats: laureats.length })
        }
        color="#ffd966"
        size="xl"
      />

      {!loading ? (
        <div className="flex flex-wrap gap-4 mt-8 mb-14">
          {[
            { badge: "grand_prix" as const, count: grandPrix ? 1 : 0 },
            { badge: "prix_jury" as const, count: prixJuryFilms.length },
          ]
            .filter((s) => s.count > 0)
            .map((s) => {
              const cfg = BADGE_CFG[s.badge];
              return (
                <div
                  key={s.badge}
                  className="flex items-center gap-2.5 rounded-xl border border-white/8 bg-white/[.03] px-5 py-3"
                >
                  <div>
                    <div
                      className="f-orb text-lg font-black"
                      style={{ color: cfg.color }}
                    >
                      {cfg.icon}
                      <span
                        className="text-white/35 f-mono text-xs ml-3"
                        style={{ color: cfg.color }}
                      >
                        {s.count}
                      </span>
                      <span className="text-white/35 f-mono text-xs ml-3">
                        {t(`common.badges.${s.badge}`)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      ) : null}

      {error && !loading && (
        <Alert
          variant="destructive"
          className="mb-8 border-red-500/25 bg-red-500/8 text-white"
        >
          <AlertDescription className="f-mono text-sm text-red-400">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* ── Grand Prix ── */}
      {!loading && grandPrix && (
        <>
          <SectionDivider label={t("palmares.grandPrix")} color="#ffd70065" />
          <GrandPrixCard
            grandPrix={grandPrix}
            podiumSides={podiumSides}
            onClick={setActiveFilm}
          />
        </>
      )}

      {/* ── Prix du Jury ── */}
      {!loading && prixJuryFilms.length > 0 && (
        <>
          <SectionDivider
            label={t("palmares.selection", { count: prixJuryFilms.length })}
            color="rgba(200,200,255,.35)"
          />
          <SelectionGrid films={prixJuryFilms} onClick={setActiveFilm} />
        </>
      )}
      {loading ? <PalmaresSkeleton /> : null}

      {activeFilm && (
        <FilmModal film={activeFilm} onClose={() => setActiveFilm(null)} />
      )}
    </PageShell>
  );
}
