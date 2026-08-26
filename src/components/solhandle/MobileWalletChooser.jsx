import { ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { buildWalletBrowserUrl } from "@/lib/mobileWalletLinks";

const wallets = [
  { id: "phantom", name: "Phantom", accent: "border-violet-400/50 bg-violet-400/10" },
  { id: "solflare", name: "Solflare", accent: "border-amber-300/50 bg-amber-300/10" },
  { id: "backpack", name: "Backpack", accent: "border-rose-400/50 bg-rose-400/10" },
];

export default function MobileWalletChooser({ open, onOpenChange, targetUrl }) {
  const openWallet = (wallet) => { window.location.href = buildWalletBrowserUrl(wallet, targetUrl); };
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="border-cyan-300/30 bg-slate-950 text-white sm:max-w-sm"><DialogHeader><DialogTitle>Open in your wallet</DialogTitle><DialogDescription className="text-slate-400">Your current SolHandle page opens directly in the wallet browser.</DialogDescription></DialogHeader><div className="space-y-3">{wallets.map((wallet) => <button key={wallet.id} type="button" onClick={() => openWallet(wallet.id)} className={`flex w-full items-center justify-between rounded-xl border p-4 text-left font-semibold ${wallet.accent}`}><span>{wallet.name}</span><ExternalLink className="h-4 w-4" /></button>)}</div></DialogContent></Dialog>;
}