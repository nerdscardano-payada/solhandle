import { useState } from 'react';
import { Check, Search, X } from 'lucide-react';
import { contactMessage, contactRequest } from '@/components/solhandle/contacts/contactClient';
const input = 'mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-names-accent';
export default function ContactForm({ wallet, contact, payment, onSaved, onCancel }) {
  const [name, setName] = useState(contact?.name || '');
  const [handle, setHandle] = useState(contact?.handle || payment?.handle || '');
  const [verified, setVerified] = useState(contact ? { address: contact.recipient_wallet } : payment ? { address: payment.receiver_wallet } : null);
  const [busy, setBusy] = useState(false), [error, setError] = useState('');
  const submit = async event => {
    event.preventDefault(); setBusy(true); setError('');
    try {
      if (!verified) {
        const resolved = await contactRequest('resolve', wallet, { handle });
        if (contact && resolved.address !== contact.recipient_wallet) throw new Error('This handle points to a different wallet. Saved wallet addresses cannot be replaced; add a separate contact instead.');
        setVerified(resolved); return;
      }
      const result = await contactRequest('save', wallet, { name, handle, expectedWallet: verified.address, ...(contact ? { id: contact.id } : {}), ...(payment ? { paymentId: payment.id } : {}) });
      onSaved(result);
    } catch (e) { setError(contactMessage(e)); } finally { setBusy(false); }
  };
  return <form onSubmit={submit} className="space-y-4 rounded-2xl border border-names-secondary/30 bg-card p-5 text-foreground">
    <div className="flex items-center justify-between gap-2"><h2 className="text-lg font-semibold">{contact ? 'Edit contact' : 'Save contact'}</h2><button type="button" onClick={onCancel} disabled={busy} aria-label="Close contact form" className="flex h-11 w-11 items-center justify-center text-muted-foreground"><X className="h-5 w-5"/></button></div>
    <label className="block text-sm">Name<input required maxLength={80} value={name} disabled={busy} onChange={e => setName(e.target.value)} placeholder="Contact name" className={input}/></label>
    <label className="block text-sm">@handle<input required value={handle} readOnly={!!payment} disabled={busy} onChange={e => { setHandle(e.target.value); setVerified(null); setError(''); }} placeholder="@ansem" autoComplete="off" className={input}/></label>
    {verified && <div className="rounded-xl border border-names-accent/20 bg-names-accent/5 p-3"><p className="flex items-center gap-2 text-xs text-names-accent"><Check className="h-4 w-4"/>{payment ? 'Recipient verified by your confirmed payment' : 'Verified recipient wallet'}</p><p className="mt-2 break-all font-mono text-xs">{verified.address}</p><p className="mt-2 text-xs text-muted-foreground">This wallet stays fixed, even if the handle changes owners. Saving the same wallet updates its existing contact.</p></div>}
    {error && <p role="alert" className="text-sm text-names-warning">{error}</p>}
    <button type="submit" disabled={busy} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-names-accent px-4 py-3 font-semibold text-hero-canvas disabled:opacity-50">{!verified && <Search className="h-4 w-4"/>}{busy ? 'Please wait…' : verified ? 'Save contact' : 'Verify @handle'}</button>
  </form>;
}