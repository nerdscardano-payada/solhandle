import useNetworkPages from '@/components/solhandle/network/useNetworkPages';
import NetworkProfileCard from '@/components/solhandle/network/NetworkProfileCard';
import NetworkState from '@/components/solhandle/network/NetworkState';
import NetworkMore from '@/components/solhandle/network/NetworkMore';
import NetworkSearch from '@/components/solhandle/network/NetworkSearch';
import NetworkBanner from '@/components/solhandle/network/NetworkBanner';
export default function NetworkDiscover() {
  const query = useNetworkPages('profiles');
  const profiles = query.data?.pages.flatMap(page => page.items) || [];
  return <><header className="network-intro space-y-4 border-b border-identity-border p-6"><NetworkBanner compact/><p className="text-xs uppercase tracking-widest text-names-secondary">People · Creators · Projects</p><h1 className="text-3xl font-semibold">Discover Network</h1><p className="text-sm leading-relaxed text-identity-muted">Published profiles, sorted by name. Engagement ranking will only be introduced when real member interactions are enabled; $HANDLE balances will not influence it.</p><NetworkSearch/></header><NetworkState query={query} empty={!profiles.length && 'No public profiles have been published yet.'}><div className="network-discover-grid p-5">{profiles.map(profile => <NetworkProfileCard key={profile.id} profile={profile}/>)}</div><NetworkMore query={query}/></NetworkState></>;
}