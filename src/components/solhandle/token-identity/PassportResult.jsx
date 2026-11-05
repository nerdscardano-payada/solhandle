import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import PassportVisitorPreview from '@/components/solhandle/token-identity/PassportVisitorPreview';
import PassportCard from '@/components/solhandle/token-identity/PassportCard';
import passportRequest from '@/components/solhandle/token-identity/passportRequest';
export default function PassportResult({id,loading,error,onOpen}) {
  const [preview,setPreview]=useState(false);
  const detail=useQuery({queryKey:['passport-test-detail',id],queryFn:()=>passportRequest({action:'inspect',id}),enabled:!!id,retry:false,staleTime:0});
  if(!id&&!loading&&!error)return null;
  return <section className="passport-result" aria-label="Latest registration"><header className="passport-result-heading"><div><span className="ep-eyebrow">LATEST REGISTRATION</span><h2>Latest registered association</h2><p>Review the saved association and its original signed evidence.</p></div>{id&&<button className="ep-button" onClick={()=>onOpen(id)}>Open evidence & review</button>}</header>
    {loading||detail.isPending&&id?<p role="status">Loading passport and checking ownership…</p>:error||detail.error?<div role="alert"><p>{error||detail.error.message}</p>{id&&<button className="ep-link" onClick={()=>detail.refetch()}>Check again</button>}</div>:detail.data&&<><button className="ep-button ep-primary" onClick={()=>setPreview(true)}>View as visitor</button><PassportVisitorPreview data={detail.data} open={preview} onOpenChange={setPreview}/><PassportCard data={detail.data}/><button className="ep-link" disabled={detail.isFetching} onClick={()=>detail.refetch()}>{detail.isFetching?'Checking ownership…':'Refresh ownership check'}</button></>}
  </section>;
}