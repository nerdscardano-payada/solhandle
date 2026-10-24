import { Link } from 'react-router-dom';
import { PenLine } from 'lucide-react';
import useProfileIdentity from '@/components/solhandle/profile/useProfileIdentity';
import { useNetworkSession } from '@/components/solhandle/network/NetworkSessionProvider';
import NetworkGate from '@/components/solhandle/network/NetworkGate';
import NetworkPayPanel from '@/components/solhandle/network/NetworkPayPanel';
export default function NetworkSectionHeader({ title = 'Home', posting = false }) {
  const session = useNetworkSession();
  const { identity, loading, error } = useProfileIdentity();
  const label = session?.profile?.handle || identity?.primaryHandle;
  return <header className="social-header"><div><h1>{title}</h1><p>{label ? <span data-no-translate>{label}</span> : loading ? 'Je identiteit laden…' : error ? 'Identiteit tijdelijk niet beschikbaar' : 'Jouw identiteit. Jouw netwerk.'}</p></div><div className="social-actions"><NetworkPayPanel/>{posting && (session?.operator ? <Link to="/network?compose=1" className="social-action social-action-primary"><PenLine className="h-4 w-4"/>Post maken</Link> : <NetworkGate action="Een bericht plaatsen"><button type="button" className="social-action social-action-primary"><PenLine className="h-4 w-4"/>Post maken</button></NetworkGate>)}</div></header>;
}