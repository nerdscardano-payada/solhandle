import { useEffect, useRef, useState } from "react";
import { Wallet } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { base44 } from "@/api/base44Client";
import { shortenAddress } from "@/lib/solhandle";
import MobileWalletChooser from "@/components/solhandle/MobileWalletChooser";
import { currentWalletTarget, isMobileBrowser, isWalletBrowser } from "@/lib/mobileWalletLinks";

export default function WalletButton({ onConnected }) {
  const { publicKey, connecting, wallets, wallet: selectedWallet, select, connect } = useWallet();
  const { setVisible } = useWalletModal();
  const address = publicKey?.toBase58() || "";
  const [primaryHandle, setPrimaryHandle] = useState("");
  const [mobileChooserOpen, setMobileChooserOpen] = useState(false);
  const [walletTarget, setWalletTarget] = useState("");
  const autoConnectAttempted = useRef(false);
  const openWallets = (detail) => {
    if (isMobileBrowser() && !isWalletBrowser()) {
      setWalletTarget(currentWalletTarget(detail));
      setMobileChooserOpen(true);
    } else setVisible(true);
  };

  useEffect(() => {
    if (address) localStorage.setItem("solhandle_wallet", address);
    else localStorage.removeItem("solhandle_wallet");
    onConnected?.(address);
  }, [address, onConnected]);
  useEffect(() => {
    if (!address) { setPrimaryHandle(""); return; }
    let active = true;
    base44.functions.invoke("reverseResolveSolHandle", { address }).then((response) => { if (active) setPrimaryHandle(response.data.primaryHandle); }).catch(() => { if (active) setPrimaryHandle(""); });
    const updatePrimary = (event) => setPrimaryHandle(`@${String(event.detail || "").replace(/^@/, "")}`);
    window.addEventListener("solhandle:primary-set", updatePrimary);
    return () => { active = false; window.removeEventListener("solhandle:primary-set", updatePrimary); };
  }, [address]);
  useEffect(() => {
    const handleWalletRequest = (event) => openWallets(event.detail);
    window.addEventListener("solhandle:connect-wallet", handleWalletRequest);
    return () => window.removeEventListener("solhandle:connect-wallet", handleWalletRequest);
  });
  useEffect(() => {
    const pendingClaim = new URLSearchParams(window.location.search).has("claim");
    if (!pendingClaim || !isWalletBrowser() || publicKey || connecting || autoConnectAttempted.current) return;
    const installed = wallets.find(({ readyState }) => readyState === "Installed");
    if (!selectedWallet && installed) { select(installed.adapter.name); return; }
    if (selectedWallet) {
      autoConnectAttempted.current = true;
      connect().catch(() => setVisible(true));
    }
  }, [wallets, selectedWallet, publicKey, connecting, select, connect, setVisible]);

  return <><button onClick={() => openWallets()} className="inline-flex items-center gap-2 rounded-lg border border-cyan-300/70 bg-slate-950/70 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_18px_rgba(79,222,255,.12)] transition hover:border-violet-400"><Wallet className="h-4 w-4 text-emerald-300" />{connecting ? "Connecting" : primaryHandle || (address ? shortenAddress(address) : "Connect Wallet")}</button><MobileWalletChooser open={mobileChooserOpen} onOpenChange={setMobileChooserOpen} targetUrl={walletTarget || window.location.href} /></>;
}