import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function DomainPolicyForm({ save, onSaved }) {
  const [target, setTarget] = useState(''); const [classification, setClassification] = useState('SUSPICIOUS'); const [reason, setReason] = useState(''); const [notice, setNotice] = useState('');
  const submit = async event => {
    event.preventDefault(); setNotice('');
    try { const result = await save.mutateAsync({ target, classification, reason }); setNotice(`Saved policy for ${result.record.hostname}.`); setReason(''); onSaved(); }
    catch (error) { setNotice(error.response?.data?.error || error.message); }
  };
  return <section className="rounded-2xl border border-border bg-card p-6"><h2 className="text-xl font-semibold">Record a domain decision</h2><p className="mt-2 text-sm text-muted-foreground">Every change adds a separate decision with its administrator, reason and time. Previous decisions stay in the history.</p><form onSubmit={submit} className="mt-5 space-y-4">
    <div><Label htmlFor="policy-domain">Domain or URL</Label><Input id="policy-domain" value={target} onChange={e => setTarget(e.target.value)} maxLength={2048} placeholder="Domain to review" required disabled={save.isPending}/></div>
    <div><Label htmlFor="policy-classification">Classification</Label><select id="policy-classification" className="mt-1 w-full rounded-md border border-input bg-background p-3 text-sm" value={classification} onChange={e => setClassification(e.target.value)} disabled={save.isPending}>{['TRUSTED', 'NORMAL', 'SUSPICIOUS', 'BLOCKED'].map(x => <option key={x}>{x}</option>)}</select></div>
    <div><Label htmlFor="policy-reason">Reason, evidence or policy basis</Label><Textarea id="policy-reason" value={reason} onChange={e => setReason(e.target.value)} minLength={10} maxLength={1000} required disabled={save.isPending}/><p className="mt-1 text-xs text-muted-foreground">Do not include private keys, seed phrases or unnecessary personal data.</p></div>
    <Button disabled={save.isPending} type="submit">{save.isPending ? 'Saving…' : 'Save decision'}</Button><p role="status" className="text-sm text-muted-foreground">{notice}</p>
  </form></section>;
}