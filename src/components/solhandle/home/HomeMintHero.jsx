import { useState } from 'react';

import { Image } from '@/components/ui/image';
import HandleSearch from '@/components/solhandle/HandleSearch';
import HomeProductVisual from '@/components/solhandle/home/HomeProductVisual';
import HomeTrustLine from '@/components/solhandle/home/HomeTrustLine';
import HomeMobileTrust from '@/components/solhandle/home/HomeMobileTrust';
import '@/components/solhandle/home/home-calm-hero.css';
import { Link } from 'react-router-dom';
import HomeClaimIntro from '@/components/solhandle/home/HomeClaimIntro';
import useHomePayCopy from '@/components/solhandle/home/useHomePayCopy';
import '@/components/solhandle/home/home-banner-hero.css';
import '@/components/solhandle/home/home-claim-panel.css';

export default function HomeMintHero({ wallet }) {
  const [previewHandle, setPreviewHandle] = useState('');
  const t = useHomePayCopy();
  return <section className="home-mint-hero home-banner-hero">
    <Image src="https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/5de195856_generated_image.png" alt="" aria-hidden="true" className="home-hero-scenery" focalPointX={0.25} focalPointY={0.65} loading="eager" fetchPriority="high" />
    <div className="home-hero-shade" />
    <div className="home-hero-layout">
      <div className="home-claim-panel relative z-10 min-w-0"><p className="text-xs font-semibold uppercase tracking-widest text-names-accent" data-no-translate>{t('Your identity. Your wallet.')}</p><HomeClaimIntro/><div className="home-claim-action mt-6"><h2 className="mb-3 text-sm font-semibold text-foreground" data-no-translate>{t('Find your @handle')}</h2><HandleSearch wallet={wallet} personalSearch compact funnel hideEmptyHint onPreviewHandle={setPreviewHandle} /></div><HomeTrustLine identityFirst/><Link to="/pay" className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm text-names-accent hover:underline" data-no-translate>{t('Already have a handle? Open SolHandle Pay')} →</Link><HomeMobileTrust /></div>
      <HomeProductVisual previewHandle={previewHandle} />
    </div>
  </section>;
}