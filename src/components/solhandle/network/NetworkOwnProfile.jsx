import { useNavigate } from 'react-router-dom';
import { useNetworkSession } from '@/components/solhandle/network/NetworkSessionProvider';
import NetworkSectionHeader from '@/components/solhandle/network/NetworkSectionHeader';
import NetworkState from '@/components/solhandle/network/NetworkState';
import LabProfile from '@/components/solhandle/network/lab/LabProfile';

export default function NetworkOwnProfile() {
  const session = useNetworkSession();
  const navigate = useNavigate();
  const openAccount = () => {
    const details = document.getElementById('account');
    if (!details) return;
    details.open = true;
    details.scrollIntoView({ block: 'start', behavior: 'auto' });
    details.querySelector('summary')?.focus();
  };
  return <div className="network-own-profile">
    <NetworkSectionHeader title="My profile"/>
    <NetworkState query={session.bootstrap}>
      {session.actorId ? <>
        {!session.ready && <div role="status" className="space-y-2 border-b border-identity-border p-5 text-sm text-identity-muted"><p>Your profile uses saved account data. Editing requires verified control of your wallet and current handle.</p><button type="button" onClick={openAccount} className="font-semibold text-names-accent">Verify my wallet & handle</button></div>}
        <LabProfile key={`${session.contextKey}:${session.actorId}`} own actorId={session.actorId} target={session.actorId} onBack={() => navigate('/network')} onProfile={id => navigate(`/network?profile=${encodeURIComponent(id)}`)} onConversation={id => navigate(`/network?post=${encodeURIComponent(id)}`)}/>
      </> : <section className="space-y-4 p-6"><h2 className="text-xl font-semibold">Your wallet. Your profile.</h2><p className="text-sm text-identity-muted">{session.address ? 'Choose or create your profile and verify an owned handle. Only this wallet’s profile will appear here.' : 'Connect your existing Solana wallet to find your profile and owned handles.'}</p><button type="button" onClick={openAccount} className="social-action social-action-secondary">{session.address ? 'Set up my profile' : 'Connect my wallet'}</button><p className="text-xs text-identity-muted">Private administrator preview. Public wallet-only login is not enabled.</p></section>}
    </NetworkState>
  </div>;
}