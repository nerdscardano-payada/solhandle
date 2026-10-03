import { useMemo, useState } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { BackpackWalletAdapter } from '@solana/wallet-adapter-backpack';
import { LOCAL_RPC } from '@/components/solhandle/bulk-local/localRpc';
export default function LocalBulkProvider({ children }) {
  const wallets = useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter(), new BackpackWalletAdapter()], []);
  const [error, setError] = useState('');
  return <ConnectionProvider endpoint={LOCAL_RPC}><WalletProvider wallets={wallets} autoConnect={false} localStorageKey="solhandle-bulk-local-wallet" onError={caught => setError(caught.message)}><WalletModalProvider>
    {error && <p role="alert" className="text-sm text-names-warning">{error}</p>}{children}
  </WalletModalProvider></WalletProvider></ConnectionProvider>;
}