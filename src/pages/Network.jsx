import { useSearchParams, Link } from 'react-router-dom';
import { MessageSquare, ArrowUpRight } from 'lucide-react';
import useNetworkPages from '@/components/solhandle/network/useNetworkPages';
import NetworkState from '@/components/solhandle/network/NetworkState';
import NetworkPostCard from '@/components/solhandle/network/NetworkPostCard';
import NetworkMore from '@/components/solhandle/network/NetworkMore';
import NetworkGate from '@/components/solhandle/network/NetworkGate';
import NetworkDevelopmentAccess from '@/components/solhandle/network/NetworkDevelopmentAccess';
import NetworkBanner from '@/components/solhandle/network/NetworkBanner';
import { useNetworkSession } from '@/components/solhandle/network/NetworkSessionProvider';
import NetworkOwnerView from '@/components/solhandle/network/NetworkOwnerView';
export default function Network() {
  const [params, setParams] = useSearchParams();
  const following = params.get('feed') === 'following';
  const session = useNetworkSession();
  const feed = useNetworkPages('feed', {}, !following && !session?.operator);
  const posts = feed.data?.pages.flatMap(page => page.items) || [];
  if (session?.operator) return <NetworkOwnerView/>;
  return <><section className="network-intro network-feed-intro border-b border-identity-border p-6"><NetworkBanner compact/><p className="text-xs font-semibold uppercase tracking-[0.2em] text-names-accent">A new layer of identity</p><h1 className="mt-3 text-3xl font-semibold tracking-tight">Your @. Your identity. Your network.</h1><p className="mt-3 max-w-lg text-sm leading-relaxed text-identity-muted">The social layer built around the SolHandle you own. Explore public publications while member access is being built.</p><Link to="/network/discover" className="mt-5 inline-flex items-center gap-2 text-sm text-names-accent">Explore Network<ArrowUpRight className="h-4 w-4"/></Link></section><NetworkDevelopmentAccess/><div className="network-public-composer flex items-center justify-between gap-3 border-b border-identity-border px-5 py-5"><span className="flex items-center gap-3 text-sm text-identity-muted"><MessageSquare className="h-5 w-5 text-names-secondary"/>A thought, a project, a conversation.</span><NetworkGate action="Create a post"><button className="rounded-full border border-names-accent/40 px-4 py-2 text-sm text-names-accent">Post</button></NetworkGate></div><nav aria-label="Feed selection" className="network-content-tabs flex border-b border-identity-border">{['Latest', 'Following'].map(name => <button key={name} onClick={() => setParams(name === 'Following' ? { feed: 'following' } : {})} aria-pressed={following === (name === 'Following')} className={`flex-1 border-b-2 py-4 text-sm font-semibold ${following === (name === 'Following') ? 'border-names-accent text-names-accent' : 'border-transparent text-identity-muted'}`}>{name}</button>)}<Link to="/network/discover" className="flex-1 py-4 text-center text-sm font-semibold text-identity-muted">Discover</Link></nav>{following ? <div className="space-y-4 p-10 text-center"><h2 className="font-semibold">Your people, in chronological order.</h2><p className="text-sm text-identity-muted">Following needs your Network account. Wallet-native login and follows are not enabled yet.</p><NetworkGate action="Open your following feed"/></div> : <NetworkState query={feed} empty={!posts.length && !feed.hasNextPage ? 'No public posts yet. No simulated accounts or activity are shown.' : null}>{posts.map(post => <NetworkPostCard key={post.id} post={post}/>)}<NetworkMore query={feed}/></NetworkState>}</>;
}