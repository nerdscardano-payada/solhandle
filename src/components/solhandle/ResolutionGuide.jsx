const audiences = [
  ["Handle holders", "Claim a handle, connect its owner wallet in My Handles, and optionally set it as your Primary Handle."],
  ["App developers", "Turn any @handle into its current verified owner address before showing a profile or preparing a transaction."],
  ["Wallets & payment apps", "Resolve the handle and require a safe native-SOL destination before asking the user to approve payment."],
  ["Integration partners", "Build and test against Devnet now; the same resolution flow will be retained for Mainnet."]
];

const steps = [
  "Choose direct on-chain resolution, the SDK source, or the REST convenience endpoint.",
  "Replace @ansem in sample code with any SolHandle. Use @bullhead for a currently verified live Devnet test.",
  "Require a claimed handle, an official collection asset, and the current NFT owner.",
  "For native SOL, continue only when safeForNativeSol is true; send to the returned address, never to the literal @handle.",
  "For wallet → @handle lookup, the owner must first set that handle as Primary Handle in My Handles."
];

export default function ResolutionGuide() {
  return <section className="mt-10 rounded-2xl border border-white/10 bg-slate-950/60 p-5 md:p-6"><p className="text-xs font-semibold tracking-wider text-cyan-300">DEVNET INTEGRATION GUIDE</p><h2 className="mt-2 text-2xl font-semibold">Who it is for and how it works</h2><div className="mt-5 grid gap-3 md:grid-cols-2">{audiences.map(([title, text]) => <div key={title} className="rounded-xl border border-white/10 bg-white/[0.03] p-4"><h3 className="font-medium text-white">{title}</h3><p className="mt-2 text-sm leading-relaxed text-slate-400">{text}</p></div>)}</div><h3 className="mt-7 font-semibold text-white">Quickstart</h3><ol className="mt-3 space-y-3">{steps.map((step, index) => <li key={step} className="flex gap-3 text-sm leading-relaxed text-slate-300"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-cyan-300/10 text-xs text-cyan-200">{index + 1}</span><span>{step}</span></li>)}</ol><div className="mt-6 rounded-xl border border-violet-300/20 bg-violet-300/5 p-4 text-sm leading-relaxed text-violet-100"><strong>Devnet now, Mainnet later:</strong> build and test the complete integration today. At launch, direct clients switch to the Mainnet RPC and SolHandle program deployment; the resolution and safety flow stays the same.</div></section>;
}