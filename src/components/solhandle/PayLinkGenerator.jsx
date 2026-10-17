import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { authorizedPayments } from '@/lib/payAuth';
import PaymentRequestFields from '@/components/solhandle/requests/PaymentRequestFields';
import PaymentLinkShare from '@/components/solhandle/requests/PaymentLinkShare';
export default function PayLinkGenerator({ handles, wallet, primaryHandle, loading, onCreated }) {
  const { publicKey, signMessage } = useWallet();
  const [selected, setSelected] = useState(''), [created, setCreated] = useState(null), [creating, setCreating] = useState(false), [error, setError] = useState('');
  const [form, setForm] = useState({ kind: 'REUSABLE', amount: '', description: '', expiry: '' });
  const names = publicKey?.toBase58() === wallet && !loading ? handles.map(item => String(item.handle).replace(/^@/, '').toLowerCase()) : [];
  const primary = String(primaryHandle || '').replace(/^@/, '').toLowerCase();
  const handle = names.includes(selected) ? selected : names.includes(primary) ? primary : names[0] || '';
  const key = JSON.stringify([wallet, handle, form]);
  const validAmount = !form.amount ? form.kind === 'REUSABLE' : /^\d+(\.\d{1,9})?$/.test(form.amount) && Number(form.amount) > 0 && Number.isSafeInteger(Math.round(Number(form.amount) * 1e9));
  const validExpiry = !form.expiry || new Date(form.expiry).getTime() > Date.now();
  const create = async event => {
    event.preventDefault(); setCreating(true); setError(''); setCreated(null);
    try {
      const data = await authorizedPayments('create_link', publicKey, signMessage, { handle, amount: form.amount, kind: form.kind, description: form.description, expiresAt: form.expiry ? new Date(form.expiry).toISOString() : '' });
      setCreated({ key, id: data.requestId }); onCreated?.();
    } catch (e) { setError(e.response?.data?.error || e.message || 'Could not create payment request.'); }
    finally { setCreating(false); }
  };
  return <section className="card-glow mt-5"><p className="text-xs font-semibold uppercase tracking-widest text-names-accent">SolHandle Pay</p><h2 className="mt-1 text-xl font-semibold">Create a payment link</h2><p className="mt-2 text-sm text-muted-foreground">Share a reusable receiving link or a one-time request. Your link stays tied to the original wallet and is blocked if your @handle changes owner.</p>
    {!publicKey ? <p className="mt-5 text-sm text-muted-foreground">Connect your wallet to create a link for your handles.</p> : loading || publicKey.toBase58() !== wallet ? <p role="status" className="mt-5 text-sm text-muted-foreground">Verifying your handles…</p> : !names.length ? <p className="mt-5 text-sm text-muted-foreground">Claim a SolHandle to create a payment link.</p> : <form onSubmit={create} className="mt-5 space-y-4"><fieldset disabled={creating} className="space-y-4"><PaymentRequestFields names={names} handle={handle} setSelected={setSelected} form={form} setForm={setForm}/>{!validAmount && <p className="text-xs text-destructive">Enter a positive SOL amount with up to 9 decimal places.</p>}{!validExpiry && <p className="text-xs text-destructive">Choose a future expiry date.</p>}<button type="submit" disabled={!validAmount || !validExpiry || !signMessage || creating} className="rounded-lg border border-names-accent/40 bg-names-accent/10 px-5 py-3 text-sm font-semibold text-names-accent disabled:opacity-50">{creating ? 'Verifying ownership…' : form.kind === 'SINGLE_USE' ? 'Create payment request' : 'Create reusable link'}</button>{!signMessage && <p className="text-xs text-names-warning">Your wallet must support message signing to create a protected link.</p>}</fieldset>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}{created?.key === key && <PaymentLinkShare handle={handle} requestId={created.id}/>}</form>}
  </section>;
}