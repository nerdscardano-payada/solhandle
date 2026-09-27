import { useState } from 'react';
import { ExternalLink, Flame, ShoppingBag } from 'lucide-react';

export default function BuybackProof({ proofs = [] }) {
  const [showAll, setShowAll] = useState(false);
  const shown = showAll ? proofs : proofs.slice(0, 4);
  return <section className="mt-4 rounded-xl border border-violet-300/25 bg-slate-900/70 p-4" aria-label="Buyback and burn transaction proof">
    <h4 className="text-sm font-semibold text-white">On-chain proof · buybacks & burns</h4>
    <p className="mt-1 text-xs text-slate-400">Open each confirmed Solana transaction. Token amounts are checked on-chain; SOL spent is admin-reported. The progress percentage above is a proposed budget, not proof of execution.</p>
    {proofs.length ? <div className="mt-3 space-y-2">{shown.map((item) => <a key={`${item.type}-${item.signature}`} href={`https://solscan.io/tx/${item.signature}`} target="_blank" rel="noopener noreferrer" className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/10 bg-slate-950/70 px-3 py-2 text-xs text-cyan-200 hover:border-cyan-300/50"><span className="inline-flex items-center gap-2 font-semibold">{item.type === 'BURN' ? <Flame aria-hidden="true" className="h-4 w-4 text-orange-300"/> : <ShoppingBag aria-hidden="true" className="h-4 w-4 text-violet-300"/>}{item.type === 'BURN' ? 'Burn' : 'Buyback'} · {Number(item.token_amount).toLocaleString('en-US', { maximumFractionDigits: 9 })} $HANDLE</span><span className="inline-flex items-center gap-2 text-slate-300">{new Date(item.block_time).toLocaleDateString('en-GB')} · {item.signature.slice(0, 6)}…{item.signature.slice(-6)} <ExternalLink aria-hidden="true" className="h-3 w-3"/></span></a>)}{proofs.length > 4 && <button type="button" onClick={() => setShowAll(value => !value)} className="text-xs font-semibold text-violet-300 underline">{showAll ? 'Show fewer' : `View all ${proofs.length} transactions`}</button>}</div> : <p className="mt-3 text-xs text-slate-400">No buyback or burn transactions have been recorded yet.</p>}
  </section>;
}