import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
export type ThemePreference = 'light' | 'dark' | 'system';
type ThemeContextValue = {
  preference: ThemePreference;
  resolvedTheme: 'light' | 'dark';
  setPreference: (value: ThemePreference) => void;
};
const storageKey = 'piyum-villa-theme';
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
function readPreference(): ThemePreference {
  try {
    const value = localStorage.getItem(storageKey);
    if (value === 'light' || value === 'dark' || value === 'system') return value;
  } catch { /* Theme still works when storage is unavailable. */ }
  return 'light';
}
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, updatePreference] = useState<ThemePreference>(readPreference);
  const [systemDark, setSystemDark] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches);
  const resolvedTheme = preference === 'system' ? (systemDark ? 'dark' : 'light') : preference;
  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (event: MediaQueryListEvent) => setSystemDark(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark');
    document.documentElement.style.colorScheme = resolvedTheme;
  }, [resolvedTheme]);
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === storageKey || event.key === null) updatePreference(readPreference());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);
  function setPreference(value: ThemePreference) {
    updatePreference(value);
    try { localStorage.setItem(storageKey, value); } catch { /* No persistence available. */ }
  }
  return <ThemeContext.Provider value={{ preference, resolvedTheme, setPreference }}>
    {children}
  </ThemeContext.Provider>;
}
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider.');
  return context;
}
