import { createContext, useContext, useEffect, useState } from 'react';
import { languages, translations } from '@/components/i18n/translations';
import coreTranslations from '@/components/i18n/coreTranslations';
import homeTranslations from '@/components/i18n/homeTranslations';
import homeStatusTranslations from '@/components/i18n/homeStatusTranslations';
import relativeTime from '@/components/i18n/relativeTime';

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
  const t = text => homeStatusTranslations[language]?.[text] || homeTranslations[language]?.[text] || coreTranslations[language]?.[text] || translations[language]?.[text] || text;
  const formatRelativeTime = value => relativeTime(value, language, t('Unknown'));
  return <LanguageContext.Provider value={{ language, setLanguage, t, formatRelativeTime }}>{children}</LanguageContext.Provider>;
}