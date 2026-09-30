import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import formatHandleTokens from '@/components/solhandle/formatHandleTokens';

export default function MintPaymentChoice({ method, onChange, handle, wallet, busy }) {
  const [state, setState] = useState({ quote: null, error: '', loading: false });
  useEffect(() => {
    let current = true;
    setState({ quote: null, error: '', loading: method === 'HANDLE' && Boolean(wallet) });
    if (method === 'HANDLE' && wallet) {
      base44.functions.invoke('quoteHandlePayment', { action: 'preview', handle, wallet }).then(response => {
        if (current) setState({ quote: response.data, error: '', loading: false });
      }).catch(error => {
        if (current) setState({ quote: null, error: error.response?.data?.error || error.message || 'Quote unavailable.', loading: false });
      });
    }
    return () => { current = false; };
  }, [method, handle, wallet]);
  const quote = state.quote;
  const tokens = raw => formatHandleTokens(raw, quote.decimals);
  return <section className="space-y-3 text-sm" aria-label="Payment method">
    <label className="block text-slate-400" htmlFor="mint-payment-method">Payment method</label>
    <select id="mint-payment-method" value={method} disabled={busy} onChange={event => onChange(event.target.value)} className="w-full rounded-lg border border-white/20 bg-slate-900 px-3 py-3 text-white">
      <option value="SOL">SOL · available now</option><option value="HANDLE">$HANDLE · preview only</option>
    </select>
    {method === 'HANDLE' && <div className="rounded-xl border border-violet-300/25 bg-slate-900/60 p-4">
      <p className="font-semibold text-violet-200">$HANDLE payments are not live yet</p>
      {!wallet && <p className="mt-2 text-slate-400">Connect a wallet to review token pricing.</p>}
      {state.loading && <p className="mt-2 text-slate-400" role="status">Getting verified reference quote…</p>}
      {state.error && <p className="mt-2 text-rose-300" role="alert">{state.error}</p>}
      {quote && <dl className="mt-3 space-y-2 break-words"><div><dt className="text-slate-400">Indicative total</dt><dd className="font-semibold text-white">{tokens(quote.totalRaw)} $HANDLE</dd></div><div><dt className="text-orange-300">Burn · 50%, rounded down</dt><dd>{tokens(quote.burnRaw)} $HANDLE</dd></div><div><dt className="text-violet-300">Treasury · remainder</dt><dd>{tokens(quote.treasuryRaw)} $HANDLE</dd></div><div><dt className="text-slate-400">Spendable wallet balance</dt><dd>{tokens(quote.walletBalanceRaw)} $HANDLE</dd></div></dl>}
      {quote && !quote.sufficientBalance && <p className="mt-3 text-amber-200">Your current spendable $HANDLE balance is below this reference amount.</p>}
      <p className="mt-3 text-xs leading-relaxed text-slate-400">Reference pricing only, not a payment approval. No discount is applied yet. SOL is still required for network and NFT account fees. Choose SOL to mint today.</p>
    </div>}
  </section>;
}