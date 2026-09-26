import BuybackCurve from '@/components/solhandle/BuybackCurve';

const sol = value => value == null ? '—' : `${Number(value).toLocaleString('en-US', { maximumFractionDigits: 4 })} SOL`;

export default function BuybackAllocation({ stats }) {
  return <div className="mt-6 rounded-2xl border border-cyan-300/25 bg-slate-900/70 p-5 sm:p-6">
    <h3 className="text-lg font-semibold text-white">Buyback & burn · indicative budget</h3>
    <p className="mt-2 text-sm text-slate-400">Primary mints can fund the flywheel before secondary sales take off.</p>
    <div className="mt-5 grid gap-3 sm:grid-cols-3">
      <div className="rounded-xl border border-white/10 bg-slate-950/60 p-4"><p className="text-xs text-slate-400">Recorded first-mint revenue</p><strong className="mt-2 block text-xl text-white">{sol(stats.primaryMintRevenueSol)}</strong></div>
      <div className="rounded-xl border border-white/10 bg-slate-950/60 p-4"><p className="text-xs text-slate-400">10% of first mints · proposed</p><strong className="mt-2 block text-xl text-cyan-200">{sol(stats.primaryBuybackBudgetSol)}</strong></div>
      <div className="rounded-xl border border-white/10 bg-slate-950/60 p-4"><p className="text-xs text-slate-400">1% of native secondary sales · indicative</p><strong className="mt-2 block text-xl text-violet-200">{sol(stats.secondaryBuybackBudgetSol)}</strong></div>
    </div>
    <BuybackCurve budget={stats.primaryBuybackBudgetSol}/>
    <p className="mt-4 text-sm text-slate-300">Example: 10 SOL in first mints → 1 SOL proposed for buyback & burn.</p>
    <p className="mt-2 text-xs leading-relaxed text-slate-400">These amounts are calculated from recorded sales, not segregated funds, executed purchases, or confirmed burns. Historical first mints are included; the 10% proposal has not been applied on-chain.</p>
  </div>;
}