import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Check, Clock3, LoaderCircle, Search, ShieldAlert, Wallet } from "lucide-react";
import invokeWithRetry from "@/lib/invokeWithRetry";
import { base44 } from "@/api/base44Client";
import useMintLaunch from "@/hooks/useMintLaunch";
import { lamportsToSol, normalizeHandle, validateHandle } from "@/lib/solhandle";
import MintBackground from "@/components/solhandle/MintBackground";
import MintReadinessDialog from "@/components/solhandle/MintReadinessDialog";
import OfficialClaimDialog from "@/components/solhandle/OfficialClaimDialog";

export default function HandleSearch({ wallet }) {
  const urlParams = new URLSearchParams(window.location.search);
  const pendingClaim = normalizeHandle(urlParams.get("claim") || "");
  const resumeClaimId = urlParams.get("official_claim") || "";
  const [input, setInput] = useState(pendingClaim || ""); const [result, setResult] = useState(null); const [showClaim, setShowClaim] = useState(false); const [showOfficialClaim, setShowOfficialClaim] = useState(false); const handle = normalizeHandle(input);
  const launch = useMintLaunch();
  useEffect(() => {
    if (pendingClaim) return;
    invokeWithRetry("getRandomAvailablePremium", {})
      .then((res) => { if (res.data?.handle) setInput((current) => current || res.data.handle); })
      .catch(() => null);
  }, [pendingClaim]);
  useEffect(() => {
    const invalid = validateHandle(handle);
    if (invalid) {
      setResult({ state: "invalid", message: invalid });
      return;
    }

    let active = true;
    setResult({ state: "checking", handle });
    const timer = setTimeout(async () => {
      try {
        const res = await invokeWithRetry("getHandleAvailability", { handle });
        if (active && res.data?.handle === handle) { setResult(res.data); base44.analytics.track({ eventName: "referral_handle_searched", properties: { available: Boolean(res.data.available) } }); }
      } catch {
        if (active) setResult({ handle, display: `@${handle}`, available: false, status: "UNAVAILABLE", state: "unavailable" });
      }
    }, 280);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [handle]);
  useEffect(() => {
    if (!launch.isLive || !pendingClaim || !wallet || !result?.available || result.handle !== pendingClaim) return;
    setShowClaim(true);
    const url = new URL(window.location.href); url.searchParams.delete("claim"); window.history.replaceState({}, "", url);
  }, [launch.isLive, pendingClaim, wallet, result]);
  useEffect(() => {
    if (!resumeClaimId || !pendingClaim || result?.status !== "RESERVED" || result.handle !== pendingClaim) return;
    setShowOfficialClaim(true);
  }, [resumeClaimId, pendingClaim, result]);
  const available = result?.available; const reserved = result?.status === "RESERVED"; const claimed = result?.status === "CLAIMED"; const price = lamportsToSol(result?.priceLamports);
  const rarity = handle.length === 1 ? "Legendary" : handle.length === 2 ? "Ultra Rare" : handle.length === 3 ? "Rare" : handle.length === 4 ? "Uncommon" : handle.length >= 5 ? "Standard" : "";
  return <><section className="relative overflow-hidden rounded-2xl border border-cyan-300/60 bg-slate-950/75 p-5 shadow-2xl shadow-cyan-400/20 backdrop-blur-xl"><MintBackground /><div className="relative z-10"><h2 className="mb-4 text-xl font-semibold text-white">Find your SolHandle</h2><label className="flex items-center rounded-xl border border-cyan-300/50 bg-slate-900/80 px-4 py-3 shadow-[0_0_18px_rgba(88,220,255,.12)]"><Search className="mr-3 h-4 w-4 text-slate-400"/><span className="mr-1 text-slate-400">@</span><input value={input} onChange={e=>setInput(e.target.value)} className="w-full bg-transparent text-white outline-none" aria-label="Search handle"/><span className="text-xs text-slate-500">{handle.length}/20</span></label><div className="mt-4 rounded-xl border border-white/10 bg-slate-900/60 p-4">{result?.state === "checking" ? <div className="flex items-center gap-3 text-slate-400"><LoaderCircle className="animate-spin"/> Checking on-chain index…</div> : result?.state === "invalid" ? <div className="flex gap-3 text-rose-300"><ShieldAlert/> {result.message}</div> : <div className="flex items-center justify-between"><div className="flex gap-3"><span className={`grid h-10 w-10 place-items-center rounded-full ${available ? "bg-emerald-400/15 text-emerald-300" : "bg-violet-400/15 text-violet-300"}`}>{available ? <Check/> : <ShieldAlert/>}</span><div><b className="block text-lg text-white">@{handle || "—"}</b><span className={available ? "text-emerald-300" : "text-violet-300"}>{available ? "is available!" : result?.status === "RESERVED" ? "is reserved for an official claim" : result?.status === "PROTECTED" ? "is a protected brand name" : result?.status === "UNAVAILABLE" ? "could not be verified" : "is already claimed"}</span>{(rarity || result?.nameClass === "Premium") && <div className="mt-2 flex flex-wrap items-center gap-2">{rarity && <span className="inline-flex h-6 items-center rounded-full border border-cyan-300/30 bg-cyan-300/10 px-2.5 text-[11px] font-semibold tracking-wide text-cyan-200">✦ {rarity.replaceAll("_", " ")}</span>}{result?.nameClass === "Premium" && <span className="inline-flex h-6 items-center rounded-full border border-violet-300/40 bg-violet-400/10 px-2.5 text-[11px] font-semibold tracking-wide text-violet-200 shadow-[0_0_12px_rgba(167,139,250,.2)]">◆ PREMIUM</span>}</div>}</div></div>{available && <div className="text-right"><span className="block text-xs text-slate-400">Price</span><b className="text-lg text-white">{price} SOL</b></div>}</div>}</div>{result?.categories?.length > 0 && <div className="mt-3 flex flex-wrap items-center gap-2"><span className="text-xs text-slate-500">Categories</span>{result.categories.map((category)=><span key={category} className="rounded-full border border-white/10 px-2 py-1 text-xs capitalize text-slate-300">{category}</span>)}{result.handleScore && <span className="ml-auto text-xs text-cyan-200">Handle Score {result.handleScore}/100</span>}</div>}{result?.handleScore && <p className="mt-2 text-xs text-slate-500">Handle Score reflects memorability and relevance, not financial value.</p>}{!launch.isLive && !reserved && !claimed && <div className="mt-4 rounded-xl border border-cyan-300/20 bg-cyan-300/[0.06] px-4 py-3 text-center"><span className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-200"><Clock3 className="h-4 w-4"/>Public mint launches in</span><b className="mt-1 block font-mono text-lg text-white">{launch.days}d {launch.hours}h {launch.minutes}m {launch.seconds}s</b><span className="text-xs text-slate-400">{launch.launchLabel} · your local time</span></div>}{reserved ? <button onClick={() => setShowOfficialClaim(true)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-emerald-300 via-cyan-400 to-violet-500 py-3 font-semibold text-slate-950"><ShieldAlert className="h-4 w-4"/>Request official claim</button> : claimed ? <Link to={`/${handle}`} className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-cyan-300/30 bg-cyan-300/10 py-3 font-semibold text-cyan-100">View @{handle}</Link> : <button disabled={!available || !launch.isLive} onClick={() => launch.isLive && (wallet ? setShowClaim(true) : window.dispatchEvent(new CustomEvent("solhandle:connect-wallet", { detail: { action: "claim", handle } })))} className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-emerald-300 via-cyan-400 to-violet-500 py-3 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"><Wallet className="h-4 w-4"/>{!launch.isLive ? "Minting opens at launch" : available ? `Claim @${handle} · ${price} SOL` : "Handle unavailable"}</button>}<p className="mt-3 text-center text-xs text-slate-400">One-time payment. No renewals. Yours until you transfer it.</p></div></section><MintReadinessDialog open={showClaim} onOpenChange={setShowClaim} wallet={wallet} result={result}/><OfficialClaimDialog open={showOfficialClaim} onOpenChange={setShowOfficialClaim} handle={handle} restriction={result?.restriction} resumeRequestId={resumeClaimId}/></>;
}