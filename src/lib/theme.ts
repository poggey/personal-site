// Theme follows the system unless the visitor picks one in the command palette.
// The choice is stored in localStorage and applied as <html data-theme> before first paint.

export type Theme = "light" | "dark";
export const THEME_STORAGE_KEY = "theme";

export function currentTheme(): Theme {
  const set = document.documentElement.dataset.theme;
  if (set === "light" || set === "dark") return set;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function toggleTheme(): Theme {
  const next: Theme = currentTheme() === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, next);
  } catch {
    // Blocked storage: the toggle still applies to this page view.
  }
  return next;
}
