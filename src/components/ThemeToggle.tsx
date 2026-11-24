import { useTheme } from '../context/ThemeProvider';

export function ThemeToggle() {
  const { resolvedTheme, setPreference } = useTheme();
  const dark = resolvedTheme === 'dark';
  return <button type="button" role="switch" aria-checked={dark}
    aria-label="Dark mode" title={`Switch to ${dark ? 'light' : 'dark'} theme`}
    className={`theme-toggle theme-switch${dark ? ' is-dark' : ''}`}
    onClick={() => setPreference(dark ? 'light' : 'dark')}>
    <span className="theme-switch-thumb" aria-hidden="true" />
    <svg className="theme-switch-sun" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 1v3M12 20v3M1 12h3M20 12h3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
    </svg>
    <svg className="theme-switch-moon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M20.7 14.1A8.5 8.5 0 0 1 9.9 3.3a8.6 8.6 0 1 0 10.8 10.8Z" />
    </svg>
  </button>;
}
