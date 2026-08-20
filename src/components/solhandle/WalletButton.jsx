import { useEffect, useState } from "react";
import { Wallet } from "lucide-react";
import { shortenAddress } from "@/lib/solhandle";

export default function WalletButton({ onConnected }) {
  const [wallet, setWallet] = useState("");
  useEffect(() => {
    const savedWallet = localStorage.getItem("solhandle_wallet");
    if (savedWallet) { setWallet(savedWallet); onConnected?.(savedWallet); }
  }, [onConnected]);
  const [busy, setBusy] = useState(false);
  async function connect() {
    const provider = window?.solana?.isPhantom ? window.solana : window?.solflare;
    if (!provider) return alert("Install Phantom or Solflare to connect a Solana wallet.");
    setBusy(true);
    try {
      const result = await provider.connect();
      const address = result.publicKey.toString();
      localStorage.setItem("solhandle_wallet", address);
      setWallet(address);
      onConnected?.(address);
    } catch (error) {
      if (!String(error?.message || "").toLowerCase().includes("rejected")) alert("Your wallet could not be connected. Please try again.");
    } finally { setBusy(false); }
  }
  return <button onClick={connect} className="inline-flex items-center gap-2 rounded-lg border border-cyan-300/70 bg-slate-950/70 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_18px_rgba(79,222,255,.12)] transition hover:border-violet-400"> <Wallet className="h-4 w-4 text-emerald-300" />{busy ? "Connecting" : wallet ? shortenAddress(wallet) : "Connect Wallet"}</button>;
}