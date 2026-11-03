import { CheckCircle2, Circle, Loader2 } from 'lucide-react';
const steps=[
 ['Submission checks','Validate the public website address, anti-spam check and research limits.'],
 ['Public research & integration assessment','AI looks for product pages and documentation, identifies actual features and audience, and assesses @handle resolution, wallet labels and SOL recipient checks.'],
 ['Evidence & report checks','Check the report format and source references, remove unsupported recommendations and rank the remaining opportunities.']
];
export default function AIAdvisorResearchSteps({ stage }) {
 const current=stage==='queued'?-1:stage==='validation'?2:stage==='research'?1:0;
 return <ol className="advisor-research-steps" aria-label="Research stages">{steps.map(([title,description],i)=>{
 const done=i<current,active=i===current;
 const Icon=done?CheckCircle2:active?Loader2:Circle;
 return <li key={title} className={active?'advisor-step-active':''}><Icon size={20} className={active?'animate-spin':''}/><div><strong>{title}</strong><small>{done?'Completed':active?'In progress':'Pending'}</small><p>{description}</p></div></li>;
 })}</ol>;
}