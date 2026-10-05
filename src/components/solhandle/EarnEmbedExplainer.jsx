import { Link } from 'react-router-dom';

export default function EarnEmbedExplainer() {
  return <section className="dark mt-8 rounded-2xl border border-names-secondary/30 bg-background p-5 text-foreground lg:p-6">
    <p className="text-xs font-semibold uppercase tracking-wider text-names-secondary">SolHandle EMBED × Earn</p>
    <h2 className="mt-3 text-2xl font-semibold">Let your website grow your Earn network.</h2>
    <p className="mt-3 text-sm leading-7 text-muted-foreground">Add the Find your SolHandle widget to your website so visitors can check an @name and continue to SolHandle to claim it. Connect your Share & Earn referral code to attribute eligible confirmed SOL-paid mints to your existing Earn account.</p>
    <ol className="mt-4 list-inside list-decimal space-y-2 text-sm leading-6 text-muted-foreground">
      <li>Connect your wallet and activate your referral link in the dashboard below.</li>
      <li>Open SolHandle EMBED, connect your referral code or link, and copy the embed.</li>
      <li>Paste it into your website’s HTML block and follow attributed activity in your Earn dashboard.</li>
    </ol>
    <p className="mt-4 text-xs leading-6 text-muted-foreground">The widget uses the existing Earn Network tiers, attribution, campaign status and payout rules, not a separate commission program. Searches alone, self-referrals and $HANDLE-paid mints do not earn commission.</p>
    <Link to="/developers/resolve" className="mt-5 inline-flex rounded-lg border border-names-accent/30 bg-names-accent/10 px-5 py-3 text-sm font-semibold text-names-accent">Set up SolHandle EMBED →</Link>
  </section>;
}