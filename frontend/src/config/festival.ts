// Paramètres de la festival
const toMs = (iso: string) => new Date(iso).getTime()

// Logo des partenaires
export type PartnerLogo = { url: string; name?: string | null }

// Paramètres de la home
export type FestivalSettings = {
  phase1CloseIso: string | null
  phase2CatalogueIso: string | null
  phase3PalmaresIso: string | null
  siteLogo?: string | null
  heroImageUrl?: string | null
  footerText?: string | null
  partnersLogos?: PartnerLogo[]
  festivalDescription?: string | null
  homeTranslations?: {
    fr?: Record<string, unknown>
    en?: Record<string, unknown>
  } | null
}

// Vérifie si le catalogue est disponible
export const isCatalogueAvailable = (nowMs: number, settings: FestivalSettings | null) => {
  const iso = settings?.phase2CatalogueIso
  if (!iso) return false
  return nowMs >= toMs(iso)
}

// Vérifie si le palmares est disponible
export const isPalmaresAvailable = (nowMs: number, settings: FestivalSettings | null) => {
  const iso = settings?.phase3PalmaresIso
  if (!iso) return false
  return nowMs >= toMs(iso)
}

// Vérifie si la soumission est encore ouverte
export const isSubmissionOpen = (nowMs: number, settings: FestivalSettings | null) => {
  const iso = settings?.phase1CloseIso
  if (!iso) return true
  return nowMs < toMs(iso)
}

// Retourne la date de la fin de la phase 1
export const getPhase1CloseIso = (settings: FestivalSettings | null) => settings?.phase1CloseIso || null
