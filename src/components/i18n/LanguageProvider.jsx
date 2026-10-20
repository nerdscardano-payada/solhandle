import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import createStaticTranslator from '@/components/i18n/createStaticTranslator';
import { languages, translations } from '@/components/i18n/translations';
import coreTranslations from '@/components/i18n/coreTranslations';
import homeTranslations from '@/components/i18n/homeTranslations';
import bannerHeroTranslations from '@/components/i18n/bannerHeroTranslations';
import homeStatusTranslations from '@/components/i18n/homeStatusTranslations';
import relativeTime from '@/components/i18n/relativeTime';
import pageTranslations from '@/components/i18n/pageTranslations';
import integrationTranslationSources from '@/components/i18n/integrationTranslationSources';
import androidTranslations from '@/components/i18n/androidTranslations';
import payTranslations from '@/components/i18n/payTranslations';
import mobileIdentityTranslations from '@/components/i18n/mobileIdentityTranslations';

const integrationLocales = import.meta.glob('./integration-locales/*.json', { import: 'default', eager: true });
const demoLocales = import.meta.glob('/demo-locales/??.json', { import: 'default', eager: true });
const onboardingLocales = import.meta.glob('/onboarding-locales/??.json', { import: 'default', eager: true });

const emptyTranslations = Object.freeze({});
const translationCache = new Map();
const translationLoaders = import.meta.glob('./locales/*.json', { import: 'default' });
const recentTranslationLoaders = import.meta.glob('/recent-locales/??.json', { import: 'default' });
const LanguageContext = createContext({ language: 'en', setLanguage: () => {}, t: text => text, staticTranslations: emptyTranslations });
export const useLanguage = () => useContext(LanguageContext);
export default function LanguageProvider({ children }) {
  const [language, updateLanguage] = useState(() => {
    const saved = localStorage.getItem('solhandle_language');
    return languages.some(([code]) => code === saved) ? saved : 'en';
  });
  const [loaded, setLoaded] = useState({ language: 'en', texts: emptyTranslations });
  const demoTexts = language === 'en' ? emptyTranslations : demoLocales[`/demo-locales/${language}.json`] || emptyTranslations;
  const payTexts = payTranslations[language] || emptyTranslations;
  const identityTexts = mobileIdentityTranslations[language] || emptyTranslations;
  const onboardingTexts = language === 'en' ? emptyTranslations : onboardingLocales[`/onboarding-locales/${language}.json`] || emptyTranslations;
  const staticTranslations = useMemo(() => ({ ...(loaded.language === language ? loaded.texts : emptyTranslations), ...demoTexts, ...payTexts, ...identityTexts, ...onboardingTexts }), [loaded, language, demoTexts, payTexts, identityTexts, onboardingTexts]);
  const translatePay = useMemo(() => createStaticTranslator(payTexts), [payTexts]);
  const translateDemo = useMemo(() => createStaticTranslator(demoTexts), [demoTexts]);
  const setLanguage = code => { if (languages.some(([value]) => value === code)) updateLanguage(code); };
  useEffect(() => {
    if (language === 'en') { setLoaded({ language, texts: emptyTranslations }); return; }
    let active = true;
    if (!translationCache.has(language)) {
      translationCache.set(language, Promise.all([translationLoaders[`./locales/${language}.json`](), recentTranslationLoaders[`/recent-locales/${language}.json`]()]).then(([texts, recentTexts]) => {
        const additions = integrationLocales[`./integration-locales/${language}.json`] || {};
        return { ...texts, ...Object.fromEntries(Object.entries(integrationTranslationSources).map(([key, source]) => [source, additions[key] || source])), ...recentTexts };
      }));
    }
    translationCache.get(language).then(texts => { if (active) setLoaded({ language, texts }); });
    return () => { active = false; };
  }, [language]);
  useEffect(() => {
    localStorage.setItem('solhandle_language', language);
    document.documentElement.lang = language;
  }, [language]);
  const t = text => { const demoText = translateDemo(text, true); return demoText !== text ? demoText : androidTranslations[language]?.[text] || bannerHeroTranslations[language]?.[text] || pageTranslations[language]?.[text] || homeStatusTranslations[language]?.[text] || homeTranslations[language]?.[text] || coreTranslations[language]?.[text] || translations[language]?.[text] || staticTranslations[text] || translatePay(text); };
  const formatRelativeTime = value => relativeTime(value, language, t('Unknown'));
  return <LanguageContext.Provider value={{ language, setLanguage, t, formatRelativeTime, staticTranslations }}>{children}</LanguageContext.Provider>;
}