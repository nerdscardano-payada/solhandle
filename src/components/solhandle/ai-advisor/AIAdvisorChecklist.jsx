import AIAdvisorChecklistGroup from '@/components/solhandle/ai-advisor/AIAdvisorChecklistGroup';
import '@/components/solhandle/ai-advisor/advisor-checklist.css';

export default function AIAdvisorChecklist({ analysis }) {
 const report=analysis.report;
 const groups=(report.opportunities||[]).map((opportunity,index)=>({
  title:opportunity.title,guide:opportunity.guide,capability:opportunity.capability,
  tasks:[['Prepare',opportunity.requirements],['Implement',opportunity.steps],['Security review',opportunity.security_notes],['Test',opportunity.tests]]
   .flatMap(([phase,items])=>(items||[]).map((text,i)=>({id:`${index}:${phase}:${i}`,phase,text})))
 }));
 return <section className="advisor-checklist" aria-label="Integration onboarding">
  <h3>Start with one integration</h3>
  <p>Choose the proposal that best fits {report.project_name}. You do not need to implement every proposal: each is an independent starting point. Follow three steps below, with no forms or mandatory checkboxes.</p>
  {groups.length?groups.map((group,index)=><AIAdvisorChecklistGroup key={index} group={group}/>):<p className="advisor-muted">No integration proposal is available yet. Use the next steps above to clarify the fit before implementation.</p>}
  <p className="advisor-muted">The examples are starting points to adapt, not executed integrations. Validate ownership, recipient safety and error handling before going live.</p>
 </section>;
}