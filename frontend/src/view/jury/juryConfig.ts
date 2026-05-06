import { marsaiColors } from '../../theme/marsai'
import type { VoteAction } from './juryTypes'

// Configuration des icônes et couleurs pour chaque action de vote
export const VOTE_CFG: Record<Exclude<VoteAction, null>, { icon: string; color: string }> = {
  validate: { icon: '✓', color: marsaiColors.success },
  refuse: { icon: '✕', color: marsaiColors.danger },
  review: { icon: '↻', color: marsaiColors.warning },
}
