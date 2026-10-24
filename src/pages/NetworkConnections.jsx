import { useWallet } from '@solana/wallet-adapter-react';
import { Link } from 'react-router-dom';
import ContactsWorkspace from '@/components/solhandle/contacts/ContactsWorkspace';
export default function NetworkConnections() {
  const { publicKey } = useWallet();
  return <><header className="social-header"><div><h1>Netwerk</h1><p>Je contacten en connecties, op één plek.</p></div></header><nav aria-label="Netwerkonderdelen" className="flex flex-wrap gap-2 border-b border-identity-border p-4"><span aria-current="page" className="social-action bg-names-accent/10 text-names-accent">Contacten</span><button type="button" disabled title="Communities worden na goedkeuring van het ontwerp uitgewerkt." className="social-action text-identity-muted">Communities · later</button><Link className="social-action text-names-accent" to="/network/discover">Mensen & projecten</Link></nav><ContactsWorkspace key={publicKey?.toBase58() || 'disconnected'}/></>;
}