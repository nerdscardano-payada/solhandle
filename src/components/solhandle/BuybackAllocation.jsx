import BuybackCurve from '@/components/solhandle/BuybackCurve';
import BuybackBurnMascot from '@/components/solhandle/BuybackBurnMascot';

const sol = value => value == null ? '—' : `${Number(value).toLocaleString('en-US', { maximumFractionDigits: 4 })} SOL`;

export default function BuybackAllocation({ stats }) {
  return <div className="mt-6 rounded-2xl border border-cyan-300/25 bg-slate-900/70 p-5 sm:p-6">
    <div className="flex flex-col-reverse items-center justify-between gap-2 sm:flex-row sm:gap-5"><div className="self-start"><h3 className="text-lg font-semibold text-white">Buyback & burn · indicative budget</h3>
    <p className="mt-2 text-sm text-slate-400">Primary mints can fund the flywheel before secondary sales take off.</p></div><BuybackBurnMascot /></div>
    <div className="mt-5 grid gap-3 sm:grid-cols-3">
      <div className="rounded-xl border border-white/10 bg-slate-950/60 p-4"><p className="text-xs text-slate-400">Recorded first-mint revenue</p><strong className="mt-2 block text-xl text-white">{sol(stats.primaryMintRevenueSol)}</strong></div>
      <div className="rounded-xl border border-white/10 bg-slate-950/60 p-4"><p className="text-xs text-slate-400">10% of first mints · proposed</p><strong className="mt-2 block text-xl text-cyan-200">{sol(stats.primaryBuybackBudgetSol)}</strong></div>
      <div className="rounded-xl border border-white/10 bg-slate-950/60 p-4"><p className="text-xs text-slate-400">1% of native secondary sales · indicative</p><strong className="mt-2 block text-xl text-violet-200">{sol(stats.secondaryBuybackBudgetSol)}</strong></div>
    </div>
    <BuybackCurve budget={stats.primaryBuybackBudgetSol}/>
    <p className="mt-4 text-sm text-slate-300">Each additional 1 SOL in the proposed budget marks a potential buyback. If executed, 1 SOL may be used to buy $HANDLE and burn the purchased tokens. Reaching a threshold does not start a transaction or confirm a burn.</p>
    <p className="mt-2 text-xs leading-relaxed text-slate-400">Example: 10 SOL in recorded first mints → 1 SOL proposed budget. This is a calculation from cumulative recorded revenue, not segregated funds or available treasury balance. Historical mints count; previous milestones are not completed buybacks, and the 10% proposal has not been applied on-chain.</p>
  </div>;
}