import { ArrowUpRight } from 'lucide-react';

export default function LiveIntegrations() {
  return <section className="dark mt-10 rounded-2xl border border-names-success/30 bg-card p-6 text-card-foreground">
    <div className="flex flex-wrap items-center gap-3"><h2 className="text-2xl font-semibold">Live integrations</h2><span className="rounded-full bg-names-success/10 px-3 py-1 text-xs font-semibold text-names-success">First integration</span></div>
    <h3 className="mt-5 text-xl font-semibold">MMOPRO · MMO Alpha Terminal</h3>
    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">MMO Alpha Terminal now displays SolHandle @handles alongside .sol names across the Feed, Holders, Search, Wallet pages, Trackers and the header, making wallets easier to recognize.</p>
    <p className="mt-3 text-xs text-muted-foreground">Announced by MMOPro on September 30, 2026 · Publicly announced integration, not a protocol test-suite verification.</p>
    <div className="mt-5 flex flex-wrap gap-5"><a href="https://at.mmocoin.pro" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-names-accent">Open MMO Alpha Terminal<ArrowUpRight className="h-4 w-4" /></a><a href="https://x.com/MMOProOfficial/status/2105149968764023288" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-names-accent">View announcement<ArrowUpRight className="h-4 w-4" /></a></div>
  </section>;
}