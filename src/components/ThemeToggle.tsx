import { useTheme } from '../context/ThemeProvider';
export function ThemeToggle(){
 const {resolvedTheme,setPreference}=useTheme(); const dark=resolvedTheme==='dark';
 return <button type="button" className="theme-toggle" aria-label={`Switch to ${dark?'light':'dark'} theme`} title={`Switch to ${dark?'light':'dark'} theme`} onClick={()=>setPreference(dark?'light':'dark')}>
 {dark?<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="12" r="4"/><path d="M12 1v3M12 20v3M1 12h3M20 12h3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></svg>:<svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor"><path d="M19.9 14.2A8.7 8.7 0 0 1 9.8 4.1a8.7 8.7 0 1 0 10.1 10.1Z"/><path d="m5 2 .6 1.4L7 4l-1.4.6L5 6l-.6-1.4L3 4l1.4-.6Z"/></svg>}
 </button>;
}
