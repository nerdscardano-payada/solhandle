import { useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import { BackpackWalletAdapter } from "@solana/wallet-adapter-backpack";
import "@/lib/registerMobileWallet";
import "@/components/solhandle/android/registerNativeWallet";
import { isAndroidHost } from '@/components/solhandle/android/nativeTransport';
import WalletSessionGuard from '@/components/solhandle/WalletSessionGuard';
import { allowWalletReconnect, walletStorageKey } from '@/lib/walletConnectionPolicy';

const endpoint = "https://api.mainnet-beta.solana.com";

export default function SolanaWalletProvider({ children }) {
  const wallets = useMemo(() => isAndroidHost() ? [] : [new PhantomWalletAdapter(), new SolflareWalletAdapter(), new BackpackWalletAdapter()], []);
  return <ConnectionProvider endpoint={endpoint}><WalletProvider wallets={wallets} localStorageKey={walletStorageKey} autoConnect={allowWalletReconnect}><WalletSessionGuard><WalletModalProvider>{children}</WalletModalProvider></WalletSessionGuard></WalletProvider></ConnectionProvider>;
}