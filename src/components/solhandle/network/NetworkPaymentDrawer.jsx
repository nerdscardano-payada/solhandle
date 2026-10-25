import { lazy, Suspense, useState } from 'react';
import { ContactRound, Send } from 'lucide-react';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import WalletButton from '@/components/solhandle/WalletButton';
import { useWallet } from '@solana/wallet-adapter-react';
import { useNetworkTheme } from '@/components/solhandle/network/NetworkThemeProvider';
import { useNetworkSession } from '@/components/solhandle/network/NetworkSessionProvider';
import useNetworkWalletContext from '@/components/solhandle/network/useNetworkWalletContext';
const Pay = lazy(() => import('@/pages/Pay'));
const ContactsWorkspace = lazy(() => import('@/components/solhandle/contacts/ContactsWorkspace'));

export default function NetworkPaymentDrawer({ children, showContacts = false, recipient = null, open: controlledOpen, onOpenChange, initialMode = 'pay', triggerClassName = 'social-action social-action-secondary' }) {
  const wallet = useWallet();
  const session = useNetworkSession();
  const contextKey = useNetworkWalletContext(session?.contextKey, wallet);
  const address = wallet.publicKey?.toBase58() || '';
  const { theme } = useNetworkTheme();
  const [panel, setPanel] = useState(null);
  const [openedContext, setOpenedContext] = useState(null);
  const active = panel?.contextKey === contextKey ? panel : null;
  const open = controlledOpen === undefined ? openedContext === contextKey : controlledOpen;
  const mode = active?.mode || initialMode;
  const contactSelection = active?.contactSelection || null;
  const choose = nextMode => setPanel({ contextKey, mode: nextMode, contactSelection: null });
  const changeOpen = value => { setOpenedContext(value ? contextKey : null); if (!value) setPanel(null); onOpenChange?.(value); };
  return <Sheet open={open} onOpenChange={changeOpen}>
    {controlledOpen === undefined && <SheetTrigger asChild>{children || <button type="button" onClick={() => choose('pay')} className={triggerClassName}><Send className="h-4 w-4"/>Pay</button>}</SheetTrigger>}
    {showContacts && <SheetTrigger asChild><button type="button" onClick={() => choose('contacts')} className={triggerClassName}><ContactRound className="h-4 w-4"/>My Contacts</button></SheetTrigger>}
    <SheetContent lang="en" translate="no" data-no-translate data-social-theme={theme} className="network-surface network-pay-drawer overflow-y-auto border-identity-border bg-hero-surface text-identity-text">
      <SheetHeader><SheetTitle className="text-identity-text">{mode === 'contacts' ? 'My Contacts' : 'SolHandle Pay'}</SheetTitle><SheetDescription className="text-identity-muted">{mode === 'contacts' ? 'Your existing private, wallet-linked address book. Saved wallets never follow a transferred handle.' : 'Review the recipient and amount, then confirm in your wallet. No payment is sent automatically.'}</SheetDescription></SheetHeader>
      <div className="my-4"><WalletButton/></div>
      {contactSelection && <button type="button" onClick={() => choose('contacts')} className="mb-4 text-sm text-names-accent">← My Contacts</button>}
      {open && <Suspense fallback={<p role="status" className="p-6 text-sm text-identity-muted">Loading {mode === 'contacts' ? 'Contacts' : 'Pay'}…</p>}>
        {mode === 'contacts' ? <ContactsWorkspace key={contextKey} onSendContact={(contact, ownerWallet) => { if (ownerWallet === address) setPanel({ contextKey, mode: 'pay', contactSelection: { contact, ownerWallet } }); }}/>
          : <Pay key={`${contextKey}:${contactSelection?.contact?.id || recipient?.bindingId || 'direct'}`} embedded networkRecipient={recipient} contactSelection={contactSelection} onChooseRecipient={recipient ? () => changeOpen(false) : undefined}/>}
      </Suspense>}
    </SheetContent>
  </Sheet>;
}