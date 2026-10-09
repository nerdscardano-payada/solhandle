import { createContext, useContext, useEffect, useState } from 'react';
import { languages, translations } from '@/components/i18n/translations';
import coreTranslations from '@/components/i18n/coreTranslations';

const LanguageContext = createContext({ language: 'en', setLanguage: () => {}, t: text => text });
export const useLanguage = () => useContext(LanguageContext);
export default function LanguageProvider({ children }) {
  const [language, updateLanguage] = useState(() => {
    const saved = localStorage.getItem('solhandle_language');
    return languages.some(([code]) => code === saved) ? saved : 'en';
  });
  const setLanguage = code => { if (languages.some(([value]) => value === code)) updateLanguage(code); };
  useEffect(() => {
    localStorage.setItem('solhandle_language', language);
    document.documentElement.lang = language;
  }, [language]);
  const t = text => coreTranslations[language]?.[text] || translations[language]?.[text] || text;
  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>;
}