import { createContext, useContext } from 'react'

export type NavBarPanelTab = { key: string; label: string; badge?: number }

export type NavBarPanelStats = {
  filmsTotal: number
  selectedText: string
  pendingCount: number
  validatedCount: number
  reviewCount: number
  refusedCount: number
  loading: boolean
}

export type NavBarPanelConfig = {
  subtitle: string
  stats: NavBarPanelStats
  tabs: NavBarPanelTab[]
  activeTab: string
  onTabChange: (key: string) => void
}

export type NavBarJuryStats = {
  voted: number
  total: number
  pct: number
  done: boolean
}

export type NavBarJuryConfig = {
  subtitle: string
  stats: NavBarJuryStats
}

export type NavBarState = {
  panel: NavBarPanelConfig | null
  jury: NavBarJuryConfig | null
  setPanel: (cfg: NavBarPanelConfig | null) => void
  setJury: (cfg: NavBarJuryConfig | null) => void
}

export const NavBarStateCtx = createContext<NavBarState | null>(null)

export function useNavBarState() {
  const v = useContext(NavBarStateCtx)
  if (!v) throw new Error('NavBarStateProvider missing')
  return v
}
