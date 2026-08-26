const sharedSteps = [
  ["Install the Mainnet SDK", "Use the official @solhandle/sdk release and pin a compatible protocol version."],
  ["Detect a handle", "Treat normalized input beginning with @ as a SolHandle candidate; never send to the literal string."],
  ["Resolve on Mainnet", "Resolve the deterministic HandleRecord and verify the official Metaplex Core collection asset."],
  ["Validate the destination", "Use the current NFT owner and require the resolver safety result for native SOL transfers."],
  ["Confirm in the interface", "Show both @handle and the final base58 address before the user approves an action."],
  ["Run verification", "Pass ownership transfer, reverse lookup, invalid handle, fake collection and recipient-safety tests."],
];

export default function IntegrationWizard({ integration }) {
  return <section className="mt-12"><p className="text-xs font-semibold tracking-wider text-cyan-300">IMPLEMENTATION WIZARD</p><h2 className="mt-2 text-2xl font-semibold">Integrate {integration.name}</h2><div className="mt-6 space-y-3">{sharedSteps.map(([title, text], index) => <div key={title} className="grid gap-3 rounded-xl border border-white/10 bg-slate-950/60 p-4 sm:grid-cols-[36px_1fr]"><span className="grid h-8 w-8 place-items-center rounded-full bg-cyan-300/10 text-sm text-cyan-200">{index + 1}</span><div><h3 className="font-medium text-white">{title}</h3><p className="mt-1 text-sm leading-relaxed text-slate-400">{text}</p></div></div>)}</div><div className="mt-6 overflow-x-auto rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-cyan-100"><pre><code>{`const result = await resolveHandle("@ansem", { network: "mainnet-beta" });\nif (!result.verified || !result.safeForNativeSol) throw new Error("Unsafe recipient");\nconfirmRecipient({ handle: result.handle, address: result.address });`}</code></pre></div></section>;
}