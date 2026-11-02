import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/components/i18n/LanguageProvider';

export default function HomeMintClaimCta() {
  const { t } = useLanguage();
  return <aside className="home-mint-claim-cta">
    <span className="ep-eyebrow">{t('Claim your identity')}</span>
    <h3>{t('Your name. Your wallet. Your identity.')}</h3>
    <p>{t('Own your unique @handle as an NFT on Solana.')}</p>
    <Link to="/search" className="ep-button ep-primary">{t('Find your @handle')} <ArrowUpRight size={17} aria-hidden="true"/></Link>
  </aside>;
}