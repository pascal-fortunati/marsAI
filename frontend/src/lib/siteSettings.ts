import { apiUrl } from './api'

// Structure minimale des paramètres du festival (front uniquement)
export type FestivalSettings = {
  name?: string
  year?: string
  // Ajoute d'autres champs selon ce dont l'UI a besoin
}

// Options de soumission disponibles pour les utilisateurs
export type SubmissionOptions = {
  categories: string[]
  languages: string[]
  countries: string[]
  jobs: string[]
  discoverySources: string[]
  aiToolSuggestions: string[]
  semanticTags: string[]
  socialNetworks: { key: string; label: string }[]
}

// Récupère les paramètres publics du festival et les options de soumission disponibles
export async function fetchPublicFestivalSettings(signal?: AbortSignal): Promise<FestivalSettings | null> {
  const res = await fetch(apiUrl('/api/site'), { signal })
  if (!res.ok) return null
  const data = (await res.json()) as { settings?: FestivalSettings }
  return data.settings ?? null
}

// Récupère les options de soumission disponibles pour les utilisateurs
export async function fetchPublicSubmissionOptions(signal?: AbortSignal): Promise<SubmissionOptions | null> {
  const res = await fetch(apiUrl('/api/site/options'), { signal })
  if (!res.ok) return null
  const data = (await res.json()) as { options?: SubmissionOptions }
  return data.options ?? null
}

// Récupère les paramètres publics du festival et les options de soumission disponibles
export async function fetchAdminFestivalSettings(
  token: string,
  signal?: AbortSignal,
): Promise<FestivalSettings | null> {
  const res = await fetch(apiUrl('/api/admin/site'), {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
    signal,
  })
  if (!res.ok) return null
  const data = (await res.json()) as { settings?: FestivalSettings }
  return data.settings ?? null
}

// Enregistre les paramètres publics du festival
export async function saveAdminFestivalSettings(token: string, settings: FestivalSettings): Promise<boolean> {
  const res = await fetch(apiUrl('/api/admin/site'), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(settings),
  })
  return res.ok
}