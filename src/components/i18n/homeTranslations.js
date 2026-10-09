import en from '@/components/i18n/home/en';
import es from '@/components/i18n/home/es';
import pt from '@/components/i18n/home/pt';
import ja from '@/components/i18n/home/ja';
import nl from '@/components/i18n/home/nl';
import de from '@/components/i18n/home/de';
import fr from '@/components/i18n/home/fr';
import tr from '@/components/i18n/home/tr';
import it from '@/components/i18n/home/it';
import vi from '@/components/i18n/home/vi';
import ko from '@/components/i18n/home/ko';

export default Object.fromEntries(Object.entries({ es, pt, ja, nl, de, fr, tr, it, vi, ko }).map(([locale, values]) => [locale, Object.fromEntries(Object.entries(en).map(([key, text]) => [text, values[key]]))]));