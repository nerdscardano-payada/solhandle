import { useMemo, useState } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { BackpackWalletAdapter } from '@solana/wallet-adapter-backpack';
import '@solana/wallet-adapter-react-ui/styles.css';
export default function PartnerDevnetProvider({ children }) {
  const wallets = useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter({ network: 'devnet' }), new BackpackWalletAdapter()], []);
  const [error, setError] = useState('');
  return <ConnectionProvider endpoint="https://api.devnet.solana.com"><WalletProvider wallets={wallets} localStorageKey="solhandle-partner-devnet-wallet" autoConnect={true} onError={error => setError(error.message || 'Wallet connection failed. Open your wallet and try connecting again.')}><WalletModalProvider>{error && <p role="alert" className="mt-4 text-sm text-destructive">Wallet: {error}</p>}{children}</WalletModalProvider></WalletProvider></ConnectionProvider>;
}