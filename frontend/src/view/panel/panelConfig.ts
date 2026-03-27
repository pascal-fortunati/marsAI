import type { Badge, Status } from './panelTypes'
import { marsaiColors } from '../../theme/marsai'

// Configuration des couleurs et icônes pour chaque statut de film
export const STATUS_CFG: Record<Status, { color: string }> = {
  pending: { color: marsaiColors.warning },
  validated: { color: marsaiColors.success },
  refused: { color: marsaiColors.danger },
  review: { color: marsaiColors.violetSoft },
  selected: { color: marsaiColors.primary },
}

// Configuration des couleurs et icônes pour chaque badge de film
export const BADGE_CFG: Record<NonNullable<Badge>, { color: string; icon: string }> = {
  grand_prix: { color: marsaiColors.gold, icon: '🏆' },
  prix_jury: { color: marsaiColors.silver, icon: '⭐' },
}