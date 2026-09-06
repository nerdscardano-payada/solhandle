import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { shortenAddress } from "@/lib/solhandle";
import MobileWalletChooser from "@/components/solhandle/MobileWalletChooser";
import { currentWalletTarget, isMobileBrowser, isWalletBrowser } from "@/lib/mobileWalletLinks";
import { trackFunnel } from "@/lib/protocolAnalytics";

export default function WalletButton({ onConnected }) {
  const { user } = useAuth();
  const { publicKey, connecting, wallets, wallet: selectedWallet, select, connect, disconnect } = useWallet();
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
    if (address) { localStorage.setItem("solhandle_wallet", address); base44.analytics.track({ eventName: "referral_wallet_connected", properties: {} }); const pendingHandle = localStorage.getItem("solhandle_pending_handle") || ""; const trackedKey = `solhandle_wallet_tracked_${address}`; if (!sessionStorage.getItem(trackedKey)) { sessionStorage.setItem(trackedKey, "1"); trackFunnel("WALLET_CONNECTED", pendingHandle); } }
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

  const buttonClass = "inline-flex items-center gap-1.5 rounded-lg border border-cyan-300/70 bg-slate-950/70 px-2.5 py-1.5 text-xs font-semibold text-white shadow-[0_0_18px_rgba(79,222,255,.12)] transition hover:border-violet-400 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm";
  return <>{address ? <DropdownMenu><DropdownMenuTrigger className={buttonClass}><Wallet className="h-3.5 w-3.5 text-emerald-300 sm:h-4 sm:w-4" />{primaryHandle || shortenAddress(address)}<ChevronDown className="h-3.5 w-3.5 text-slate-400" /></DropdownMenuTrigger><DropdownMenuContent align="end" className="border-white/10 bg-slate-950 text-slate-200"><DropdownMenuItem asChild className="focus:bg-white/10 focus:text-white"><Link to="/my-handles">My Handles</Link></DropdownMenuItem><DropdownMenuItem asChild className="focus:bg-white/10 focus:text-white"><Link to="/earn">Referrals / Earnings</Link></DropdownMenuItem>{user?.role === "admin" && <><DropdownMenuSeparator className="bg-white/10" /><DropdownMenuItem asChild className="focus:bg-white/10 focus:text-white"><Link to="/admin">Admin</Link></DropdownMenuItem></>}<DropdownMenuSeparator className="bg-white/10" /><DropdownMenuItem onClick={() => disconnect()} className="gap-2 text-rose-300 focus:bg-white/10 focus:text-rose-200"><LogOut className="h-4 w-4" />Disconnect</DropdownMenuItem></DropdownMenuContent></DropdownMenu> : <button onClick={() => openWallets()} className={buttonClass}><Wallet className="h-3.5 w-3.5 text-emerald-300 sm:h-4 sm:w-4" />{connecting ? "Connecting" : "Connect Wallet"}</button>}<MobileWalletChooser open={mobileChooserOpen} onOpenChange={setMobileChooserOpen} targetUrl={walletTarget || window.location.href} /></>;
}