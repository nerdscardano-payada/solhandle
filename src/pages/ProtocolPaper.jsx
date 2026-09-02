import Header from "@/components/solhandle/Header";
import ProtocolPaperNav from "@/components/solhandle/ProtocolPaperNav";
import ProtocolPaperSection from "@/components/solhandle/ProtocolPaperSection";
import { protocolPaperMeta, protocolSections } from "@/lib/protocolPaperContent";

export default function ProtocolPaper() {
  return <main className="min-h-screen bg-[#050811] text-white"><div className="mx-auto min-h-screen max-w-7xl border-x border-white/10"><Header />
    <header className="relative overflow-hidden border-b border-white/10 px-5 py-14 md:px-9 md:py-20"><div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,.12),transparent_35%),radial-gradient(circle_at_80%_40%,rgba(167,139,250,.12),transparent_35%)]" /><div className="relative max-w-4xl">
      <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wider"><span className="rounded-full border border-cyan-300/25 bg-cyan-300/5 px-3 py-1 text-cyan-200">Version {protocolPaperMeta.version}</span><span className="rounded-full border border-white/10 px-3 py-1 text-slate-400">{protocolPaperMeta.date}</span></div>
      <p className="mt-8 text-sm font-medium uppercase tracking-[0.2em] text-violet-300">{protocolPaperMeta.tagline}</p><h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">{protocolPaperMeta.title} <span className="text-cyan-300">v{protocolPaperMeta.version}</span></h1><p className="mt-5 text-xl text-slate-300 md:text-2xl">{protocolPaperMeta.subtitle}</p>
      <p className="mt-7 max-w-3xl leading-relaxed text-slate-400">A concise technical specification of SolHandle’s ownership, resolution, integration and security model. This paper describes protocol mechanics without token economics, market forecasts or handle price predictions.</p>
    </div></header>
    <div className="grid gap-10 px-5 py-12 md:px-9 lg:grid-cols-[230px_minmax(0,1fr)]"><ProtocolPaperNav sections={protocolSections} /><article className="max-w-3xl">{protocolSections.map((section) => <ProtocolPaperSection key={section.id} section={section} />)}<p className="border-t border-white/10 pt-8 text-xs leading-relaxed text-slate-500">This document is technical information, not financial advice. Mainnet state and the current protocol configuration remain authoritative.</p></article></div>
  </div></main>;
}