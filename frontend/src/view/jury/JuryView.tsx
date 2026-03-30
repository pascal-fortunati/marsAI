import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import i18n, { setLanguage } from "../../lib/i18n";
import {
  ApiError,
  apiFetchJson,
  consumeAuthErrorFromUrl,
  consumeTokenFromUrlHash,
  decodeJwtPayload,
  getStoredToken,
} from "../../lib/api";
import { NavBar } from "../../components/NavBar";
import { StarfieldNeural } from "../../components/ui/StarfieldNeural";

import { FilmSearch } from "./FilmSearch";
import { FilmDetail } from "./FilmDetail";
import { VideoPlayer } from "./VideoPlayer";
import { JuryVote } from "./JuryVote";
import { AssignedFilms } from "./AssignedFilms";
import JurySkeleton from "./JurySkeleton";
import type { Film, VoteDecision } from "./types";

type ApiFilm = Film & {
  voteDecision?: VoteDecision;
  voteComment?: string;
};


export function JuryView() {
  const { t } = useTranslation();
  const [currentLang, setCurrentLang] = useState<"fr" | "en">(() =>
    i18n.language?.toLowerCase().startsWith("en") ? "en" : "fr",
  );

  const [films, setFilms] = useState<Film[]>([]);
  const [isFetchingFilms, setIsFetchingFilms] = useState(true);
  const [filmsError, setFilmsError] = useState("");

  const [isLoggedIn] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "all" | "voted" | "remaining"
  >("all");
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);
  const [votesByFilm, setVotesByFilm] = useState<Record<string, VoteDecision>>(
    {},
  );
  const [commentsByFilm, setCommentsByFilm] = useState<Record<string, string>>(
    {},
  );
  const [voteStatus, setVoteStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  useEffect(() => {
    let cancelled = false;

    const loadAssignedFilms = async () => {
      setIsFetchingFilms(true);
      setFilmsError("");

      if (isDemoMode) {
        setTimeout(() => {
          setFilms(DEMO_FILMS);
          setVotesByFilm({});
          setCommentsByFilm({});
          setIsFetchingFilms(false);
        }, 2500); // Délai artificiel pour voir le skeleton
        return;
      }

      try {
        const response = await apiFetchJson<{ films: ApiFilm[] }>("/api/films");
        if (cancelled) return;

        const nextFilms = response.films ?? [];
        setFilms(nextFilms);

        const nextVotes: Record<string, VoteDecision> = {};
        const nextComments: Record<string, string> = {};
        for (const film of nextFilms) {
          if (film.voteDecision) {
            nextVotes[film.id] = film.voteDecision;
          }
          if (film.voteComment) {
            nextComments[film.id] = film.voteComment;
          }
        }
        setVotesByFilm(nextVotes);
        setCommentsByFilm(nextComments);
      } catch (error) {
        if (cancelled) return;
        const message =
          error instanceof Error
            ? error.message
            : "Unable to load assigned films.";
        setFilmsError(message);
      } finally {
        if (!cancelled) {
          setIsFetchingFilms(false);
        }
      }
    };

    loadAssignedFilms();

    return () => {
      cancelled = true;
    };
  }, [isDemoMode]);

  const handleSelectFilm = (film: Film) => {
    setSelectedFilm(film);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredFilms = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return films.filter((film) => {
      const isVoted = Boolean(votesByFilm[film.id]);
      const passesFilter =
        activeFilter === "all" ||
        (activeFilter === "voted" && isVoted) ||
        (activeFilter === "remaining" && !isVoted);

      if (!passesFilter) return false;

      if (!normalizedQuery) return true;

      const haystack = [film.title, film.country, film.tags?.join(" ")]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [films, searchQuery, activeFilter, votesByFilm]);

  useEffect(() => {
    // Conserve une selection coherente avec les filtres/recherche actifs.
    if (filteredFilms.length === 0) {
      setSelectedFilm(null);
      return;
    }

    if (
      !selectedFilm ||
      !filteredFilms.some((film) => film.id === selectedFilm.id)
    ) {
      setSelectedFilm(filteredFilms[0]);
    }
  }, [filteredFilms, selectedFilm]);

  const handleVote = async (
    filmId: string,
    decision: VoteDecision,
    comment?: string,
  ) => {
    if (isDemoMode) {
      setVotesByFilm((previous) => ({ ...previous, [filmId]: decision }));
      if (typeof comment === "string") {
        setCommentsByFilm((previous) => ({ ...previous, [filmId]: comment }));
      }
      setVoteStatus("success");
      return;
    }

    setVoteStatus("submitting");
    try {
      await apiFetchJson<{ ok: boolean }>("/api/vote", {
        method: "POST",
        body: JSON.stringify({ filmId, decision, comment }),
      });
      setVotesByFilm((previous) => ({ ...previous, [filmId]: decision }));
      if (typeof comment === "string") {
        setCommentsByFilm((previous) => ({ ...previous, [filmId]: comment }));
      }
      setVoteStatus("success");
    } catch {
      setVoteStatus("error");
    }
  };

  const filmsTotal = films.length;
  const filmsValidated = Object.values(votesByFilm).filter(
    (decision) => decision === "validate",
  ).length;
  const filmsToReview = Object.values(votesByFilm).filter(
    (decision) => decision === "review",
  ).length;
  const filmsRefused = Object.values(votesByFilm).filter(
    (decision) => decision === "refuse",
  ).length;
  const filmsDecided = filmsValidated + filmsToReview + filmsRefused;
  const filmsRemaining = filmsTotal - filmsDecided;
  const progression =
    filmsTotal > 0 ? Math.round((filmsDecided / filmsTotal) * 100) : 0;

  const handleNextFilm = () => {
    const source = filteredFilms.length > 0 ? filteredFilms : films;
    if (source.length === 0) {
      setSelectedFilm(null);
      return;
    }

    if (!selectedFilm) {
      setSelectedFilm(source[0]);
      return;
    }

    const currentIndex = source.findIndex(
      (film) => film.id === selectedFilm.id,
    );
    if (currentIndex === -1) {
      setSelectedFilm(source[0]);
      return;
    }

    const nextIndex = (currentIndex + 1) % source.length;
    setSelectedFilm(source[nextIndex]);
  };

  const handleLangChange = (lang: "fr" | "en") => {
    setCurrentLang(lang);
    setLanguage(lang);
  };

  if (isFetchingFilms) {
    return <JurySkeleton />;
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground transition-colors">
      <a
        href="#jury-main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:text-foreground focus:ring-2 focus:ring-ring"
      >
        Aller au contenu principal
      </a>

      <div className="absolute inset-0 z-0">
        <StarfieldNeural />
      </div>

      <div className="relative z-10 pt-24">
        <NavBar
          totalFilms={filmsTotal}
          votedFilms={filmsValidated}
          reviewFilms={filmsToReview}
          refusedFilms={filmsRefused}
          remainingFilms={filmsRemaining}
          progression={progression}
          currentLang={currentLang}
          onLangChange={handleLangChange}
        />
        <div className="mx-auto w-full max-w-screen-2xl p-4 lg:p-5">
          <div className="sticky top-24 z-40 -mx-2 mb-4 bg-background/85 px-2 py-2 backdrop-blur-md lg:mb-5">
            <FilmSearch
              query={searchQuery}
              onSearch={handleSearch}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              decidedFilms={filmsDecided}
              totalFilms={filmsTotal}
              progression={progression}
              disabled={!isLoggedIn}
            />
          </div>

          <section className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-5">
            <aside className="hidden lg:block lg:sticky lg:top-5">
              <AssignedFilms
                filmsTotal={filmsTotal}
                filmsRemaining={filmsRemaining}
                progression={progression}
                activeFilter={activeFilter}
                searchResults={filteredFilms}
                selectedFilm={selectedFilm}
                votesByFilm={votesByFilm}
                isLoggedIn={isLoggedIn}
                onSelectFilm={handleSelectFilm}
              />
            </aside>

            <main id="jury-main-content" className="space-y-4 lg:space-y-5">
              {filmsError && (
                <div className="feedback-error px-4 py-3 text-sm">
                  {filmsError}
                </div>
              )}
              <VideoPlayer film={selectedFilm} hasFilms={films.length > 0} />
              <FilmDetail
                film={selectedFilm}
                voteDecision={
                  selectedFilm ? votesByFilm[selectedFilm.id] : undefined
                }
              />
              <JuryVote
                film={selectedFilm}
                status={voteStatus}
                onVote={handleVote}
                commentValue={
                  selectedFilm ? (commentsByFilm[selectedFilm.id] ?? "") : ""
                }
                onCommentChange={(nextComment) => {
                  if (!selectedFilm) return;
                  // Conserve les brouillons de commentaires liés au film actuellement sélectionné.
                  setCommentsByFilm((previous) => ({
                    ...previous,
                    [selectedFilm.id]: nextComment,
                  }));
                }}
                onNextFilm={handleNextFilm}
                isVoteLocked={Boolean(
                  selectedFilm && votesByFilm[selectedFilm.id],
                )}
                disabled={!isLoggedIn || !selectedFilm}
              />
            </main>
          </section>
        </div>
      </div>
    </div>
  );
}
