import { useEffect, useState } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import DiscoverPassportCard from '@/components/solhandle/token-identity/DiscoverPassportCard';
export default function DiscoverPassports() {
  const [search,setSearch]=useState(''),[q,setQ]=useState(''),queryClient=useQueryClient();
  useEffect(()=>base44.entities.PublicTokenIdentity.subscribe(()=>queryClient.invalidateQueries({queryKey:['discover-project-passports']})),[queryClient]);
  const result=useInfiniteQuery({queryKey:['discover-project-passports',q],initialPageParam:undefined,queryFn:async({pageParam})=>{const {data}=await base44.functions.invoke('checkTokenIdentity',{action:'directory',q,cursor:pageParam});if(data.error)throw new Error(data.error);return data;},getNextPageParam:page=>page.has_more?page.next_cursor:undefined,retry:false,refetchOnWindowFocus:false});
  const items=result.data?.pages.flatMap(page=>page.items)||[];
  return <section className="space-y-5" aria-label="Token Passports"><header><h2 className="text-2xl font-heading font-bold">Token Passports</h2><p className="ep-small">Token projects linked to a SolHandle, with project representation reviewed by SolHandle. Review is not proof of token creation, safety or investment value.</p></header>
    <div className="flex flex-wrap items-center gap-4"><form className="ep-search-field flex-1" role="search" onSubmit={event=>{event.preventDefault();setQ(search.trim());}}><input aria-label="Search token passports" value={search} maxLength={80} placeholder="Token name, symbol, @handle or mint…" onChange={event=>{setSearch(event.target.value);if(!event.target.value)setQ('');}}/><button className="ep-link" type="submit">Search</button></form><Link className="ep-button ep-primary" to="/token-passport">Create my project passport</Link></div>
    {result.isPending?<p role="status">Loading project passports…</p>:result.error?<div role="alert"><p>{result.error.response?.data?.error||result.error.message}</p><button className="ep-button" onClick={()=>result.refetch()}>Try again</button></div>:<>{!items.length&&<p>{q?'No matching project passports.':'No reviewed project passports published yet. Create a passport to submit your project for verification.'}</p>}<div className="grid gap-5 width-min-[768px]:grid-cols-2 width-min-[1500px]:grid-cols-3">{items.map(item=><DiscoverPassportCard key={item.id} item={item}/>)}</div>{result.hasNextPage&&<button className="ep-button" disabled={result.isFetchingNextPage} onClick={()=>result.fetchNextPage()}>{result.isFetchingNextPage?'Loading…':'Load more passports'}</button>}</>}
  </section>;
}