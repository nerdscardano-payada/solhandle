import HandleSearch from '@/components/solhandle/HandleSearch';
import { Image } from '@/components/ui/image';
import MainnetContracts from '@/components/solhandle/MainnetContracts';
import AmbassadorBanner from '@/components/solhandle/AmbassadorBanner';
import PayMilestoneCard from '@/components/solhandle/PayMilestoneCard';

export default function UnifiedHomeHero({ wallet }) {
  return <div className="relative">
    <section className="dark overflow-hidden rounded-3xl border border-names-accent/30 bg-card text-foreground shadow-xl shadow-names-accent/10">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-10 px-8 pt-10">
        <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-names-accent">NFT-native identity on Solana</p>
        <h1 className="mt-4 text-6xl font-semibold leading-tight tracking-tight">Claim your @ <span className="bg-gradient-to-r from-names-success via-names-accent to-names-secondary bg-clip-text text-transparent">on Solana.</span></h1>
        <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-foreground">Give your wallet a name people can remember. Find your unique @handle and own it as an NFT directly in your Solana wallet.</p>
        <p className="mt-3 text-sm text-foreground">One-time payment. No renewals. Yours until you transfer it.</p>
        </div>
        <Image src="https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/57d22a75c_solhandlelogo.png" alt="SolHandle logo — Your identity. Yours." className="h-48 w-48" fittingType="fit"/>
      </div>
      <div id="search-handles" className="mt-7 scroll-mt-24 [&>section]:rounded-none [&>section]:border-0 [&>section]:bg-transparent [&>section]:px-8 [&>section]:pb-8 [&>section]:pt-4 [&>section]:shadow-none [&_h2]:text-2xl [&_label]:py-5 [&_label_input]:text-xl">
        <HandleSearch wallet={wallet} compact personalSearch/>
      </div>
    </section>
    <div className="mt-5 grid grid-cols-2 items-start gap-6">
      <div><MainnetContracts compact/><AmbassadorBanner/></div>
      <PayMilestoneCard/>
    </div>
  </div>;
}