// Ce fichier gère le thème de l'application
export type ThemeMode = "dark" | "light";

const STORAGE_KEY = "marsai_theme";

// Vérifie si une valeur est un thème valide
function isThemeMode(value: unknown): value is ThemeMode {
  return value === "dark" || value === "light";
}

// Récupère le thème stocké dans localStorage, ou null si aucune valeur valide n'est trouvée
export function getStoredTheme(): ThemeMode | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return isThemeMode(raw) ? raw : null;
  } catch {
    return null;
  }
}

// Résout le thème initial à utiliser, en se basant sur la valeur stockée ou en retournant "dark" par défaut
export function resolveInitialTheme(): ThemeMode {
  return getStoredTheme() ?? "dark";
}

//
export function applyTheme(mode: ThemeMode) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", mode);
}

// Stocke le thème choisi dans localStorage pour une utilisation future
export function persistTheme(mode: ThemeMode) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    return;
  }
}

// Applique le thème choisi et le stocke pour les sessions futures
export function setTheme(mode: ThemeMode) {
  applyTheme(mode);
  persistTheme(mode);
}
