import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, RotateCcw, X, type LucideIcon } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { getFilmNumberPrefix, type Film, type VoteDecision } from "./types";

type JuryVoteProps = {
  film: Film | null;
  status: "idle" | "submitting" | "success" | "error";
  onVote: (
    filmId: string,
    decision: VoteDecision,
    comment?: string,
  ) => Promise<void>;
  commentValue: string;
  onCommentChange: (nextComment: string) => void;
  onNextFilm: () => void;
  isVoteLocked?: boolean;
  disabled?: boolean;
};

export function JuryVote({
  film,
  status,
  onVote,
  commentValue,
  onCommentChange,
  onNextFilm,
  isVoteLocked = false,
  disabled,
}: JuryVoteProps) {
  const { t } = useTranslation();
  const [decision, setDecision] = useState<VoteDecision | null>(null);

  const isSubmitting = status === "submitting";

  useEffect(() => {
    // A chaque changement de film selectionne, imposer un choix de vote explicite.
    setDecision(null);
  }, [film?.id]);

  const handleSubmit = async () => {
    if (!film || !decision) return;
    await onVote(film.id, decision, commentValue);
  };

  const decisionButtons: Array<{
    value: VoteDecision;
    label: string;
    icon: LucideIcon;
    activeClassName: string;
  }> = [
    {
      value: "validate",
      label: t("jury.actions.validate"),
      icon: Check,
      activeClassName: "btn-validate",
    },
    {
      value: "review",
      label: t("jury.actions.review"),
      icon: RotateCcw,
      activeClassName: "btn-review",
    },
    {
      value: "refuse",
      label: t("jury.actions.refuse"),
      icon: X,
      activeClassName: "btn-refuse",
    },
  ];

  const isDisabled = Boolean(disabled);
  const controlsDisabled = isDisabled || isSubmitting || isVoteLocked;
  const filmPrefix = film ? getFilmNumberPrefix(film) : null;

  return (
    <div
      className={`f-mono panel p-8 transition-opacity ${
        isVoteLocked ? "opacity-60" : ""
      }`}
    >
      <h2 className="f-orb text-2xl font-bold mb-4 text-foreground">
        {t("jury.voteTitle")}
      </h2>

      {!film ? (
        <p className="text-muted-foreground">{t("jury.pendingStatus")}</p>
      ) : (
        <>
          <p className="text-sm text-foreground/80">
            {t("jury.selectFilm")} :{" "}
            {filmPrefix && (
              <span className="text-xs font-normal text-muted-foreground">
                {filmPrefix}{" "}
              </span>
            )}
            <strong>{film.title}</strong>
          </p>

          <div className="mt-4 space-y-4">
            <div className="grid gap-2 sm:grid-cols-3">
              {decisionButtons.map((item) => {
                const active = decision === item.value;
                const Icon = item.icon;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setDecision(item.value)}
                    className={`h-11 rounded-md border px-4 text-base font-semibold transition-all duration-200 disabled:opacity-50 ${
                      active
                        ? item.activeClassName
                        : "border-border bg-secondary/40 text-foreground hover:border-ring hover:bg-secondary/60 active:bg-secondary/80"
                    }`}
                    disabled={controlsDisabled}
                  >
                    <span className="inline-flex items-center justify-center gap-2">
                      <Icon
                        className={`h-4 w-4 ${active ? "" : "text-muted-foreground"}`}
                        aria-hidden="true"
                      />
                      <span>{item.label}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div>
              <label className="text-sm text-muted-foreground">
                {t("jury.commentLabel")}
                <span className="ml-1 text-muted-foreground/70">
                  (optionnel)
                </span>
              </label>
              <textarea
                value={commentValue}
                onChange={(e) => onCommentChange(e.target.value)}
                className="f-mono mt-1 h-20 w-full resize-none rounded border border-border bg-input px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                placeholder={t("jury.commentPlaceholder")}
                disabled={controlsDisabled}
              />
            </div>

            <div className="flex justify-end">
              <Button
                variant="default"
                size="lg"
                className={`f-mono w-fit rounded-2xl text-base font-semibold transition-all duration-200 ${
                  isVoteLocked
                    ? "bg-muted text-muted-foreground shadow-none cursor-not-allowed"
                    : "bg-gradient-to-r from-violet-400/95 to-rose-500/95 text-white shadow-lg shadow-violet-400/35 hover:from-violet-400 hover:to-rose-500 hover:shadow-violet-400/50"
                }`}
                disabled={controlsDisabled || !decision}
                onClick={handleSubmit}
              >
                {isSubmitting ? (
                  <>
                    <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                    {t("jury.submitting")}
                  </>
                ) : (
                  t("jury.sendVote", { defaultValue: "Voter" })
                )}
              </Button>
            </div>

            {status === "success" && (
              <>
                <div className="feedback-success">
                  <p className="feedback-success-text">
                    ✓ {t("jury.voteSuccess")}
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={onNextFilm}
                    className="f-mono"
                  >
                    {t("jury.nextFilm")}
                  </Button>
                </div>
              </>
            )}

            {status === "error" && (
              <div className="feedback-error">
                <p className="feedback-error-text">✗ {t("jury.voteError")}</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
