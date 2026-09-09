import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import MarketplaceAction from "@/components/solhandle/MarketplaceAction";

export default function PortfolioMarketplaceAction({ item, wallet }) {
  const [listing, setListing] = useState(null);
  const load = () => base44.entities.NativeListing.filter({ asset_address: item.asset, status: "ACTIVE" }, "-created_at", 1).then((rows) => setListing(rows[0] || null));
  useEffect(() => { load(); }, [item.asset]);
  return listing
    ? <MarketplaceAction action="delist" label="Delist handle" handle={item.handle} asset={item.asset} seller={wallet} onComplete={load}/>
    : <MarketplaceAction action="list" label="List for sale" handle={item.handle} asset={item.asset} seller={wallet} onComplete={load}/>;
}