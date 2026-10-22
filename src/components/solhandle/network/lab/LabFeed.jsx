import useLabList from '@/components/solhandle/network/lab/useLabList';
import NetworkState from '@/components/solhandle/network/NetworkState';
import NetworkMore from '@/components/solhandle/network/NetworkMore';
import LabPostCard from '@/components/solhandle/network/lab/LabPostCard';
export default function LabFeed({ actorId, mode, q = '', author, id, onConversation, onProfile }) {
  const query = useLabList(actorId, { action: 'feed', mode, q, author, id });
  const posts = query.data?.pages.flatMap(page => page.items) || [];
  return <NetworkState query={query} empty={!posts.length && !query.hasNextPage && 'No matching test posts. Create content or follow another test identity.'}>{posts.map(post => <LabPostCard key={post.id} actorId={actorId} post={post} onConversation={onConversation} onProfile={onProfile}/>)}<NetworkMore query={query}/></NetworkState>;
}