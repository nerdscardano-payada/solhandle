import useLabList from '@/components/solhandle/network/lab/useLabList';
import NetworkState from '@/components/solhandle/network/NetworkState';
import NetworkMore from '@/components/solhandle/network/NetworkMore';
export default function LabPeople({ actorId, target, direction, q = '', onProfile, hideEmpty = false }) {
  const query = useLabList(actorId, direction ? { action: 'relations', target, direction } : { action: 'people', q });
  const people = query.data?.pages.flatMap(page => page.items) || [];
  return <NetworkState query={query} empty={!hideEmpty && !people.length && !query.hasNextPage && 'No matching profiles yet.'}><div className="network-discover-grid p-5">{people.map(profile => <button key={profile.id} onClick={() => onProfile(profile.id)} className="network-person-card block w-full p-5 text-left"><span className="font-semibold text-names-accent">{profile.name}</span><span className="ml-3 text-xs text-identity-muted">{profile.kind} · Network</span><p className="mt-3 line-clamp-2 whitespace-pre-wrap text-sm text-identity-muted">{profile.bio || 'No bio added.'}</p></button>)}</div><NetworkMore query={query}/></NetworkState>;
}