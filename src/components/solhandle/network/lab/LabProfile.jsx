import { useRef, useState } from 'react';
import NetworkProfileTabs from '@/components/solhandle/network/NetworkProfileTabs';
import NetworkProfileIdentity from '@/components/solhandle/network/NetworkProfileIdentity';
import { useQuery } from '@tanstack/react-query';
import labClient, { labError } from '@/components/solhandle/network/lab/labClient';
import useNetworkSocialMutation from '@/components/solhandle/network/lab/useNetworkSocialMutation';
import LabComposer from '@/components/solhandle/network/lab/LabComposer';
import NetworkState from '@/components/solhandle/network/NetworkState';
import LabProfileEdit from '@/components/solhandle/network/lab/LabProfileEdit';
import LabProfileHero from '@/components/solhandle/network/lab/LabProfileHero';
import LabProfileAbout from '@/components/solhandle/network/lab/LabProfileAbout';
import LabFeed from '@/components/solhandle/network/lab/LabFeed';
import LabPeople from '@/components/solhandle/network/lab/LabPeople';
import NetworkProfileEditor from '@/components/solhandle/network/NetworkProfileEditor';
import { useNetworkSession } from '@/components/solhandle/network/NetworkSessionProvider';
export default function LabProfile({ actorId, target, onProfile, onConversation, onBack, own = false }) {
  const session = useNetworkSession();
  const [editing, setEditing] = useState(false);
  const [list, setList] = useState('posts');
  const editor = useRef(null);
  const openEditor = () => {
    if (own) { setEditing(true); return; }
    const details = editor.current?.querySelector('details');
    if (!details) return;
    details.open = true;
    details.scrollIntoView({ block: 'center' });
    details.querySelector('summary')?.focus();
  };
  const query = useQuery({ queryKey: ['network-lab', actorId, 'profile', target, session?.contextKey], queryFn: () => labClient({ action: 'profile', actorId, target }), enabled: !own, retry: 1, refetchInterval: 30000 });
  const change = useNetworkSocialMutation(actorId);
  const profileQuery = own ? session.account : query;
  const savedProfile = profileQuery.isSuccess ? profileQuery.data?.profile : null;
  const verified = Boolean(savedProfile?.ownerVerified && Date.parse(savedProfile.verifiedUntil) > Date.now() && (!own || session.ready));
  const profile = savedProfile ? { ...savedProfile, ownerVerified: verified, primaryActive: verified && savedProfile.primaryActive, paymentsEnabled: verified && savedProfile.paymentsEnabled, handle: verified ? savedProfile.handle : null } : null;
  return <>{onBack && <button type="button" onClick={onBack} className="sd-profile-back">← Back to feed</button>}<NetworkState query={profileQuery}>{profile && <><LabProfileHero profile={profile} own={own} actorId={actorId} change={change} onList={setList} onEdit={openEditor}/><div className="network-profile-columns"><div className="min-w-0">{change.isError && <p role="alert" className="p-5 text-sm text-names-warning">{labError(change.error)}</p>}{actorId === target && (own ? <NetworkProfileEditor actorId={actorId} profile={profile} open={editing} onOpenChange={setEditing}/> : <div ref={editor} className="px-5 pb-5"><LabProfileEdit key={target} actorId={actorId} profile={profile}/></div>)}<NetworkProfileTabs value={list} onChange={setList}/>{own && list === 'posts' && <LabComposer key={`${session.contextKey}:${actorId}`} actorId={actorId} />}{['followers', 'following'].includes(list) ? <LabPeople actorId={actorId} target={target} direction={list} onProfile={onProfile}/> : list === 'identity' ? <NetworkProfileIdentity profile={profile}/> : list === 'about' ? <LabProfileAbout profile={profile} onIdentity={() => setList('identity')}/> : <LabFeed actorId={actorId} author={target} mode={list === 'replies' ? 'profileReplies' : list === 'media' ? 'media' : 'latest'} onProfile={onProfile} onConversation={onConversation}/>}</div></div></>}</NetworkState></>;
}