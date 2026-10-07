import HandleSearch from '@/components/solhandle/HandleSearch';
import HomeHeroArtwork from '@/components/solhandle/HomeHeroArtwork';

import MainnetContracts from '@/components/solhandle/MainnetContracts';
import AmbassadorBanner from '@/components/solhandle/AmbassadorBanner';
import PayMilestoneCard from '@/components/solhandle/PayMilestoneCard';

export default function FocusedHomeHero({ wallet }) {
  return <div className="dark relative text-foreground">
    <div aria-hidden="true" className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-names-secondary/10 blur-3xl"/>
    <div className="relative grid grid-cols-[1.2fr_1fr] items-start gap-10">
      <section>
        <p className="mb-5 inline-flex rounded-full border border-names-accent/30 bg-names-accent/5 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-names-accent">Your @ on Solana</p>
        <h1 className="font-heading text-7xl font-bold leading-[1.04] tracking-tight">Claim your <span className="bg-gradient-to-r from-names-accent to-names-secondary bg-clip-text text-transparent">@</span><br/>on <span className="bg-gradient-to-r from-names-secondary via-names-accent to-names-success bg-clip-text text-transparent">Solana.</span></h1>
        <p className="mt-6 max-w-lg text-lg leading-8 text-muted-foreground">Search, mint, and own a human-readable @handle instead of a long wallet address.</p>
        <div id="search-handles" className="mt-8 scroll-mt-8 [&_input]:text-3xl [&_input]:font-semibold [&_label]:px-5 [&_label]:py-5">
          <HandleSearch wallet={wallet}/>
        </div>
      </section>
      <div className="w-full"><HomeHeroArtwork/><PayMilestoneCard/></div>
    </div>
    <div className="mt-12"><MainnetContracts/><AmbassadorBanner/></div>
  </div>;
}