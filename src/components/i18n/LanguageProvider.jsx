import { createContext, useContext, useEffect, useState } from 'react';
import { languages, translations } from '@/components/i18n/translations';
import coreTranslations from '@/components/i18n/coreTranslations';
import homeTranslations from '@/components/i18n/homeTranslations';
import bannerHeroTranslations from '@/components/i18n/bannerHeroTranslations';
import homeStatusTranslations from '@/components/i18n/homeStatusTranslations';
import relativeTime from '@/components/i18n/relativeTime';
import pageTranslations from '@/components/i18n/pageTranslations';
import integrationTranslationSources from '@/components/i18n/integrationTranslationSources';

const integrationLocales = import.meta.glob('./integration-locales/*.json', { import: 'default', eager: true });

const emptyTranslations = Object.freeze({});
const translationCache = new Map();
const translationLoaders = import.meta.glob('./locales/*.json', { import: 'default' });
const LanguageContext = createContext({ language: 'en', setLanguage: () => {}, t: text => text, staticTranslations: emptyTranslations });
export const useLanguage = () => useContext(LanguageContext);
export default function LanguageProvider({ children }) {
  const [language, updateLanguage] = useState(() => {
    const saved = localStorage.getItem('solhandle_language');
    return languages.some(([code]) => code === saved) ? saved : 'en';
  });
  const [loaded, setLoaded] = useState({ language: 'en', texts: emptyTranslations });
  const staticTranslations = loaded.language === language ? loaded.texts : emptyTranslations;
  const setLanguage = code => { if (languages.some(([value]) => value === code)) updateLanguage(code); };
  useEffect(() => {
    if (language === 'en') { setLoaded({ language, texts: emptyTranslations }); return; }
    let active = true;
    if (!translationCache.has(language)) {
      translationCache.set(language, translationLoaders[`./locales/${language}.json`]().then(texts => {
        const additions = integrationLocales[`./integration-locales/${language}.json`] || {};
        return { ...texts, ...Object.fromEntries(Object.entries(integrationTranslationSources).map(([key, source]) => [source, additions[key] || source])) };
      }));
    }
    translationCache.get(language).then(texts => { if (active) setLoaded({ language, texts }); });
    return () => { active = false; };
  }, [language]);
  useEffect(() => {
    localStorage.setItem('solhandle_language', language);
    document.documentElement.lang = language;
  }, [language]);
  const t = text => bannerHeroTranslations[language]?.[text] || pageTranslations[language]?.[text] || homeStatusTranslations[language]?.[text] || homeTranslations[language]?.[text] || coreTranslations[language]?.[text] || translations[language]?.[text] || staticTranslations[text] || text;
  const formatRelativeTime = value => relativeTime(value, language, t('Unknown'));
  return <LanguageContext.Provider value={{ language, setLanguage, t, formatRelativeTime, staticTranslations }}>{children}</LanguageContext.Provider>;
}