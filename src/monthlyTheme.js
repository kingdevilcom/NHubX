import { getFireTheme, getFireThemeProperties } from './fireTheme.js';

export function startMonthlyTheme() {
  const refreshTheme = () => {
    const root = document.documentElement;
    const theme = getFireTheme();
    if (root.dataset.themeMonth === String(theme.month)) return;

    root.dataset.themeMonth = theme.month;
    for (const [property, value] of Object.entries(getFireThemeProperties(theme))) {
      root.style.setProperty(property, value);
    }
  };

  refreshTheme();
  const timer = window.setInterval(refreshTheme, 30_000);
  document.addEventListener('visibilitychange', refreshTheme);
  return () => {
    window.clearInterval(timer);
    document.removeEventListener('visibilitychange', refreshTheme);
  };
}
