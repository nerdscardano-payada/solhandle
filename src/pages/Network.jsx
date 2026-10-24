import { useSearchParams } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import useNetworkPages from '@/components/solhandle/network/useNetworkPages';
import NetworkState from '@/components/solhandle/network/NetworkState';
import NetworkPostCard from '@/components/solhandle/network/NetworkPostCard';
import NetworkMore from '@/components/solhandle/network/NetworkMore';
import NetworkGate from '@/components/solhandle/network/NetworkGate';
import { useNetworkSession } from '@/components/solhandle/network/NetworkSessionProvider';
import NetworkOwnerView from '@/components/solhandle/network/NetworkOwnerView';
import NetworkSectionHeader from '@/components/solhandle/network/NetworkSectionHeader';
import NetworkDemoFeed from '@/components/solhandle/network/demo/NetworkDemoFeed';
export default function Network() {
  const [params, setParams] = useSearchParams();
  const following = params.get('feed') === 'following';
  const session = useNetworkSession();
  const feed = useNetworkPages('feed', {}, !following && !session?.operator);
  const posts = feed.data?.pages.flatMap(page => page.items) || [];
  if (session?.operator) return <NetworkOwnerView/>;
  return <><NetworkSectionHeader title="Home" posting/><nav aria-label="Tijdlijn" className="network-workspace-tabs flex gap-2 border-b border-identity-border p-3">{[['latest', 'Voor jou'], ['following', 'Volgend']].map(([value, label]) => <button key={value} type="button" onClick={() => setParams(value === 'following' ? { feed: 'following' } : {})} aria-pressed={following === (value === 'following')} className={`rounded-lg px-4 py-2 text-sm ${following === (value === 'following') ? 'bg-names-accent/10 font-semibold text-names-accent' : 'text-identity-muted'}`}>{label}</button>)}</nav><NetworkGate action="Een bericht plaatsen"><button type="button" className="network-public-composer m-4 flex w-[calc(100%-2rem)] items-center gap-3 rounded-xl border border-identity-border p-5 text-left text-sm text-identity-muted"><MessageSquare className="h-5 w-5 text-names-accent"/>Wat wil je delen?</button></NetworkGate>{following ? <section className="social-section space-y-4"><h2>Je gevolgde mensen op één plek</h2><p className="text-sm text-identity-muted">Een persoonlijke tijdlijn vereist een sociaal account. Publieke wallet-aanmelding is nog niet beschikbaar.</p><NetworkGate action="Je persoonlijke tijdlijn openen"/></section> : <><NetworkDemoFeed/><NetworkState query={feed}>{posts.map(post => <NetworkPostCard key={post.id} post={post}/>)}<NetworkMore query={feed}/></NetworkState></>}</>;
}