import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { CheckCircle2, Copy } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function OfficialClaimVerification({ claim }) {
  const { publicKey, signMessage } = useWallet();
  const [domainVerified, setDomainVerified] = useState(false); const [walletVerified, setWalletVerified] = useState(false); const [busy, setBusy] = useState(""); const [error, setError] = useState("");
  const checkDomain = async () => { setBusy("domain"); setError(""); try { const response = await base44.functions.invoke("verifyOfficialClaimDomain", { request_id: claim.requestId }); setDomainVerified(response.data.verified); } catch (caught) { setError(caught.response?.data?.error || caught.message); } finally { setBusy(""); } };
  const verifyWallet = async () => {
    setError("");
    if (!publicKey) { window.dispatchEvent(new Event("solhandle:connect-wallet")); return; }
    if (publicKey.toBase58() !== claim.recipientWallet) { setError("Connect the recipient wallet entered in the request."); return; }
    if (!signMessage) { setError("This wallet does not support message signing."); return; }
    setBusy("wallet");
    try { const bytes = await signMessage(new TextEncoder().encode(claim.message)); const signatureBase64 = btoa(String.fromCharCode(...bytes)); const response = await base44.functions.invoke("verifyOfficialClaimWallet", { request_id: claim.requestId, signature_base64: signatureBase64 }); setWalletVerified(response.data.verified); }
    catch (caught) { setError(caught.response?.data?.error || caught.message); } finally { setBusy(""); }
  };
  const complete = domainVerified && walletVerified;
  return <div className="space-y-4 text-sm"><div className="rounded-xl border border-cyan-300/20 bg-cyan-300/5 p-4"><p className="text-slate-300">Publish this exact value as DNS TXT at <b>_solhandle.{claim.domain}</b> or at <b>https://{claim.domain}/.well-known/solhandle-verification.txt</b></p><div className="mt-3 flex items-center gap-2 rounded-lg bg-black/30 p-3"><code className="min-w-0 flex-1 break-all text-cyan-200">{claim.challenge}</code><button onClick={() => navigator.clipboard.writeText(claim.challenge)} aria-label="Copy challenge"><Copy className="h-4 w-4"/></button></div></div><div className="grid gap-3 sm:grid-cols-2"><button onClick={checkDomain} disabled={busy || domainVerified} className="rounded-lg border border-cyan-300/30 px-4 py-3 disabled:opacity-60">{domainVerified ? <span className="inline-flex items-center gap-2 text-emerald-300"><CheckCircle2 className="h-4 w-4"/>Domain verified</span> : busy === "domain" ? "Checking…" : "Check domain"}</button><button onClick={verifyWallet} disabled={busy || walletVerified} className="rounded-lg border border-violet-300/30 px-4 py-3 disabled:opacity-60">{walletVerified ? <span className="inline-flex items-center gap-2 text-emerald-300"><CheckCircle2 className="h-4 w-4"/>Wallet verified</span> : busy === "wallet" ? "Signing…" : "Verify recipient wallet"}</button></div>{error && <p className="text-rose-300">{error}</p>}{complete && <p className="rounded-lg border border-emerald-300/20 bg-emerald-300/10 p-3 text-emerald-200">Both proofs are verified. The request is ready for administrator review.</p>}</div>;
}