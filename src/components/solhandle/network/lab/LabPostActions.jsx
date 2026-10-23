import { MessageCircle, Heart, Repeat2, Bookmark } from 'lucide-react';
import useLabMutation from '@/components/solhandle/network/lab/useLabMutation';
import { labError } from '@/components/solhandle/network/lab/labClient';
import NetworkPostAction from '@/components/solhandle/network/NetworkPostAction';
import NetworkShare from '@/components/solhandle/network/NetworkShare';
import useNetworkParticipation from '@/components/solhandle/network/useNetworkParticipation';
export default function LabPostActions({ actorId, post, onConversation }) {
  const change = useLabMutation(actorId);
  const canParticipate = useNetworkParticipation(actorId);
  return <><footer className="network-feed-footer" aria-label="Post actions"><NetworkPostAction icon={MessageCircle} label="Reply" accessibleLabel="Open replies" count={post.replies} onClick={() => onConversation(post.id)}/>{[[Heart, 'LIKE', post.likes, 'Like', 'Liked', 'Unlike', 'like'], [Repeat2, 'REPOST', post.reposts, 'Repost', 'Reposted', 'Undo repost', 'repost'], [Bookmark, 'BOOKMARK', null, 'Save', 'Saved', 'Remove bookmark', 'bookmark']].map(([Icon, kind, count, label, activeLabel, undoLabel, tone]) => <NetworkPostAction key={kind} icon={Icon} label={post.states.includes(kind) ? activeLabel : label} accessibleLabel={post.states.includes(kind) ? undoLabel : label} count={count} tone={tone} active={post.states.includes(kind)} disabled={!canParticipate || change.isPending} pending={change.isPending && change.variables?.kind === kind} onClick={() => change.mutate({ action: 'interact', kind, postId: post.id, active: !post.states.includes(kind) })}/>)}<NetworkShare compact path={`/network?post=${post.id}`} title={`${post.author.name} · Network post`}/></footer>{change.isError && <p role="alert" className="mt-3 text-xs text-names-warning">{labError(change.error)}</p>}</>;
}