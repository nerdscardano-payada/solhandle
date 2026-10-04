import { Link } from 'react-router-dom';
import Header from '@/components/solhandle/Header';
import { useAuth } from '@/lib/AuthContext';
import PartnerMintMarkdown from '@/components/solhandle/partner-mint/PartnerMintMarkdown';
import { tokenHandleSections } from '@/components/solhandle/token-handles/tokenHandlePlan';
import TokenClaimDemo from '@/components/solhandle/token-handles/TokenClaimDemo';

export default function TokenHandlesPlan() {
  const { user } = useAuth();
  const contents = <nav aria-label="Token Handles plan contents" className="space-y-3">{tokenHandleSections.map(section => <a key={section.id} href={`#${section.id}`} className="block text-sm text-muted-foreground hover:text-names-accent">{section.title}</a>)}</nav>;
  return <main className="dark min-h-screen bg-background font-body text-foreground"><div className="mx-auto max-w-7xl border-x border-border"><Header/>
    <div className="px-5 py-8 lg:px-9 lg:py-12">
      <Link to="/developers" className="text-sm text-names-accent">← Developer Center</Link>
      <p className="mt-7 text-xs font-semibold uppercase tracking-widest text-names-secondary">Technical proposal · Not live · Claims disabled</p>
      <h1 className="mt-3 text-3xl font-semibold lg:text-5xl">Verified $ Token Handles</h1>
      <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">One protocol. Two namespaces. @ for wallets. $ for tokens. A security-first plan for verified token identity on Solana, without speculative ownership or marketplace trading.</p>
      <div className="mt-6 rounded-xl border border-names-warning/30 bg-card p-5"><h2 className="font-semibold text-names-warning">Safety before issuance</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">This is a published plan, not an active claim service. The strict MVP requires independent dual review, exact mint binding and an audited on-chain registry. When evidence is uncertain, registration stays blocked. Verification is not a guarantee of token safety.</p></div>
      {user?.role === 'admin' && <Link to="/admin/mainnet-tests#token-detection" className="mt-6 inline-flex rounded-lg border border-names-accent/30 px-4 py-3 text-sm font-semibold text-names-accent">Open admin token detection pilot →</Link>}
      <TokenClaimDemo />
      <details className="mt-7 rounded-xl border border-border p-4 lg:hidden"><summary className="cursor-pointer text-sm font-semibold text-names-accent">Plan contents</summary><div className="mt-4">{contents}</div></details>
      <div className="mt-9 grid min-w-0 gap-8 lg:grid-cols-[250px_minmax(0,1fr)]">
        <aside className="sticky top-6 hidden max-h-[85vh] overflow-y-auto self-start pr-3 lg:block">{contents}</aside>
        <article className="min-w-0">{tokenHandleSections.map(section => <section id={section.id} key={section.id} className="mb-9 scroll-mt-6 border-t border-border pt-6"><h2 className="mb-4 text-xl font-semibold lg:text-2xl">{section.title}</h2><PartnerMintMarkdown body={section.body}/></section>)}</article>
      </div>
    </div>
  </div></main>;
}