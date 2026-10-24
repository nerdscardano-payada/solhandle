import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import LabProfileEdit from '@/components/solhandle/network/lab/LabProfileEdit';
import { useNetworkTheme } from '@/components/solhandle/network/NetworkThemeProvider';
import { useNetworkSession } from '@/components/solhandle/network/NetworkSessionProvider';

export default function NetworkProfileEditor({ actorId, profile, open, onOpenChange }) {
  const { theme } = useNetworkTheme();
  const session = useNetworkSession();
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent data-social-theme={theme} className="network-surface max-h-[90dvh] w-[calc(100%-2rem)] overflow-y-auto border-identity-border bg-hero-surface text-identity-text">
      <DialogHeader>
        <DialogTitle>Edit profile</DialogTitle>
        <DialogDescription className="text-identity-muted">Your real Network profile. Confirm changes with your existing verified wallet.</DialogDescription>
      </DialogHeader>
      {!session.ready && <p role="status" className="text-sm text-names-warning">Verify your wallet and current handle under Account management before saving changes.</p>}
      {open && <LabProfileEdit actorId={actorId} profile={profile} embedded onSaved={() => onOpenChange(false)}/>}
    </DialogContent>
  </Dialog>;
}