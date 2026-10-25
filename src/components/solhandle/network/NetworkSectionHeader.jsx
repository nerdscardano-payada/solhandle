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
  return <header className="sd-page-title"><div><span className="sd-eyebrow">THE SOLHANDLE NETWORK</span><h1>{title}<span className="sd-title-dot">.</span></h1>{(label || loading || error) && <p>{label ? <span data-no-translate>{label}</span> : loading ? 'Loading…' : 'Identity unavailable'}</p>}</div><div className="social-actions"><NetworkPayPanel/>{posting && (session?.operator ? <Link to="/network?compose=1" className="social-action social-action-primary"><PenLine className="h-4 w-4"/>Post</Link> : <NetworkGate action="Create a post"><button type="button" className="social-action social-action-primary"><PenLine className="h-4 w-4"/>Post</button></NetworkGate>)}</div></header>;
}