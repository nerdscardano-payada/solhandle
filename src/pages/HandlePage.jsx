import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import Header from "@/components/solhandle/Header";
import HandleCard from "@/components/solhandle/HandleCard";
import SimilarHandles from "@/components/solhandle/SimilarHandles";
import HandleShareActions from "@/components/solhandle/HandleShareActions";
import AmbassadorBadge from "@/components/solhandle/AmbassadorBadge";
import HandleMarketplacePanel from "@/components/solhandle/HandleMarketplacePanel";
import { setHandleShareMetadata } from "@/lib/shareSolHandle";
import { normalizeHandle, validateHandle } from "@/lib/solhandle";
import HandleRecordDetails from "@/components/solhandle/HandleRecordDetails";

function rarityFor(length) {
  return length === 1 ? "Legendary" : length === 2 ? "Ultra Rare" : length === 3 ? "Rare" : length === 4 ? "Uncommon" : "Standard";
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
  const owner = data?.currentOwner || data?.original_minter;

  return (
    <main className="min-h-screen bg-platform text-white">
      <div className="mx-auto min-h-screen max-w-7xl border-x border-white/10">
        <Header />
        <section className="px-5 py-12 md:px-9">
          <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="min-w-0 text-center">
              <h1 className="break-words text-4xl font-semibold sm:text-5xl">@{handle || "—"}</h1>
              <AmbassadorBadge handle={handle}/>
              <span className={`mt-3 inline-block rounded-full px-3 py-1 text-sm ${invalid ? "bg-red-400/10 text-red-300" : available ? "bg-emerald-400/10 text-emerald-300" : "bg-cyan-400/10 text-cyan-300"}`}>
                {invalid ? "Invalid handle" : available ? "Available to mint" : data?.status === "RESERVED" ? "Reserved for official claim" : data?.status === "PROTECTED" ? "Protected brand name" : "Official SolHandle ✓"}
              </span>
              <div className="mt-6"><HandleCard handle={handle} display={`@${handle || "—"}`} /></div>
              {!invalid && data && <div className="mt-5 flex justify-center"><HandleShareActions handle={handle} isPremium={data?.nameClass === "Premium"} location="handle_detail" /></div>}
            </div>
            <div className="min-w-0">
              <HandleRecordDetails data={data} invalid={invalid} available={available} owner={owner} handle={handle} rarity={rarityFor(handle.length)}/>
              {data?.assetAddress && owner && <HandleMarketplacePanel handle={handle} asset={data.assetAddress} owner={owner}/>}
              {available && <Link to={`/?claim=${handle}`} className="mt-6 inline-flex w-full justify-center rounded-lg bg-gradient-to-r from-emerald-300 via-cyan-300 to-violet-400 px-5 py-3 font-semibold text-slate-950">Mint @{handle}</Link>}
            </div>
          </div>
          <div className="mt-12"><SimilarHandles handle={handle}/></div>
          <Link to="/" className="mt-8 inline-block text-cyan-200">Search another handle</Link>
        </section>
      </div>
    </main>
  );
}