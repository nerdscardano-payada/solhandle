import { useState } from 'react';
import { useNetworkSession } from '@/components/solhandle/network/NetworkSessionProvider';
import useNetworkSocialMutation from '@/components/solhandle/network/lab/useNetworkSocialMutation';
import LabImageUpload from '@/components/solhandle/network/lab/LabImageUpload';
import LabMentionPicker from '@/components/solhandle/network/lab/LabMentionPicker';
import useLabMutation from '@/components/solhandle/network/lab/useLabMutation';
import { labError } from '@/components/solhandle/network/lab/labClient';
import useNetworkParticipation from '@/components/solhandle/network/useNetworkParticipation';
export default function LabComposer({ actorId, parentId = '' }) {
  const [body, setBody] = useState('');
  const [mediaId, setMediaId] = useState('');
  const [mediaBusy, setMediaBusy] = useState(false);
  const [mentions, setMentions] = useState([]);
  const [revision, setRevision] = useState(0);
  const session = useNetworkSession();
  const identity = session.account;
  const save = useNetworkSocialMutation(actorId, () => { setBody(''); setMediaId(''); setMentions([]); setRevision(value => value + 1); });
  const profile = session.actorId === actorId ? session.profile : null;
  const canParticipate = useNetworkParticipation(actorId);
  const ownershipBlocked = profile?.identityConfigured && (!profile.ownerVerified || Date.parse(profile.verifiedUntil) <= Date.now());
  const refresh = useLabMutation(actorId);
  return <form onSubmit={event => { event.preventDefault(); if (!canParticipate) return; save.mutate({ action: 'publish', body, parentId, mediaIds: mediaId ? [mediaId] : [], mentionIds: mentions.map(person => person.id) }); }} className="sd-composer live-composer">{!canParticipate && <p role="status" className="text-xs leading-relaxed text-names-accent">Activeer je handle via Profiel → Accountbeheer.</p>}{save.isSuccess && <p role="status" className="text-sm text-names-success">{parentId ? 'Reply published.' : 'Post published.'}</p>}<fieldset disabled={!canParticipate || save.isPending} className="space-y-4"><p className="text-sm font-semibold">{profile?.handle || profile?.name || 'Je identiteit laden…'}</p><label className="block text-sm font-semibold"><span className="sr-only">{parentId ? 'Schrijf een reactie' : 'Wat wil je delen?'}</span><textarea required={!mediaId} maxLength={2000} rows={2} value={body} disabled={save.isPending} onChange={event => setBody(event.target.value)} className="mt-3 w-full rounded-xl border border-identity-border bg-card p-3 font-normal" placeholder={parentId ? 'Plaats je reactie…' : 'Wat wil je delen?'}/></label><details><summary className="cursor-pointer text-sm font-normal text-identity-muted">Foto of vermelding toevoegen</summary><div className="space-y-4 pt-3"><LabImageUpload key={`${actorId}:${revision}`} actorId={actorId} label="Post image" value={mediaId} onChange={setMediaId} onBusyChange={setMediaBusy} disabled={save.isPending}/><LabMentionPicker actorId={actorId} selected={mentions} onChange={setMentions} disabled={save.isPending}/></div></details><div className="flex items-center justify-between gap-3"><span className="text-xs text-identity-muted">{body.length}/2000</span><button disabled={save.isPending || mediaBusy || ownershipBlocked || !profile || (!body.trim() && !mediaId)} className="sd-button sd-gradient">{save.isPending ? 'Opslaan…' : parentId ? 'Reageren' : 'Plaatsen'}</button></div>{ownershipBlocked && <div role="alert" className="space-y-2 text-sm text-names-warning"><p>Vernieuw je eigendomsbewijs om te posten.</p><button type="button" disabled={refresh.isPending} onClick={() => refresh.mutate({ action: 'identityRefresh' })} className="underline">Eigendom vernieuwen</button></div>}{(save.isError || identity.isError || refresh.isError) && <p role="alert" className="text-sm text-names-warning">{labError(save.error || identity.error || refresh.error)}</p>}</fieldset></form>;
}