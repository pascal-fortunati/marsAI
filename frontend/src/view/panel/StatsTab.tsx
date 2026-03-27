import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { Film, Status } from './panelTypes'
import { marsaiColors } from './panelStyles'
import { Card, CardContent } from '../../components/ui/card'

// Composant représentant l'onglet des statistiques dans le panneau d'administration
export function StatsTab({ films }: { films: Film[] }) {
  const { t } = useTranslation()
  const stats = useMemo(() => {
    const by = (s: Status) => films.filter((f) => f.status === s).length
    return [
      { label: t('panel.stats.totalSubmissions'), val: films.length, color: marsaiColors.primary },
      { label: t('common.status.pending'), val: by('pending'), color: marsaiColors.warning },
      { label: t('common.status.validated'), val: by('validated'), color: marsaiColors.success },
      { label: t('common.status.selected'), val: by('selected'), color: marsaiColors.primary },
      { label: t('common.status.review'), val: by('review'), color: marsaiColors.violetSoft },
      { label: t('common.status.refused'), val: by('refused'), color: marsaiColors.danger },
      { label: t('panel.stats.unassigned'), val: films.filter((f) => f.assignedJury.length === 0).length, color: marsaiColors.warning },
      { label: t('panel.stats.countriesRepresented'), val: new Set(films.map((f) => f.country)).size, color: marsaiColors.cyan },
      { label: t('panel.stats.totalJuryVotes'), val: films.reduce((a, f) => a + (f.juryVotes?.length ?? 0), 0), color: marsaiColors.success },
    ]
  }, [films, t])

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((s) => (
        <Card key={s.label} className="border-white/8 bg-white/[.03] text-white">
          <CardContent className="p-7">
            <div className="f-orb text-5xl font-black" style={{ color: s.color }}>
              {s.val}
            </div>
            <div className="f-mono mt-3 text-sm text-white/40">{s.label}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
