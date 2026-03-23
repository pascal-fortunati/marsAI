import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import i18n, { setLanguage } from "../../lib/i18n";
import NavBar from "../../components/ui/NavBar";
import { StarfieldNeural } from "../../components/ui/StarfieldNeural";

import { FilmSearch } from "./FilmSearch";
import { FilmDetail } from "./FilmDetail";
import { VideoPlayer } from "./VideoPlayer";
import { JuryVote } from "./JuryVote";
import { AssignedFilms } from "./AssignedFilms";
import type { Film, VoteDecision } from "./types";

// Static film metadata (IDs, durations, tags)
const filmMetadata = [
  { id: "film-01", duration: "2:00", tags: ["Humanity", "AIJourney"] },
  { id: "film-02", duration: "1:52", tags: ["Resilience", "UrbanFuture"] },
  { id: "film-03", duration: "2:10", tags: ["FoodTech", "City"] },
  { id: "film-04", duration: "1:34", tags: ["Climate", "Hope"] },
  { id: "film-05", duration: "1:48", tags: ["Art", "Industry"] },
  { id: "film-06", duration: "1:58", tags: ["Family", "Biodiversity"] },
  { id: "film-07", duration: "2:01", tags: ["Community", "Signal"] },
  { id: "film-08", duration: "1:46", tags: ["Ocean", "Memory"] },
  { id: "film-09", duration: "1:41", tags: ["Care", "Ethics"] },
  { id: "film-10", duration: "1:55", tags: ["Language", "Sea"] },
  { id: "film-11", duration: "2:03", tags: ["Music", "Space"] },
  { id: "film-12", duration: "1:59", tags: ["Love", "Quantum"] },
];

const DEFAULT_VOTES_BY_FILM: Record<string, VoteDecision> = {
  "film-02": "review",
  "film-03": "refuse",
  "film-07": "validate",
};

const VALID_DECISIONS: VoteDecision[] = ["validate", "review", "refuse"];
const JURY_VOTES_STORAGE_KEY = "jury-votes-by-film";
const JURY_COMMENTS_STORAGE_KEY = "jury-comments-by-film";

export function JuryView() {
  const { t } = useTranslation();
  const [currentLang, setCurrentLang] = useState<"fr" | "en">(() =>
    i18n.language?.toLowerCase().startsWith("en") ? "en" : "fr",
  );

  // Load localized films from i18n
  const localizedFilms = useMemo<Film[]>(() => {
    return filmMetadata.map((meta) => ({
      id: meta.id,
      title: t(`films.${meta.id}.title`),
      country: t(`films.${meta.id}.country`),
      synopsis: t(`films.${meta.id}.synopsis`),
      duration: meta.duration,
      tags: meta.tags,
    }));
  }, [t]);

  const [isLoggedIn] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "all" | "voted" | "remaining"
  >("all");
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(
    localizedFilms[0],
  );
  const [votesByFilm, setVotesByFilm] = useState<Record<string, VoteDecision>>(
    () => {
      if (typeof window === "undefined") return DEFAULT_VOTES_BY_FILM;
      try {
        const raw = window.localStorage.getItem(JURY_VOTES_STORAGE_KEY);
        if (!raw) return DEFAULT_VOTES_BY_FILM;
        const parsed = JSON.parse(raw) as Record<string, unknown>;
        const restored = Object.fromEntries(
          Object.entries(parsed).filter(([, value]) =>
            VALID_DECISIONS.includes(value as VoteDecision),
          ),
        ) as Record<string, VoteDecision>;
        return Object.keys(restored).length > 0
          ? restored
          : DEFAULT_VOTES_BY_FILM;
      } catch {
        return DEFAULT_VOTES_BY_FILM;
      }
    },
  );
  // Front-only cache: one comment per film id, restored from localStorage.
  const [commentsByFilm, setCommentsByFilm] = useState<Record<string, string>>(
    () => {
      if (typeof window === "undefined") return {};
      try {
        const raw = window.localStorage.getItem(JURY_COMMENTS_STORAGE_KEY);
        if (!raw) return {};
        const parsed = JSON.parse(raw) as Record<string, unknown>;
        return Object.fromEntries(
          Object.entries(parsed).filter(
            ([, value]) => typeof value === "string",
          ),
        ) as Record<string, string>;
      } catch {
        return {};
      }
    },
  );
  const [voteStatus, setVoteStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const handleSelectFilm = (film: Film) => {
    setSelectedFilm(film);
    // TODO: charger les détails du film si nécessaire (API /api/films/:id)
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredFilms = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return localizedFilms.filter((film) => {
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
  }, [localizedFilms, searchQuery, activeFilter, votesByFilm]);

  useEffect(() => {
    // Keep selection consistent with active filters/search.
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

  useEffect(() => {
    // Persist votes so they survive page refreshes.
    window.localStorage.setItem(
      JURY_VOTES_STORAGE_KEY,
      JSON.stringify(votesByFilm),
    );
  }, [votesByFilm]);

  useEffect(() => {
    // Persist comment drafts so they survive page refreshes.
    window.localStorage.setItem(
      JURY_COMMENTS_STORAGE_KEY,
      JSON.stringify(commentsByFilm),
    );
  }, [commentsByFilm]);

  const handleVote = async (
    filmId: string,
    decision: VoteDecision,
    comment?: string,
  ) => {
    setVoteStatus("submitting");
    try {
      // TODO: appeler POST /api/vote avec { filmId, decision, comment }
      setVotesByFilm((previous) => ({ ...previous, [filmId]: decision }));
      if (typeof comment === "string") {
        setCommentsByFilm((previous) => ({ ...previous, [filmId]: comment }));
      }
      setVoteStatus("success");
    } catch (error) {
      setVoteStatus("error");
    }
  };

  const filmsTotal = filmMetadata.length;
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
  const progression = Math.round((filmsDecided / filmsTotal) * 100);

  const handleNextFilm = () => {
    const source = filteredFilms.length > 0 ? filteredFilms : localizedFilms;
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

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-950 text-white">
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
        <div className="mx-auto w-full max-w-7xl p-4 lg:p-5">
          <div className="sticky top-24 z-40 -mx-2 px-2 py-2 bg-slate-950/85 backdrop-blur-md mb-4 lg:mb-5">
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

            <main className="space-y-4 lg:space-y-5">
              <VideoPlayer film={selectedFilm} />
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
                  // Keep draft comments attached to the currently selected film.
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
