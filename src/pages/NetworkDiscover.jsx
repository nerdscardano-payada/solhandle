import { useSearchParams, Link } from 'react-router-dom';
import NetworkSearch from '@/components/solhandle/network/NetworkSearch';
import NetworkSectionHeader from '@/components/solhandle/network/NetworkSectionHeader';
import NetworkDiscoverResults from '@/components/solhandle/network/NetworkDiscoverResults';
import NetworkProjectDirectory from '@/components/solhandle/network/projects/NetworkProjectDirectory';
export default function NetworkDiscover() {
  const [params] = useSearchParams();
  const q = (params.get('q') || '').slice(0, 80);
  return <><NetworkSectionHeader title="Discover"/><div className="border-b border-identity-border p-5"><NetworkSearch key={q}/>{q ? <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-identity-muted"><p>Results for “{q}”</p><Link to="/network/discover" className="social-action text-names-accent">Clear search</Link></div> : null}</div><NetworkProjectDirectory key={`projects:${q}`} q={q}/><NetworkDiscoverResults key={q} q={q}/></>;
}