import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid3X3, List } from "lucide-react";
import { apiFetchJson } from "../../lib/api";
import { PageHeader, AccentTitle } from "../../components/PageHeader";
import { PageShell } from "../../components/PageShell";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { PER_PAGE } from "./catalogueConfig";
import { FilmCard, FilmModal, Pagination } from "./catalogueParts";
import type { CatalogueResponse, Film } from "./catalogueTypes";
import { CatalogueSkeleton } from "../../skeletons/CatalogueSkeleton";

// Précharger les posters des films
async function preloadPosters(items: Film[], signal: AbortSignal) {
  const urls = [
    ...new Set(
      items.map((item) => (item.posterUrl || "").trim()).filter(Boolean),
    ),
  ];
  await Promise.allSettled(
    urls.map(
      (url) =>
        new Promise<void>((resolve) => {
          if (signal.aborted) {
            resolve();
            return;
          }
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.referrerPolicy = "no-referrer";
          img.src = url;
        }),
    ),
  );
}

// Composant principal de la vue du catalogue de films
export function CatalogueView() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">(() => {
    const stored = localStorage.getItem("catalogueViewMode");
    return (stored === "list" || stored === "grid") ? stored : "grid";
  });
  const [activeFilm, setActiveFilm] = useState<Film | null>(null);
  const [films, setFilms] = useState<Film[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Sauvegarder la préférence de mode d'affichage en localStorage
  useEffect(() => {
    localStorage.setItem("catalogueViewMode", viewMode);
  }, [viewMode]);

  useEffect(() => {
    const ac = new AbortController();
    apiFetchJson<CatalogueResponse>(
      `/api/catalogue?page=${page}&pageSize=${PER_PAGE}`,
      { signal: ac.signal },
    )
      .then(async (r) => {
        const items = r.items || [];
        await preloadPosters(items, ac.signal);
        if (ac.signal.aborted) return;
        setError(null);
        setFilms(items);
        setTotal(Number.isFinite(r.total) ? r.total : 0);
      })
      .catch((e: unknown) => {
        if (ac.signal.aborted) return;
        const message = e instanceof Error ? e.message : t("catalogue.error");
        setError(message);
        setFilms([]);
        setTotal(0);
      })
      .finally(() => {
        if (ac.signal.aborted) return;
        setLoading(false);
      });
    return () => ac.abort();
  }, [page, t]);

  const handlePage = (p: number) => {
    setLoading(true);
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <PageShell size="xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <PageHeader
            eyebrow={t("catalogue.eyebrow")}
            title={
              <>
                {t("catalogue.title")}{" "}
                <span className="ml-3">
                  <AccentTitle>2026</AccentTitle>
                </span>
              </>
            }
          />
        </div>

        {/* View Mode Toggle */}
        <button
          onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
          title={viewMode === "grid" ? t("catalogue.listView") : t("catalogue.gridView")}
          className="transition-all duration-300"
          style={{
            background: "none",
            border: "1px solid rgba(125,113,251,0.4)",
            borderRadius: "0.5rem",
            padding: "0.5rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              backgroundImage: "linear-gradient(135deg, rgb(125, 113, 251), rgb(255, 92, 53))",
              backgroundSize: "200%",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "shimText 3s linear infinite",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {viewMode === "grid" ? <List size={20} /> : <Grid3X3 size={20} />}
          </span>
        </button>
      </div>

      {error ? (
        <Alert
          variant="destructive"
          className="mt-6 border-[#ff5c35]/25 bg-[#ff5c35]/8 text-white"
        >
          <AlertDescription className="f-mono text-[10px] uppercase tracking-[0.2em] text-[#ff5c35]/80">
            {error}
          </AlertDescription>
        </Alert>
      ) : null}

      <div
        key={page}
        className={viewMode === "grid"
          ? "mt-10 grid auto-rows-fr items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-4"
          : "mt-10 flex flex-col gap-3"
        }
      >
        {loading ? (
          <CatalogueSkeleton count={PER_PAGE} viewMode={viewMode} />
        ) : (
          films.map((film, i) => (
            <FilmCard
              key={film.id}
              film={film}
              index={i}
              onClick={() => setActiveFilm(film)}
              viewMode={viewMode}
            />
          ))
        )}
      </div>

      <div
        className="mt-10"
        style={{ animation: "fadeUp 0.4s ease-out 0.3s both" }}
      >
        <Pagination
          page={page}
          total={total}
          perPage={PER_PAGE}
          onChange={handlePage}
        />
      </div>

      {activeFilm && (
        <FilmModal film={activeFilm} onClose={() => setActiveFilm(null)} />
      )}
    </PageShell>
  );
}
