import { Globe } from 'lucide-react';
import PartnerWidgetDemo from '@/components/solhandle/partner-mint/PartnerWidgetDemo';
export default function PartnerEmbedPreview() {
  return <section id="partner-embed-preview" aria-labelledby="partner-embed-heading" className="mt-8 rounded-2xl border border-names-accent/25 bg-card p-4 sm:p-6">
    <p className="text-xs font-semibold uppercase tracking-wider text-names-secondary">Phase 2 · partner embed preview</p>
    <h2 id="partner-embed-heading" className="mt-2 text-2xl font-semibold">What partners can put on their platform</h2>
    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">A compact SolHandle search module inside their own website or app. Try searching below, then select “Claim handle” to preview the checkout handoff.</p>
    <div className="mt-6 overflow-hidden rounded-xl border border-border bg-background"><div className="flex items-center gap-3 border-b border-border px-4 py-3 text-xs text-muted-foreground"><Globe className="h-4 w-4 text-names-accent"/><span>Example partner platform</span><span className="ml-auto text-names-secondary">Embedded module</span></div><div className="px-4 py-8 sm:px-8 sm:py-10"><PartnerWidgetDemo/></div></div>
    <p className="mt-4 text-xs leading-relaxed text-muted-foreground">This is a working visual demo, not an installable widget or published React package. The production widget will preserve the approved partner attribution and use real on-chain availability and quotes; wallet restrictions require a top-level checkout fallback.</p>
  </section>;
}