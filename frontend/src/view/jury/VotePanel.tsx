import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/ui/Button";
import type { Film } from "./types";

type VotePanelProps = {
  film: Film | null;
  status: "idle" | "submitting" | "success" | "error";
  onVote: (filmId: string, score: number, comment?: string) => Promise<void>;
  disabled?: boolean;
};

export function VotePanel({ film, status, onVote, disabled }: VotePanelProps) {
  const { t } = useTranslation();
  const [score, setScore] = useState<number>(0);
  const [comment, setComment] = useState<string>("");

  const isSubmitting = status === "submitting";

  const handleSubmit = async () => {
    if (!film) return;
    await onVote(film.id, score, comment);
  };

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
            <div>
              <label className="text-sm text-gray-300">
                {t("jury.scoreLabel", { defaultValue: "Note (0-10)" })}
              </label>
              <input
                type="number"
                min={0}
                max={10}
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
                className="mt-1 w-full rounded border border-gray-700 bg-slate-950 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={disabled || isSubmitting}
              />
            </div>

            <div>
              <label className="text-sm text-gray-300">
                {t("jury.commentLabel")}
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="mt-1 h-20 w-full resize-none rounded border border-gray-700 bg-slate-950 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
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
              {isSubmitting ? t("jury.sending") : t("jury.sendVote")}
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

            <p className="text-xs text-gray-500">
              TODO: implémenter une navigation vers les autres films /
              historique des votes.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
