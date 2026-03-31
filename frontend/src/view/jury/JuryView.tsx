// ...existing code...
import { useEffect, useMemo, useState } from "react";
import { apiFetchJson } from "../../lib/api";
import { NavBar } from "../../components/NavBar";
import { StarfieldNeural } from "../../components/ui/StarfieldNeural";
import { FilmDetail } from "./FilmDetail";
import { JuryVote } from "./JuryVote";
import { AssignedFilms } from "./AssignedFilms";
import JurySkeleton from "./JurySkeleton";
import type { Film, VoteDecision } from "./types";

type ApiFilm = Film & {
  voteDecision?: VoteDecision;
  voteComment?: string;
};

export function JuryView() {
  // const { t } = useTranslation();
  const [films, setFilms] = useState<Film[]>([]);
  const [isFetchingFilms, setIsFetchingFilms] = useState(true);
  const [filmsError, setFilmsError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(true);
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

  // Sélection d'un film dans la liste
  const handleSelectFilm = (film: Film | null) => {
    setSelectedFilm(film);
  };

  useEffect(() => {
    let cancelled = false;

    const loadAssignedFilms = async () => {
      setIsFetchingFilms(true);
      setFilmsError("");

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
        let message = "Unable to load assigned films.";
        if (
          error &&
          typeof error === "object" &&
          "message" in error &&
          typeof (error as any).message === "string"
        ) {
          message = (error as any).message;
          const msg = message.toLowerCase();
          if (
            msg.includes("non authentifié") ||
            msg.includes("not authenticated")
          ) {
            setIsLoggedIn(false);
          }
        }
        setFilmsError(message);
      }
      setIsFetchingFilms(false);
    };
    loadAssignedFilms();
    return () => {
      cancelled = true;
    };
  }, []);
  // Filtrage des films selon la recherche et le filtre actif
  const filteredFilms = useMemo(() => {
    let filtered = films;
    if (activeFilter === "voted") {
      filtered = filtered.filter((film: Film) => votesByFilm[film.id]);
    } else if (activeFilter === "remaining") {
      filtered = filtered.filter((film: Film) => !votesByFilm[film.id]);
    }
    if (searchQuery.trim() !== "") {
      const query = searchQuery.trim().toLowerCase();
      filtered = filtered.filter(
        (film: Film) =>
          film.title.toLowerCase().includes(query) ||
          (film.director && film.director.toLowerCase().includes(query)),
      );
    }
    return filtered;
  }, [films, votesByFilm, activeFilter, searchQuery]);

  const handleVote = async (
    filmId: string,
    decision: VoteDecision,
    comment?: string,
  ) => {
    setVoteStatus("submitting");
    try {
      await apiFetchJson<{ ok: boolean }>("/api/vote", {
        method: "POST",
        body: JSON.stringify({ filmId, decision, comment }),
      });
      setVotesByFilm((previous: Record<string, VoteDecision>) => ({
        ...previous,
        [filmId]: decision,
      }));
      if (typeof comment === "string") {
        setCommentsByFilm((previous: Record<string, string>) => ({
          ...previous,
          [filmId]: comment,
        }));
      }
      setVoteStatus("success");
    } catch {
      setVoteStatus("error");
    }
  };

  const filmsTotal = films.length;

  const filmsRemaining = filmsTotal - Object.keys(votesByFilm).length;
  const progression = filmsTotal
    ? Math.round((Object.keys(votesByFilm).length / filmsTotal) * 100)
    : 0;

  return (
    <div className="relative min-h-screen bg-background">
      <StarfieldNeural />
      <NavBar />
      <main className="container mx-auto py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <section className="md:col-span-1">
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
          </section>
          <section className="md:col-span-2">
            {isFetchingFilms ? (
              <JurySkeleton />
            ) : filmsError ? (
              <div className="panel p-8 text-center text-red-500">
                {filmsError}
              </div>
            ) : selectedFilm ? (
              <FilmDetail film={selectedFilm} />
            ) : null}

            <JuryVote
              film={selectedFilm}
              status={voteStatus}
              onVote={handleVote}
              commentValue={
                selectedFilm ? commentsByFilm[selectedFilm.id] || "" : ""
              }
              onCommentChange={(next: string) => {
                if (selectedFilm) {
                  setCommentsByFilm((prev: Record<string, string>) => ({
                    ...prev,
                    [selectedFilm.id]: next,
                  }));
                }
              }}
              onNextFilm={() => {
                // Sélectionne le film suivant dans la liste filtrée
                if (!selectedFilm) return;
                const idx = filteredFilms.findIndex(
                  (f: Film) => f.id === selectedFilm.id,
                );
                if (idx >= 0 && idx < filteredFilms.length - 1) {
                  setSelectedFilm(filteredFilms[idx + 1]);
                }
              }}
              isVoteLocked={false}
              disabled={isFetchingFilms || !selectedFilm}
            />
          </section>
        </div>
      </main>
    </div>
  );
}
