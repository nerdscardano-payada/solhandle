import { Link } from 'react-router-dom';
import { Link2, PanelsTopLeft } from 'lucide-react';

export default function EarnWays() {
  return <section aria-label="Two ways to share" className="mt-8 grid gap-4 lg:grid-cols-2">
    <article className="flex flex-col rounded-2xl border border-names-accent/30 bg-card p-5 lg:p-7">
      <div className="flex items-center gap-3 text-names-accent"><Link2 size={22}/><span className="text-xs font-semibold uppercase tracking-wider">Option 1 · Text link</span></div>
      <h2 className="mt-4 text-2xl font-semibold">Share a link. Earn with your @.</h2>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">Your personal referral link is tied to your own SolHandle. Share it in an X post, your bio, a message or on your website.</p>
      <div className="mt-4 break-all rounded-lg border border-border bg-background p-3 font-mono text-sm text-names-accent">solhandle.io/?ref=ansem<span className="mt-1 block font-body text-xs text-muted-foreground">Example for @ansem. Your link uses your own handle.</span></div>
      <p className="mb-5 mt-4 text-sm leading-6 text-muted-foreground">Someone claims through your link? Eligible confirmed mints can earn you commission.</p>
      <a href="#ambassador-dashboard" className="mt-auto inline-flex min-h-11 items-center justify-center rounded-lg bg-names-accent px-5 py-3 text-sm font-semibold text-background">Get my referral link →</a>
    </article>
    <article className="flex flex-col rounded-2xl border border-names-secondary/30 bg-card p-5 lg:p-7">
      <div className="flex items-center gap-3 text-names-secondary"><PanelsTopLeft size={22}/><span className="text-xs font-semibold uppercase tracking-wider">Option 2 · Website widget</span></div>
      <h2 className="mt-4 text-2xl font-semibold">Let your website do the sharing.</h2>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">Add SolHandle Embed to your website. Visitors search for their @name in the widget, then continue to SolHandle to claim it.</p>
      <div className="mt-4 rounded-lg border border-names-secondary/20 bg-background p-4"><p className="font-semibold">Find your SolHandle</p><p className="mt-2 text-sm text-muted-foreground">Search & Claim, linked to your referral handle.</p></div>
      <p className="mb-5 mt-4 text-sm leading-6 text-muted-foreground">Use the same referral link in the embed setup. Both options credit the same Earn account.</p>
      <Link to="/developers/resolve" className="mt-auto inline-flex min-h-11 items-center justify-center rounded-lg border border-names-secondary/40 bg-names-secondary/10 px-5 py-3 text-sm font-semibold text-names-secondary">Set up SolHandle Embed →</Link>
    </article>
  </section>;
}