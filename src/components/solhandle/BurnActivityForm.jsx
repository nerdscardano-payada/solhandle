import { useState } from 'react';
import { base44 } from '@/api/base44Client';

export default function BurnActivityForm({ onSaved }) {
  const [type, setType] = useState('BUYBACK');
  const [wallet, setWallet] = useState('');
  const [signature, setSignature] = useState('');
  const [sol, setSol] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const submit = async (event) => {
    event.preventDefault(); setSaving(true); setError('');
    try {
      await base44.functions.invoke('recordBurnActivity', { type, wallet: wallet.trim(), signature: signature.trim(), ...(type === 'BUYBACK' ? { sol_reported: Number(sol) } : {}) });
      setSignature(''); setSol(''); await onSaved();
    } catch (e) { setError(e.response?.data?.error || e.message || 'Could not save this activity.'); }
    finally { setSaving(false); }
  };
  return <form onSubmit={submit} className="card-glow mt-8 space-y-4">
    <h2 className="text-xl font-semibold">Record on-chain activity</h2>
    <p className="text-sm text-slate-400">Paste a confirmed Solana signature. The $HANDLE amount is read from the transaction; buyback SOL spending is reported by you, not independently verified.</p>
    <div className="flex gap-3"><label className="flex items-center gap-2 text-sm"><input type="radio" name="activity" checked={type === 'BUYBACK'} onChange={() => setType('BUYBACK')}/> Buyback</label><label className="flex items-center gap-2 text-sm"><input type="radio" name="activity" checked={type === 'BURN'} onChange={() => setType('BURN')}/> Burn</label></div>
    <label className="block text-sm text-slate-300">Signing wallet<input required value={wallet} onChange={e => setWallet(e.target.value)} placeholder="Solana wallet address" className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 font-mono text-sm text-white"/></label>
    <label className="block text-sm text-slate-300">Transaction signature<input required value={signature} onChange={e => setSignature(e.target.value)} placeholder="Solana transaction signature" className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 font-mono text-sm text-white"/></label>
    {type === 'BUYBACK' && <label className="block text-sm text-slate-300">SOL spent (reported)<input required type="number" min="0.000000001" step="any" value={sol} onChange={e => setSol(e.target.value)} placeholder="1" className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white"/></label>}
    {error && <p role="alert" className="text-sm text-rose-300">{error}</p>}
    <button disabled={saving} className="rounded-xl bg-gradient-to-r from-violet-400 to-cyan-300 px-5 py-3 font-semibold text-slate-950 disabled:opacity-50">{saving ? 'Checking on-chain…' : 'Verify & save'}</button>
  </form>;
}