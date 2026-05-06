import { useTranslation } from 'react-i18next'
import { marsaiColors, withAlpha } from '../../theme/marsai'
import type { JuryFilm, VoteAction } from './juryTypes'
import { VOTE_CFG } from './juryConfig'
import { Card } from '../../components/ui/card'

// Composant de barre latérale pour les jurys
export function JurySidebar({
  films, activeId, onSelect,
}: {
  films: JuryFilm[]
  activeId: string | null
  onSelect: (id: string) => void
}) {
  const { t } = useTranslation()

  return (
    <div className="w-80 shrink-0 sticky top-28">
      <Card className="overflow-hidden border-white/8 bg-[hsl(var(--card))]">
        <div className="px-5 py-3 border-b border-border/70">
          <span className="f-orb text-sm font-black">{t('jury.assigned', { count: films.length })}</span>
        </div>

        <div className="divide-y divide-border max-h-[calc(100vh-220px)] overflow-y-auto">
          {films.length === 0 ? (
            <div className="py-10 text-center f-mono text-sm text-muted-foreground">
              {t('jury.noFilm')}
            </div>
          ) : (
            films.map((f, idx) => {
              const active = f.id === activeId
              return (
                <button
                  key={f.id}
                  onClick={() => onSelect(f.id)}
                  className="w-full text-left px-5 py-4 transition-colors hover:bg-muted/30"
                  style={{ background: active ? withAlpha(marsaiColors.primary, 0.08) : undefined }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="f-mono text-[10px] text-muted-foreground shrink-0">#{idx + 1}</span>
                        <span className="f-orb text-sm font-black truncate">{f.title}</span>
                      </div>
                      <div className="f-mono text-xs text-muted-foreground">
                        {f.country} · {f.duration}
                      </div>
                    </div>
                    <div className="shrink-0 mt-0.5">
                      {f.status === 'voted' ? (
                        <span className="f-mono text-xs font-semibold"
                          style={{ color: f.vote ? VOTE_CFG[f.vote].color : marsaiColors.success }}>
                          {f.vote ? VOTE_CFG[f.vote as Exclude<VoteAction, null>].icon : '✓'}
                        </span>
                      ) : (
                        <span className="w-2 h-2 rounded-full block mt-1"
                          style={{ background: marsaiColors.warning }} />
                      )}
                    </div>
                  </div>
                  {active && (
                    <div className="mt-2 h-0.5 rounded-full"
                      style={{ background: withAlpha(marsaiColors.primary, 0.4) }} />
                  )}
                </button>
              )
            })
          )}
        </div>
      </Card>
    </div>
  )
}
