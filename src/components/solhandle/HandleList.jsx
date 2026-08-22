import { Copy, ExternalLink } from "lucide-react";
import HandleCard from "@/components/solhandle/HandleCard";
import SetPrimaryButton from "@/components/solhandle/SetPrimaryButton";

export default function HandleList({ handles, wallet, loading, onPrimarySet }) {
  if (!wallet) return <div className="card-glow mt-9 text-slate-400">Connect your wallet to view your SolHandle portfolio.</div>;
  if (loading) return <div className="card-glow mt-9 text-slate-400">Verifying ownership on Solana…</div>;
  if (!handles.length) return <div className="card-glow mt-9 text-slate-400">No verified SolHandles were found for this wallet yet.</div>;
  return <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{handles.map(item => <article className="overflow-hidden rounded-2xl border border-cyan-300/20 bg-slate-950 shadow-xl shadow-cyan-950/20" key={item.handle}>
    <HandleCard handle={item.handle} display={item.display} to={`/${item.handle}`}/>
    <div className="p-5"><p className="text-xs uppercase tracking-wider text-emerald-300">{item.isPrimary ? "Primary SolHandle" : "Verified Core Asset"}</p><p className="mt-2 text-sm text-slate-400">Minted {item.mintedAt ? new Date(item.mintedAt).toLocaleDateString() : "on Solana"}</p><div className="mt-5 flex flex-wrap gap-4 text-sm"><button onClick={() => navigator.clipboard.writeText(item.display)} className="inline-flex items-center gap-1 text-cyan-200"><Copy className="h-4 w-4"/>Copy</button>{!item.isPrimary && <SetPrimaryButton handle={item.handle} onSuccess={onPrimarySet}/>}<a href={`/${item.handle}`} className="inline-flex items-center gap-1 text-violet-300"><ExternalLink className="h-4 w-4"/>Profile</a><a href={`https://explorer.solana.com/address/${item.asset}?cluster=devnet`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-slate-300"><ExternalLink className="h-4 w-4"/>Asset</a></div></div>
  </article>)}</div>;
}