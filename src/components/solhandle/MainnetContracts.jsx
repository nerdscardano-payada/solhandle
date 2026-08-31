import { useState } from "react";
import { BadgeCheck, Copy, ExternalLink } from "lucide-react";

const contracts = [
  { label: "Program ID", value: "B7xiwfxGcR2Xz7tcUKrkB8Ly6NV8jU7LH1m6GJZRUuf" },
  { label: "Collection ID", value: "7XZzcbeFBxQA63n9avz44vnbpv34hDGYyHfCDmTdPBJP" },
];

export default function MainnetContracts() {
  const [copied, setCopied] = useState("");
  const copy = async ({ label, value }) => {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    window.setTimeout(() => setCopied(""), 1500);
  };

  return <section className="relative mt-7 rounded-2xl border border-emerald-300/20 bg-slate-950/60 p-4 backdrop-blur-sm" aria-label="Verified Mainnet contracts">
    <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-200"><BadgeCheck className="h-4 w-4"/>Verified Mainnet contracts</div>
    <div className="grid gap-3">{contracts.map((contract) => <div key={contract.label} className="flex min-w-0 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
      <div className="min-w-0 flex-1"><p className="text-xs text-slate-500">{contract.label}</p><p className="truncate font-mono text-sm text-slate-200">{contract.value}</p></div>
      <button type="button" onClick={() => copy(contract)} className="text-slate-400 hover:text-cyan-200" aria-label={`Copy ${contract.label}`}><Copy className="h-4 w-4"/></button>
      <a href={`https://explorer.solana.com/address/${contract.value}`} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-cyan-200" aria-label={`View ${contract.label} on Solana Explorer`}><ExternalLink className="h-4 w-4"/></a>
      {copied === contract.label && <span className="text-xs text-emerald-300">Copied</span>}
    </div>)}</div>
  </section>;
}