import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { marsaiColors, withAlpha } from "../../theme/marsai";
import type { JuryFilm, VoteAction } from "./juryTypes";
import { VOTE_CFG } from "./juryConfig";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Separator } from "../../components/ui/separator";
import { useToast } from "../../hooks/use-toast";

// Composant représentant le panneau de vote du jury pour un film
export function JuryVotePanel({
  film,
  onVote,
  onNext,
  hasNext,
}: {
  film: JuryFilm;
  onVote: (
    id: string,
    action: Exclude<VoteAction, null>,
    comment: string,
  ) => Promise<void>;
  onNext: () => void;
  hasNext: boolean;
}) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [action, setAction] = useState<VoteAction>(film.vote);
  const [comment, setComment] = useState(film.comment);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(film.status === "voted");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const voteLabels: Record<Exclude<VoteAction, null>, string> = {
    validate: t("jury.actions.validate"),
    refuse: t("jury.actions.refuse"),
    review: t("jury.actions.review"),
  };

  useEffect(() => {
    setAction(film.vote);
    setComment(film.comment);
    setDone(film.status === "voted");
    setSubmitError(null);
  }, [film.id, film.vote, film.comment, film.status]);

  const needsComment = action === "refuse" && !comment.trim();

  async function submit() {
    if (done || !action || needsComment) return;
    setSending(true);
    setSubmitError(null);
    try {
      await onVote(film.id, action, comment);
      setDone(true);
      toast({
        title: t("jury.sendVote"),
        description: t("jury.votedStatus"),
        kind: "success",
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : t("common.error");
      setSubmitError(message);
      toast({
        title: t("common.error"),
        description: message,
        kind: "error",
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {/* ── Player vidéo ── */}
      <div className="overflow-hidden rounded-2xl border bg-black">
        <div className="flex h-5 items-center justify-center gap-2.5 bg-black px-4">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="h-2.5 w-2 rounded-sm bg-white/8" />
          ))}
        </div>
        <div className="relative aspect-video bg-black">
          {film.youtubeId ? (
            <iframe
              src={`https://www.youtube.com/embed/${film.youtubeId}?rel=0&modestbranding=1`}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={film.title}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="f-mono text-sm text-muted-foreground">
                {t("jury.noVideo")}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Info film ── */}
      <Card className="border-white/8 bg-[hsl(var(--card))]">
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="min-w-0">
              <h2 className="f-orb text-xl font-black truncate">
                {film.title}
              </h2>
              <div className="f-mono text-sm text-muted-foreground mt-1">
                {film.country} · {film.duration}
              </div>
            </div>
            {/* Status badge — couleur dynamique via style inline */}
            <Badge
              variant="outline"
              className="f-mono shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold"
              style={{
                color: done ? marsaiColors.success : undefined,
                background: done
                  ? withAlpha(marsaiColors.success, 0.1)
                  : undefined,
                borderColor: done
                  ? withAlpha(marsaiColors.success, 0.25)
                  : undefined,
              }}
            >
              {done ? t("jury.votedStatus") : t("jury.pendingStatus")}
            </Badge>
          </div>

          <p className="f-mono text-sm leading-relaxed text-muted-foreground mb-4">
            {film.synopsis}
          </p>

          <div className="flex flex-wrap gap-2">
            {(film.aiTools ?? []).map((tool) => (
              <Badge
                key={tool}
                variant="secondary"
                className="f-mono px-3 py-1 text-xs"
              >
                {tool}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Vote ── */}
      <Card className="border-white/8 bg-[hsl(var(--card))]">
        <CardContent className="p-6 flex flex-col gap-5">
          <div className="f-mono text-xs uppercase tracking-widest text-muted-foreground">
            {t("jury.voteTitle")}
          </div>

          {/* Boutons d'action — shadcn Button outline, couleur active via style inline */}
          <div className="grid grid-cols-3 gap-3">
            {(
              Object.entries(VOTE_CFG) as [
                Exclude<VoteAction, null>,
                (typeof VOTE_CFG)[keyof typeof VOTE_CFG],
              ][]
            ).map(([k, v]) => {
              const active = action === k;
              return (
                <Button
                  key={k}
                  onClick={() => setAction(k)}
                  disabled={done}
                  variant="outline"
                  className="f-mono h-auto rounded-xl py-4 text-sm font-semibold flex flex-col gap-1 transition-all"
                  style={{
                    color: active ? v.color : undefined,
                    background: active ? withAlpha(v.color, 0.08) : undefined,
                    borderColor: active ? withAlpha(v.color, 0.3) : undefined,
                    boxShadow: active
                      ? `0 0 18px ${withAlpha(v.color, 0.1)}`
                      : undefined,
                  }}
                >
                  <span className="text-xl">{v.icon}</span>
                  {voteLabels[k]}
                </Button>
              );
            })}
          </div>

          <Separator />

          {/* Commentaire */}
          <div className="flex flex-col gap-2">
            <Label className="f-mono text-xs uppercase tracking-widest text-muted-foreground">
              {t("jury.commentLabel")}
              {action === "refuse" ? (
                <span className="text-destructive ml-1">*</span>
              ) : (
                <span className="text-muted-foreground/50 ml-1 normal-case">
                  {t("jury.commentOptional")}
                </span>
              )}
            </Label>
            <Textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={done}
              placeholder={
                action === "refuse"
                  ? t("jury.refusePlaceholder")
                  : t("jury.commentPlaceholder")
              }
              className="f-mono resize-none"
            />
            {needsComment && (
              <p className="f-mono text-xs text-destructive">
                {t("jury.commentRequired")}
              </p>
            )}
          </div>
          {submitError && (
            <p className="f-mono text-xs text-destructive">{submitError}</p>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3">
            {hasNext && done && (
              <Button
                variant="outline"
                onClick={onNext}
                className="f-mono h-9 rounded-xl px-3 text-xs sm:h-10 sm:px-4 sm:text-sm"
              >
                {t("jury.nextFilm")} →
              </Button>
            )}
            <div className="flex-1" />
            <Button
              onClick={submit}
              disabled={done || sending || !action || needsComment}
              className="f-orb h-9 rounded-xl px-3 text-xs font-black sm:h-10 sm:px-5 sm:text-sm"
              style={{
                background: `linear-gradient(135deg, ${marsaiColors.primary}, ${marsaiColors.accent})`,
              }}
            >
              {sending
                ? t("jury.sending")
                : done
                  ? t("jury.voteLocked")
                  : t("jury.sendVote")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
