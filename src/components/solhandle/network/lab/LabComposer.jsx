import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import labClient from '@/components/solhandle/network/lab/labClient';
import LabImageUpload from '@/components/solhandle/network/lab/LabImageUpload';
import LabMentionPicker from '@/components/solhandle/network/lab/LabMentionPicker';
import useLabMutation from '@/components/solhandle/network/lab/useLabMutation';
import { labError } from '@/components/solhandle/network/lab/labClient';
export default function LabComposer({ actorId, parentId = '' }) {
  const [body, setBody] = useState('');
  const [mediaId, setMediaId] = useState('');
  const [mediaBusy, setMediaBusy] = useState(false);
  const [mentions, setMentions] = useState([]);
  const [revision, setRevision] = useState(0);
  const identity = useQuery({ queryKey: ['network-lab', actorId, 'profile', actorId], queryFn: () => labClient({ action: 'profile', actorId, target: actorId }), retry: 1, refetchInterval: 30000 });
  const save = useLabMutation(actorId, () => { setBody(''); setMediaId(''); setMentions([]); setRevision(value => value + 1); });
  const profile = identity.data?.profile;
  const ownershipBlocked = profile?.identityConfigured && !profile.ownerVerified;
  const refresh = useLabMutation(actorId);
  return <form onSubmit={event => { event.preventDefault(); save.mutate({ action: 'publish', body, parentId, mediaIds: mediaId ? [mediaId] : [], mentionIds: mentions.map(person => person.id) }); }} className="space-y-4 border-b border-identity-border p-5"><p className="text-sm font-semibold">Posting as {profile?.handle || profile?.name || 'loading identity…'} <span className="text-xs text-names-warning">· {profile?.ownerVerified ? 'owned handle · development access' : 'test identity, no currently verified @handle'}</span></p><label className="block text-sm font-semibold">{parentId ? 'Write a reply' : 'Create a post'}<textarea required={!mediaId} maxLength={2000} rows={3} value={body} disabled={save.isPending} onChange={event => setBody(event.target.value)} className="mt-3 w-full rounded-xl border border-identity-border bg-card p-3 font-normal" placeholder="Share a thought, a project or a conversation"/></label><LabImageUpload key={`${actorId}:${revision}`} actorId={actorId} label="Post image" value={mediaId} onChange={setMediaId} onBusyChange={setMediaBusy} disabled={save.isPending}/><LabMentionPicker actorId={actorId} selected={mentions} onChange={setMentions} disabled={save.isPending}/><div className="flex items-center justify-between gap-3"><span className="text-xs text-identity-muted">{body.length}/2000 · test access only</span><button disabled={save.isPending || mediaBusy || ownershipBlocked || !profile || (!body.trim() && !mediaId)} className="rounded-full bg-names-accent px-5 py-2 text-sm font-semibold disabled:opacity-40">{save.isPending ? 'Saving…' : parentId ? 'Reply' : 'Post'}</button></div>{ownershipBlocked && <div role="alert" className="space-y-2 text-sm text-names-warning"><p>Posting is disabled until your owned identity is refreshed. Your account and history remain yours.</p><button type="button" disabled={refresh.isPending} onClick={() => refresh.mutate({ action: 'identityRefresh' })} className="underline">Refresh ownership</button></div>}{(save.isError || identity.isError || refresh.isError) && <p role="alert" className="text-sm text-names-warning">{labError(save.error || identity.error || refresh.error)}</p>}</form>;
}