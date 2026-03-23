import { useTranslation } from "react-i18next";
import { MousePointerClick, RotateCcw } from "lucide-react";
import type { Film, VoteDecision } from "./types";

type FilmDetailProps = {
  film: Film | null;
  voteDecision?: VoteDecision;
};

export function FilmDetail({ film, voteDecision }: FilmDetailProps) {
  const { t } = useTranslation();

  if (!film) {
    return (
      <div className="f-mono rounded-lg border border-slate-800 bg-slate-900/45 p-8 text-white shadow-lg">
        <h2 className="f-orb text-2xl font-bold mb-4">
          {t("jury.filmDetailsTitle")}
        </h2>
        <p className="text-gray-400">{t("jury.filmSelectPrompt")}</p>
      </div>
    );
  }

  const tags = film.tags ?? [];
  const isValidated = voteDecision === "validate";
  const isRefused = voteDecision === "refuse";
  const isReview = voteDecision === "review";

  const badgeClass = isValidated
    ? "border-emerald-400/60 bg-emerald-950/60 text-emerald-300"
    : isRefused
      ? "border-rose-400/60 bg-rose-950/50 text-rose-300"
      : isReview
        ? "border-amber-400/60 bg-amber-950/50 text-amber-300"
        : "border-slate-500/60 bg-slate-800/60 text-slate-300";

  const badgeLabel = isValidated
    ? t("jury.votedStatus")
    : isRefused
      ? `x ${t("common.status.refused")}`
      : isReview
        ? t("jury.actions.review")
        : t("jury.pendingStatus");

  return (
    <div className="f-mono rounded-lg border border-slate-800 bg-slate-900/45 p-8 text-white shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <h2 className="f-orb text-2xl font-bold">{film.title}</h2>

        <span
          className={`shrink-0 inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${badgeClass}`}
        >
          {isReview && <RotateCcw className="h-3 w-3" aria-hidden="true" />}
          {!isValidated && !isRefused && !isReview && (
            <MousePointerClick className="h-4 w-4" aria-hidden="true" />
          )}
          {badgeLabel}
        </span>
      </div>

      <p className="mt-1 text-sm text-gray-400">
        {[film.country, film.duration].filter(Boolean).join(" • ") ||
          t("jury.unknownYear", { defaultValue: "Année inconnue" })}
      </p>

      <div className="mt-5 space-y-2">
        <p className="text-gray-200">
          {film.synopsis ??
            t("jury.synopsisUnavailable", {
              defaultValue: "(Synopsis non disponible)",
            })}
        </p>
      </div>

      {tags.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-xs text-gray-200"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
