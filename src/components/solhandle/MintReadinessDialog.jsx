import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Copy, ExternalLink, Wallet } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { base44 } from "@/api/base44Client";
import { mintSolHandle } from "@/lib/mintSolHandle";
import { buildHandlePngBlob } from "@/lib/buildHandlePng";
import MintProgress from "@/components/solhandle/MintProgress";
import { lamportsToSol, shortenAddress } from "@/lib/solhandle";

export default function MintReadinessDialog({ open, onOpenChange, wallet, result }) {
  const { publicKey, sendTransaction } = useWallet();
  const navigate = useNavigate();
  const [phase, setPhase] = useState("");
  const [signature, setSignature] = useState("");
  const [error, setError] = useState("");
  const handle = result?.handle || "";
  const minting = phase === "metadata" || phase === "wallet";

  const mint = async () => {
    setError("");
    setSignature("");
    setPhase("metadata");
    try {
      const png = await buildHandlePngBlob(handle);
      const { file_url } = await base44.integrations.Core.UploadFile({ file: png });
      const upload = await base44.functions.invoke("uploadProtocolMetadata", { handle, image_url: file_url });
      setPhase("wallet");
      const mintResult = await mintSolHandle({ handle, uri: upload.data.uri, maxPriceLamports: result.priceLamports, wallet: publicKey, sendTransaction });
      setSignature(mintResult.signature);
      setPhase("confirmed");
      await base44.functions.invoke("syncSolHandleIndex", { signature: mintResult.signature }).catch(() => null);
      const params = new URLSearchParams({ handle, signature: mintResult.signature, asset: mintResult.asset, wallet: publicKey.toBase58() });
      navigate(`/mint-success?${params.toString()}`);
    } catch (caught) {
      setPhase("");
      setError(caught.response?.data?.error || caught.message || "Minting failed. Please try again.");
    }
  };

  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="border-cyan-300/30 bg-slate-950 text-white sm:max-w-md"><DialogHeader><DialogTitle>Review your Mainnet Beta claim</DialogTitle><DialogDescription className="text-slate-400">Your wallet will approve the on-chain NFT mint.</DialogDescription></DialogHeader><div className="rounded-xl border border-cyan-300/25 bg-gradient-to-br from-cyan-300/10 via-slate-900/70 to-violet-400/10 p-4"><div className="flex items-center justify-between"><div><span className="text-xs text-cyan-100/70">Your SolHandle NFT</span><b className="block text-3xl">@{handle}</b></div><button onClick={() => navigator.clipboard.writeText(`@${handle}`)} className="rounded-md p-2 text-cyan-200" aria-label="Copy handle"><Copy className="h-4 w-4" /></button></div><div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/10 pt-4 text-sm"><div><span className="block text-slate-500">Mainnet Beta price</span><b>{lamportsToSol(result?.priceLamports)} SOL</b></div><div><span className="block text-slate-500">Receives NFT</span><b>{shortenAddress(wallet)}</b></div></div></div><div className="space-y-3 text-sm text-slate-300"><p className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />Availability confirmed for @{handle}.</p><p className="flex gap-2"><Wallet className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />The NFT is minted directly to your connected wallet.</p><MintProgress phase={phase} error={error}/>{signature && <a className="flex items-center gap-2 text-violet-300 underline" href={`https://explorer.solana.com/tx/${signature}?cluster=mainnet-beta`} target="_blank" rel="noreferrer"><ExternalLink className="h-4 w-4" />View transaction</a>}</div><button disabled={!publicKey || Boolean(signature) || minting} onClick={mint} className="w-full rounded-lg bg-gradient-to-r from-emerald-300 via-cyan-400 to-violet-500 py-3 text-sm font-semibold text-slate-950 disabled:opacity-50">{signature ? "Minted on Mainnet Beta" : minting ? "Minting…" : "Mint on Mainnet Beta"}</button></DialogContent></Dialog>;
}