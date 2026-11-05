import { useQuery } from '@tanstack/react-query';
import PassportCard from '@/components/solhandle/token-identity/PassportCard';
import PassportPublication from '@/components/solhandle/token-identity/PassportPublication';
export default function MemberPassportDetail({id,wallet,request}) {
  const detail=useQuery({queryKey:['member-passport-detail',wallet,id],queryFn:()=>request({action:'inspect',id}),enabled:!!id,retry:false,gcTime:0});
  if(!id)return null;
  return <section className="passport-test-detail" aria-label="My registration details">
    <h2>Registration & review</h2>
    {detail.isPending?<p role="status">Loading your registration and checking ownership…</p>:detail.error?<div role="alert"><p>{detail.error.message}</p><button className="ep-button" onClick={()=>detail.refetch()}>Try again</button></div>:<>
      <PassportCard data={detail.data}/>
      <p>Review status: <strong>{detail.data.item.status}</strong>. Approval does not publish this registration.</p>
      {detail.data.item.review_reason&&<p>Administrator review: {detail.data.item.review_reason}</p>}
      {detail.data.item.note&&<blockquote>{detail.data.item.note}</blockquote>}
      <PassportPublication key={detail.data.item.revision} item={detail.data.item} request={request} walletScope={wallet}/>
    </>}
    <button className="ep-button" disabled={detail.isFetching} onClick={()=>detail.refetch()}>{detail.isFetching?'Checking…':'Refresh review & ownership'}</button>
  </section>;
}