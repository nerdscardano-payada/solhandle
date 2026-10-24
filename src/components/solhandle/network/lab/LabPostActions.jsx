import { MessageCircle, Heart, Repeat2, Bookmark } from 'lucide-react';
import useNetworkSocialMutation from '@/components/solhandle/network/lab/useNetworkSocialMutation';
import { labError } from '@/components/solhandle/network/lab/labClient';
import NetworkPostAction from '@/components/solhandle/network/NetworkPostAction';
import NetworkShare from '@/components/solhandle/network/NetworkShare';
import useNetworkParticipation from '@/components/solhandle/network/useNetworkParticipation';
export default function LabPostActions({ actorId, post, onConversation }) {
  const change = useNetworkSocialMutation(actorId);
  const canParticipate = useNetworkParticipation(actorId);
  return <><footer className="network-feed-footer" aria-label="Post actions"><NetworkPostAction icon={MessageCircle} label="Reageren" accessibleLabel="Reacties openen" count={post.replies} onClick={() => onConversation(post.id)}/>{[[Repeat2, 'REPOST', post.reposts, 'Repost', 'Gerepost', 'Repost intrekken', 'repost'], [Heart, 'LIKE', post.likes, 'Like', 'Leuk gevonden', 'Like intrekken', 'like'], [Bookmark, 'BOOKMARK', null, 'Bewaren', 'Bewaard', 'Niet meer bewaren', 'bookmark']].map(([Icon, kind, count, label, activeLabel, undoLabel, tone]) => <NetworkPostAction key={kind} icon={Icon} label={post.states.includes(kind) ? activeLabel : label} accessibleLabel={post.states.includes(kind) ? undoLabel : label} count={count} tone={tone} active={post.states.includes(kind)} disabled={!canParticipate || change.isPending} pending={change.isPending && change.variables?.kind === kind} onClick={() => change.mutate({ action: 'interact', kind, postId: post.id, active: !post.states.includes(kind) })}/>)}<NetworkShare compact path={`/network?post=${post.id}`} title={`${post.author.name} · Network post`}/></footer>{change.isError && <p role="alert" className="mt-3 text-xs text-names-warning">{labError(change.error)}</p>}</>;
}