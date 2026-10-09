import marketLabels from '@/components/i18n/marketLabels';
import marketMessages from '@/components/i18n/marketMessages';
import faqTranslations from '@/components/i18n/faqTranslations';
import contactTranslations from '@/components/i18n/contactTranslations';

const modules = [marketLabels, marketMessages, faqTranslations, contactTranslations];
export default Object.fromEntries(Object.keys(marketLabels).map(locale => [locale, Object.assign({}, ...modules.map(module => module[locale]))]));