import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import Header from "@/components/solhandle/Header";
import HandleCard from "@/components/solhandle/HandleCard";
import { normalizeHandle, validateHandle, lamportsToSol, shortenAddress } from "@/lib/solhandle";

function rarityFor(length) {
  return length === 1 ? "Legendary" : length === 2 ? "Ultra Rare" : length === 3 ? "Rare" : length === 4 ? "Uncommon" : "Standard";
}

function Detail({ label, value, accent }) {
  return (
    <div className="flex items-start justify-between gap-4 border-t border-white/10 py-3">
      <span className="text-sm text-slate-500">{label}</span>
      <span className={`text-right text-sm font-medium ${accent || "text-slate-200"}`}>{value}</span>
    </div>
  );
}

export default function HandlePage() {
  const handle = normalizeHandle(window.location.pathname.split("/").filter(Boolean).pop());
  const [data, setData] = useState(null);

  useEffect(() => {
    if (validateHandle(handle)) {
      setData({ state: "invalid" });
      return;
    }
    base44.functions.invoke("getHandleAvailability", { handle })
      .then(res => setData(res.data))
      .catch(() => setData({ state: "invalid" }));
  }, [handle]);

  const invalid = data?.state === "invalid";
  const available = data?.available;
  const priceLamports = data?.priceLamports;
  const owner = data?.currentOwner || data?.original_minter;

  return (
    <main className="min-h-screen bg-[#050811] text-white">
      <div className="mx-auto min-h-screen max-w-7xl border-x border-white/10">
        <Header />
        <section className="mx-auto max-w-3xl px-5 py-16 text-center">
          <h1 className="text-5xl font-semibold">@{handle || "—"}</h1>
          <span className={`mt-3 inline-block rounded-full px-3 py-1 text-sm ${invalid ? "bg-red-400/10 text-red-300" : available ? "bg-emerald-400/10 text-emerald-300" : "bg-cyan-400/10 text-cyan-300"}`}>
            {invalid ? "Invalid handle" : available ? "Available to mint" : "Official SolHandle ✓"}
          </span>

          <div className="mx-auto mt-8 max-w-xl">
            <HandleCard handle={handle} display={`@${handle || "—"}`} />
          </div>

          <div className="card-glow mt-10 text-left">
            <p className="mb-1 text-xs uppercase tracking-wider text-cyan-300">Handle record</p>
            <Detail label="Status" value={invalid ? "Invalid handle" : available ? "Available" : data?.status || "Indexed on-chain"} accent={available ? "text-emerald-300" : undefined} />
            <Detail label="Current owner" value={owner ? shortenAddress(owner) : "—"} />
            <Detail label="Mint price" value={priceLamports ? `${lamportsToSol(priceLamports)} SOL` : "—"} />
            <Detail label="Rarity tier" value={rarityFor(handle.length)} accent="text-violet-300" />
            <Detail label="Name class" value={data?.nameClass || "Standard"} />
            <Detail label="Asset address" value={data?.assetAddress ? shortenAddress(data.assetAddress) : "—"} />
            <Detail label="Protected" value={data?.protected ? "Yes" : "No"} accent={data?.protected ? "text-amber-300" : undefined} />
            <Detail label="Collection" value="SOLHANDLE Core Collection" />
            <Detail label="Handle length" value={`${handle.length} characters`} />
          </div>

          <Link to="/" className="mt-8 inline-block text-cyan-200">Search another handle</Link>
        </section>
      </div>
    </main>
  );
}