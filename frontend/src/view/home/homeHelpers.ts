import type { FestivalSettings } from '../../config/festival'
import type { CParts, Phase } from './homeTypes'

// Fonction utilitaire pour calculer les parties d'une durée en millisecondes
export function getParts(ms: number): CParts {
  const d = Math.max(0, ms - Date.now())
  return {
    days: Math.floor(d / 86400000),
    hours: Math.floor((d / 3600000) % 24),
    minutes: Math.floor((d / 60000) % 60),
    seconds: Math.floor((d / 1000) % 60),
    done: d === 0,
  }
}

// Fonction utilitaire pour convertir une date ISO en millisecondes
export function toMs(iso: string | null | undefined) {
  if (!iso) return null
  const ms = new Date(iso).getTime()
  return Number.isNaN(ms) ? null : ms
}

// Fonction utilitaire pour calculer les phases de festival en fonction de la date actuelle et des paramètres de festival
export function computePhases(
  settings: FestivalSettings | null,
  nowMs: number,
  labels: { title: string; desc: string }[],
): { phases: Phase[]; currentIndex: 0 | 1 | 2 } {
  const p1 = toMs(settings?.phase1CloseIso)
  const p2 = toMs(settings?.phase2CatalogueIso)
  const p3 = toMs(settings?.phase3PalmaresIso)

  let idx: 0 | 1 | 2 = 0
  if (p1 !== null && nowMs >= p1) {
    idx = 1
    if (p2 !== null && nowMs >= p2) {
      idx = 2
    }
  }
  if (idx === 1 && p3 !== null && nowMs >= p3) idx = 2

  const phases: Phase[] = [
    { num: '01', title: labels[0]?.title ?? '', desc: labels[0]?.desc ?? '', active: idx === 0 },
    { num: '02', title: labels[1]?.title ?? '', desc: labels[1]?.desc ?? '', active: idx === 1 },
    { num: '03', title: labels[2]?.title ?? '', desc: labels[2]?.desc ?? '', active: idx === 2 },
  ]

  return { phases, currentIndex: idx }
}