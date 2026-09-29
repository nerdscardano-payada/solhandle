import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { base44 } from '@/api/base44Client';

export default function HandlePaymentQuotePreview() {
  const { publicKey } = useWallet();
  const [handle, setHandle] = useState('');
  const [quote, setQuote] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const requestQuote = async (event) => {
    event.preventDefault();
    setError(''); setQuote(null); setLoading(true);
    try {
      const response = await base44.functions.invoke('quoteHandlePayment', { action: 'preview', handle, wallet: publicKey.toBase58() });
      setQuote(response.data);
    } catch (caught) {
      setError(caught.response?.data?.error || caught.message || 'Pricing is temporarily unavailable.');
    } finally { setLoading(false); }
  };
  const tokens = (raw) => (Number(raw) / 10 ** quote.decimals).toLocaleString('en-US', { maximumFractionDigits: Math.min(quote.decimals, 9) });
  return <section className="mt-6 rounded-2xl border border-cyan-300/20 bg-slate-900/60 p-5">
    <h2 className="text-lg font-semibold text-white">$HANDLE reference quote</h2>
    <p className="mt-2 text-sm text-slate-400">See an indicative Jupiter-based token amount. No swap or payment takes place.</p>
    <form onSubmit={requestQuote} className="mt-4 flex flex-col gap-3 sm:flex-row">
      <label className="flex min-w-0 flex-1 items-center rounded-lg border border-white/20 bg-slate-950 px-3 text-slate-400">@<input value={handle} onChange={(event) => { setHandle(event.target.value); setQuote(null); }} maxLength={21} placeholder="ansem" aria-label="Handle" className="w-full bg-transparent px-2 py-3 text-white outline-none" /></label>
      <button type="submit" disabled={!publicKey || !handle.trim() || loading} className="rounded-lg bg-cyan-300 px-5 py-3 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50">{loading ? 'Getting quote…' : 'See reference quote'}</button>
    </form>
    {!publicKey && <p className="mt-2 text-sm text-slate-400">Connect your wallet to request a quote.</p>}
    {error && <p role="alert" className="mt-3 text-sm text-rose-300">{error}</p>}
    {quote && <div className="mt-4 grid gap-3 border-t border-white/10 pt-4 text-sm sm:grid-cols-3"><div><span className="text-slate-400">Indicative total</span><b className="block text-xl text-white">{tokens(quote.totalRaw)} $HANDLE</b></div><div><span className="text-orange-300">Burn (50%)</span><b className="block text-xl text-white">{tokens(quote.burnRaw)}</b></div><div><span className="text-violet-300">Treasury (remainder)</span><b className="block text-xl text-white">{tokens(quote.treasuryRaw)}</b></div></div>}
    <p className="mt-4 text-xs text-slate-400">Illustrative only. $HANDLE minting is not active until the on-chain payment, burn and treasury rules are deployed and verified.</p>
  </section>;
}