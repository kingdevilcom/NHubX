import { useEffect, useLayoutEffect, useState } from 'react';
import { watchThemeSetting } from '../firebase';
import { fireThemeVariables, normalizeThemeSetting, resolveFireTheme } from '../fireTheme';

export function useSiteTheme() {
  const [setting, setSetting] = useState(null);
  const [monthlyTheme, setMonthlyTheme] = useState(() => resolveFireTheme('auto'));
  const theme = !setting || setting === 'auto' ? monthlyTheme : resolveFireTheme(setting);

  useEffect(() => watchThemeSetting(
    (value) => setSetting(normalizeThemeSetting(value)),
    (error) => {
      console.error('Unable to load the site theme:', error);
      setSetting((current) => current ?? 'auto');
    },
  ), []);

  useEffect(() => {
    const refresh = () => setMonthlyTheme(resolveFireTheme('auto'));
    const timer = window.setInterval(refresh, 15_000);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, []);

  useLayoutEffect(() => {
    const root = document.documentElement;
    for (const [name, value] of Object.entries(fireThemeVariables(theme))) {
      root.style.setProperty(name, value);
    }
  }, [theme]);

  return { theme, themeSetting: setting };
}
