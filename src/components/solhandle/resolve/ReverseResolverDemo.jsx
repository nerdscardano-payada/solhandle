import { useState } from 'react';
import { base44 } from '@/api/base44Client';

export default function ReverseResolverDemo() {
  const [address, setAddress] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  async function lookup(event) {
    event.preventDefault(); setLoading(true); setResult('');
    try {
      const { data } = await base44.functions.invoke('reverseResolveSolHandle', { address: address.trim() });
      setResult(data.verified && data.address === address.trim() && data.network === 'mainnet-beta' ? data.primaryHandle : address.trim());
    } catch (error) {
      setResult(error.response?.status === 404 ? `No verified primary handle. Display the original wallet: ${address.trim()}` : 'Lookup unavailable or invalid wallet. Keep the original wallet visible.');
    } finally { setLoading(false); }
  }
  return <form onSubmit={lookup} className="mt-4 rounded-xl border border-border p-4"><label htmlFor="member-wallet" className="text-sm font-semibold">Existing member wallet</label><div className="mt-3 flex flex-wrap gap-2"><input id="member-wallet" required value={address} onChange={event => setAddress(event.target.value)} placeholder="Paste a Solana wallet address" className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2 text-foreground"/><button disabled={loading} className="rounded-lg bg-names-accent px-4 py-2 font-semibold text-background disabled:opacity-50">{loading ? 'Looking up…' : 'Find primary name'}</button></div><p role="status" className="mt-3 break-all text-sm text-muted-foreground">{result}</p></form>;
}