import useNetworkPages from '@/components/solhandle/network/useNetworkPages';
import NetworkState from '@/components/solhandle/network/NetworkState';
import NetworkPostCard from '@/components/solhandle/network/NetworkPostCard';
import NetworkMore from '@/components/solhandle/network/NetworkMore';

export default function NetworkPublicTimeline({ q = '' }) {
  const query = useNetworkPages('feed', { q });
  const posts = query.data?.pages.flatMap(page => page.items) || [];
  return <NetworkState query={query} empty={!posts.length && !query.hasNextPage && (q ? 'Geen passende openbare berichten.' : 'Nog geen openbare berichten. Alleen echt gepubliceerde berichten verschijnen hier.')}>
    {posts.map(post => <NetworkPostCard key={post.id} post={post}/>)}
    <NetworkMore query={query}/>
  </NetworkState>;
}