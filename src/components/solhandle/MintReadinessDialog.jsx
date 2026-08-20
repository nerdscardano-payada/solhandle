import { CheckCircle2, Copy, ExternalLink, Wallet } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { lamportsToSol, shortenAddress } from "@/lib/solhandle";

export default function MintReadinessDialog({ open, onOpenChange, wallet, result }) {
  const handle = result?.handle || "";
  const copyHandle = () => navigator.clipboard.writeText(`@${handle}`);

  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="border-cyan-300/30 bg-slate-950 text-white sm:max-w-md">
      <DialogHeader><DialogTitle>Claim prepared</DialogTitle><DialogDescription className="text-slate-400">Your claim details are ready for the Devnet launch.</DialogDescription></DialogHeader>
      <div className="rounded-xl border border-cyan-300/20 bg-slate-900/70 p-4">
        <div className="flex items-center justify-between"><div><span className="text-xs text-slate-400">SolHandle</span><b className="block text-2xl">@{handle}</b></div><button onClick={copyHandle} className="rounded-md p-2 text-cyan-200 hover:bg-white/10" aria-label="Copy handle"><Copy className="h-4 w-4" /></button></div>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm"><div><span className="block text-slate-500">Price</span><b>{lamportsToSol(result?.priceLamports)} SOL</b></div><div><span className="block text-slate-500">Wallet</span><b>{shortenAddress(wallet)}</b></div></div>
      </div>
      <div className="space-y-3 text-sm text-slate-300"><p className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />Handle availability checked.</p><p className="flex gap-2"><Wallet className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />Wallet connected and ready to sign.</p><p className="flex gap-2"><ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-violet-300" />Minting activates after the Devnet program and collection are deployed.</p></div>
    </DialogContent>
  </Dialog>;
}