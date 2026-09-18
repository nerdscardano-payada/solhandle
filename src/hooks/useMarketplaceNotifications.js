import { useCallback, useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";

export default function useMarketplaceNotifications(wallet, handles = []) {
  const [bids, setBids] = useState([]);
  const [sales, setSales] = useState([]);
  const assetsKey = handles.map((item) => item.asset || item.asset_address).filter(Boolean).sort().join(",");

  const load = useCallback(async () => {
    if (!wallet) { setBids([]); setSales([]); return; }
    let assets = assetsKey ? assetsKey.split(",") : [];
    if (!assets.length) {
      const response = await base44.functions.invoke("getOwnerHandles", { wallet });
      assets = (response.data.handles || []).map((item) => item.asset).filter(Boolean);
    }
    const [activeBids, completedSales] = await Promise.all([
      base44.entities.NativeBid.filter({ status: "ACTIVE" }, "-amount_lamports", 500),
      base44.entities.NativeListing.filter({ seller: wallet, status: "CLOSED" }, "-closed_at", 25)
    ]);
    const ownedAssets = new Set(assets);
    setBids(activeBids.filter((bid) => ownedAssets.has(bid.asset_address)));
    setSales(completedSales);
  }, [wallet, assetsKey]);

  useEffect(() => {
    load();
    const stopBids = base44.entities.NativeBid.subscribe(load);
    const stopListings = base44.entities.NativeListing.subscribe(load);
    return () => { stopBids(); stopListings(); };
  }, [load]);

  return { bids, sales, refresh: load };
}