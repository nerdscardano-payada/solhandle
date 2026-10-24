import { Link, useNavigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import ContactsWorkspace from '@/components/solhandle/contacts/ContactsWorkspace';
import LabPeople from '@/components/solhandle/network/lab/LabPeople';
import { useNetworkSession } from '@/components/solhandle/network/NetworkSessionProvider';

export default function NetworkConnectionsContent({ tab, query }) {
  const session = useNetworkSession();
  const { publicKey } = useWallet();
  const navigate = useNavigate();
  if (tab === 'contacts') return <ContactsWorkspace key={publicKey?.toBase58() || 'disconnected'}/>;
  if (!session.ready) return <div className="sd-empty"><h3>Your network starts with one connection.</h3><p>Social connections require an active, verified social profile. Your private address book remains available under Private contacts.</p><Link to="/network/me#account" className="sd-button sd-secondary">Identity & account</Link></div>;
  return <LabPeople actorId={session.actorId} target={session.actorId} q={query} direction={tab === 'following' ? 'following' : 'followers'} onProfile={id => navigate(`/network?profile=${encodeURIComponent(id)}`)}/>;
}