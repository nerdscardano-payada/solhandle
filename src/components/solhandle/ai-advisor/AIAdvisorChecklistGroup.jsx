import { Link } from 'react-router-dom';
import AIAdvisorCode from '@/components/solhandle/ai-advisor/AIAdvisorCode';
const phases=[
 {title:'Choose where it fits',phases:['Prepare']},
 {title:'Add the integration',phases:['Implement']},
 {title:'Validate before going live',phases:['Security review','Test']}
];
export default function AIAdvisorChecklistGroup({ group }) {
 return <div className="advisor-checklist-group"><h4>{group.title}</h4>
  {phases.map((step,index)=><div key={step.title}>
   <h4>{index+1}. {step.title}</h4>
   {index===0&&<p>Start with the relevant screen or user flow in your product; keep your existing wallet connection and signing.</p>}
   {step.phases.map(phase=>{
    const tasks=group.tasks.filter(task=>task.phase===phase);
    return tasks.length>0&&<div key={phase}>
     {index===2&&<p className="advisor-muted">{phase==='Security review'?'Security considerations':'Tests to perform, not yet executed'}</p>}
     <ul>{tasks.map(task=><li key={task.id}>{task.text}</li>)}</ul>
    </div>;
   })}
   {index===1&&group.capability&&<AIAdvisorCode capability={group.capability} inline/>}
  </div>)}
  {group.guide&&<Link to={`/integrations/${group.guide}`}>Detailed integration guide</Link>}
 </div>;
}