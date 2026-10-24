import { lazy, Suspense, useState } from 'react';
import { Send } from 'lucide-react';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import WalletButton from '@/components/solhandle/WalletButton';
import { useNetworkTheme } from '@/components/solhandle/network/NetworkThemeProvider';
const Pay = lazy(() => import('@/pages/Pay'));
export default function NetworkPayPanel({ children }) {
  const [open, setOpen] = useState(false);
  const { theme } = useNetworkTheme();
  return <Sheet open={open} onOpenChange={setOpen}><SheetTrigger asChild>{children || <button type="button" className="social-action social-action-secondary"><Send className="h-4 w-4"/>Betalen</button>}</SheetTrigger><SheetContent data-social-theme={theme} className="network-surface network-pay-drawer overflow-y-auto border-identity-border text-identity-text"><SheetHeader><SheetTitle>SolHandle Pay</SheetTitle><SheetDescription>Betaal naar een @handle. Controleer de ontvanger en bevestig zelf in je wallet.</SheetDescription></SheetHeader><div className="my-4"><WalletButton/></div>{open && <Suspense fallback={<p role="status" className="p-6 text-identity-muted">Betalen laden…</p>}><Pay embedded/></Suspense>}</SheetContent></Sheet>;
}