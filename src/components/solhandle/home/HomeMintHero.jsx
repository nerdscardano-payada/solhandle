import { useState } from 'react';
import { useLanguage } from '@/components/i18n/LanguageProvider';
import { Image } from '@/components/ui/image';
import HandleSearch from '@/components/solhandle/HandleSearch';
import HomeProductVisual from '@/components/solhandle/home/HomeProductVisual';
import HomeTrustLine from '@/components/solhandle/home/HomeTrustLine';
import HomeMobileTrust from '@/components/solhandle/home/HomeMobileTrust';
import '@/components/solhandle/home/home-calm-hero.css';
import HomeBannerHeading from '@/components/solhandle/home/HomeBannerHeading';
import '@/components/solhandle/home/home-banner-hero.css';

export default function HomeMintHero({ wallet }) {
  const [previewHandle, setPreviewHandle] = useState('');
  const { t } = useLanguage();
  return <section className="home-mint-hero home-banner-hero">
    <Image src="https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/5de195856_generated_image.png" alt="" aria-hidden="true" className="home-hero-scenery" focalPointX={0.25} focalPointY={0.65} loading="eager" fetchPriority="high" />
    <div className="home-hero-shade" />
    <div className="home-hero-layout">
      <div className="relative z-10 min-w-0"><p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground/85 lg:text-xs">{t('Own your identity on Solana')} <span className="ml-3 inline-block h-px w-10 bg-names-accent" /></p><HomeBannerHeading/><p className="mt-5 text-base leading-relaxed text-foreground lg:text-xl">{t('Turn your long wallet address into a simple @handle.')}</p><div className="mt-6"><h2 className="mb-3 text-lg font-semibold text-foreground lg:text-xl">{t('Claim your')} <span className="home-gradient-text">@name</span> {t('on Solana')}</h2><HandleSearch wallet={wallet} personalSearch compact funnel hideEmptyHint onPreviewHandle={setPreviewHandle} /></div><HomeTrustLine/><HomeMobileTrust/></div>
      <HomeProductVisual previewHandle={previewHandle} />
    </div>
  </section>;
}