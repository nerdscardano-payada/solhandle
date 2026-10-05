import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function EarnRewardsOverview() {
  const { data: info, isPending, isError } = useQuery({ queryKey: ['earn-program-info'], queryFn: async () => (await base44.functions.invoke('referralPortal', { action: 'program_info' })).data, staleTime: 60000 });
  if (isPending) return <p className="mt-8 text-sm text-muted-foreground">Loading reward distribution…</p>;
  if (isError || !info) return <p role="alert" className="mt-8 text-sm text-names-warning">Reward distribution is currently unavailable.</p>;
  const tiers = info.tiers || [];
  const rates = tiers.map(([, rate]) => Number(rate));
  const lowest = Math.min(...rates), highest = Math.max(...rates);
  const streams = [
    { title: 'New handle mints', rate: `${lowest}–${highest}%`, split: `You: ${lowest}–${highest}% · SolHandle: ${100 - highest}–${100 - lowest}%`, text: 'Your active $HANDLE tier decides your share of an eligible SOL-paid mint.', example: `A 0.10 SOL eligible mint → ${(0.1 * lowest / 100).toFixed(3)}–${(0.1 * highest / 100).toFixed(3)} SOL for you.` },
    { title: 'Resales of referred handles', rate: `${info.secondaryShare}%`, split: `You: ${info.secondaryShare}% · SolHandle: ${100 - info.secondaryShare}%`, text: 'Your share of royalties SolHandle actually receives, not of the full sale price.', example: `0.10 SOL royalty received → ${(0.1 * info.secondaryShare / 100).toFixed(3)} SOL for you.` },
    { title: '$HANDLE trading fees', rate: `${info.creatorFeeShare}%`, split: `You: ${info.creatorFeeShare}% · SolHandle: ${100 - info.creatorFeeShare}%`, text: 'Your share of eligible creator fees received from trading by referred wallets, subject to program allocation limits.', example: `0.10 SOL eligible fees received → ${(0.1 * info.creatorFeeShare / 100).toFixed(3)} SOL for you, before any allocation limit.` }
  ];
  return <section className="mt-10" aria-labelledby="earn-rewards-title">
    <h2 id="earn-rewards-title" className="text-2xl font-semibold">What can you earn?</h2>
    <p className="mt-2 text-sm leading-6 text-muted-foreground">The same rewards apply to your text link and SolHandle Embed. Rewards are paid in SOL, with no extra referral charge for the buyer.</p>
    <div className="mt-5 grid gap-4 lg:grid-cols-3">{streams.map(stream => <article key={stream.title} className="rounded-xl border border-border bg-card p-5">
      <strong className="text-3xl text-names-success">{stream.rate}</strong><h3 className="mt-3 font-semibold">{stream.title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{stream.text}</p><p className="mt-4 text-xs font-semibold text-names-accent">{stream.split}</p>
      <p className="mt-3 border-t border-border pt-3 text-sm leading-6">{stream.example}</p>
    </article>)}</div>
    <details className="mt-4 rounded-xl border border-border bg-card p-4"><summary className="cursor-pointer text-sm font-semibold">Which $HANDLE balance unlocks each mint percentage?</summary>
      <div className="mt-4 overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b border-border text-muted-foreground"><th className="pb-3">Minimum $HANDLE held</th><th className="pb-3">Your mint share</th><th className="pb-3">SolHandle share</th></tr></thead><tbody>{tiers.map(([balance, rate]) => <tr key={balance} className="border-b border-border"><td className="py-3">{Number(balance).toLocaleString('en-US')}</td><td className="py-3 text-names-success">{rate}%</td><td className="py-3 text-muted-foreground">{100 - rate}%</td></tr>)}</tbody></table></div>
      <p className="mt-3 text-xs leading-6 text-muted-foreground">An eligible active tier is required for rewards. Below {Number(tiers[0]?.[0] || 0).toLocaleString('en-US')} $HANDLE, your share is 0%. Upgrades activate after {info.qualificationHours} hours; a lower balance reduces your tier immediately.</p>
    </details>
    <p className="mt-4 text-xs leading-6 text-muted-foreground">{info.mode === 'LIVE' ? 'Rewards depend on eligible, confirmed activity and revenue actually received. Income is not guaranteed.' : info.mode === 'PAUSED' ? 'The program is paused. No new earnings accrue while paused.' : 'Pre-launch: referrals can be recorded, but no earnings accrue and no payouts are available yet.'} Searches, self-referrals and $HANDLE-paid mints do not earn commission. Examples are illustrative, not promised income.</p>
  </section>;
}