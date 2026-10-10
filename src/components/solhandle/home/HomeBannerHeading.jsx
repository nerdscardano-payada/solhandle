import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/components/i18n/LanguageProvider';

export default function HomeBannerHeading() {
  const { t } = useLanguage();
  const title = t('44 chars → @name');
  const [characters, name] = title.split(' → ');
  return <h1 className="home-claim-title home-banner-heading" aria-label={title}>
    <span className="home-banner-address">{characters}</span>
    <span className="home-banner-result"><ArrowRight className="home-banner-arrow text-names-accent" aria-hidden="true"/><span className="home-gradient-text">{name}</span></span>
  </h1>;
}