import { createContext, useContext } from 'react';
const darkTheme = { theme: 'dark' };
const ThemeContext = createContext(darkTheme);
export const useNetworkTheme = () => useContext(ThemeContext);
export default function NetworkThemeProvider({ children }) {
  return <ThemeContext.Provider value={darkTheme}>{children}</ThemeContext.Provider>;
}