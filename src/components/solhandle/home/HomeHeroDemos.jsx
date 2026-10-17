import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/components/i18n/LanguageProvider';
import homeDemoTranslations from '@/components/i18n/homeDemoTranslations';

export default function HomeHeroDemos() {
  const { language } = useLanguage();
  const texts = homeDemoTranslations[language] || homeDemoTranslations.en;
  return <div className="px-[5vw] pb-6 pt-2" data-no-translate>
    <Link to="/demos" className="inline-flex min-h-11 items-center gap-2 text-xs text-names-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-names-accent">{texts[1]}<ArrowRight className="h-3.5 w-3.5" aria-hidden="true"/></Link>
  </div>;
}