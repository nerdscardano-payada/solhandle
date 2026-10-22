import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { networkRead } from '@/components/solhandle/network/networkClient';
import useNetworkPages from '@/components/solhandle/network/useNetworkPages';
import NetworkState from '@/components/solhandle/network/NetworkState';
import NetworkPostCard from '@/components/solhandle/network/NetworkPostCard';
import NetworkMore from '@/components/solhandle/network/NetworkMore';
import NetworkGate from '@/components/solhandle/network/NetworkGate';
export default function NetworkPost() {
  const { postId } = useParams();
  const query = useQuery({ queryKey: ['network', 'post', postId], queryFn: () => networkRead({ action: 'post', id: postId }), retry: 1 });
  const post = query.data?.post;
  const replies = useNetworkPages('replies', { id: postId }, Boolean(post));
  const items = replies.data?.pages.flatMap(page => page.items) || [];
  return <><header className="border-b border-identity-border p-5"><Link to="/network" className="text-sm text-names-accent">← Network</Link><h1 className="mt-3 text-2xl font-semibold">Conversation</h1></header><NetworkState query={query}>{post ? <><NetworkPostCard post={post} detail/><div className="flex items-center justify-between border-b border-identity-border p-5"><h2 className="font-semibold">Replies</h2><NetworkGate action="Reply to this post"><button className="text-sm text-names-accent">Write a reply</button></NetworkGate></div><NetworkState query={replies} empty={!items.length && !replies.hasNextPage && 'No published replies yet.'}>{items.map(reply => <NetworkPostCard key={reply.id} post={reply}/>)}<NetworkMore query={replies}/></NetworkState></> : <p className="p-10 text-center text-identity-muted">This post is not publicly available.</p>}</NetworkState></>;
}