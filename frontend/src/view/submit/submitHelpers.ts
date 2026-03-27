import type { SubmissionOptions } from '../../lib/siteSettings'
import { resources } from '../../lib/i18nResources'

// Type représentant une langue de ressource
type ResourceLang = keyof typeof resources

// Fonction utilitaire pour convertir une valeur en tableau de chaînes de caractères
function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map((v) => String(v)) : []
}

// Fonction utilitaire pour convertir une valeur en tableau d'objets de réseaux sociaux
function asSocialArray(value: unknown): { key: string; label: string }[] {
  if (!Array.isArray(value)) return []
  return value
    .map((v) => ({
      key: String((v as { key?: unknown })?.key ?? '').trim(),
      label: String((v as { label?: unknown })?.label ?? '').trim(),
    }))
    .filter((v) => v.key && v.label)
}

export function orderCountriesForSubmit(list: string[], lang: string): string[] {
  const locale = lang?.startsWith('fr') ? 'fr-FR' : 'en-US'
  const priorityByLang = lang?.startsWith('fr')
    ? ['France', 'Royaume-Uni', 'Angleterre', 'États-Unis']
    : ['France', 'United Kingdom', 'England', 'United States']

  const seen = new Set<string>()
  const unique = list.filter((item) => {
    const key = String(item).trim()
    if (!key || seen.has(key)) return false
    seen.add(key)
    return true
  })

  const top: string[] = []
  for (const wanted of priorityByLang) {
    const match = unique.find((item) => item.toLowerCase() === wanted.toLowerCase())
    if (match && !top.includes(match)) top.push(match)
  }

  const topSet = new Set(top)
  const rest = unique
    .filter((item) => !topSet.has(item))
    .sort((a, b) => a.localeCompare(b, locale, { sensitivity: 'base' }))

  return [...top, ...rest]
}

// Fonction utilitaire pour obtenir les options de soumission par défaut en fonction de la langue
export function fallbackSubmissionOptions(lang: string): SubmissionOptions {
  const active = (lang?.startsWith('fr') ? 'fr' : 'en') as ResourceLang
  const defaults = resources[active]?.translation?.submit?.defaults as {
    categories?: unknown
    languages?: unknown
    countries?: unknown
    jobs?: unknown
    discoverySources?: unknown
    aiToolSuggestions?: unknown
    semanticTags?: unknown
    socialNetworks?: unknown
  }
  return {
    categories: asStringArray(defaults?.categories),
    languages: asStringArray(defaults?.languages),
    countries: orderCountriesForSubmit(asStringArray(defaults?.countries), lang),
    jobs: asStringArray(defaults?.jobs),
    discoverySources: asStringArray(defaults?.discoverySources),
    aiToolSuggestions: asStringArray(defaults?.aiToolSuggestions),
    semanticTags: asStringArray(defaults?.semanticTags),
    socialNetworks: asSocialArray(defaults?.socialNetworks),
  }
}

// Fonction utilitaire pour vérifier si une personne est majeure en fonction de sa date de naissance
export function isAdult(birthdate: string): boolean {
  if (!birthdate) return false
  const birth = new Date(birthdate)
  const now = new Date()
  const age = now.getFullYear() - birth.getFullYear() - (now < new Date(now.getFullYear(), birth.getMonth(), birth.getDate()) ? 1 : 0)
  return age >= 18
}

// Fonction utilitaire pour parser une durée au format "mm:ss" ou "ss" en secondes
export function parseDuration(str: string): number {
  if (str.includes(':')) {
    const [m, s] = str.split(':').map(Number)
    return (m || 0) * 60 + (s || 0)
  }
  return Number(str) || 0
}

// Fonction utilitaire pour convertir une date en une chaîne de caractères au format "yyyy-mm-dd"
export function toDateInputValue(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// Fonction utilitaire pour convertir une chaîne de caractères au format "yyyy-mm-dd" en une date
export function fromDateInputValue(value: string): Date | undefined {
  if (!value) return undefined
  const [y, m, d] = value.split('-').map(Number)
  if (!y || !m || !d) return undefined
  return new Date(y, m - 1, d)
}

// Fonction utilitaire pour formater une date au format "yyyy-mm-dd" en une chaîne de caractères lisible en fonction de la langue
export function formatDateForDisplay(value: string, language: string): string {
  const date = fromDateInputValue(value)
  if (!date) return value
  const locale = language?.startsWith('fr') ? 'fr-FR' : 'en-US'
  return new Intl.DateTimeFormat(locale, { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date)
}
