import useNetworkPages from '@/components/solhandle/network/useNetworkPages';
import NetworkState from '@/components/solhandle/network/NetworkState';
import NetworkMore from '@/components/solhandle/network/NetworkMore';
import NetworkPostCard from '@/components/solhandle/network/NetworkPostCard';
import NetworkProfileAbout from '@/components/solhandle/network/NetworkProfileAbout';
import NetworkProfileIdentity from '@/components/solhandle/network/NetworkProfileIdentity';
export default function NetworkProfileContent({ profile, tab, onIdentity }) {
  const query = useNetworkPages('feed', { author: profile.id, kind: tab === 'replies' ? 'replies' : 'posts' }, ['posts', 'replies'].includes(tab));
  const posts = query.data?.pages.flatMap(page => page.items) || [];
  if (tab === 'identity') return <NetworkProfileIdentity profile={profile}/>;
  if (tab === 'about') return <NetworkProfileAbout profile={profile} onIdentity={onIdentity}/>;
  if (tab === 'media') return <p className="p-10 text-center text-sm text-identity-muted">Media publishing is not enabled. No media has been published.</p>;
  return <section className="sd-profile-feed" aria-label="Profile posts"><NetworkState query={query} empty={!posts.length && !query.hasNextPage && <div className="sd-empty"><h3>No published {tab} yet.</h3><p>Only posts published by this account appear here.</p></div>}>{posts.map(post => <NetworkPostCard key={post.id} post={post}/>)}<NetworkMore query={query}/></NetworkState></section>;
}