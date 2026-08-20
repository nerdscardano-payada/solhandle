import { CheckCircle2, Copy, ExternalLink, Wallet } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { lamportsToSol, shortenAddress } from "@/lib/solhandle";

export default function MintReadinessDialog({ open, onOpenChange, wallet, result }) {
  const handle = result?.handle || "";
  const copyHandle = () => navigator.clipboard.writeText(`@${handle}`);
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="border-cyan-300/30 bg-slate-950 text-white sm:max-w-md">
      <DialogHeader><DialogTitle>Review your claim</DialogTitle><DialogDescription className="text-slate-400">Confirm the handle, price, and receiving wallet before minting.</DialogDescription></DialogHeader>
      <div className="rounded-xl border border-cyan-300/25 bg-gradient-to-br from-cyan-300/10 via-slate-900/70 to-violet-400/10 p-4">
        <div className="flex items-center justify-between"><div><span className="text-xs text-cyan-100/70">Your SolHandle NFT</span><b className="block text-3xl">@{handle}</b></div><button onClick={copyHandle} className="rounded-md p-2 text-cyan-200 hover:bg-white/10" aria-label="Copy handle"><Copy className="h-4 w-4" /></button></div>
        <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/10 pt-4 text-sm"><div><span className="block text-slate-500">One-time price</span><b>{lamportsToSol(result?.priceLamports)} SOL</b></div><div><span className="block text-slate-500">Receives NFT</span><b>{shortenAddress(wallet)}</b></div></div>
      </div>
      <div className="space-y-3 text-sm text-slate-300"><p className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />Availability confirmed for @{handle}.</p><p className="flex gap-2"><Wallet className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />Your connected wallet will own this NFT directly.</p><p className="flex gap-2"><ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-violet-300" />Minting opens once the Devnet program and collection are deployed.</p></div>
      <button disabled className="w-full rounded-lg bg-white/10 py-3 text-sm font-semibold text-slate-400">Minting opens on Devnet</button>
    </DialogContent>
  </Dialog>;
}