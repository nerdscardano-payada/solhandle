import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Flame, LoaderCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import formatHandleTokens from '@/components/solhandle/formatHandleTokens';

export default function HandleTokenClaimButton({ handle, enabled, onClaim }) {
  const { publicKey } = useWallet();
  const wallet = publicKey?.toBase58() || '';
  const [state, setState] = useState({ quote: null, error: '', loading: false });
  useEffect(() => {
    let active = true;
    setState({ quote: null, error: '', loading: Boolean(enabled && wallet) });
    if (!enabled || !wallet) return;
    const timer = setTimeout(() => {
      base44.functions.invoke('quoteHandlePayment', { action: 'preview', handle, wallet }).then(({ data }) => {
        if (active) setState({ quote: data, error: '', loading: false });
      }).catch(error => {
        if (active) setState({ quote: null, error: error.response?.data?.error || error.message || 'Quote unavailable.', loading: false });
      });
    }, 350);
    return () => { active = false; clearTimeout(timer); };
  }, [handle, wallet, enabled]);
  const quote = state.quote?.handle === handle && state.quote?.wallet === wallet ? state.quote : null;
  const ready = quote?.quoteEligible && quote?.paymentAvailable;
  return <div className="dark mt-3">
    <button type="button" disabled={!enabled || Boolean(wallet && !ready)} onClick={onClaim} className="flex w-full min-w-0 items-center justify-center gap-2 rounded-lg border border-burn-accent/50 bg-burn-accent/10 px-3 py-3 font-semibold text-foreground disabled:cursor-not-allowed disabled:opacity-50">
      {state.loading ? <LoaderCircle className="h-4 w-4 shrink-0 animate-spin text-burn-accent"/> : <Flame className="h-4 w-4 shrink-0 text-burn-accent"/>}
      <span className="break-words">{!wallet ? 'Connect wallet · Claim with $HANDLE' : state.loading ? 'Getting $HANDLE price…' : quote ? `Claim @${handle} · ≈ ${formatHandleTokens(quote.totalRaw, quote.decimals)} $HANDLE` : 'Claim with $HANDLE · Quote unavailable'}</span>
    </button>
    <p className="mt-1.5 text-center text-xs text-burn-accent">50% burned on-chain · SOL required for fees</p>
    {state.error && <p role="alert" className="mt-2 text-xs text-destructive">{state.error}</p>}
    {quote?.quoteWarning && <p role="status" className="mt-2 text-xs text-muted-foreground">{quote.quoteWarning}</p>}
    {quote && !quote.paymentAvailable && <p className="mt-2 text-xs text-muted-foreground">$HANDLE payments are currently unavailable.</p>}
  </div>;
}