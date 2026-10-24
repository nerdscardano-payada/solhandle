import { useState } from 'react';
import LabImageUpload from '@/components/solhandle/network/lab/LabImageUpload';
import useSignedProfileSave from '@/components/solhandle/network/lab/useSignedProfileSave';
import { labError } from '@/components/solhandle/network/lab/labClient';
import useNetworkParticipation from '@/components/solhandle/network/useNetworkParticipation';
export default function LabProfileEdit({ actorId, profile, embedded = false, onSaved }) {
  const [name, setName] = useState(profile.name);
  const [bio, setBio] = useState(profile.bio);
  const [kind, setKind] = useState(profile.kind);
  const [links, setLinks] = useState(profile.links.join('\n'));
  const [website, setWebsite] = useState(profile.website || '');
  const [avatarId, setAvatarId] = useState(profile.avatarMediaId || '');
  const [bannerId, setBannerId] = useState(profile.bannerMediaId || '');
  const [avatarBusy, setAvatarBusy] = useState(false);
  const [bannerBusy, setBannerBusy] = useState(false);
  const save = useSignedProfileSave(actorId, onSaved);
  const canParticipate = useNetworkParticipation(actorId);
  const field = 'w-full rounded-xl border border-identity-border bg-card p-3 text-sm';
  const form = <form className="mt-4 space-y-4" onSubmit={event => { event.preventDefault(); if (!canParticipate) return; save.mutate({ action: 'saveProfile', display_name: name, bio, kind, website, avatarMediaId: avatarId, bannerMediaId: bannerId, social_links: links.split('\n').map(link => link.trim()).filter(Boolean) }); }}><fieldset disabled={!canParticipate || save.isPending} className="space-y-4"><LabImageUpload actorId={actorId} label="Avatar" value={avatarId} onChange={setAvatarId} onBusyChange={setAvatarBusy} disabled={save.isPending}/><LabImageUpload actorId={actorId} label="Banner" value={bannerId} onChange={setBannerId} onBusyChange={setBannerBusy} disabled={save.isPending}/><label className="block text-xs">Website<input type="url" maxLength={500} value={website} placeholder="https://" onChange={event => setWebsite(event.target.value)} className={field}/></label><label className="block text-xs">Display name<input required maxLength={80} value={name} onChange={event => setName(event.target.value)} className={field}/></label><label className="block text-xs">Bio<textarea rows={4} maxLength={500} value={bio} onChange={event => setBio(event.target.value)} className={field}/></label><label className="block text-xs">Profile type<select value={kind} onChange={event => setKind(event.target.value)} className={field}>{['PERSON', 'CREATOR', 'PROJECT'].map(value => <option key={value}>{value}</option>)}</select></label><label className="block text-xs">HTTPS links, one per line<textarea value={links} onChange={event => setLinks(event.target.value)} maxLength={2500} className={field}/></label><button disabled={save.isPending || avatarBusy || bannerBusy} className="rounded-full border border-names-accent/40 px-5 py-2 text-sm text-names-accent">{save.isPending ? 'Authorizing & saving…' : 'Sign & save profile'}</button><p className="text-xs text-identity-muted">Approve these exact changes with your existing verified wallet. This signs a message, not a payment.</p>{save.isError && <p role="alert" className="text-sm text-names-warning">{labError(save.error)}</p>}{save.isSuccess && <p role="status" className="text-sm text-names-success">Profile saved.</p>}</fieldset></form>;
  return embedded ? form : <details className="mt-5"><summary className="cursor-pointer text-sm text-names-accent">Edit profile</summary>{form}</details>;
}