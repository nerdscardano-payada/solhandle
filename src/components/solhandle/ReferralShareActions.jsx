import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function ReferralShareActions({ code, handle = code, wallet = "" }) {
  const [copied, setCopied] = useState(false); const link = `https://solhandle.io/?ref=${encodeURIComponent(String(code).replace(/^@/, "").toLowerCase())}`;
  const track = (platform) => { base44.analytics.track({ eventName: `referral_${platform.toLowerCase()}_click`, properties: { handle: String(handle).replace(/^@/, "") } }); if (wallet) base44.functions.invoke("referralPortal", { action: "share", wallet, handle, platform }).catch(() => null); };
  const copy = async () => { await navigator.clipboard.writeText(link); track("COPY"); setCopied(true); setTimeout(() => setCopied(false), 1800); };
  const share = () => { track("X"); const text = `Just claimed @${String(handle).replace(/^@/, "")} on SolHandle ⚡\n\nYour Solana wallet deserves a human-readable identity.\n\nClaim yours 👇`; window.open(`https://x.com/intent/tweet?${new URLSearchParams({ text, url: link })}`, "_blank", "noopener,noreferrer"); };
  return <div className="flex flex-wrap gap-3"><button onClick={share} className="rounded-lg bg-cyan-300 px-5 py-3 font-semibold text-slate-950">𝕏 Share & Earn</button><button onClick={copy} className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-5 py-3 font-semibold text-white">{copied ? <Check className="h-4 w-4"/> : <Copy className="h-4 w-4"/>}{copied ? "Link copied" : "Copy referral link"}</button></div>;
}