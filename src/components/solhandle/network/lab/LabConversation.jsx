import { useQuery } from '@tanstack/react-query';
import labClient from '@/components/solhandle/network/lab/labClient';
import NetworkState from '@/components/solhandle/network/NetworkState';
import LabPostCard from '@/components/solhandle/network/lab/LabPostCard';
import LabComposer from '@/components/solhandle/network/lab/LabComposer';
import LabFeed from '@/components/solhandle/network/lab/LabFeed';
export default function LabConversation({ actorId, id, onConversation, onProfile, onBack }) {
  const query = useQuery({ queryKey: ['network-lab', actorId, 'post', id], queryFn: () => labClient({ action: 'post', actorId, id }), retry: 1 });
  return <><button onClick={onBack} className="p-5 text-sm text-names-accent">← Tijdlijn</button><NetworkState query={query}>{query.data?.post && <><LabPostCard actorId={actorId} post={query.data.post} onConversation={onConversation} onProfile={onProfile}/><LabComposer key={`${actorId}:${id}`} actorId={actorId} parentId={id}/><h2 className="border-b border-identity-border px-4 py-3 text-sm font-semibold">Reacties</h2><div className="network-replies"><LabFeed actorId={actorId} mode="replies" id={id} onConversation={onConversation} onProfile={onProfile}/></div></>}</NetworkState></>;
}