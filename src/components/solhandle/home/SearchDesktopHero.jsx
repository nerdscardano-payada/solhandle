import { useState } from 'react';
import { useLanguage } from '@/components/i18n/LanguageProvider';
import { Link } from 'react-router-dom';
import HandleSearch from '@/components/solhandle/HandleSearch';
import HomeProductVisual from '@/components/solhandle/home/HomeProductVisual';
import HomeTrustLine from '@/components/solhandle/home/HomeTrustLine';
import '@/components/solhandle/home/home-funnel.css';
import '@/components/solhandle/home/home-background.css';

export default function SearchDesktopHero({ wallet }) {
  const [previewHandle, setPreviewHandle] = useState('');
  const { t } = useLanguage();
  return <section className="home-funnel">
    <div className="home-hero-layout">
      <div className="min-w-0">
        <Link to="/" className="text-sm text-names-accent">← {t('Back to home')}</Link>
        <h1 className="home-claim-title">{t('Find your SolHandle').split('SolHandle')[0]}<span className="home-gradient-text">SolHandle</span>{t('Find your SolHandle').split('SolHandle')[1]}</h1>
        <p className="mt-5 text-xl leading-relaxed text-foreground">{t('Search your name. Check its price.')}<br/>{t('Own your identity on Solana.')}</p>
        <div className="mt-6"><HandleSearch wallet={wallet} personalSearch compact funnel officialClaims onPreviewHandle={setPreviewHandle}/></div>
        <HomeTrustLine/>
      </div>
      <HomeProductVisual previewHandle={previewHandle}/>
    </div>
  </section>;
}