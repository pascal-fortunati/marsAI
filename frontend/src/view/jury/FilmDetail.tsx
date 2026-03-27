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
      <div className="f-mono panel p-8">
        <h2 className="f-orb text-2xl font-bold mb-4 text-foreground">
          {t("jury.filmDetailsTitle")}
        </h2>
        <p className="text-muted-foreground">{t("jury.filmSelectPrompt")}</p>
      </div>
    );
  }

  const tags = film.tags ?? [];
  const isValidated = voteDecision === "validate";
  const isRefused = voteDecision === "refuse";
  const isReview = voteDecision === "review";

  const badgeClass = isValidated
    ? "status-voted"
    : isRefused
      ? "status-refused"
      : isReview
        ? "status-review"
        : "status-pending";

  const badgeLabel = isValidated
    ? t("jury.votedStatus")
    : isRefused
      ? `x ${t("common.status.refused")}`
      : isReview
        ? t("jury.actions.review")
        : t("jury.pendingStatus");

  return (
    <div className="f-mono panel p-8">
      <div className="flex items-start justify-between gap-3">
        <h2 className="f-orb text-2xl font-bold text-foreground">
          {film.title}
        </h2>

        <span
          className={`shrink-0 inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition-all ${badgeClass}`}
        >
          {isReview && <RotateCcw className="h-3 w-3" aria-hidden="true" />}
          {!isValidated && !isRefused && !isReview && (
            <MousePointerClick className="h-4 w-4" aria-hidden="true" />
          )}
          {badgeLabel}
        </span>
      </div>

      <p className="mt-1 text-sm text-muted-foreground">
        {[film.country, film.duration].filter(Boolean).join(" • ") ||
          t("jury.unknownYear", { defaultValue: "Année inconnue" })}
      </p>

      <div className="mt-5 space-y-2">
        <p className="text-foreground/90">
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
              className="rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs text-foreground/80 hover:bg-secondary hover:text-foreground transition-colors"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
