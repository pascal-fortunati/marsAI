import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/ui/Button";
import type { Film, VoteDecision } from "./types";

type VotePanelProps = {
  film: Film | null;
  status: "idle" | "submitting" | "success" | "error";
  onVote: (
    filmId: string,
    decision: VoteDecision,
    comment?: string,
  ) => Promise<void>;
  disabled?: boolean;
};

export function VotePanel({ film, status, onVote, disabled }: VotePanelProps) {
  const { t } = useTranslation();
  const [decision, setDecision] = useState<VoteDecision>("validate");
  const [comment, setComment] = useState<string>("");

  const isSubmitting = status === "submitting";

  const handleSubmit = async () => {
    if (!film) return;
    await onVote(film.id, decision, comment);
  };

  const decisionButtons: Array<{ value: VoteDecision; label: string }> = [
    { value: "validate", label: t("jury.actions.validate") },
    { value: "refuse", label: t("jury.actions.refuse") },
    { value: "review", label: t("jury.actions.review") },
  ];

  return (
    <div className="bg-gray-900 text-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">{t("jury.voteTitle")}</h2>

      {!film ? (
        <p className="text-gray-400">{t("jury.pendingStatus")}</p>
      ) : (
        <>
          <p className="text-sm text-gray-300">
            {t("jury.selectFilm")} : <strong>{film.title}</strong>
          </p>

          <div className="mt-4 space-y-3">
            <div className="grid gap-2 sm:grid-cols-3">
              {decisionButtons.map((item) => {
                const active = decision === item.value;
                return (
                  <Button
                    key={item.value}
                    type="button"
                    variant={active ? "default" : "outline"}
                    onClick={() => setDecision(item.value)}
                    className={!active ? "text-white" : undefined}
                    disabled={disabled || isSubmitting}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </div>

            <div>
              <label className="text-sm text-gray-300">
                {t("jury.commentLabel")}
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="mt-1 h-20 w-full resize-none rounded border border-gray-700 bg-slate-950 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder={t("jury.commentPlaceholder")}
                disabled={disabled || isSubmitting}
              />
            </div>

            <Button
              variant="default"
              size="lg"
              className="w-full"
              onClick={handleSubmit}
              disabled={disabled || isSubmitting || !film}
            >
              {isSubmitting
                ? t("jury.sending")
                : t("jury.sendVote", { defaultValue: "Voter" })}
            </Button>

            {status === "success" && (
              <p className="text-sm text-emerald-300">
                {t("jury.voteAlreadySubmitted", {
                  defaultValue: "Vote envoyé avec succès !",
                })}
              </p>
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
