import { useState } from 'react';
import { Image } from '@/components/ui/image';
import HandleSearch from '@/components/solhandle/HandleSearch';
import HomeProductVisual from '@/components/solhandle/home/HomeProductVisual';
import HomeTrustLine from '@/components/solhandle/home/HomeTrustLine';
import HomeMobileTrust from '@/components/solhandle/home/HomeMobileTrust';

export default function HomeMintHero({ wallet }) {
  const [previewHandle, setPreviewHandle] = useState('');
  return <section className="home-mint-hero">
    <Image src="https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/7bc1b17f7_generated_image.png" alt="" aria-hidden="true" className="home-hero-scenery" loading="eager" fetchPriority="high" />
    <div className="home-hero-shade" />
    <div className="home-hero-layout">
      <div className="relative z-10 min-w-0"><p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground/85 lg:text-xs">Own your identity on Solana <span className="ml-3 inline-block h-px w-10 bg-names-accent" /></p><h1 className="home-claim-title">Claim your <span className="home-gradient-text">@<br/>on Solana</span></h1><p className="mt-5 text-base leading-relaxed text-foreground lg:text-xl">Your wallet already has an address.<br/>Give it a name people can remember.</p><div className="mt-6"><HandleSearch wallet={wallet} personalSearch compact funnel onPreviewHandle={setPreviewHandle} /></div><HomeTrustLine/><HomeMobileTrust/></div>
      <HomeProductVisual previewHandle={previewHandle} />
    </div>
  </section>;
}