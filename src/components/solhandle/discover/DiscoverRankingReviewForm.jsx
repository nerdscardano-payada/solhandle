import { useState } from 'react';

export default function DiscoverRankingReviewForm({ kind, listing, run, busy }) {
  const handle = kind === 'handle';
  const [evidence, setEvidence] = useState(listing[`${kind}_evidence_url`] || '');
  const [wallet, setWallet] = useState(listing.handle_owner_wallet || '');
  const [until, setUntil] = useState(''), [interval, setInterval] = useState(''), [confirmed, setConfirmed] = useState(false);
  const submit = async event => {
    event.preventDefault();
    const saved = await run({ action: `grant_${kind}`, evidence_url: evidence, wallet, valid_until: new Date(until).toISOString(), interval_hours: Number(interval), confirmed });
    if (saved) { setConfirmed(false); setUntil(''); }
  };
  return <form className="discover-form space-y-3 rounded-lg border border-border p-4" onSubmit={submit}>
    <h4 className="font-semibold">{handle ? '2. Active linked handle' : '1. Working SolHandle integration'}</h4>
    <p className="text-xs text-muted-foreground">{handle ? 'Review wallet-control evidence and the active relationship to this listing. The server checks the official NFT and its current owner.' : 'Personally test a real product integration. A logo, backlink or directory listing alone does not qualify.'}</p>
    <label>Public evidence URL<input type="url" required maxLength={500} value={evidence} onChange={event => setEvidence(event.target.value)} disabled={busy}/></label>
    {handle && <label>Project-controlled owner wallet<input required maxLength={44} value={wallet} onChange={event => setWallet(event.target.value)} disabled={busy}/></label>}
    <label>Review valid until (local time)<input type="datetime-local" required value={until} onChange={event => setUntil(event.target.value)} disabled={busy}/></label>
    {handle && <label>Ownership check interval (hours)<input type="number" required min={1} max={720} step={1} value={interval} onChange={event => setInterval(event.target.value)} disabled={busy}/><span className="text-xs text-muted-foreground">Choose explicitly. Due checks run every 15 minutes; temporary failures retry after one hour.</span></label>}
    <label className="flex items-start gap-2"><input type="checkbox" required checked={confirmed} onChange={event => setConfirmed(event.target.checked)} disabled={busy}/><span>{handle ? 'I reviewed proof of wallet control and active use of this handle by this listing.' : 'I tested and confirmed a working SolHandle integration in this product.'}</span></label>
    <button className="ep-button" disabled={busy || (handle && !listing.handle)}>{busy ? 'Saving…' : 'Approve ranking benefit'}</button>
  </form>;
}