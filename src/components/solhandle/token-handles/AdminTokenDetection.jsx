import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import TokenDetectionResult from '@/components/solhandle/token-handles/TokenDetectionResult';

export default function AdminTokenDetection() {
  const [mint, setMint] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  async function detect(event) {
    event.preventDefault(); setError(''); setResult(null); setLoading(true);
    try {
      const { data } = await base44.functions.invoke('detectTokenHandle', { mint: mint.trim() });
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (failure) {
      setError(failure.response?.data?.error || failure.message || 'Unable to detect token.');
    } finally { setLoading(false); }
  }
  return <section id="token-detection" className="mt-8 scroll-mt-6 rounded-2xl border border-names-accent/30 bg-card p-5">
    <p className="text-xs font-semibold uppercase tracking-widest text-names-secondary">Admin pilot · Read only</p>
    <h2 className="mt-3 font-heading text-2xl font-semibold">Token Handle detection</h2>
    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Enter a Solana Mainnet mint to inspect validated on-chain metadata and authorities. No wallet signature, SOL payment, claim or registration is performed. Off-chain metadata is not fetched.</p>
    <form onSubmit={detect} className="mt-5 space-y-3"><label htmlFor="token-mint-detection" className="block text-sm font-semibold">Token mint address</label><Input id="token-mint-detection" value={mint} onChange={event => { setMint(event.target.value); setResult(null); setError(''); }} placeholder="Solana token mint address" required maxLength={44} disabled={loading} spellCheck={false} autoComplete="off" className="font-mono"/><Button type="submit" disabled={loading || !mint.trim()} className="gap-2">{loading && <Loader2 className="h-4 w-4 animate-spin"/>}{loading ? 'Reading finalized token data…' : 'Find token'}</Button></form>
    {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
    {!result && !error && !loading && <p className="mt-4 text-sm text-muted-foreground">No token inspected yet. A ticker alone cannot identify a mint.</p>}
    {result && <TokenDetectionResult result={result}/>}
    <p className="mt-5 border-t border-border pt-4 text-xs text-muted-foreground">Detection is not verification or an investment recommendation. Public claims remain disabled.</p>
  </section>;
}