import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useNetworkTheme } from '@/components/solhandle/network/NetworkThemeProvider';
import '@/components/solhandle/network/network-profile-parity.css';

export default function NetworkProfileDialog({ title, description, trigger, open, onOpenChange, children }) {
  const { theme } = useNetworkTheme();
  return <Dialog open={open} onOpenChange={onOpenChange}>{trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}<DialogContent data-mode={theme} data-social-theme={theme} className="network-surface sol-design sd-dialog-panel network-profile-dialog"><DialogHeader><DialogTitle>{title}</DialogTitle>{description && <DialogDescription>{description}</DialogDescription>}</DialogHeader>{children}</DialogContent></Dialog>;
}