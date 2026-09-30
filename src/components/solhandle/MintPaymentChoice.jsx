import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import formatHandleTokens from '@/components/solhandle/formatHandleTokens';
import MintPaymentMethodOptions from '@/components/solhandle/MintPaymentMethodOptions';

export default function MintPaymentChoice({ method, onChange, handle, wallet, busy, onQuote }) {
  const [state, setState] = useState({ quote: null, error: '', loading: false });
  const [refresh, setRefresh] = useState(0);
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
  }, [method, handle, wallet, refresh]);
  useEffect(() => { onQuote?.(state.quote); }, [state.quote, onQuote]);
  const quote = state.quote;
  const tokens = raw => formatHandleTokens(raw, quote.decimals);
  return <section className="space-y-3 text-sm" aria-label="Payment method">
    <MintPaymentMethodOptions method={method} onChange={onChange} busy={busy} />
    {method === 'HANDLE' && <div className="rounded-xl border border-violet-300/25 bg-slate-900/60 p-4">
      <p className="font-semibold text-violet-200">Pay with $HANDLE · 50% burned on-chain</p>
      {!wallet && <p className="mt-2 text-slate-400">Connect a wallet to review token pricing.</p>}
      {state.loading && <p className="mt-2 text-slate-400" role="status">Getting verified reference quote…</p>}
      {state.error && <p className="mt-2 text-rose-300" role="alert">{state.error}</p>}
      {quote && <dl className="mt-3 space-y-2 break-words"><div><dt className="text-slate-400">Indicative total</dt><dd className="font-semibold text-white">{tokens(quote.totalRaw)} $HANDLE</dd></div><div><dt className="text-orange-300">Burn · 50%, rounded down</dt><dd>{tokens(quote.burnRaw)} $HANDLE</dd></div><div><dt className="text-violet-300">Treasury · remainder</dt><dd>{tokens(quote.treasuryRaw)} $HANDLE</dd></div><div><dt className="text-slate-400">Spendable wallet balance</dt><dd>{tokens(quote.walletBalanceRaw)} $HANDLE</dd></div></dl>}
      {quote?.quoteWarning && <p className="mt-3 text-xs leading-relaxed text-amber-200" role="status">{quote.quoteWarning}</p>}
      {quote && !quote.sufficientBalance && <p className="mt-3 text-amber-200">Your current spendable $HANDLE balance is below this reference amount.</p>}
      {quote && !quote.singleAccountSufficient && quote.sufficientBalance && <p className="mt-3 text-amber-200">Consolidate your $HANDLE into one spendable token account before minting.</p>}
      {quote && !quote.paymentAvailable && <p className="mt-3 text-amber-200">$HANDLE payments are currently unavailable. You can still choose SOL.</p>}
      <button type="button" disabled={busy || state.loading} onClick={() => setRefresh(value => value + 1)} className="mt-3 underline disabled:opacity-50">Refresh quote</button>
      <p className="mt-3 text-xs leading-relaxed text-slate-400">50% of your $HANDLE payment is burned on-chain. Maximum reference price impact: 10%. The approved token amount cannot increase without a new review. SOL is required for network and NFT account fees. Token mints do not generate SOL referral rewards.</p>
    </div>}
  </section>;
}