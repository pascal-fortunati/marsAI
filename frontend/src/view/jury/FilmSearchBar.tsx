import { useTranslation } from "react-i18next";
import type { Film } from "./types";

type FilmSearchBarProps = {
  query: string;
  results: Film[];
  onSearch: (query: string) => void;
  onSelectFilm: (film: Film) => void;
  disabled?: boolean;
};

export function FilmSearchBar({
  query,
  results,
  onSearch,
  onSelectFilm,
  disabled,
}: FilmSearchBarProps) {
  const { t } = useTranslation();

  // TODO: appeler l'API /api/films?search=...
  return (
    <div className="bg-gray-900 text-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">{t("jury.searchPlaceholder")}</h2>

      <div className="flex gap-2">
        <input
          className="flex-1 rounded border border-gray-700 bg-slate-950 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder={t("jury.searchPlaceholder")}
          value={query}
          onChange={(event) => onSearch(event.target.value)}
          disabled={disabled}
        />
      </div>

      <div className="mt-4 max-h-64 overflow-auto">
        {results.length === 0 ? (
          <p className="text-sm text-gray-400">
            {t("jury.noFilm")} (TODO : afficher les films recherchés)
          </p>
        ) : (
          <ul className="space-y-2">
            {results.map((film) => (
              <li key={film.id}>
                <button
                  className="w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-left hover:bg-gray-700"
                  onClick={() => onSelectFilm(film)}
                  disabled={disabled}
                >
                  <div className="font-semibold">{film.title}</div>
                  <div className="text-xs text-gray-400">
                    {film.year ?? t("jury.unknownYear", "Année inconnue")}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
