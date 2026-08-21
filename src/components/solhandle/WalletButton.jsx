import { useEffect } from "react";
import { Wallet } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { shortenAddress } from "@/lib/solhandle";

export default function WalletButton({ onConnected }) {
  const { publicKey, connecting } = useWallet();
  const { setVisible } = useWalletModal();
  const address = publicKey?.toBase58() || "";

  useEffect(() => { onConnected?.(address); }, [address, onConnected]);
  useEffect(() => {
    const openWallets = () => setVisible(true);
    window.addEventListener("solhandle:connect-wallet", openWallets);
    return () => window.removeEventListener("solhandle:connect-wallet", openWallets);
  }, [setVisible]);

  return <button onClick={() => setVisible(true)} className="inline-flex items-center gap-2 rounded-lg border border-cyan-300/70 bg-slate-950/70 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_18px_rgba(79,222,255,.12)] transition hover:border-violet-400"><Wallet className="h-4 w-4 text-emerald-300" />{connecting ? "Connecting" : address ? shortenAddress(address) : "Connect Wallet"}</button>;
}