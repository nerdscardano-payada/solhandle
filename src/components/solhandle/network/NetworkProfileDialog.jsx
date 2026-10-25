import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useNetworkTheme } from '@/components/solhandle/network/NetworkThemeProvider';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import '@/components/solhandle/network/network-profile-parity.css';

export default function NetworkProfileDialog({ title, description, trigger, open, onOpenChange, children }) {
  const { theme } = useNetworkTheme();
  const { visible: walletSelectionOpen } = useWalletModal();
  return <Dialog open={open} onOpenChange={onOpenChange} modal={!walletSelectionOpen}>{trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}<DialogContent onInteractOutside={event => { if (walletSelectionOpen) event.preventDefault(); }} lang="en" translate="no" data-no-translate data-mode={theme} data-social-theme={theme} className="network-surface sol-design sd-dialog-panel network-profile-dialog"><DialogHeader><DialogTitle>{title}</DialogTitle>{description && <DialogDescription>{description}</DialogDescription>}</DialogHeader>{children}</DialogContent></Dialog>;
}