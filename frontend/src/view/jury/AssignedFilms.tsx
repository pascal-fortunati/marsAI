import { useTranslation } from "react-i18next";
import type { Film, VoteDecision } from "./types";

type AssignedFilmsProps = {
  filmsTotal: number;
  filmsRemaining: number;
  progression: number;
  searchResults: Film[];
  selectedFilm: Film | null;
  votesByFilm: Record<string, VoteDecision>;
  isLoggedIn: boolean;
  onSelectFilm: (film: Film) => void;
};

export function AssignedFilms({
  filmsTotal,
  filmsRemaining,
  progression,
  searchResults,
  selectedFilm,
  votesByFilm,
  isLoggedIn,
  onSelectFilm,
}: AssignedFilmsProps) {
  const { t } = useTranslation();

  return (
    <div className="f-mono rounded-lg border border-slate-800 bg-slate-900 p-5 shadow-lg">
      <h2 className="text-lg font-semibold">
        {t("jury.assigned", { count: filmsTotal })}
      </h2>
      <p className="mt-1 text-xs text-gray-400">
        {filmsRemaining} {t("jury.remaining", { defaultValue: "restants" })}
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
                onClick={() => onSelectFilm(film)}
                className={`w-full rounded-md border px-3 py-3 text-left transition ${
                  isSelected
                    ? "border-primary bg-indigo-950"
                    : "border-slate-800 bg-slate-900 hover:border-slate-600 hover:bg-slate-800"
                }`}
                disabled={!isLoggedIn}
              >
                <p className="font-semibold text-white">{film.title}</p>
                <p className="mt-1 text-xs text-gray-400">
                  {[film.country, film.duration].filter(Boolean).join(" • ")}
                </p>
                <p
                  className={`mt-2 text-xs font-medium ${
                    isVoted ? "text-emerald-300" : "text-amber-300"
                  }`}
                >
                  {isVoted ? t("jury.votedStatus") : t("jury.pendingStatus")}
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
  );
}
