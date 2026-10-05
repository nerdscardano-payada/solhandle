import { Link } from 'react-router-dom';
import Header from '@/components/solhandle/Header';
import ResolverDemo from '@/components/solhandle/ResolverDemo';
import ResolveDocsContent from '@/components/solhandle/resolve/ResolveDocsContent';
import { sections } from '@/components/solhandle/resolve/resolveExamples';

export default function SolHandleResolve() {
  return <main className="dark min-h-screen bg-background font-body text-foreground"><div className="mx-auto max-w-7xl border-x border-border"><Header/>
    <div className="mx-auto max-w-5xl px-5 py-8 lg:px-9 lg:py-12">
      <Link to="/developers" className="text-sm text-names-accent">← Developer Center</Link>
      <p className="mt-7 text-xs font-semibold uppercase tracking-widest text-names-secondary">Mainnet · Public HTTP API · On-chain SDK</p>
      <h1 className="mt-3 text-3xl font-semibold lg:text-5xl">SolHandle Resolve</h1>
      <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">Turn @handles into current Solana wallet addresses. Start with a copy-and-paste snippet, no wallet connection or personal RPC setup required.</p>
      <div className="mt-6 rounded-xl border border-names-accent/30 bg-card p-4 text-sm leading-7 text-muted-foreground">Choose the <strong className="text-foreground">HTTP API</strong> for the simplest website integration, or the <strong className="text-foreground">SDK</strong> for independent on-chain verification. Neither method holds funds or sends transactions.</div>
      <nav aria-label="Resolve documentation contents" className="my-6 flex flex-wrap gap-3 text-sm text-names-accent">{sections.map(section => <a key={section.id} href={`#${section.id}`} className="rounded-lg border border-border px-3 py-2">{section.id === 'quick-start' ? 'Quick start' : section.id === 'website' ? 'Website example' : section.id === 'api' ? 'HTTP API' : section.id === 'response' ? 'Response' : 'On-chain SDK'}</a>)}<a href="#safety" className="rounded-lg border border-border px-3 py-2">Safety</a></nav>
      <ResolveDocsContent/>
      <section className="mt-8"><h2 className="text-xl font-semibold">Try a live handle</h2><p className="mt-2 text-sm text-muted-foreground">This demo uses the same resolver behind the public API. Enter an existing @handle to see its current owner.</p><ResolverDemo/></section>
    </div>
  </div></main>;
}