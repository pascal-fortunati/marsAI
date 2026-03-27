// Service pour parser une chaîne JSON en un tableau, ou retourner un tableau vide en cas d'erreur
export function safeJsonArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value !== "string") return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}