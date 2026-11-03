import AdvisorAdminDetailContent from '@/components/solhandle/ai-advisor/admin/AdvisorAdminDetailContent';
export default function AdvisorAdminDetail({ flow }){
 const q=flow.detail;
 if(!flow.selected)return null;
 return <section id="advisor-admin-detail" className="advisor-admin-detail" tabIndex={-1}><div className="advisor-admin-detail-heading"><h2>Aanvraag en AI-toelichting</h2><button className="ep-button" onClick={()=>flow.setSelected(null)}>Details sluiten</button></div>
 {q.isPending?<p role="status">Aanvraag en rapport laden…</p>:q.isError?<div role="alert"><p>De aanvraag is niet beschikbaar of kon niet worden geladen.</p><button className="ep-button" onClick={()=>q.refetch()}>Opnieuw laden</button></div>:q.data?.request?<AdvisorAdminDetailContent data={q.data} close={()=>flow.setSelected(null)}/>:<p>De aanvraag is niet meer beschikbaar.</p>}
 </section>;
}