export default function AdvisorAdminMetrics({ query }){
 if(query.isPending)return <p role="status" className="ep-small">Overzicht laden…</p>;
 if(query.isError)return <div role="alert"><p>De totalen konden niet worden geladen.</p><button className="ep-button" onClick={()=>query.refetch()}>Totalen opnieuw laden</button></div>;
 const data=query.data;
 return <section aria-label="AI Advisor totalen" className="advisor-admin-metrics">{[['Aanvragen',data.total],['Beschikbare rapporten',data.reports],['Mislukte aanvragen',data.failed],['Wachtrij / onderzoek',data.active]].map(([label,value])=><div className="ep-card" key={label}><span className="ep-small">{label}</span><strong>{value.toLocaleString('nl-BE')}</strong></div>)}<p className="ep-small">Totalen van alle bewaarde aanvragen en rapporten, onafhankelijk van de filters. Voltooid betekent een onderzoeksrapport, niet een geteste of officieel geverifieerde integratie.</p></section>;
}