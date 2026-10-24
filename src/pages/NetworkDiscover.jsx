import { useSearchParams, Link } from 'react-router-dom';
import NetworkSearch from '@/components/solhandle/network/NetworkSearch';
import NetworkSectionHeader from '@/components/solhandle/network/NetworkSectionHeader';
import NetworkDiscoverResults from '@/components/solhandle/network/NetworkDiscoverResults';
export default function NetworkDiscover() {
  const [params] = useSearchParams();
  const q = (params.get('q') || '').slice(0, 80);
  return <><NetworkSectionHeader title="Ontdekken"/><div className="border-b border-identity-border p-5"><NetworkSearch key={q}/>{q ? <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-identity-muted"><p>Resultaten voor “{q}”</p><Link to="/network/discover" className="social-action text-names-accent">Zoekopdracht wissen</Link></div> : <p className="mt-3 text-sm text-identity-muted">Vind mensen, makers en projecten. Zoek ook in gepubliceerde berichten.</p>}</div><NetworkDiscoverResults key={q} q={q}/></>;
}