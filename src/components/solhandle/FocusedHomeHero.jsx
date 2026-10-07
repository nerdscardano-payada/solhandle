import HandleSearch from '@/components/solhandle/HandleSearch';
import HomeIdentityPreview from '@/components/solhandle/HomeIdentityPreview';
import MainnetContracts from '@/components/solhandle/MainnetContracts';
import AmbassadorBanner from '@/components/solhandle/AmbassadorBanner';
import PayMilestoneCard from '@/components/solhandle/PayMilestoneCard';

export default function FocusedHomeHero({ wallet }) {
  return <div className="dark text-foreground">
    <div className="grid grid-cols-[1.55fr_1fr] items-center gap-16">
      <section>
        <p className="mb-5 text-sm font-semibold uppercase tracking-widest text-names-accent">NFT-native identity on Solana</p>
        <h1 className="font-heading text-7xl font-semibold leading-[1.04] tracking-tight">Find your<br/><span className="bg-gradient-to-r from-names-success via-names-accent to-names-secondary bg-clip-text text-transparent">SolHandle.</span></h1>
        <p className="mt-6 max-w-lg text-lg leading-8 text-muted-foreground">Turn your wallet address into a name. Search, claim and own your unique @handle on Solana.</p>
        <div id="search-handles" className="mt-8 scroll-mt-8 [&_h2]:hidden [&_input]:text-4xl [&_input]:font-semibold [&_label]:px-6 [&_label]:py-6">
          <HandleSearch wallet={wallet}/>
        </div>
      </section>
      <div className="mx-auto w-full max-w-sm"><HomeIdentityPreview/><PayMilestoneCard/></div>
    </div>
    <div className="mt-12"><MainnetContracts/><AmbassadorBanner/></div>
  </div>;
}