import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import Header from "@/components/solhandle/Header";
import HandleCard from "@/components/solhandle/HandleCard";
import SimilarHandles from "@/components/solhandle/SimilarHandles";
import HandleShareActions from "@/components/solhandle/HandleShareActions";
import { setHandleShareMetadata } from "@/lib/shareSolHandle";
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

  useEffect(() => {
    if (!handle || validateHandle(handle)) return;
    return setHandleShareMetadata(handle, data?.nameClass === "Premium");
  }, [handle, data?.nameClass]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("utm_source") === "x") base44.analytics.track({ eventName: "shared_handle_visit", properties: { handle, source: "x" } });
  }, [handle]);

  const invalid = data?.status === "INVALID";
  const available = data?.available;
  const restriction = data?.restriction;
  const priceLamports = data?.priceLamports;
  const owner = data?.currentOwner || data?.original_minter;

  return (
    <main className="min-h-screen bg-[#050811] text-white">
      <div className="mx-auto min-h-screen max-w-7xl border-x border-white/10">
        <Header />
        <section className="mx-auto max-w-3xl px-5 py-16 text-center">
          <h1 className="text-5xl font-semibold">@{handle || "—"}</h1>
          <span className={`mt-3 inline-block rounded-full px-3 py-1 text-sm ${invalid ? "bg-red-400/10 text-red-300" : available ? "bg-emerald-400/10 text-emerald-300" : "bg-cyan-400/10 text-cyan-300"}`}>
            {invalid ? "Invalid handle" : available ? "Available to mint" : data?.status === "RESERVED" ? "Reserved for official claim" : data?.status === "PROTECTED" ? "Protected brand name" : "Official SolHandle ✓"}
          </span>
          {!invalid && data && <div className="mt-3 flex justify-center"><HandleShareActions handle={handle} isPremium={data?.nameClass === "Premium"} location="handle_detail" /></div>}

          <div className="mx-auto mt-8 max-w-xl">
            <HandleCard handle={handle} display={`@${handle || "—"}`} />
          </div>

          <div className="card-glow mt-10 text-left">
            <p className="mb-1 text-xs uppercase tracking-wider text-cyan-300">Handle record</p>
            <Detail label="Status" value={invalid ? "Invalid handle" : data?.status || "AVAILABLE"} accent={available ? "text-emerald-300" : undefined} />
            {restriction && <Detail label={restriction.restrictionType === "RESERVED" ? "Reserved for" : "Protection reason"} value={restriction.reservedFor} />}
            <Detail label="Current owner" value={owner ? shortenAddress(owner) : "—"} />
            <Detail label="Mint price" value={priceLamports ? `${lamportsToSol(priceLamports)} SOL` : "—"} />
            <Detail label="Rarity tier" value={rarityFor(handle.length)} accent="text-violet-300" />
            <Detail label="Name class" value={data?.nameClass || "Standard"} />
            {data?.handleScore && <Detail label="Handle Score" value={`${data.handleScore} / 100`} accent="text-cyan-300" />}
            {data?.categories?.length > 0 && <Detail label="Categories" value={data.categories.join(" · ")} />}
            {data?.tags?.length > 0 && <Detail label="Tags" value={data.tags.join(" · ")} />}
            <Detail label="Asset address" value={data?.assetAddress ? shortenAddress(data.assetAddress) : "—"} />
            {data?.listing && <div className="flex items-center justify-between gap-4 border-t border-white/10 py-3"><span className="text-sm text-slate-500">For sale</span><a href={data.listing.url} target="_blank" rel="noreferrer" className="text-right text-sm font-semibold text-amber-300">{data.listing.price} {data.listing.currency} on Magic Eden ↗</a></div>}
            <Detail label="Protected" value={data?.protected ? "Yes" : "No"} accent={data?.protected ? "text-amber-300" : undefined} />
            <Detail label="Collection" value="SOLHANDLE Core Collection" />
            <Detail label="Handle length" value={`${handle.length} characters`} />
          </div>

          {available && <Link to={`/?claim=${handle}`} className="mt-8 inline-flex rounded-lg bg-gradient-to-r from-emerald-300 via-cyan-300 to-violet-400 px-5 py-3 font-semibold text-slate-950">Mint @{handle}</Link>}
          <SimilarHandles handle={handle}/>
          <Link to="/" className="mt-8 inline-block text-cyan-200">Search another handle</Link>
        </section>
      </div>
    </main>
  );
}