import { useEffect, useMemo } from 'react';
import { useLanguage } from '@/components/i18n/LanguageProvider';
import createStaticTranslator from '@/components/i18n/createStaticTranslator';

export default function NativeDialogLocalization() {
  const { staticTranslations } = useLanguage();
  const translate = useMemo(() => createStaticTranslator(staticTranslations), [staticTranslations]);
  useEffect(() => {
    const restore = ['alert', 'confirm', 'prompt'].map(name => {
      const original = window[name];
      const localized = (message, ...args) => original.call(window, translate(message), ...args);
      window[name] = localized;
      return () => { if (window[name] === localized) window[name] = original; };
    });
    return () => restore.forEach(reset => reset());
  }, [translate]);
  return null;
}