import { LockKeyhole } from 'lucide-react';
import NetworkProfileDialog from '@/components/solhandle/network/NetworkProfileDialog';

export default function NetworkGate({ children, action = 'Participate in Network' }) {
  return <NetworkProfileDialog title={action} description="Public posts are already available to read. Public wallet sign-in is not available yet. Connecting a wallet does not sign you in to Social." trigger={children || <button type="button" className="sd-button sd-gradient">Sign in to Social</button>}><LockKeyhole size={28} aria-hidden="true"/><p>Participation requires a verified wallet and your own SolHandle. No additional wallet is created and no email workaround is required. This action becomes available only after secure account sign-in is ready.</p></NetworkProfileDialog>;
}