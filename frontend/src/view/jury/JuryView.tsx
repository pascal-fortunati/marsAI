import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import i18n, { setLanguage } from "../../lib/i18n";
import NavBar from "../../components/ui/NavBar";
import { LoginView } from "./LoginView";
import { FilmSearchBar } from "./FilmSearchBar";
import { FilmDetail } from "./FilmDetail";
import { VideoPlayer } from "./VideoPlayer";
import { VotePanel } from "./VotePanel";
import type { Film } from "./types";

export function JuryView() {
  const [currentLang, setCurrentLang] = useState<"fr" | "en">(() =>
    i18n.language?.toLowerCase().startsWith("en") ? "en" : "fr",
  );

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Film[]>([]);
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);
  const [voteStatus, setVoteStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const { t } = useTranslation();

  const selectedFilmTitle = useMemo(
    () => selectedFilm?.title ?? t("jury.noFilm"),
    [selectedFilm, t],
  );

  const handleLogin = async (token: string) => {
    // TODO: appeler l'API pour valider le token / récupérer le profil juré
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    // TODO: remove token + appeler clearStoredToken() via lib/api
    setIsLoggedIn(false);
    setSelectedFilm(null);
    setSearchResults([]);
    setSearchQuery("");
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    // TODO: appeler l'API /api/films?search=... et mettre à jour searchResults
    setSearchResults([]);
  };

  const handleSelectFilm = (film: Film) => {
    setSelectedFilm(film);
    // TODO: charger les détails du film si nécessaire (API /api/films/:id)
  };

  const handleVote = async (
    filmId: string,
    score: number,
    comment?: string,
  ) => {
    setVoteStatus("submitting");
    try {
      // TODO: appeler POST /api/vote avec { filmId, score, comment }
      setVoteStatus("success");
    } catch (error) {
      setVoteStatus("error");
    }
  };

  const handleLangChange = (lang: "fr" | "en") => {
    setCurrentLang(lang);
    setLanguage(lang);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <NavBar currentLang={currentLang} onLangChange={handleLangChange} />
      <div className="mx-auto flex max-w-6xl flex-col gap-6 p-4">
        <header className="rounded-lg bg-gray-900 p-6 shadow-lg">
          <h2 className="text-2xl font-bold">{t("nav.jurySpace")}</h2>
          <p className="mt-2 text-gray-300">{t("jury.loginPrompt")}</p>
        </header>

        <section className="grid gap-6 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <LoginView
              isLoggedIn={isLoggedIn}
              onLogin={handleLogin}
              onLogout={handleLogout}
            />
            <FilmSearchBar
              query={searchQuery}
              results={searchResults}
              onSearch={handleSearch}
              onSelectFilm={handleSelectFilm}
              disabled={!isLoggedIn}
            />
          </aside>

          <main className="lg:col-span-5">
            <FilmDetail film={selectedFilm} />
            <VideoPlayer film={selectedFilm} />
          </main>

          <aside className="lg:col-span-3">
            <VotePanel
              film={selectedFilm}
              status={voteStatus}
              onVote={handleVote}
              disabled={!isLoggedIn || !selectedFilm}
            />
          </aside>
        </section>

        <footer className="rounded-lg bg-gray-900 p-4 text-sm text-gray-400">
          <p>
            <strong>Astuce :</strong> Commence par te connecter puis recherche
            un film pour activer les actions.
          </p>
        </footer>
      </div>
    </div>
  );
}
