import { Link } from 'react-router-dom';
import { partnerMintPhases } from '@/components/solhandle/partner-mint/partnerMintPlan';

export default function PartnerMintPhases({ showLink = true }) {
  return <section id="partner-mint-roadmap" className="mt-10 rounded-2xl border border-names-secondary/25 bg-card p-5 sm:p-7">
    <p className="text-xs font-semibold uppercase tracking-wider text-names-secondary">Planned · SOL only · not live</p>
    <h2 className="mt-2 text-2xl font-semibold text-foreground">Partner Mint · three-phase roadmap</h2>
    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">50% of the SOL mint fee to an approved partner, 50% to the protocol. Existing $HANDLE burn and direct mint flows remain unchanged; release depends on security gates, not fixed dates.</p>
    <div className="mt-6 grid gap-5 lg:grid-cols-3">{partnerMintPhases.map(phase => <article key={phase.number} className="min-w-0 border-t border-border pt-4">
      <p className="text-xs font-semibold text-names-accent">Partner Mint Phase {phase.number} · Planned</p>
      <h3 className="mt-2 text-lg font-semibold text-foreground">{phase.title}</h3>
      <ul className="mt-4 list-disc space-y-2 pl-4 text-sm text-muted-foreground">{phase.deliverables.map(item => <li key={item}>{item}</li>)}</ul>
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground"><strong className="text-foreground">Release gate:</strong> {phase.gate}</p>
    </article>)}</div>
    {showLink && <Link to="/developers/partner-mint" className="mt-6 inline-block text-sm font-semibold text-names-accent underline underline-offset-4">Read the complete technical plan →</Link>}
  </section>;
}