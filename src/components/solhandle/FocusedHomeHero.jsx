import '@/components/solhandle/home-hero.css';
import HeroSearch from '@/components/solhandle/HeroSearch';
import HeroIdentityBenefits from '@/components/solhandle/HeroIdentityBenefits';
import HomeHeroArtwork from '@/components/solhandle/HomeHeroArtwork';
import HeroClaimTitle from '@/components/solhandle/HeroClaimTitle';

import MainnetContracts from '@/components/solhandle/MainnetContracts';
import AmbassadorBanner from '@/components/solhandle/AmbassadorBanner';
import PayMilestoneCard from '@/components/solhandle/PayMilestoneCard';

export default function FocusedHomeHero({ wallet }) {
  return <div className="dark relative text-foreground">
    <div className="hero-stage relative isolate grid min-h-[clamp(32rem,38vw,40rem)] grid-cols-[1fr_1fr] items-center gap-7">
      <HomeHeroArtwork/>
      <section className="relative z-10 py-8">
        <p className="mb-5 inline-flex rounded-full border border-names-accent/30 bg-names-accent/5 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-names-accent">On Solana</p>
        <HeroClaimTitle/>
        <p className="mt-6 max-w-xl text-xl leading-8 text-muted-foreground">Search, mint, and own a human-readable @handle instead of a long wallet address.</p>
        <div id="search-handles" className="mt-6 scroll-mt-8">
          <HeroSearch wallet={wallet}/>
        </div>
        <HeroIdentityBenefits/>
      </section>
      <div aria-hidden="true"/>
    </div>
    <div className="mt-8 grid grid-cols-[1.35fr_1fr] items-start gap-6 border-t border-border pt-6"><div><MainnetContracts/><AmbassadorBanner/></div><PayMilestoneCard/></div>
  </div>;
}