import BuybackCurve from '@/components/solhandle/BuybackCurve';
import BuybackBurnMascot from '@/components/solhandle/BuybackBurnMascot';

const sol = value => value == null ? '—' : `${Number(value).toLocaleString('en-US', { maximumFractionDigits: 4 })} SOL`;

export default function BuybackAllocation({ stats }) {
  return <div className="mt-4 rounded-2xl border border-cyan-300/25 bg-slate-900/70 p-4 sm:p-5">
    <div className="flex items-center justify-between gap-3"><div><h3 className="text-lg font-semibold text-white">Buyback & burn · indicative budget</h3>
    <p className="mt-1 text-xs text-slate-400">Proposed allocation from recorded mints and sales.</p></div><BuybackBurnMascot /></div>
    <div className="mt-3 grid gap-2 sm:grid-cols-3">
      <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3"><p className="text-xs text-slate-400">Recorded first-mint revenue</p><strong className="mt-1 block text-lg text-white">{sol(stats.primaryMintRevenueSol)}</strong></div>
      <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3"><p className="text-xs text-slate-400">10% of first mints · proposed</p><strong className="mt-1 block text-lg text-cyan-200">{sol(stats.primaryBuybackBudgetSol)}</strong></div>
      <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3"><p className="text-xs text-slate-400">1% of native secondary sales · indicative</p><strong className="mt-1 block text-lg text-violet-200">{sol(stats.secondaryBuybackBudgetSol)}</strong></div>
    </div>
    <BuybackCurve budget={stats.primaryBuybackBudgetSol}/>
    <p className="mt-3 text-xs leading-relaxed text-slate-400">Each 1 SOL threshold is a potential buyback and burn, not an automatic transaction. This indicative figure includes historical mints; it is not segregated funds or available treasury balance. Previous milestones do not confirm completed buys or burns, and the 10% proposal is not applied on-chain.</p>
  </div>;
}