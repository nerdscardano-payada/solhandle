import { useState } from 'react';
import useLabMutation from '@/components/solhandle/network/lab/useLabMutation';
import { labError } from '@/components/solhandle/network/lab/labClient';
export default function LabComposer({ actorId, parentId = '' }) {
  const [body, setBody] = useState('');
  const save = useLabMutation(actorId, () => setBody(''));
  return <form onSubmit={event => { event.preventDefault(); save.mutate({ action: 'publish', body, parentId }); }} className="space-y-3 border-b border-identity-border p-5"><label className="block text-sm font-semibold">{parentId ? 'Write a test reply' : 'Create a test post'}<textarea required maxLength={2000} rows={3} value={body} onChange={event => setBody(event.target.value)} className="mt-3 w-full rounded-xl border border-identity-border bg-card p-3 font-normal" placeholder="Only visible inside the administrator development lab"/></label><div className="flex items-center justify-between gap-3"><span className="text-xs text-identity-muted">{body.length}/2000 · plain text · test only</span><button disabled={save.isPending || !body.trim()} className="rounded-full bg-names-accent px-5 py-2 text-sm font-semibold disabled:opacity-40">{save.isPending ? 'Saving…' : parentId ? 'Reply' : 'Post'}</button></div>{save.isError && <p role="alert" className="text-sm text-names-warning">{labError(save.error)}</p>}</form>;
}