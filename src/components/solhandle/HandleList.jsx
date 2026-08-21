import { Copy, ExternalLink } from "lucide-react";
import { Image } from "@/components/ui/image";
import SetPrimaryButton from "@/components/solhandle/SetPrimaryButton";

export default function HandleList({ handles, wallet, loading, onPrimarySet }) {
  if (!wallet) return <div className="card-glow mt-9 text-slate-400">Connect your wallet to view your SolHandle portfolio.</div>;
  if (loading) return <div className="card-glow mt-9 text-slate-400">Verifying ownership on Solana…</div>;
  if (!handles.length) return <div className="card-glow mt-9 text-slate-400">No verified SolHandles were found for this wallet yet.</div>;
  return <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{handles.map(item => <article className="overflow-hidden rounded-2xl border border-cyan-300/20 bg-slate-950 shadow-xl shadow-cyan-950/20" key={item.handle}>
    <div className="relative aspect-[16/9] bg-slate-900"><Image src="https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/21d822722_image.png" alt={`SolHandle artwork for ${item.display}`} className="absolute inset-0 h-full w-full opacity-60" fittingType="fill"/><div className="absolute inset-0 grid place-items-center bg-slate-950/35"><h2 className="max-w-[85%] truncate text-3xl font-semibold text-white">{item.display}</h2></div></div>
    <div className="p-5"><p className="text-xs uppercase tracking-wider text-emerald-300">{item.isPrimary ? "Primary SolHandle" : "Verified Core Asset"}</p><p className="mt-2 text-sm text-slate-400">Minted {item.mintedAt ? new Date(item.mintedAt).toLocaleDateString() : "on Solana"}</p><div className="mt-5 flex flex-wrap gap-4 text-sm"><button onClick={() => navigator.clipboard.writeText(item.display)} className="inline-flex items-center gap-1 text-cyan-200"><Copy className="h-4 w-4"/>Copy</button>{!item.isPrimary && <SetPrimaryButton handle={item.handle} onSuccess={onPrimarySet}/>}<a href={`/${item.handle}`} className="inline-flex items-center gap-1 text-violet-300"><ExternalLink className="h-4 w-4"/>Profile</a><a href={`https://explorer.solana.com/address/${item.asset}?cluster=devnet`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-slate-300"><ExternalLink className="h-4 w-4"/>Asset</a></div></div>
  </article>)}</div>;
}