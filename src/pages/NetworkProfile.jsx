import { useQuery } from '@tanstack/react-query';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { networkRead } from '@/components/solhandle/network/networkClient';
import NetworkState from '@/components/solhandle/network/NetworkState';
import NetworkProfileHeader from '@/components/solhandle/network/NetworkProfileHeader';
import NetworkProfileContent from '@/components/solhandle/network/NetworkProfileContent';
import NetworkProfileStats from '@/components/solhandle/network/NetworkProfileStats';
import NetworkProfileTabs from '@/components/solhandle/network/NetworkProfileTabs';
export default function NetworkProfile() {
  const { publicId } = useParams();
  const [params, setParams] = useSearchParams();
  const tab = ['posts', 'replies', 'media', 'about'].includes(params.get('tab')) ? params.get('tab') : 'posts';
  const query = useQuery({ queryKey: ['network', 'profile', publicId], queryFn: () => networkRead({ action: 'profile', id: publicId }), retry: 1 });
  const profile = query.data?.profile;
  return <NetworkState query={query}>{profile ? <><NetworkProfileHeader profile={profile}/><div className="network-profile-columns"><div className="min-w-0"><NetworkProfileTabs value={tab} onChange={value => setParams(value === 'posts' ? {} : { tab: value })}/><NetworkProfileContent key={`${profile.id}:${tab}`} profile={profile} tab={tab}/></div><NetworkProfileStats profile={profile}/></div></> : <div className="p-10"><h1 className="text-2xl font-semibold">Profile not available</h1><p className="mt-3 text-identity-muted">This account has no published Network profile. Owning or minting a handle does not automatically create one.</p><Link className="mt-5 block text-names-accent" to="/network/discover">Browse published profiles</Link></div>}</NetworkState>;
}