const items = [
  ["Forward resolution", "Working on Devnet", "@handle → current Core NFT owner"],
  ["Reverse resolution", "Proof pending", "Implemented; needs a live Devnet Primary Handle for a positive end-to-end test"],
  ["Destination safety", "Working on Devnet", "System wallet / unfunded on-curve validation"],
  ["Forward REST endpoint", "Working on Devnet", "Live positive proof; chain remains authoritative"],
  ["Reverse REST endpoint", "Proof pending", "Correctly rejects wallets without a verified primary handle"],
  ["@solhandle/sdk on npm", "Not published", "Source implementation exists; package release pending"],
  ["Native wallet support", "Not integrated", "Requires review and adoption by wallet providers"]
];
export default function ResolutionStatus() {
  return <section className="mt-12"><h2 className="text-2xl font-semibold">Current integration status</h2><div className="mt-5 grid gap-3 md:grid-cols-2">{items.map(([name,status,detail]) => <div key={name} className="rounded-xl border border-white/10 bg-slate-950/60 p-4"><div className="flex items-start justify-between gap-3"><p className="font-medium">{name}</p><span className={`shrink-0 text-xs ${status.startsWith("Working") ? "text-emerald-300" : "text-amber-300"}`}>{status}</span></div><p className="mt-2 text-sm text-slate-500">{detail}</p></div>)}</div></section>;
}