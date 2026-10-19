import { ArrowUpRight } from 'lucide-react';

export default function ParallaxIntegrationCard() {
  return <section className="mt-10 rounded-2xl border border-names-secondary/30 bg-card p-6 text-card-foreground">
    <div className="flex flex-wrap items-center gap-3"><h2 className="text-2xl font-semibold">Upcoming integrations</h2><span className="rounded-full bg-names-secondary/10 px-3 py-1 text-xs font-semibold text-names-secondary">Announced · In development</span></div>
    <h3 className="mt-5 text-xl font-semibold">PARALLAX × SolHandle</h3>
    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">Parallax and SolHandle are building an identity integration to make creator wallets easier to recognize. Planned support includes @handles alongside addresses in Wallet Watch, creator identities on Atlas project cards and profiles, and wallet-linked identities in Project Passports.</p>
    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">Handle ownership, wallet verification and project permissions remain separate: transferring a handle never transfers someone else’s verification or project access.</p>
    <p className="mt-3 text-xs text-muted-foreground">Publicly announced by Parallax on October 18, 2026 · Integration in development; not yet presented as live or independently verified.</p>
    <div className="mt-5 flex flex-wrap gap-5"><a href="https://parallaxlaunch.live/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-names-accent">Explore Parallax<ArrowUpRight className="h-4 w-4"/></a><a href="https://x.com/ParallaxLauncHQ/status/2111727056522555516" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-names-accent">View announcement<ArrowUpRight className="h-4 w-4"/></a></div>
  </section>;
}