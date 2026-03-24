import { useTranslation } from "react-i18next";
import { Check, MousePointerClick, RotateCcw, X } from "lucide-react";
import { getFilmNumberPrefix, type Film, type VoteDecision } from "./types";

type AssignedFilmsProps = {
  filmsTotal: number;
  filmsRemaining: number;
  progression: number;
  activeFilter: "all" | "voted" | "remaining";
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
  activeFilter,
  searchResults,
  selectedFilm,
  votesByFilm,
  isLoggedIn,
  onSelectFilm,
}: AssignedFilmsProps) {
  const { t } = useTranslation();
  const displayedCount = searchResults.length;

  const title =
    activeFilter === "all"
      ? t("jury.assigned", { count: displayedCount })
      : `${displayedCount} films ${
          activeFilter === "voted" ? t("jury.voted") : t("jury.remaining")
        }`;

  return (
    <div className="f-mono overflow-hidden rounded-[20px] border border-slate-800 bg-slate-900/45 shadow-lg">
      <div className="px-6 pt-5 pb-4">
        <h2 className="f-orb text-lg font-semibold leading-none">{title}</h2>
      </div>

      <div className="h-px w-full bg-slate-800" aria-hidden="true" />

      <ul className="divide-y divide-slate-800/80">
        {searchResults.map((film) => {
          const isSelected = selectedFilm?.id === film.id;
          const voteDecision = votesByFilm[film.id];
          const isVoted = Boolean(voteDecision);
          const isRefused = voteDecision === "refuse";
          const isReview = voteDecision === "review";
          const prefix = getFilmNumberPrefix(film);

          return (
            <li key={film.id}>
              <button
                type="button"
                onClick={() => onSelectFilm(film)}
                className={`w-full px-6 py-6 text-left transition ${
                  isSelected
                    ? "bg-indigo-900/30 ring-1 ring-inset ring-indigo-400/35"
                    : "bg-transparent hover:bg-slate-800/35"
                }`}
                disabled={!isLoggedIn}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-white">
                    {prefix && (
                      <span className="text-xs font-normal text-gray-400">
                        {prefix}{" "}
                      </span>
                    )}
                    {film.title}
                  </p>

                  {isVoted ? (
                    isRefused ? (
                      <X
                        className="h-4 w-4 shrink-0 text-red-400"
                        aria-label={t("jury.actions.refuse")}
                      />
                    ) : isReview ? (
                      <RotateCcw
                        className="h-4 w-4 shrink-0 text-amber-400"
                        aria-label={t("jury.actions.review")}
                      />
                    ) : (
                      <Check
                        className="h-4 w-4 shrink-0 text-emerald-400"
                        aria-label={t("jury.votedStatus")}
                      />
                    )
                  ) : (
                    <MousePointerClick
                      className="h-5 w-5 shrink-0 text-slate-400"
                      aria-label={t("jury.pendingStatus")}
                    />
                  )}
                </div>

                <p className="mt-1 text-xs text-gray-400">
                  {[film.country, film.duration].filter(Boolean).join(" • ")}
                </p>

                <div
                  className={`mt-4 h-[2px] w-full rounded-full ${
                    isSelected ? "bg-indigo-400/70" : "bg-transparent"
                  }`}
                  aria-hidden="true"
                />
              </button>
            </li>
          );
        })}
      </ul>

      {searchResults.length === 0 && (
        <p className="px-6 py-5 text-sm text-gray-400">{t("jury.noFilm")}</p>
      )}
    </div>
  );
}
