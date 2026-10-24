import { useRef, useState } from 'react';
import NetworkProfileTabs from '@/components/solhandle/network/NetworkProfileTabs';
import NetworkProfileIdentity from '@/components/solhandle/network/NetworkProfileIdentity';
import { useQuery } from '@tanstack/react-query';
import labClient, { labError } from '@/components/solhandle/network/lab/labClient';
import useLabMutation from '@/components/solhandle/network/lab/useLabMutation';
import NetworkState from '@/components/solhandle/network/NetworkState';
import LabProfileEdit from '@/components/solhandle/network/lab/LabProfileEdit';
import LabProfileHero from '@/components/solhandle/network/lab/LabProfileHero';
import LabProfileAbout from '@/components/solhandle/network/lab/LabProfileAbout';
import LabFeed from '@/components/solhandle/network/lab/LabFeed';
import LabPeople from '@/components/solhandle/network/lab/LabPeople';
import NetworkProfileStats from '@/components/solhandle/network/NetworkProfileStats';
export default function LabProfile({ actorId, target, onProfile, onConversation, onBack }) {
  const [list, setList] = useState('posts');
  const editor = useRef(null);
  const openEditor = () => {
    const details = editor.current?.querySelector('details');
    if (!details) return;
    details.open = true;
    details.scrollIntoView({ block: 'center' });
    details.querySelector('summary')?.focus();
  };
  const query = useQuery({ queryKey: ['network-lab', actorId, 'profile', target], queryFn: () => labClient({ action: 'profile', actorId, target }), retry: 1, refetchInterval: 30000 });
  const change = useLabMutation(actorId);
  const profile = query.data?.profile;
  return <><button onClick={onBack} className="p-5 text-sm text-names-accent">← Back to feed</button><NetworkState query={query}>{profile && <><LabProfileHero profile={profile} actorId={actorId} change={change} onList={setList} onEdit={openEditor}/><div className="network-profile-columns"><div className="min-w-0">{change.isError && <p role="alert" className="p-5 text-sm text-names-warning">{labError(change.error)}</p>}{actorId === target && <div ref={editor} className="px-5 pb-5"><LabProfileEdit key={target} actorId={actorId} profile={profile}/></div>}<NetworkProfileTabs value={list} onChange={setList}/>{['followers', 'following'].includes(list) ? <LabPeople actorId={actorId} target={target} direction={list} onProfile={onProfile}/> : list === 'identity' ? <NetworkProfileIdentity profile={profile}/> : list === 'about' ? <LabProfileAbout profile={profile}/> : <LabFeed actorId={actorId} author={target} mode={list === 'replies' ? 'profileReplies' : list === 'media' ? 'media' : 'latest'} onProfile={onProfile} onConversation={onConversation}/>}</div><NetworkProfileStats profile={profile} onList={setList}/></div></>}</NetworkState></>;
}