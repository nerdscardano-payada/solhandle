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
  return <><header className="flex items-center gap-4 border-b border-identity-border px-4 py-3"><Link to="/network" className="text-sm text-names-accent">← Tijdlijn</Link><h1 className="text-lg font-semibold">Gesprek</h1></header><NetworkState query={query}>{post ? <><NetworkPostCard post={post} detail/><div className="flex items-center justify-between border-b border-identity-border px-4 py-3"><h2 className="text-sm font-semibold">Reacties</h2><NetworkGate action="Reageren"><button className="text-sm text-names-accent">Reageren</button></NetworkGate></div><div className="network-replies"><NetworkState query={replies} empty={!items.length && !replies.hasNextPage && 'Nog geen reacties.'}>{items.map(reply => <NetworkPostCard key={reply.id} post={reply}/>)}<NetworkMore query={replies}/></NetworkState></div></> : <p className="p-10 text-center text-identity-muted">Dit bericht is niet openbaar.</p>}</NetworkState></>;
}