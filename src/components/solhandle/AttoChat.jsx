import { useEffect, useState } from 'react';
import { Send, X, RotateCcw } from 'lucide-react';
import AttoMessages from '@/components/solhandle/AttoMessages';
import useAttoConversation from '@/components/solhandle/useAttoConversation';

export default function AttoChat() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  useEffect(() => {
    const openChat = () => setOpen(true);
    window.addEventListener('solhandle:open-atto', openChat);
    return () => window.removeEventListener('solhandle:open-atto', openChat);
  }, []);
  const { messages, loading, sending, replying, error, send, reset } = useAttoConversation(open);
  async function submit(event) {
    event.preventDefault();
    if (!draft.trim() || sending || replying) return;
    const text = draft.trim(); setDraft('');
    await send(text);
  }
  return <div className="fixed bottom-4 right-3 z-[100] sm:bottom-6 sm:right-6">
    {open && <section role="dialog" aria-label="Chat with Atto" className="mb-3 flex h-[min(70dvh,600px)] w-[calc(100vw-24px)] max-w-[390px] flex-col overflow-hidden rounded-2xl border border-cyan-300/35 bg-slate-950 text-white shadow-2xl shadow-cyan-900/30">
      <div className="flex items-center gap-3 border-b border-white/10 bg-gradient-to-r from-cyan-400/10 to-violet-400/10 px-4 py-3"><div className="min-w-0 flex-1"><h2 className="font-semibold">Chat with Atto</h2><p className="text-xs text-slate-400">Your SolHandle guide</p></div><button type="button" onClick={reset} aria-label="New conversation" title="New conversation" className="rounded-lg p-2 text-slate-300 hover:bg-white/10"><RotateCcw className="h-4 w-4"/></button><button type="button" onClick={() => setOpen(false)} aria-label="Close Atto chat" className="rounded-lg p-2 text-slate-300 hover:bg-white/10"><X className="h-5 w-5"/></button></div>
      <AttoMessages messages={messages} loading={loading} replying={replying}/>
      {error && <p role="alert" className="px-4 pb-2 text-xs text-rose-300">{error}</p>}
      <form onSubmit={submit} className="flex gap-2 border-t border-white/10 p-3"><input aria-label="Ask Atto a question" value={draft} onChange={event => setDraft(event.target.value)} placeholder="Ask Atto anything…" maxLength={1000} className="min-w-0 flex-1 rounded-xl border border-white/15 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300"/><button type="submit" disabled={!draft.trim() || loading || sending || replying} aria-label="Send message" className="rounded-xl bg-cyan-300 px-3 text-slate-950 disabled:opacity-50"><Send className="h-4 w-4"/></button></form>
    </section>}
    <button type="button" onClick={() => setOpen(value => !value)} aria-label={open ? 'Close Atto chat' : 'Talk to Atto'} aria-expanded={open} className="ml-auto flex items-center gap-2 rounded-full border border-cyan-300/60 bg-slate-950 px-2 py-1.5 pr-4 text-sm font-semibold text-cyan-100 shadow-lg shadow-cyan-500/20">{open ? 'Close Atto' : 'Talk to Atto'}</button>
  </div>;
}