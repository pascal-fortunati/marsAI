/**
 * Theme management utilities
 * Supports dark and light modes with persistence.
 */

export type Theme = "dark" | "light";

const THEME_STORAGE_KEY = "marsai-theme";
const ROOT_ATTR = "data-theme";

/**
 * Get the current theme from localStorage or system preference.
 * Default is light when no preference is detected.
 */
export function getStoredTheme(): Theme {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }

  // Try to detect system preference
  if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }

  return "light";
}

/**
 * Set the active theme in DOM and localStorage
 */
export function setTheme(theme: Theme): void {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  document.documentElement.setAttribute(ROOT_ATTR, theme);
  
  // Update meta theme-color
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute("content", theme === "dark" ? "#05030d" : "#f8f9fa");
  }
}

/**
 * Toggle between dark and light themes
 */
export function toggleTheme(): Theme {
  const current = getStoredTheme();
  const next: Theme = current === "dark" ? "light" : "dark";
  setTheme(next);
  return next;
}

/**
 * Initialize theme on page load
 */
export function initializeTheme(): Theme {
  const theme = getStoredTheme();
  setTheme(theme);
  return theme;
}
