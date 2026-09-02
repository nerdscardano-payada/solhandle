export default function ProtocolPaperNav({ sections }) {
  return <aside className="hidden lg:block"><div className="sticky top-6 rounded-2xl border border-white/10 bg-slate-950/60 p-5">
    <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">Contents</p>
    <nav className="mt-4 space-y-2">{sections.map((section) => <a key={section.id} href={`#${section.id}`} className="flex gap-3 text-xs leading-relaxed text-slate-400 hover:text-cyan-200"><span className="font-mono text-slate-600">{section.number}</span>{section.title}</a>)}</nav>
  </div></aside>;
}