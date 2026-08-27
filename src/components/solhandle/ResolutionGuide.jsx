const audiences = [
  ["Handle holders", "Claim a Mainnet handle, connect its owner wallet in My Handles, and optionally set it as your Primary Handle."],
  ["App developers", "Turn any @handle into its current verified Mainnet owner before showing a profile or preparing a transaction."],
  ["Wallets & payment apps", "Resolve the handle and require a safe native-SOL destination before asking the user to approve payment."],
  ["Integration partners", "Build and test against the live Mainnet protocol while treating direct Solana state as authoritative."]
];

const steps = [
  "Choose direct Mainnet on-chain resolution, the SDK source, or the REST convenience endpoint.",
  "Replace @ansem in sample code with an existing SolHandle. Use @solhandle for a live officially claimed Mainnet proof.",
  "Require a valid HandleRecord, the deterministic asset, the official collection, and the current NFT owner.",
  "For native SOL, continue only when safeForNativeSol is true; send to the returned address, never to the literal @handle.",
  "For wallet → @handle lookup, the owner must first set that handle as Primary Handle in My Handles."
];

export default function ResolutionGuide() {
  return <section className="mt-10 rounded-2xl border border-white/10 bg-slate-950/60 p-5 md:p-6"><p className="text-xs font-semibold tracking-wider text-cyan-300">MAINNET INTEGRATION GUIDE</p><h2 className="mt-2 text-2xl font-semibold">Who it is for and how it works</h2><div className="mt-5 grid gap-3 md:grid-cols-2">{audiences.map(([title, text]) => <div key={title} className="rounded-xl border border-white/10 bg-white/[0.03] p-4"><h3 className="font-medium text-white">{title}</h3><p className="mt-2 text-sm leading-relaxed text-slate-400">{text}</p></div>)}</div><h3 className="mt-7 font-semibold text-white">Quickstart</h3><ol className="mt-3 space-y-3">{steps.map((step, index) => <li key={step} className="flex gap-3 text-sm leading-relaxed text-slate-300"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-cyan-300/10 text-xs text-cyan-200">{index + 1}</span><span>{step}</span></li>)}</ol><div className="mt-6 rounded-xl border border-emerald-300/20 bg-emerald-300/5 p-4 text-sm leading-relaxed text-emerald-100"><strong>Mainnet live:</strong> use a Solana Mainnet Beta RPC, Program <code>B7xiwfxGcR2Xz7tcUKrkB8Ly6NV8jU7LH1m6GJZRUuf</code> and Collection <code>7XZzcbeFBxQA63n9avz44vnbpv34hDGYyHfCDmTdPBJP</code>. Never substitute Devnet addresses in production.</div></section>;
}