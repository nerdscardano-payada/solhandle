import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import PremiumDirectoryCard from "@/components/solhandle/PremiumDirectoryCard";
import PremiumDirectoryControls from "@/components/solhandle/PremiumDirectoryControls";

export default function PremiumHandleDirectory() {
  const [length, setLength] = useState(2); const [tier, setTier] = useState(""); const [category, setCategory] = useState(""); const [page, setPage] = useState(1);
  const [result, setResult] = useState({ handles: [], categories: [], hasMore: false }); const [loading, setLoading] = useState(true); const [error, setError] = useState(false);
  useEffect(() => { setLoading(true); setError(false); base44.functions.invoke("getPremiumDirectory", { length, tier, category, page }).then(({ data }) => setResult(data)).catch(() => { setError(true); setResult({ handles: [], categories: [], hasMore: false }); }).finally(() => setLoading(false)); }, [length, tier, category, page]);
  const changeLength = (value) => { setLength(value); setTier(""); setCategory(""); setPage(1); };
  const changeTier = (value) => { setTier(value); setPage(1); };
  const changeCategory = (value) => { setCategory(value); setPage(1); };
  return <div>
    <div className="max-w-3xl"><p className="text-sm font-medium tracking-wider text-cyan-300">PREMIUM HANDLE DIRECTORY</p><h1 className="mt-2 text-4xl font-semibold">Find a high-value short identity.</h1><p className="mt-3 text-slate-400">Ranked 2, 3 and 4-character handles, verified live against Solana and protected-name records.</p></div>
    <PremiumDirectoryControls length={length} tier={tier} category={category} categories={result.categories || []} onLength={changeLength} onTier={changeTier} onCategory={changeCategory}/>
    {loading ? <div className="card-glow mt-8 flex items-center gap-2 text-slate-400"><LoaderCircle className="h-4 w-4 animate-spin"/>Checking live availability…</div> : error ? <div className="card-glow mt-8 text-center text-rose-300">Live availability could not be verified. Please try again.</div> : result.handles?.length ? <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{result.handles.map((item) => <PremiumDirectoryCard key={item.handle} item={item}/>)}</div> : <div className="card-glow mt-8 text-center text-slate-400">No currently available handles in this selection.</div>}
    <div className="mt-8 flex justify-center gap-3"><button disabled={page === 1 || loading} onClick={() => setPage(page - 1)} className="rounded-lg border border-white/10 px-4 py-2 text-sm disabled:opacity-40">Previous</button><span className="px-3 py-2 text-sm text-slate-400">Page {page}</span><button disabled={!result.hasMore || loading} onClick={() => setPage(page + 1)} className="rounded-lg border border-white/10 px-4 py-2 text-sm disabled:opacity-40">Next</button></div>
  </div>;
}