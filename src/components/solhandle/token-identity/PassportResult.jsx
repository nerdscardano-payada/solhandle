import { useQuery } from '@tanstack/react-query';
import PassportCard from '@/components/solhandle/token-identity/PassportCard';
import passportRequest from '@/components/solhandle/token-identity/passportRequest';
export default function PassportResult({id,loading,error,onOpen}) {
  const detail=useQuery({queryKey:['passport-test-detail',id],queryFn:()=>passportRequest({action:'inspect',id}),enabled:!!id,retry:false,staleTime:0});
  if(!id&&!loading&&!error)return null;
  return <section className="passport-result" aria-label="Laatste testresultaat"><header className="passport-result-heading"><div><span className="ep-eyebrow">JE TESTRESULTAAT</span><h2>Je laatste test, als paspoort</h2><p>Dit is de opgeslagen koppeling, niet het formulier om een nieuwe test te maken.</p></div>{id&&<button className="ep-button" onClick={()=>onOpen(id)}>Open bewijs & beoordeling</button>}</header>
    {loading||detail.isPending&&id?<p role="status">Testpaspoort laden en eigendom controleren…</p>:error||detail.error?<div role="alert"><p>{error||detail.error.message}</p>{id&&<button className="ep-link" onClick={()=>detail.refetch()}>Opnieuw controleren</button>}</div>:detail.data&&<><PassportCard data={detail.data}/><button className="ep-link" disabled={detail.isFetching} onClick={()=>detail.refetch()}>{detail.isFetching?'Eigendom controleren…':'Eigendomscontrole vernieuwen'}</button></>}
  </section>;
}