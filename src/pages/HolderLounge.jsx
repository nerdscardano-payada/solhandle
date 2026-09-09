import Header from "@/components/solhandle/Header";
import LoungeGate from "@/components/solhandle/LoungeGate";
import LoungeChannels from "@/components/solhandle/LoungeChannels";
import LoungeChat from "@/components/solhandle/LoungeChat";
import useHolderLounge from "@/hooks/useHolderLounge";

export default function HolderLounge() {
  const lounge = useHolderLounge(); const channel = lounge.channels.find((item) => item.id === lounge.selectedId);
  return <main className="min-h-screen bg-[#050811] text-white"><div className="mx-auto min-h-screen max-w-7xl border-x border-white/10"><Header/>{!lounge.session ? <LoungeGate address={lounge.address} loading={lounge.loading} error={lounge.error} onEnter={lounge.enter}/> : <section className="p-3 md:p-6"><div className="mb-3 flex items-center justify-between px-2 text-xs text-slate-500"><span>Signed in as <strong className="text-cyan-200">{lounge.session.member.display_handle}</strong></span><span className="rounded-full border border-emerald-300/20 px-2 py-1 text-emerald-300">{lounge.session.member.role}</span></div>{lounge.error && <p className="mb-3 rounded-lg border border-rose-400/30 bg-rose-400/10 p-3 text-sm text-rose-200">{lounge.error}</p>}<div className="grid overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70 shadow-2xl md:grid-cols-[290px_1fr]"><LoungeChannels channels={lounge.channels} messages={lounge.messages} selectedId={lounge.selectedId} onSelect={lounge.setSelectedId}/><LoungeChat channel={channel} messages={lounge.messages} role={lounge.session.member.role} onBack={() => lounge.setSelectedId("")} onSend={lounge.send} onModerate={lounge.moderate}/></div></section>}</div></main>;
}