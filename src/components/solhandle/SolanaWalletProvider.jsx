import { useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import { BackpackWalletAdapter } from "@solana/wallet-adapter-backpack";
import "@/lib/registerMobileWallet";

const endpoint = "https://api.mainnet-beta.solana.com";

export default function SolanaWalletProvider({ children }) {
  const isAndroid = typeof navigator !== "undefined" && /Android/i.test(navigator.userAgent);
  const wallets = useMemo(() => isAndroid ? [] : [new PhantomWalletAdapter(), new SolflareWalletAdapter(), new BackpackWalletAdapter()], [isAndroid]);
  return <ConnectionProvider endpoint={endpoint}><WalletProvider wallets={wallets} autoConnect><WalletModalProvider>{children}</WalletModalProvider></WalletProvider></ConnectionProvider>;
}