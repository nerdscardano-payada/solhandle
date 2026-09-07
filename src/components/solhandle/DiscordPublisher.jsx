import { useState } from "react";
import { Send } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function DiscordPublisher() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  const publish = async (event) => {
    event.preventDefault(); setSending(true); setStatus("");
    try {
      await base44.functions.invoke("publishDiscord", { type: "developer", title, message });
      setTitle(""); setMessage(""); setStatus("Published to the Developer channel.");
    } catch (error) { setStatus(error.response?.data?.error || "Message could not be published."); }
    finally { setSending(false); }
  };
  return <form onSubmit={publish} className="card-glow mt-8">
    <p className="text-xs font-semibold uppercase tracking-wider text-violet-300">Discord developer channel</p>
    <h2 className="mt-2 text-xl font-semibold text-white">Publish developer update</h2>
    <input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={100} placeholder="Update title (optional)" className="mt-5 w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/50" />
    <textarea value={message} onChange={(event) => setMessage(event.target.value)} maxLength={1800} required rows={4} placeholder="Write your developer or SDK update…" className="mt-3 w-full resize-y rounded-lg border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/50" />
    <div className="mt-3 flex items-center justify-between gap-4"><span className="text-xs text-slate-400">{status}</span><button disabled={sending || !message.trim()} className="inline-flex items-center gap-2 rounded-lg bg-violet-300 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50"><Send className="h-4 w-4"/>{sending ? "Publishing…" : "Publish to Developer"}</button></div>
  </form>;
}