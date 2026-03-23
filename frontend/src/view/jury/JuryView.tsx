import { useState, useMemo } from "react";
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
  const [searchResults, setSearchResults] = useState<Film[]>(localizedFilms);
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(
    localizedFilms[0],
  );
  const [votesByFilm, setVotesByFilm] = useState<Record<string, VoteDecision>>({
    "film-02": "review",
    "film-03": "refuse",
    "film-07": "validate",
  });
  const [voteStatus, setVoteStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const handleSelectFilm = (film: Film) => {
    setSelectedFilm(film);
    // TODO: charger les détails du film si nécessaire (API /api/films/:id)
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      setSearchResults(localizedFilms);
      return;
    }

    const filtered = localizedFilms.filter((film) => {
      const haystack = [film.title, film.country, film.tags?.join(" ")]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    });

    setSearchResults(filtered);
  };

  const handleVote = async (
    filmId: string,
    decision: VoteDecision,
    comment?: string,
  ) => {
    setVoteStatus("submitting");
    try {
      // TODO: appeler POST /api/vote avec { filmId, decision, comment }
      setVotesByFilm((previous) => ({ ...previous, [filmId]: decision }));
      setVoteStatus("success");
    } catch (error) {
      setVoteStatus("error");
    }
  };

  const filmsTotal = filmMetadata.length;
  const filmsVoted = Object.keys(votesByFilm).length;
  const filmsRemaining = filmsTotal - filmsVoted;
  const progression = Math.round((filmsVoted / filmsTotal) * 100);

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
          votedFilms={filmsVoted}
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
              disabled={!isLoggedIn}
            />
          </div>

          <section className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-5">
            <aside className="lg:sticky lg:top-5">
              <AssignedFilms
                filmsTotal={filmsTotal}
                filmsRemaining={filmsRemaining}
                progression={progression}
                searchResults={searchResults}
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
                isVoted={Boolean(selectedFilm && votesByFilm[selectedFilm.id])}
              />
              <JuryVote
                film={selectedFilm}
                status={voteStatus}
                onVote={handleVote}
                disabled={!isLoggedIn || !selectedFilm}
              />
            </main>
          </section>
        </div>
      </div>
    </div>
  );
}
