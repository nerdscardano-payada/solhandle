import { useState } from 'react';
import useLabList from '@/components/solhandle/network/lab/useLabList';
import NetworkMore from '@/components/solhandle/network/NetworkMore';
import NetworkState from '@/components/solhandle/network/NetworkState';
export default function LabMentionPicker({ actorId, selected, onChange, disabled }) {
  const [q, setQ] = useState('');
  const [search, setSearch] = useState('');
  const query = useLabList(actorId, { action: 'people', q: search });
  const people = query.data?.pages.flatMap(page => page.items) || [];
  return <details className="rounded-xl border border-identity-border p-3"><summary className="cursor-pointer text-xs text-names-secondary">Mention accounts ({selected.length}/10)</summary><p className="mt-3 text-xs text-identity-muted">Select an account, not a freely typed @handle; the account reference and label are preserved with the post.</p><div className="mt-3 flex gap-3"><input aria-label="Find account to mention" value={q} maxLength={80} onChange={event => setQ(event.target.value)} className="min-w-0 flex-1 rounded-lg border border-identity-border bg-card p-2 text-xs"/><button type="button" onClick={() => setSearch(q.trim())} className="text-xs text-names-accent">Find</button></div><NetworkState query={query}>{people.filter(person => person.id !== actorId).map(person => { const added = selected.some(item => item.id === person.id); return <label key={person.id} className="mt-3 flex items-center gap-3 text-xs"><input type="checkbox" checked={added} disabled={disabled || (!added && selected.length >= 10)} onChange={() => onChange(added ? selected.filter(item => item.id !== person.id) : [...selected, person])}/>{person.name} · test account</label>; })}<NetworkMore query={query}/></NetworkState>{selected.length > 0 && <p className="mt-3 text-xs text-names-accent">Mentioning: {selected.map(person => person.name).join(', ')}</p>}</details>;
}