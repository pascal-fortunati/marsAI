import { useState } from "react";
import { useTranslation } from "react-i18next";
import i18n, { setLanguage } from "../../lib/i18n";
import NavBar from "../../components/ui/NavBar";

import { FilmSearchBar } from "./FilmSearchBar";
import { FilmDetail } from "./FilmDetail";
import { VideoPlayer } from "./VideoPlayer";
import { VotePanel } from "./VotePanel";
import type { Film, VoteDecision } from "./types";

const assignedFilms: Film[] = [
  {
    id: "film-01",
    title: "Mentions Spéciales",
    country: "Allemagne",
    duration: "2:00",
    synopsis:
      "Un court expérimental sur la mémoire collective : L’IA restaure des archives et invente des futurs désirables.",
    tags: ["Humanity", "AIJourney"],
  },
  {
    id: "film-02",
    title: "After Rain Protocol",
    country: "France",
    duration: "1:52",
    synopsis:
      "Après une crue, une ville apprend à confier sa reconstruction à des intelligences distribuées.",
    tags: ["Resilience", "UrbanFuture"],
  },
  {
    id: "film-03",
    title: "Neon Harvest",
    country: "Japon",
    duration: "2:10",
    synopsis:
      "Des fermes verticales pilotées par IA redessinent les rituels d'une mégalopole nocturne.",
    tags: ["FoodTech", "City"],
  },
  {
    id: "film-04",
    title: "Children of Dust",
    country: "Maroc",
    duration: "1:34",
    synopsis:
      "Dans un désert connecté, des enfants recyclent des drones pour faire renaître l'eau.",
    tags: ["Climate", "Hope"],
  },
  {
    id: "film-05",
    title: "Echoes in Copper",
    country: "Chili",
    duration: "1:48",
    synopsis:
      "Une mine abandonnée devient un instrument sonore joué par des agents génératifs.",
    tags: ["Art", "Industry"],
  },
  {
    id: "film-06",
    title: "The Last Orchard",
    country: "Italie",
    duration: "1:58",
    synopsis:
      "Une famille dialogue avec un modèle prédictif pour sauver son verger historique.",
    tags: ["Family", "Biodiversity"],
  },
  {
    id: "film-07",
    title: "Packet of Light",
    country: "Sénégal",
    duration: "2:01",
    synopsis:
      "Une radio communautaire transforme des signaux satellites en poèmes visuels.",
    tags: ["Community", "Signal"],
  },
  {
    id: "film-08",
    title: "Blue Archive 2096",
    country: "Canada",
    duration: "1:46",
    synopsis:
      "Dans un océan monitoré en temps réel, des historiennes de données retrouvent des récits perdus.",
    tags: ["Ocean", "Memory"],
  },
  {
    id: "film-09",
    title: "Warm Silicon",
    country: "Corée du Sud",
    duration: "1:41",
    synopsis:
      "Une puce émotionnelle remet en question la frontière entre soin et automatisation.",
    tags: ["Care", "Ethics"],
  },
  {
    id: "film-10",
    title: "Tidal Grammar",
    country: "Portugal",
    duration: "1:55",
    synopsis:
      "Une linguiste entraîne un modèle sur les marées pour prédire les mots qui disparaissent.",
    tags: ["Language", "Sea"],
  },
  {
    id: "film-11",
    title: "Gravity Notes",
    country: "Argentine",
    duration: "2:03",
    synopsis:
      "Un orchestre adapte sa partition à la micro-gravité d'une station orbitale.",
    tags: ["Music", "Space"],
  },
  {
    id: "film-12",
    title: "Murmure Quantique",
    country: "Belgique",
    duration: "1:59",
    synopsis:
      "Un couple tente de conserver ses souvenirs dans une mémoire quantique défaillante.",
    tags: ["Love", "Quantum"],
  },
];

export function JuryView() {
  const [currentLang, setCurrentLang] = useState<"fr" | "en">(() =>
    i18n.language?.toLowerCase().startsWith("en") ? "en" : "fr",
  );

  const [isLoggedIn] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Film[]>(assignedFilms);
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(
    assignedFilms[0],
  );
  const [votesByFilm, setVotesByFilm] = useState<Record<string, VoteDecision>>({
    "film-02": "review",
    "film-03": "refuse",
    "film-07": "validate",
  });
  const [voteStatus, setVoteStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const { t } = useTranslation();

  const handleSelectFilm = (film: Film) => {
    setSelectedFilm(film);
    // TODO: charger les détails du film si nécessaire (API /api/films/:id)
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      setSearchResults(assignedFilms);
      return;
    }

    const filtered = assignedFilms.filter((film) => {
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

  const filmsTotal = assignedFilms.length;
  const filmsVoted = Object.keys(votesByFilm).length;
  const filmsRemaining = filmsTotal - filmsVoted;
  const progression = Math.round((filmsVoted / filmsTotal) * 100);

  const handleNextFilm = () => {
    if (!selectedFilm) {
      setSelectedFilm(assignedFilms[0]);
      return;
    }

    const currentIndex = assignedFilms.findIndex(
      (film) => film.id === selectedFilm.id,
    );
    const nextIndex = (currentIndex + 1) % assignedFilms.length;
    setSelectedFilm(assignedFilms[nextIndex]);
  };

  const handleLangChange = (lang: "fr" | "en") => {
    setCurrentLang(lang);
    setLanguage(lang);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <NavBar
        totalFilms={filmsTotal}
        votedFilms={filmsVoted}
        remainingFilms={filmsRemaining}
        progression={progression}
        currentLang={currentLang}
        onLangChange={handleLangChange}
      />
      <div className="mx-auto w-full max-w-7xl p-4 lg:p-5">
        <div className="mb-4 lg:mb-5">
          <FilmSearchBar
            query={searchQuery}
            onSearch={handleSearch}
            disabled={!isLoggedIn}
          />
        </div>

        <section className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-5">
          <aside className="lg:sticky lg:top-5 lg:h-[calc(100vh-120px)] lg:overflow-auto">
            <div className="rounded-lg border border-gray-800 bg-gray-900 p-5 shadow-lg">
              <h2 className="text-lg font-semibold">
                {t("jury.assigned", { count: filmsTotal })}
              </h2>
              <p className="mt-1 text-xs text-gray-400">
                {filmsRemaining}{" "}
                {t("jury.remaining", { defaultValue: "restants" })}
                {" · "}
                {progression}%
              </p>

              <ul className="mt-4 space-y-2">
                {searchResults.map((film) => {
                  const isSelected = selectedFilm?.id === film.id;
                  const isVoted = Boolean(votesByFilm[film.id]);

                  return (
                    <li key={film.id}>
                      <button
                        type="button"
                        onClick={() => handleSelectFilm(film)}
                        className={`w-full rounded-md border px-3 py-3 text-left transition ${
                          isSelected
                            ? "border-primary bg-primary/15"
                            : "border-gray-700 bg-slate-950 hover:border-gray-500"
                        }`}
                        disabled={!isLoggedIn}
                      >
                        <p className="font-semibold text-white">{film.title}</p>
                        <p className="mt-1 text-xs text-gray-400">
                          {[film.country, film.duration]
                            .filter(Boolean)
                            .join(" • ")}
                        </p>
                        <p
                          className={`mt-2 text-xs font-medium ${
                            isVoted ? "text-emerald-300" : "text-amber-300"
                          }`}
                        >
                          {isVoted
                            ? t("jury.votedStatus")
                            : t("jury.pendingStatus")}
                        </p>
                      </button>
                    </li>
                  );
                })}
              </ul>

              {searchResults.length === 0 && (
                <p className="mt-4 text-sm text-gray-400">{t("jury.noFilm")}</p>
              )}
            </div>
          </aside>

          <main className="space-y-4 lg:space-y-5">
            <VideoPlayer film={selectedFilm} />
            <FilmDetail film={selectedFilm} />
            <VotePanel
              film={selectedFilm}
              status={voteStatus}
              onVote={handleVote}
              disabled={!isLoggedIn || !selectedFilm}
            />

            <div className="rounded-lg border border-gray-800 bg-gray-900 px-4 py-3">
              <button
                type="button"
                className="text-sm text-gray-300 transition-colors hover:text-white"
                onClick={handleNextFilm}
                disabled={!isLoggedIn || !selectedFilm}
              >
                {t("jury.nextFilm")}
              </button>
            </div>
          </main>
        </section>
      </div>
    </div>
  );
}
