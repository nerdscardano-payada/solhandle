import { useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function ReferralShareActions({ code, handle = code, wallet = "" }) {
  const [copied, setCopied] = useState(false); const link = `https://solhandle.io/?ref=${encodeURIComponent(String(code).replace(/^@/, "").toLowerCase())}`;
  const track = (platform) => { base44.analytics.track({ eventName: `referral_${platform.toLowerCase()}_click`, properties: { handle: String(handle).replace(/^@/, "") } }); if (wallet) base44.functions.invoke("referralPortal", { action: "share", wallet, handle, platform }).catch(() => null); };
  const copy = async () => { await navigator.clipboard.writeText(link); track("COPY"); setCopied(true); setTimeout(() => setCopied(false), 1800); };
  const message = "Your @ on Solana.\n\nMint your SolHandle and own your identity on Solana.";
  const shareX = () => { track("X"); window.open(`https://x.com/intent/tweet?${new URLSearchParams({ text: message, url: link })}`, "_blank", "noopener,noreferrer"); };
  const share = async () => { if (navigator.share) await navigator.share({ title: "SolHandle", text: message, url: link }); else await copy(); };
  return <div className="mt-5"><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Your referral link</p><div className="mt-2 break-all rounded-xl border border-cyan-300/20 bg-cyan-300/5 p-4 font-mono text-cyan-200">{link}</div><div className="mt-3 flex flex-wrap gap-3"><button onClick={copy} className="inline-flex items-center gap-2 rounded-lg bg-cyan-300 px-4 py-2.5 font-semibold text-slate-950">{copied ? <Check className="h-4 w-4"/> : <Copy className="h-4 w-4"/>}{copied ? "Link copied" : "Copy Link"}</button><button onClick={shareX} className="rounded-lg border border-white/15 px-4 py-2.5 font-semibold text-white">Share on X</button><button onClick={share} className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2.5 font-semibold text-white"><Share2 className="h-4 w-4"/>Share</button></div></div>;
}