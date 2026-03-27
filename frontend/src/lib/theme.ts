/**
 * Utilitaires de gestion du theme.
 * Prend en charge les modes sombre et clair avec persistance.
 */

export type Theme = "dark" | "light";

const THEME_STORAGE_KEY = "marsai-theme";
const ROOT_ATTR = "data-theme";

/**
 * Recupere le theme courant depuis localStorage ou la preference systeme.
 * Le mode clair est utilise par defaut si aucune preference n'est detectee.
 */
export function getStoredTheme(): Theme {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }

  // Tente de detecter la preference systeme
  if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }

  return "light";
}

/**
 * Definit le theme actif dans le DOM et localStorage.
 */
export function setTheme(theme: Theme): void {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  document.documentElement.setAttribute(ROOT_ATTR, theme);
  
  // Met a jour la meta theme-color
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute("content", theme === "dark" ? "#020617" : "#f8fafc");
  }
}

/**
 * Bascule entre les themes sombre et clair.
 */
export function toggleTheme(): Theme {
  const current = getStoredTheme();
  const next: Theme = current === "dark" ? "light" : "dark";
  setTheme(next);
  return next;
}

/**
 * Initialise le theme au chargement de la page.
 */
export function initializeTheme(): Theme {
  const theme = getStoredTheme();
  setTheme(theme);
  return theme;
}
