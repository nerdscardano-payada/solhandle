import { useNavigate } from 'react-router-dom';
import useNetworkPages from '@/components/solhandle/network/useNetworkPages';
import NetworkProfileCard from '@/components/solhandle/network/NetworkProfileCard';
import NetworkPostCard from '@/components/solhandle/network/NetworkPostCard';
import NetworkState from '@/components/solhandle/network/NetworkState';
import NetworkMore from '@/components/solhandle/network/NetworkMore';
import LabPeople from '@/components/solhandle/network/lab/LabPeople';
import LabFeed from '@/components/solhandle/network/lab/LabFeed';
import { useNetworkSession } from '@/components/solhandle/network/NetworkSessionProvider';
export default function NetworkDiscoverResults({ q = '' }) {
  const session = useNetworkSession();
  const navigate = useNavigate();
  const actorId = session?.operator ? session.actorId : '';
  const profiles = useNetworkPages('profiles', { q }, !actorId);
  const posts = useNetworkPages('feed', { q }, Boolean(q.trim()) && !actorId);
  const people = profiles.data?.pages.flatMap(page => page.items) || [];
  const publications = posts.data?.pages.flatMap(page => page.items) || [];
  const onProfile = id => navigate(`/network?profile=${encodeURIComponent(id)}`);
  const onConversation = id => navigate(`/network?post=${encodeURIComponent(id)}`);
  return <><section className="social-section"><h2>Mensen & projecten</h2>{actorId ? <LabPeople actorId={actorId} q={q} onProfile={onProfile}/> : <NetworkState query={profiles} empty={!people.length && !profiles.hasNextPage && 'Nog geen passende openbare profielen.'}><div className="network-discover-grid">{people.map(profile => <NetworkProfileCard key={profile.id} profile={profile}/>)}</div><NetworkMore query={profiles}/></NetworkState>}</section>{q.trim() && <section className="social-section border-t border-identity-border"><h2>Berichten</h2>{actorId ? <LabFeed actorId={actorId} mode="latest" q={q} onProfile={onProfile} onConversation={onConversation}/> : <NetworkState query={posts} empty={!publications.length && !posts.hasNextPage && 'Geen passende openbare berichten.'}>{publications.map(post => <NetworkPostCard key={post.id} post={post}/>)}<NetworkMore query={posts}/></NetworkState>}</section>}</>;
}