import NetworkProfileDialog from '@/components/solhandle/network/NetworkProfileDialog';
import LabProfileEdit from '@/components/solhandle/network/lab/LabProfileEdit';
import { useNetworkSession } from '@/components/solhandle/network/NetworkSessionProvider';

export default function NetworkProfileEditor({ actorId, profile, open, onOpenChange }) {
  const session = useNetworkSession();
  return <NetworkProfileDialog open={open} onOpenChange={onOpenChange} title="Edit profile" description="Your real Network profile. Confirm changes with your existing verified wallet.">
      {!session.ready && <p role="status" className="text-sm text-names-warning">Verify your wallet and current handle under Identity & account before saving changes.</p>}
      {open && <LabProfileEdit actorId={actorId} profile={profile} embedded onSaved={() => onOpenChange(false)}/>}
  </NetworkProfileDialog>;
}