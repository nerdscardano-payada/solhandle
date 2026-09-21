import { lamportsToSol, shortenAddress } from "@/lib/solhandle";

export default function HandleRecordDetails({ data, invalid, available, owner, handle, rarity }) {
  const restriction = data?.restriction;
  const rows = [
    ["Status", invalid ? "Invalid handle" : data?.status || "AVAILABLE"],
    ...(restriction ? [[restriction.restrictionType === "RESERVED" ? "Reserved for" : "Protection reason", restriction.reservedFor]] : []),
    ["Current owner", owner ? shortenAddress(owner) : "—"],
    ["Mint price", data?.priceLamports ? `${lamportsToSol(data.priceLamports)} SOL` : "—"],
    ["Rarity tier", rarity],
    ["Name class", data?.nameClass || "Standard"],
    ...(data?.handleScore ? [["Handle Score", `${data.handleScore} / 100`]] : []),
    ...(data?.categories?.length ? [["Categories", data.categories.join(" · ")]] : []),
    ...(data?.tags?.length ? [["Tags", data.tags.join(" · ")]] : []),
    ["Metaplex Core asset", data?.assetAddress ? <a href={`https://explorer.solana.com/address/${data.assetAddress}`} target="_blank" rel="noreferrer" className="font-mono underline underline-offset-4">{shortenAddress(data.assetAddress)} ↗</a> : "—"],
    ["Collection", "Metaplex Core · SOLHANDLE Collection"],
    ["Handle length", `${handle.length} characters`]
  ];
  return <div className="card-glow text-left">
    <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider">Handle record</h2>
    <dl>{rows.map(([label, value]) => <div key={label} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] items-start gap-4 border-t border-current/10 py-3 text-sm">
      <dt className="opacity-60">{label}</dt><dd className={`min-w-0 break-words text-right font-medium ${label === "Status" && available ? "text-inherit" : "opacity-90"}`}>{value}</dd>
    </div>)}</dl>
  </div>;
}