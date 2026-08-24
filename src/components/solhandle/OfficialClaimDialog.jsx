import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { base44 } from "@/api/base44Client";

const emptyForm = { organization: "", contact_name: "", contact_email: "", proof_url: "", recipient_wallet: "", statement: "" };

export default function OfficialClaimDialog({ open, onOpenChange, handle, restriction }) {
  const [form, setForm] = useState(emptyForm);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));
  const submit = async (event) => {
    event.preventDefault(); setSending(true); setError("");
    try {
      await base44.entities.OfficialClaimRequest.create({ ...form, handle, reserved_for: restriction?.reservedFor || "", status: "pending" });
      setSent(true); setForm(emptyForm);
    } catch (caught) { setError(caught.message || "Your request could not be submitted."); }
    finally { setSending(false); }
  };
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="border-cyan-300/30 bg-slate-950 text-white sm:max-w-lg"><DialogHeader><DialogTitle>Official claim for @{handle}</DialogTitle><DialogDescription className="text-slate-400">Submit proof that you represent {restriction?.reservedFor || "the reserved organization"}. A protocol administrator will review it.</DialogDescription></DialogHeader>{sent ? <div className="rounded-xl border border-emerald-300/25 bg-emerald-300/10 p-5 text-sm text-emerald-200">Request received. We will review the submitted proof before the NFT can be minted.</div> : <form onSubmit={submit} className="space-y-3"><input required value={form.organization} onChange={update("organization")} placeholder="Organization" className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2.5"/><div className="grid gap-3 sm:grid-cols-2"><input required value={form.contact_name} onChange={update("contact_name")} placeholder="Contact name" className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2.5"/><input required type="email" value={form.contact_email} onChange={update("contact_email")} placeholder="Work email" className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2.5"/></div><input required type="url" value={form.proof_url} onChange={update("proof_url")} placeholder="Proof URL (official website or profile)" className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2.5"/><input required value={form.recipient_wallet} onChange={update("recipient_wallet")} placeholder="Recipient Solana wallet" className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2.5 font-mono text-sm"/><textarea required value={form.statement} onChange={update("statement")} placeholder="Explain your authority to claim this handle" rows={3} className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2.5"/>{error && <p className="text-sm text-rose-300">{error}</p>}<button disabled={sending} className="w-full rounded-lg bg-gradient-to-r from-emerald-300 via-cyan-400 to-violet-500 py-3 font-semibold text-slate-950 disabled:opacity-50">{sending ? "Submitting…" : "Submit for review"}</button></form>}</DialogContent></Dialog>;
}