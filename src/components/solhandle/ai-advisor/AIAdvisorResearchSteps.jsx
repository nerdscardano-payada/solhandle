import { CheckCircle2, Circle, Loader2 } from 'lucide-react';
const steps=[
 ['Submission checks','Validate the public website address, anti-spam check and research limits.'],
 ['Project research','AI first researches the submitted website, product features, audience and public documentation.'],
 ['Concrete integration proposals','Only after project research, AI assesses where, why and how SolHandle can improve existing project features.'],
 ['Evidence & report checks','Check the report format and source references, remove unsupported recommendations and rank the remaining opportunities.']
];
export default function AIAdvisorResearchSteps({ stage }) {
 const current=stage==='queued'?-1:stage==='validation'?3:stage==='proposals'?2:stage==='research'?1:0;
 return <ol className="advisor-research-steps" aria-label="Research stages">{steps.map(([title,description],i)=>{
 const done=i<current,active=i===current;
 const Icon=done?CheckCircle2:active?Loader2:Circle;
 return <li key={title} className={active?'advisor-step-active':''}><Icon size={20} className={active?'animate-spin':''}/><div><strong>{title}</strong><small>{done?'Completed':active?'In progress':'Pending'}</small><p>{description}</p></div></li>;
 })}</ol>;
}