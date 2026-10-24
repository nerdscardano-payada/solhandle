import { createContext, useContext, useEffect, useState } from 'react';
const ThemeContext = createContext({ preference: 'system', theme: 'dark', setPreference: () => {} });
export const useNetworkTheme = () => useContext(ThemeContext);
export default function NetworkThemeProvider({ children }) {
  const [preference, setPreference] = useState(() => {
    const saved = localStorage.getItem('solhandle-social-appearance');
    return ['light', 'dark', 'system'].includes(saved) ? saved : 'system';
  });
  const [systemDark, setSystemDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches);
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const update = event => setSystemDark(event.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => { localStorage.setItem('solhandle-social-appearance', preference); }, [preference]);
  const theme = preference === 'system' ? (systemDark ? 'dark' : 'light') : preference;
  return <ThemeContext.Provider value={{ preference, setPreference, theme }}>{children}</ThemeContext.Provider>;
}