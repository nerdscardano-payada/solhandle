import { useState } from 'react';
import { Image } from '@/components/ui/image';
import HandleSearch from '@/components/solhandle/HandleSearch';
import HomeProductVisual from '@/components/solhandle/home/HomeProductVisual';
import HomeTrustLine from '@/components/solhandle/home/HomeTrustLine';
import { ShieldCheck, Layers, Coins } from 'lucide-react';

export default function HomeMintHero({ wallet }) {
  const [previewHandle, setPreviewHandle] = useState('');
  return <section className="home-mint-hero">
    <Image src="https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/7bc1b17f7_generated_image.png" alt="" aria-hidden="true" className="home-hero-scenery" loading="eager" fetchPriority="high" />
    <div className="home-hero-shade" />
    <div className="home-hero-layout">
      <div className="relative z-10 min-w-0"><p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground/85 lg:text-xs">Own your identity on Solana <span className="ml-3 inline-block h-px w-10 bg-names-accent" /></p><h1 className="home-claim-title"><span className="lg:hidden">Claim your <span className="home-gradient-text">@<br />on Solana</span></span><span className="hidden lg:inline">Your Solana wallet.<br/><span className="home-gradient-text">One memorable<br/>@name.</span></span></h1><p className="mt-5 text-base leading-relaxed text-foreground lg:text-xl"><span className="lg:hidden">Your wallet already has an address.<br />Give it a name people can remember.</span><span className="hidden lg:inline">Own your name as an NFT.<br/>One-time payment, no renewals.</span></p><div className="mt-6"><HandleSearch wallet={wallet} personalSearch compact funnel onPreviewHandle={setPreviewHandle} /></div><HomeTrustLine/><div className="home-hero-benefits lg:hidden">{[[Coins, 'One-time payment', 'No renewals'], [ShieldCheck, 'Yours on-chain', 'As an NFT'], [Layers, 'Use across apps', 'On Solana']].map(([Icon, title, text]) => <div key={title} className="flex items-center gap-3"><Icon className="h-8 w-8 shrink-0 rounded-full border border-names-accent/40 p-1.5 text-names-accent" /><div><b className="block text-xs">{title}</b><span className="text-[10px] text-foreground/65">{text}</span></div></div>)}</div></div>
      <HomeProductVisual previewHandle={previewHandle} />
    </div>
  </section>;
}