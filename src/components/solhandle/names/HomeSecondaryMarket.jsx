import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import SecondaryMarketGuide from '@/components/solhandle/names/SecondaryMarketGuide';
import NameCard from '@/components/solhandle/names/NameCard';

export default function HomeSecondaryMarket() {
  const query=useQuery({queryKey:['homepage-external-offers'],retry:false,staleTime:60000,queryFn:async()=>{
    const {data}=await base44.functions.invoke('discoverNames',{tab:'for-sale'});
    if(data.error)throw new Error(data.error);
    return data;
  }});
  const offers=query.data?.items || [];
  return <section className="home-secondary-market" aria-label="Explore the secondary market">
    <SecondaryMarketGuide/>
    <h3>Recently checked external offers</h3>
    {query.isPending ? <p role="status" className="secondary-market-empty">Checking external offers and NFT ownership…</p> : query.isError ? <div role="alert" className="secondary-market-empty"><p>External offers could not be checked right now.</p><button className="ep-link" type="button" disabled={query.isFetching} onClick={()=>query.refetch()}>{query.isFetching?'Checking…':'Try again'}</button></div> : offers.length ? <div className="home-secondary-market-grid">{offers.slice(0,4).map(item=><NameCard key={item.handle} item={item}/>)}</div> : <div className="secondary-market-empty">No recently verified offers to display. Listings may still be available on external marketplaces. Browse checked offers above to explore the full selection.</div>}
  </section>;
}