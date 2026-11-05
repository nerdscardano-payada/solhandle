import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import passportRequest from '@/components/solhandle/token-identity/passportRequest';
import PassportTokenSnapshot from '@/components/solhandle/token-identity/PassportTokenSnapshot';
import PassportReview from '@/components/solhandle/token-identity/PassportReview';
import PassportEvidence from '@/components/solhandle/token-identity/PassportEvidence';
import PassportCard from '@/components/solhandle/token-identity/PassportCard';
export default function PassportDetail({id,onClose,onReviewed}) {
  const detail=useQuery({queryKey:['passport-test-detail',id],queryFn:()=>passportRequest({action:'inspect',id}),enabled:!!id,retry:false,staleTime:0});
  const data=detail.data,item=data?.item;
  async function refresh() {await Promise.all([detail.refetch(),onReviewed()]);}
  return <Dialog open={!!id} onOpenChange={open=>{if(!open)onClose();}}><DialogContent className="passport-test-dialog"><DialogHeader><DialogTitle>Token Passport · private test review</DialogTitle></DialogHeader>{detail.isFetching?<p role="status">Checking the original wallet against live ownership…</p>:detail.error?<p role="alert">{detail.error.message}</p>:item&&<div className="passport-test-detail"><PassportCard data={data}/><button className="ep-link" onClick={()=>detail.refetch()}>Eigendomscontrole vernieuwen</button><PassportTokenSnapshot token={item.token}/>{item.note&&<blockquote>{item.note}</blockquote>}<PassportReview item={item} ownership={data.ownership} onReviewed={refresh}/><PassportEvidence item={item} history={data.history}/></div>}</DialogContent></Dialog>;
}