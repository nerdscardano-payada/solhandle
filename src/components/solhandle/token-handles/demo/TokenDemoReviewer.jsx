import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function TokenDemoReviewer({ id, label, review, dispatch }) {
  const [checks, setChecks] = useState([false, false, false]);
  const [reason, setReason] = useState('');
  function decide(approved) { dispatch({ type: 'review', reviewer: id, approved, reason, checks }); }
  return <section className="rounded-xl border border-border p-4">
    <h4 className="font-semibold">{label} · fictional role</h4>
    {review ? <><p className="mt-3 text-sm text-names-success">Approved in demo</p><p className="mt-2 break-words text-sm text-muted-foreground">{review.reason}</p></> : <div className="mt-4 space-y-3">
      {['Token-control evidence reviewed', 'Project identity independently reviewed', 'Symbol entitlement and conflicts reviewed'].map((text, index) => <label key={text} className="flex items-start gap-2 text-sm"><input type="checkbox" checked={checks[index]} onChange={event => setChecks(previous => previous.map((value, item) => item === index ? event.target.checked : value))} className="mt-1"/>{text}</label>)}
      <label className="block space-y-2 text-sm">Decision reason<Textarea value={reason} onChange={event => setReason(event.target.value)} maxLength={1000} placeholder="Record the sample decision and evidence reviewed"/></label>
      <div className="flex flex-wrap gap-2"><Button disabled={!reason.trim() || !checks.every(Boolean)} onClick={() => decide(true)}>Simulate approval</Button><Button variant="outline" disabled={!reason.trim()} onClick={() => decide(false)}>Simulate rejection</Button></div>
    </div>}
  </section>;
}