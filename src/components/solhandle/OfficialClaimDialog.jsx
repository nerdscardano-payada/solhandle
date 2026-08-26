import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { base44 } from "@/api/base44Client";
import OfficialClaimVerification from "@/components/solhandle/OfficialClaimVerification";
import ClaimWizardProgress from "@/components/solhandle/ClaimWizardProgress";

const emptyForm = { organization: "", contact_name: "", contact_email: "", proof_url: "", recipient_wallet: "", statement: "" };
export default function OfficialClaimDialog({ open, onOpenChange, handle, restriction, resumeRequestId }) {
  const [form, setForm] = useState(emptyForm); const [claim, setClaim] = useState(null); const [step, setStep] = useState(1); const [sending, setSending] = useState(false); const [error, setError] = useState("");
  const storageKey = `solhandle_official_claim_${handle}`;
  useEffect(() => {
    if (!open || claim) return;
    const requestId = resumeRequestId || localStorage.getItem(storageKey);
    if (!requestId) return;
    setSending(true); setError("");
    base44.functions.invoke("startOfficialClaim", { resume_request_id: requestId }).then((response) => {
      const restored = response.data;
      setClaim({ ...restored, recipientWallet: restored.recipientWallet });
      setStep(restored.status === "verified" ? 4 : restored.status === "domain_verified" ? 3 : 2);
      localStorage.setItem(storageKey, restored.requestId);
    }).catch((caught) => {
      localStorage.removeItem(storageKey);
      setError(caught.response?.data?.error || caught.message || "Your request could not be restored.");
    }).finally(() => setSending(false));
  }, [open, claim, resumeRequestId, storageKey]);
  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));
  const submit = async (event) => {
    event.preventDefault(); setSending(true); setError("");
    try { const response = await base44.functions.invoke("startOfficialClaim", { ...form, handle, reserved_for: restriction?.reservedFor || "" }); localStorage.setItem(storageKey, response.data.requestId); setClaim({ ...response.data, handle, recipientWallet: form.recipient_wallet }); setStep(2); }
    catch (caught) { setError(caught.response?.data?.error || caught.message || "Your request could not be started."); }
    finally { setSending(false); }
  };
  const changeOpen = (value) => { if (!value) { setForm(emptyForm); setClaim(null); setStep(1); setError(""); } onOpenChange(value); };
  return <Dialog modal={false} open={open} onOpenChange={changeOpen}><DialogContent className="max-h-[90vh] overflow-y-auto border-cyan-300/30 bg-slate-950 text-white sm:max-w-lg"><DialogHeader><DialogTitle>Official claim for @{handle}</DialogTitle><DialogDescription className="text-slate-400">Complete all four secure verification steps before review.</DialogDescription></DialogHeader><ClaimWizardProgress currentStep={step}/>{claim ? <OfficialClaimVerification claim={claim} step={step} onStepChange={setStep}/> : <form onSubmit={submit} className="space-y-3"><input required value={form.organization} onChange={update("organization")} placeholder="Organization" className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2.5"/><div className="grid gap-3 sm:grid-cols-2"><input required value={form.contact_name} onChange={update("contact_name")} placeholder="Contact name" className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2.5"/><input required type="email" value={form.contact_email} onChange={update("contact_email")} placeholder="Work email" className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2.5"/></div><input required type="url" value={form.proof_url} onChange={update("proof_url")} placeholder="Supporting profile URL (does not select the DNS domain)" className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2.5"/><input required value={form.recipient_wallet} onChange={update("recipient_wallet")} placeholder="Recipient Solana wallet" className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2.5 font-mono text-sm"/><textarea required value={form.statement} onChange={update("statement")} placeholder="Explain your authority to claim this handle" rows={3} className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2.5"/>{error && <p className="text-sm text-rose-300">{error}</p>}<button disabled={sending} className="w-full rounded-lg bg-gradient-to-r from-emerald-300 via-cyan-400 to-violet-500 py-3 font-semibold text-slate-950 disabled:opacity-50">{sending ? "Creating secure challenge…" : "Start secure verification"}</button></form>}</DialogContent></Dialog>;
}