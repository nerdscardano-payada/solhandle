import { Link } from 'react-router-dom';
import AIAdvisorCode from '@/components/solhandle/ai-advisor/AIAdvisorCode';
const phases=[
 {title:'Choose the screen and prepare your server',phases:['Prepare']},
 {title:'Add the helper and connect your screen',phases:['Implement']},
 {title:'Check the results and safety before going live',phases:['Security review','Test']}
];
export default function AIAdvisorChecklistGroup({ group }) {
 return <div className="advisor-checklist-group"><h4>{group.title}</h4>
  {phases.map((step,index)=><div key={step.title}>
   <h4>{index+1}. {step.title}</h4>
   {index===0&&<p>Find the existing screen named in the proposal, such as a wallet header or recipient field. Make sure you can edit both that screen and the server operation it calls. If the project has no server operation for this yet, add one using its existing framework; the examples do not create one automatically. Keep the current wallet connection and signing unchanged.</p>}
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