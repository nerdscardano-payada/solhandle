import { useState } from 'react';
import AIAdvisorChecklistGroup from '@/components/solhandle/ai-advisor/AIAdvisorChecklistGroup';
import '@/components/solhandle/ai-advisor/advisor-checklist.css';

export default function AIAdvisorChecklist({ analysis }) {
 const report=analysis.report;
 const storageKey=`advisor-checklist:${JSON.stringify([analysis.website,analysis.completed_at,analysis.prompt_version])}`;
 const groups=(report.opportunities||[]).map((opportunity,index)=>({
  title:opportunity.title,guide:opportunity.guide,capability:opportunity.capability,
  tasks:[['Prepare',opportunity.requirements],['Implement',opportunity.steps],['Security review',opportunity.security_notes],['Test',opportunity.tests]]
   .flatMap(([phase,items])=>(items||[]).map((text,i)=>({id:`${index}:${phase}:${i}`,phase,text})))
 }));
 if(report.next_actions?.length)groups.push({title:report.opportunities?.length?'Project next actions':'Clarify before integrating',tasks:report.next_actions.map((text,i)=>({id:`next:${i}`,phase:'Next action',text}))});
 const tasks=groups.flatMap(group=>group.tasks);
 const [progress,setProgress]=useState(()=>{
  try {const saved=JSON.parse(localStorage.getItem(storageKey)||'[]');return {checked:Array.isArray(saved)?saved.filter(id=>typeof id==='string'):[],persistent:true};}
  catch{return {checked:[],persistent:false};}
 });
 const completed=tasks.filter(task=>progress.checked.includes(task.id)).length;
 function toggle(id) {
  const checked=progress.checked.includes(id)?progress.checked.filter(value=>value!==id):[...progress.checked,id];
  let persistent=true;
  try{localStorage.setItem(storageKey,JSON.stringify(checked));}catch{persistent=false;}
  setProgress({checked,persistent});
 }
 return <section className="advisor-checklist" aria-label="Interactive integration checklist">
  <h3>Integration onboarding: steps and code</h3>
  <p>Follow these steps for {report.project_name}: prepare, integrate the SDK example, review security and test. The code is visible in the implementation step; adapt it to your platform. Tick each action as you work through it.</p>
  {!report.opportunities?.length&&<p className="advisor-muted">No integration proposal is available yet. Complete these clarification steps before starting implementation.</p>}
  {tasks.length>0?<>
   <p role="status" className="advisor-muted">{completed} of {tasks.length} actions checked</p>
   <progress className="advisor-checklist-progress" value={completed} max={tasks.length} aria-label="Checklist completion"/>
   {groups.filter(group=>group.tasks.length).map((group,index)=><AIAdvisorChecklistGroup key={index} group={group} checked={progress.checked} toggle={toggle}/>)}
   <p className="advisor-muted">{progress.persistent?'Your checklist progress is saved only in this browser.':'Progress is kept for this visit only; browser storage is unavailable.'} Sharing the report does not share your checkmarks. Checking an item does not run tests, execute an integration or grant official verification.</p>
  </>:<p className="advisor-muted">This analysis contains no actionable steps. Start a new analysis or request technical review before integrating.</p>}
 </section>;
}