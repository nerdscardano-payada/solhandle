import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
export default function GrowthAdminReviewCard({ review, busy, onAction }) {
  const [note, setNote] = useState(''), pending = ['PENDING','APPROVING'].includes(review.status), valid = note.trim().length >= 10;
  const decide = action => onAction({ action, id:review.id, note });
  return <article className="rounded-2xl border border-border bg-card p-5">
    <div className="flex flex-wrap justify-between gap-3"><h3 className="text-lg font-semibold">{review.quest_title}</h3><span className="text-xs text-names-secondary">{review.status}</span></div>
    <p className="mt-3 break-all font-mono text-xs">Deelnemer: {review.wallet}</p>
    <p className="mt-2 text-xs text-muted-foreground">Versie {review.quest_version} · {new Date(review.submitted_at).toLocaleString('nl-NL')}</p>
    <ul className="my-4 space-y-1 text-sm text-names-warning">{review.reasons.map((reason,i) => <li key={`${reason}:${i}`}>{reason === 'REFERRAL_MANUAL_REVIEW' ? 'Verplichte referral- en anti-Sybil-review' : reason}</li>)}</ul>
    {review.evidence?.original_minter && <p className="mb-2 break-all text-xs">Oorspronkelijke minter: {review.evidence.original_minter}</p>}
    {review.evidence?.recipient && <p className="mb-2 break-all text-xs">Ontvanger: {review.evidence.recipient}</p>}
    {review.evidence?.handle && <p className="mb-2 text-sm">Handle: @{review.evidence.handle.replace(/^@/, '')}</p>}
    {review.conversion_id && <p className="mb-2 break-all text-xs">Conversie: {review.conversion_id}</p>}
    <div className="flex flex-wrap gap-4 text-xs text-names-accent">{review.signature && <a target="_blank" rel="noopener noreferrer" href={`https://explorer.solana.com/tx/${encodeURIComponent(review.signature)}`}>On-chain bewijs →</a>}<Link to="/admin/referrals">Bestaande referral-fraudeflags →</Link></div>
    {review.decision_note && <p className="mt-4 whitespace-pre-wrap text-sm text-muted-foreground">Interne beslissing: {review.decision_note}</p>}
    {review.decided_at && <p className="mt-2 break-all text-xs text-muted-foreground">Besluit: {new Date(review.decided_at).toLocaleString('nl-NL')} · {review.decided_by}</p>}
    {(pending || review.status === 'REJECTED') && <><label className="mt-5 block text-sm">Interne beslisreden<textarea value={note} onChange={e => setNote(e.target.value)} minLength={10} maxLength={1000} disabled={busy} className="mt-2 w-full rounded-xl border border-input bg-background p-3" placeholder="Leg je beoordeling uit; minimaal 10 tekens"/></label><div className="mt-3 flex flex-wrap gap-3">{pending ? <><Button disabled={busy || !valid} onClick={() => decide('approve_review')}>Goedkeuren & XP toekennen</Button><Button variant="outline" disabled={busy || !valid} onClick={() => decide('reject_review')}>Afwijzen zonder XP</Button></> : <Button variant="outline" disabled={busy || !valid} onClick={() => decide('reopen_review')}>Heropen review</Button>}</div></>}
  </article>;
}