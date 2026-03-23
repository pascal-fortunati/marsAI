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
  onNextFilm: () => void;
  isVoteLocked?: boolean;
  disabled?: boolean;
};

export function JuryVote({
  film,
  status,
  onVote,
  onNextFilm,
  isVoteLocked = false,
  disabled,
}: JuryVoteProps) {
  const { t } = useTranslation();
  const [decision, setDecision] = useState<VoteDecision | null>(null);
  const [comment, setComment] = useState<string>("");

  const isSubmitting = status === "submitting";

  useEffect(() => {
    // Every time the selected film changes, require an explicit vote choice.
    setDecision(null);
  }, [film?.id]);

  const handleSubmit = async () => {
    if (!film || !decision) return;
    await onVote(film.id, decision, comment);
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
      activeClassName: "border-emerald-400 bg-emerald-950 text-emerald-300",
    },
    {
      value: "review",
      label: t("jury.actions.review"),
      icon: RotateCcw,
      activeClassName: "border-amber-400 bg-amber-950 text-amber-300",
    },
    {
      value: "refuse",
      label: t("jury.actions.refuse"),
      icon: X,
      activeClassName: "border-rose-400 bg-rose-950 text-rose-300",
    },
  ];

  const isDisabled = Boolean(disabled);
  const controlsDisabled = isDisabled || isSubmitting || isVoteLocked;
  const filmPrefix = film ? getFilmNumberPrefix(film) : null;

  return (
    <div
      className={`f-mono rounded-lg border border-slate-800 bg-slate-900/45 p-8 text-white shadow-lg ${
        isVoteLocked ? "opacity-65" : ""
      }`}
    >
      <h2 className="f-orb text-2xl font-bold mb-4">{t("jury.voteTitle")}</h2>

      {!film ? (
        <p className="text-gray-400">{t("jury.pendingStatus")}</p>
      ) : (
        <>
          <p className="text-sm text-gray-300">
            {t("jury.selectFilm")} :{" "}
            {filmPrefix && (
              <span className="text-xs font-normal text-gray-400">
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
                    className={`h-11 rounded-md border px-4 text-base font-semibold transition disabled:opacity-50 ${
                      active
                        ? item.activeClassName
                        : "border-slate-800 bg-slate-900 text-white hover:border-slate-600 hover:bg-slate-800"
                    }`}
                    disabled={controlsDisabled}
                  >
                    <span className="inline-flex items-center justify-center gap-2">
                      <Icon
                        className={`h-4 w-4 ${active ? "" : "text-slate-400"}`}
                        aria-hidden="true"
                      />
                      <span>{item.label}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div>
              <label className="text-sm text-gray-400">
                {t("jury.commentLabel")}
                <span className="ml-1 text-slate-500">(optionnel)</span>
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="mt-1 h-20 w-full resize-none rounded border border-slate-800 bg-slate-900 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder={t("jury.commentPlaceholder")}
                disabled={controlsDisabled}
              />
            </div>

            <div className="flex justify-end">
              <Button
                variant="outline"
                size="lg"
                className={`f-mono w-fit rounded-2xl border-0 text-base font-semibold ${
                  isVoteLocked
                    ? "bg-slate-700 text-slate-300 shadow-none"
                    : "bg-gradient-to-r from-violet-400/95 to-rose-500/95 text-white shadow-lg shadow-violet-400/35 hover:from-violet-400 hover:to-rose-500 hover:shadow-violet-400/50"
                }`}
                onClick={handleSubmit}
                disabled={controlsDisabled || !film || !decision}
              >
                {isSubmitting
                  ? t("jury.sending")
                  : t("jury.sendVote", { defaultValue: "Voter" })}
              </Button>
            </div>

            {isVoteLocked && (
              <button
                type="button"
                className="w-fit rounded-md px-2 py-1 text-sm text-white transition-colors hover:bg-slate-800/70"
                onClick={onNextFilm}
                disabled={isDisabled || !film}
              >
                {t("jury.nextFilm")}
              </button>
            )}

            {status === "error" && (
              <p className="text-sm text-rose-300">
                {t("jury.errorSending", {
                  defaultValue:
                    "Erreur lors de l'envoi du vote. Essaie à nouveau.",
                })}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
