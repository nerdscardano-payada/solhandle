import { useState } from "react";
import { Send } from "lucide-react";

export default function LoungeComposer({ disabled, onSend }) {
  const [body, setBody] = useState(""); const submit = (event) => { event.preventDefault(); if (!body.trim() || disabled) return; onSend({ body: body.trim() }); setBody(""); };
  return <form onSubmit={submit} className="flex gap-2 border-t border-white/10 bg-slate-950/90 p-3"><input value={body} onChange={(event) => setBody(event.target.value)} maxLength={2000} disabled={disabled} placeholder={disabled ? "Only admins can post here" : "Message verified holders…"} className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[.04] px-4 py-3 text-sm outline-none placeholder:text-slate-600 focus:border-cyan-300/40 disabled:opacity-50"/><button disabled={disabled || !body.trim()} className="rounded-xl bg-cyan-300 px-4 text-slate-950 disabled:opacity-40" aria-label="Send message"><Send className="h-4 w-4" /></button></form>;
}