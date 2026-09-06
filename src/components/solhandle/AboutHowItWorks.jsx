const steps = [
  ["01", "Search", "Enter a name to verify its availability and official price against the protocol."],
  ["02", "Connect", "Connect your Solana wallet. You stay in control throughout the entire flow."],
  ["03", "Mint", "Approve one atomic transaction that pays and creates your unique Handle NFT."],
  ["04", "Use", "Set a primary handle, share your identity and use it in supported integrations."]
];

export default function AboutHowItWorks() {
  return <section className="border-y border-white/10 bg-slate-950/45 px-5 py-16 md:px-9"><div className="mx-auto max-w-6xl"><p className="text-xs font-semibold uppercase tracking-[.2em] text-violet-300">How it works</p><h2 className="mt-3 text-3xl font-semibold text-white">From search to ownership in four steps.</h2><div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-4">{steps.map(([number, title, body]) => <article key={number} className="bg-slate-950 p-6"><span className="font-mono text-sm text-cyan-300">{number}</span><h3 className="mt-8 text-lg font-semibold text-white">{title}</h3><p className="mt-2 text-sm leading-relaxed text-slate-400">{body}</p></article>)}</div></div></section>;
}