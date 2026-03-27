// Convertit une date ISO en date locale avec format 'YYYY-MM-DDTHH:mm'
const pad = (n: number) => String(n).padStart(2, '0')

// Convertit une date locale avec format 'YYYY-MM-DDTHH:mm' en date ISO
export function isoToLocal(iso: string) {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

// Convertit une date locale avec format 'YYYY-MM-DDTHH:mm' en date ISO
export function localToIso(v: string) {
  if (!v) return null
  const d = new Date(v)
  return isNaN(d.getTime()) ? null : d.toISOString()
}

// Parse une chaîne JSON en tableau de chaînes, en supprimant les espaces et en filtrant les vides
export function parseJsonArray(
  label: string,
  raw: string,
  invalidJsonMessage = `${label}: invalid JSON`,
  arrayRequiredMessage = `${label}: array required`,
): string[] {
  if (!raw.trim()) return []
  let p: unknown
  try {
    p = JSON.parse(raw)
  } catch {
    throw new Error(invalidJsonMessage)
  }
  if (!Array.isArray(p)) throw new Error(arrayRequiredMessage)
  return (p as unknown[]).map((v) => String(v).trim()).filter(Boolean)
}