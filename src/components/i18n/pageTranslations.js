import marketLabels from '@/components/i18n/marketLabels';
import marketMessages from '@/components/i18n/marketMessages';
import faqTranslations from '@/components/i18n/faqTranslations';
import contactTranslations from '@/components/i18n/contactTranslations';
import searchTranslations from '@/components/i18n/searchTranslations';
import mintLabels from '@/components/i18n/mintLabels';
import mintMessages from '@/components/i18n/mintMessages';
import mintSuccessTranslations from '@/components/i18n/mintSuccessTranslations';

const modules = [marketLabels, marketMessages, faqTranslations, contactTranslations, searchTranslations, mintLabels, mintMessages, mintSuccessTranslations];
export default Object.fromEntries(Object.keys(marketLabels).map(locale => [locale, Object.assign({}, ...modules.map(module => module[locale]))]));