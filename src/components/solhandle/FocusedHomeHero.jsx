import HeroSearch from '@/components/solhandle/HeroSearch';
import HeroIdentityBenefits from '@/components/solhandle/HeroIdentityBenefits';
import HomeHeroArtwork from '@/components/solhandle/HomeHeroArtwork';
import HeroClaimTitle from '@/components/solhandle/HeroClaimTitle';

import MainnetContracts from '@/components/solhandle/MainnetContracts';
import AmbassadorBanner from '@/components/solhandle/AmbassadorBanner';
import PayMilestoneCard from '@/components/solhandle/PayMilestoneCard';

export default function FocusedHomeHero({ wallet }) {
  return <div className="dark relative text-foreground">
    <div aria-hidden="true" className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-names-secondary/10 blur-3xl"/>
    <div className="relative grid grid-cols-[1fr_1.05fr] items-center gap-5">
      <section>
        <p className="mb-5 inline-flex rounded-full border border-names-accent/30 bg-names-accent/5 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-names-accent">On Solana</p>
        <HeroClaimTitle/>
        <p className="mt-6 max-w-xl text-xl leading-8 text-muted-foreground">Search, mint, and own a human-readable @handle instead of a long wallet address.</p>
        <div id="search-handles" className="mt-6 scroll-mt-8">
          <HeroSearch wallet={wallet}/>
        </div>
        <HeroIdentityBenefits/>
      </section>
      <div className="w-full"><HomeHeroArtwork/></div>
    </div>
    <div className="mt-8 grid grid-cols-[1.35fr_1fr] items-start gap-6 border-t border-border pt-6"><div><MainnetContracts/><AmbassadorBanner/></div><PayMilestoneCard/></div>
  </div>;
}