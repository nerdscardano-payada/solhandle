import { Link } from "react-router-dom";

export default function ProtocolPaperSection({ section }) {
  return <section id={section.id} className="scroll-mt-8 border-t border-white/10 py-10 first:border-t-0 first:pt-0">
    <div className="flex gap-4"><span className="pt-1 font-mono text-xs text-cyan-300">{section.number}</span><div className="min-w-0 flex-1">
      <h2 className="text-2xl font-semibold text-white">{section.title}</h2>
      <div className="mt-4 space-y-4 leading-relaxed text-slate-400">{section.paragraphs.map((text) => <p key={text}>{text}</p>)}</div>
      {section.facts && <dl className="mt-5 divide-y divide-white/10 overflow-hidden rounded-xl border border-white/10">{section.facts.map(([label, value]) => <div key={label} className="grid gap-1 bg-white/[0.025] px-4 py-3 sm:grid-cols-[140px_1fr]"><dt className="text-sm text-slate-500">{label}</dt><dd className="break-all font-mono text-sm text-cyan-100">{value}</dd></div>)}</dl>}
      {section.bullets && <ul className="mt-5 space-y-2">{section.bullets.map((item) => <li key={item} className="flex gap-3 text-sm leading-relaxed text-slate-300"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-300" />{item}</li>)}</ul>}
      {section.callout && <p className="mt-5 rounded-xl border border-cyan-300/20 bg-cyan-300/5 p-4 text-sm leading-relaxed text-cyan-100">{section.callout}</p>}
      {section.links && <div className="mt-5 flex flex-wrap gap-3">{section.links.map((link) => link.href.startsWith("/") ? <Link key={link.href} to={link.href} className="rounded-lg border border-white/10 px-3 py-2 text-sm text-cyan-200 hover:border-cyan-300/30">{link.label}</Link> : <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="rounded-lg border border-white/10 px-3 py-2 text-sm text-cyan-200 hover:border-cyan-300/30">{link.label}</a>)}</div>}
    </div></div>
  </section>;
}