import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import SecondaryMarketGuide from '@/components/solhandle/names/SecondaryMarketGuide';
import NameCard from '@/components/solhandle/names/NameCard';

export default function HomeSecondaryMarket() {
  const query=useQuery({queryKey:['homepage-external-offers'],retry:false,staleTime:60000,queryFn:async()=>{
    const page=await base44.entities.MarketplaceListing.filter({status:'ACTIVE',marketplace:'Magic Eden',currency:'SOL',price:{$gt:0},handle:{$regex:'^[a-z0-9]{1,20}$'},asset_address:{$regex:'^[1-9A-HJ-NP-Za-km-z]{32,44}$'}},{sort:'-last_verified_at',limit:4});
    return {items:page.items.map(row=>({handle:row.handle,asset:row.asset_address,status:'FOR_SALE',externalListing:{marketplace:row.marketplace,price:row.price,currency:row.currency,url:`https://magiceden.io/item-details/${row.asset_address}`,checkedAt:row.last_verified_at}}))};
  }});
  const offers=query.data?.items || [];
  return <section className="home-secondary-market" aria-label="Explore the secondary market">
    <SecondaryMarketGuide/>
    <h3>Active Magic Eden listings</h3>
    <p className="mb-4 text-sm text-identity-muted">Latest offers recorded by the Magic Eden sync. Confirm the current price and availability on Magic Eden before buying.</p>
    {query.isPending ? <p role="status" className="secondary-market-empty">Loading Magic Eden listings…</p> : query.isError ? <div role="alert" className="secondary-market-empty"><p>Magic Eden listings could not be loaded right now.</p><button className="ep-link" type="button" disabled={query.isFetching} onClick={()=>query.refetch()}>{query.isFetching?'Loading…':'Try again'}</button></div> : offers.length ? <div className="home-secondary-market-grid">{offers.map(item=><NameCard key={item.asset} item={item} showInterest={false}/>)}</div> : <div className="secondary-market-empty">No active Magic Eden listings have been recorded yet. New offers appear here after the next successful sync.</div>}
  </section>;
}