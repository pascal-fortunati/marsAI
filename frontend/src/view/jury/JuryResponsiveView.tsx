import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { JuryVotePanel } from "./JuryVotePanel";
import type { JuryFilm, VoteAction } from "./juryTypes";
import { marsaiColors, withAlpha } from "../../theme/marsai";

export function JuryResponsiveView({
  films,
  activeId,
  onSelect,
  activeFilm,
  onVote,
  onNext,
  hasNext,
}: {
  films: JuryFilm[];
  activeId: string | null;
  onSelect: (id: string) => void;
  activeFilm: JuryFilm | null;
  onVote: (
    id: string,
    action: Exclude<VoteAction, null>,
    comment: string,
  ) => Promise<void>;
  onNext: () => void;
  hasNext: boolean;
}) {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const selectedIndex = useMemo(
    () => films.findIndex((f) => f.id === activeId),
    [films, activeId],
  );

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setSidebarOpen((v) => !v)}
        className="fixed left-3 top-1/2 z-40 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#7d71fb]/35 bg-[#0b0814]/92 text-white shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-sm"
        aria-label={
          sidebarOpen
            ? "Fermer la liste des films"
            : "Ouvrir la liste des films"
        }
      >
        {sidebarOpen ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </button>

      <div
        className={`fixed inset-0 z-30 bg-black/55 transition-opacity duration-300 ${
          sidebarOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside
        className={`fixed top-21 bottom-0 left-0 z-40 flex h-[calc(100dvh-5.25rem)] w-[88vw] max-w-sm flex-col border-r border-white/10 bg-[#080611]/96 shadow-[0_15px_60px_rgba(0,0,0,0.45)] backdrop-blur transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-14 items-center justify-between border-b border-white/8 px-4">
          <span className="f-orb text-sm font-black text-white">
            {t("jury.assigned", { count: films.length })}
          </span>
          <Badge variant="secondary" className="f-mono text-[10px]">
            {selectedIndex >= 0
              ? `${selectedIndex + 1}/${films.length}`
              : `0/${films.length}`}
          </Badge>
        </div>
        <div className="flex-1 divide-y divide-white/8 overflow-y-auto pb-8">
          {films.length === 0 ? (
            <div className="p-6 f-mono text-sm text-white/55">
              {t("jury.noFilm")}
            </div>
          ) : (
            films.map((f, idx) => {
              const active = f.id === activeId;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    onSelect(f.id);
                    setSidebarOpen(false);
                  }}
                  className="w-full px-4 py-3 text-left transition-colors hover:bg-white/5"
                  style={{
                    background: active
                      ? withAlpha(marsaiColors.primary, 0.16)
                      : undefined,
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="f-mono text-[10px] text-white/50">
                        #{idx + 1}
                      </div>
                      <div className="f-orb truncate text-sm font-black text-white">
                        {f.title}
                      </div>
                      <div className="f-mono text-xs text-white/55">
                        {f.country} · {f.duration}
                      </div>
                    </div>
                    <span
                      className="f-mono mt-0.5 shrink-0 rounded px-2 py-0.5 text-[10px] font-semibold"
                      style={{
                        color:
                          f.status === "voted"
                            ? marsaiColors.success
                            : "rgba(255,255,255,0.68)",
                        background:
                          f.status === "voted"
                            ? withAlpha(marsaiColors.success, 0.15)
                            : "rgba(255,255,255,0.09)",
                      }}
                    >
                      {f.status === "voted"
                        ? t("jury.votedStatus")
                        : t("jury.pendingStatus")}
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </aside>

      <div className="pt-1">
        {activeFilm ? (
          <JuryVotePanel
            key={activeFilm.id}
            film={activeFilm}
            onVote={onVote}
            onNext={onNext}
            hasNext={hasNext}
          />
        ) : (
          <Card className="border-white/8 bg-[hsl(var(--card))]">
            <CardContent className="p-10 text-center">
              <div className="f-orb text-base font-black text-muted-foreground/40">
                {t("jury.selectFilm")}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
