import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { CheckCircle2, Copy } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function OfficialClaimVerification({ claim, step, onStepChange }) {
  const { publicKey, signMessage } = useWallet();
  const [busy, setBusy] = useState(""); const [error, setError] = useState("");
  const checkDomain = async () => { setBusy("domain"); setError(""); try { const response = await base44.functions.invoke("verifyOfficialClaimDomain", { request_id: claim.requestId }); if(response.data.verified) onStepChange(3); } catch (caught) { setError(caught.response?.data?.error || caught.message); } finally { setBusy(""); } };
  const verifyWallet = async () => {
    setError("");
    if (!publicKey) { window.dispatchEvent(new Event("solhandle:connect-wallet")); return; }
    if (publicKey.toBase58() !== claim.recipientWallet) { setError("Connect the recipient wallet entered in the request."); return; }
    if (!signMessage) { setError("This wallet does not support message signing."); return; }
    setBusy("wallet");
    try { const bytes = await signMessage(new TextEncoder().encode(claim.message)); const signatureBase64 = btoa(String.fromCharCode(...bytes)); const response = await base44.functions.invoke("verifyOfficialClaimWallet", { request_id: claim.requestId, signature_base64: signatureBase64 }); if(response.data.verified) onStepChange(4); }
    catch (caught) { setError(caught.response?.data?.error || caught.message); } finally { setBusy(""); }
  };
  if(step === 2) return <div className="space-y-4 text-sm"><div><h3 className="font-semibold text-white">Verify official domain</h3><p className="mt-1 text-slate-400">The approved domain for @{claim.handle || "this handle"} is <b className="text-white">{claim.domain}</b>. Your supporting profile URL does not change this domain.</p></div><div className="space-y-3 rounded-xl border border-cyan-300/20 bg-cyan-300/5 p-4"><p className="text-slate-300">Create one DNS record with these exact details:</p><CopyField label="Record type" value="TXT"/><CopyField label="Host / name" value={`_solhandle.${claim.domain}`}/><CopyField label="TXT value" value={claim.challenge}/><p className="text-xs leading-relaxed text-slate-400">Some DNS providers automatically append <b>{claim.domain}</b>. If yours does, enter only <b>_solhandle</b> as the host. Do not enter www.{claim.domain}.</p></div><div className="rounded-lg border border-white/10 p-3 text-xs text-slate-400">Alternative: publish only the TXT value at <b className="text-slate-200">https://{claim.domain}/.well-known/solhandle-verification.txt</b></div>{error && <p className="text-rose-300">{error}</p>}<button onClick={checkDomain} disabled={Boolean(busy)} className="w-full rounded-lg bg-gradient-to-r from-emerald-300 via-cyan-400 to-violet-500 py-3 font-semibold text-slate-950 disabled:opacity-60">{busy === "domain" ? "Checking domain…" : "Verify domain and continue"}</button></div>;
  if(step === 3) return <div className="space-y-4 text-sm"><div><h3 className="font-semibold text-white">Verify recipient wallet</h3><p className="mt-1 text-slate-400">Connect the recipient wallet and sign the claim message. This does not create a transaction.</p></div><div className="rounded-xl border border-violet-300/20 bg-violet-300/5 p-4"><span className="text-slate-400">Recipient wallet</span><code className="mt-2 block break-all text-violet-200">{claim.recipientWallet}</code></div>{error && <p className="text-rose-300">{error}</p>}<button onClick={verifyWallet} disabled={Boolean(busy)} className="w-full rounded-lg bg-gradient-to-r from-emerald-300 via-cyan-400 to-violet-500 py-3 font-semibold text-slate-950 disabled:opacity-60">{busy === "wallet" ? "Waiting for signature…" : "Sign message and continue"}</button></div>;
  return <div className="rounded-xl border border-emerald-300/20 bg-emerald-300/10 p-5 text-center"><CheckCircle2 className="mx-auto h-8 w-8 text-emerald-300"/><h3 className="mt-3 font-semibold text-white">Verification complete</h3><p className="mt-2 text-sm text-emerald-100/80">Both proofs are verified. Your request is ready for administrator review.</p></div>;
}

function CopyField({ label, value }) {
  return <div><span className="mb-1 block text-xs text-slate-400">{label}</span><div className="flex items-center gap-2 rounded-lg bg-black/30 p-3"><code className="min-w-0 flex-1 break-all text-cyan-200">{value}</code><button type="button" onClick={() => navigator.clipboard.writeText(value)} aria-label={`Copy ${label}`}><Copy className="h-4 w-4"/></button></div></div>;
}