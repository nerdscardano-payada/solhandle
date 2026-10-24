import { lazy, Suspense, useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { ContactRound, Send } from 'lucide-react';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import WalletButton from '@/components/solhandle/WalletButton';
import { useNetworkTheme } from '@/components/solhandle/network/NetworkThemeProvider';
const Pay = lazy(() => import('@/pages/Pay'));
const ContactsWorkspace = lazy(() => import('@/components/solhandle/contacts/ContactsWorkspace'));

export default function NetworkProfilePaymentTools() {
  const { publicKey } = useWallet();
  const address = publicKey?.toBase58() || '';
  const { theme } = useNetworkTheme();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState('pay');
  const [contactSelection, setContactSelection] = useState(null);
  useEffect(() => { setContactSelection(null); }, [address]);
  const choose = value => { setMode(value); setContactSelection(null); };
  return <Sheet open={open} onOpenChange={setOpen}>
    <SheetTrigger asChild><button type="button" className="social-action social-action-secondary" onClick={() => choose('pay')}><Send className="h-4 w-4"/>Pay</button></SheetTrigger>
    <SheetTrigger asChild><button type="button" className="social-action social-action-secondary" onClick={() => choose('contacts')}><ContactRound className="h-4 w-4"/>My Contacts</button></SheetTrigger>
    <SheetContent data-social-theme={theme} className="network-surface network-pay-drawer overflow-y-auto border-identity-border text-identity-text">
      <SheetHeader><SheetTitle>{mode === 'pay' ? 'SolHandle Pay' : 'My Contacts'}</SheetTitle><SheetDescription>{mode === 'pay' ? 'Review the recipient, then confirm in your wallet. No payment is sent automatically.' : 'Your existing private, wallet-linked address book. Contacts never become public profile data.'}</SheetDescription></SheetHeader>
      <div className="my-4"><WalletButton/></div>
      {open && <Suspense fallback={<p role="status" className="p-6 text-sm text-identity-muted">Loading {mode === 'pay' ? 'Pay' : 'Contacts'}…</p>}>
        {mode === 'contacts' ? <ContactsWorkspace key={address} onSendContact={(contact, ownerWallet) => { setContactSelection({ contact, ownerWallet }); setMode('pay'); }}/>
          : <Pay key={`${address}:${contactSelection?.contact?.id || 'direct'}`} embedded contactSelection={contactSelection}/>}
      </Suspense>}
    </SheetContent>
  </Sheet>;
}