import { useWallet } from '@solana/wallet-adapter-react';
import Header from '@/components/solhandle/Header';
import ContactsWorkspace from '@/components/solhandle/contacts/ContactsWorkspace';
export default function MyContacts() {
  const { publicKey } = useWallet();
  return <main className="min-h-screen bg-hero-canvas text-foreground"><div className="mx-auto min-h-screen max-w-7xl border-x border-border"><Header/><ContactsWorkspace key={publicKey?.toBase58() || 'disconnected'}/></div></main>;
}