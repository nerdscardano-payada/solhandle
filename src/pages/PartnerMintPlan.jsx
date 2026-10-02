import { Link } from 'react-router-dom';
import Header from '@/components/solhandle/Header';
import PartnerMintPhases from '@/components/solhandle/partner-mint/PartnerMintPhases';
import PartnerMintMarkdown from '@/components/solhandle/partner-mint/PartnerMintMarkdown';
import PartnerMintWebsiteExample from '@/components/solhandle/partner-mint/PartnerMintWebsiteExample';
import PartnerEmbedPreview from '@/components/solhandle/partner-mint/PartnerEmbedPreview';
import PartnerMintWalletExample from '@/components/solhandle/partner-mint/PartnerMintWalletExample';
import { partnerMintSections } from '@/components/solhandle/partner-mint/partnerMintPlan';

export default function PartnerMintPlan() {
  const contents = <nav aria-label="Partner Mint plan contents" className="space-y-3">{partnerMintSections.map(section => <a key={section.id} href={`#${section.id}`} className="block text-sm text-muted-foreground hover:text-names-accent">{section.title}</a>)}</nav>;
  return <main className="dark min-h-screen bg-background font-body text-foreground"><div className="mx-auto min-h-screen max-w-7xl border-x border-border"><Header/>
    <div className="px-5 py-8 sm:px-9 sm:py-12">
      <div className="flex flex-wrap gap-5 text-sm text-names-accent"><Link to="/developers">← Developer Center</Link><Link to="/docs">Documentation</Link><Link to="/roadmap#partner-mint-roadmap">Roadmap</Link></div>
      <p className="mt-7 text-xs font-semibold uppercase tracking-widest text-names-secondary">Technical plan · planned, not live</p>
      <h1 className="mt-3 text-3xl font-semibold sm:text-5xl">SolHandle Partner Mint</h1>
      <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">Your interface. Our protocol. Shared revenue. A devnet-first, non-custodial integration plan for approved partners, with a 50/50 split on SOL mint fees only.</p>
      <PartnerEmbedPreview/>
      <PartnerMintWebsiteExample/>
      <PartnerMintPhases showLink={false}/>
      <details className="mt-7 rounded-xl border border-border p-4 sm:hidden"><summary className="cursor-pointer text-sm font-semibold text-names-accent">Plan contents</summary><div className="mt-4">{contents}</div></details>
      <div className="mt-9 grid min-w-0 gap-8 sm:grid-cols-[230px_minmax(0,1fr)]">
        <aside className="sticky top-6 hidden max-h-[85vh] overflow-y-auto self-start pr-3 sm:block">{contents}</aside>
        <article className="min-w-0">{partnerMintSections.map(section => <section id={section.id} key={section.id} className="mb-9 scroll-mt-6 border-t border-border pt-6"><h2 className="mb-4 text-xl font-semibold sm:text-2xl">{section.title}</h2>{section.id === 'phase-3' && <PartnerMintWalletExample/>}<PartnerMintMarkdown body={section.body}/></section>)}</article>
      </div>
    </div>
  </div></main>;
}