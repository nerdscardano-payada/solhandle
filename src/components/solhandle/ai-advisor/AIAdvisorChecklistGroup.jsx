import { Link } from 'react-router-dom';
import AIAdvisorCode from '@/components/solhandle/ai-advisor/AIAdvisorCode';
const phases=['Prepare','Implement','Security review','Test','Next action'];
export default function AIAdvisorChecklistGroup({ group, checked, toggle }) {
 return <div className="advisor-checklist-group"><h4>{group.title}</h4>
  {phases.filter(phase=>group.tasks.some(task=>task.phase===phase)).map((phase,index)=><div key={phase}>
   <h4>{index+1}. {phase==='Prepare'?'Prepare your integration':phase==='Implement'?'Install and integrate':phase==='Test'?'Test before going live':phase}</h4>
   <ol className="advisor-checklist-items">{group.tasks.filter(task=>task.phase===phase).map(task=><li key={task.id}>
    <label className="advisor-checklist-item"><input type="checkbox" checked={checked.includes(task.id)} onChange={()=>toggle(task.id)}/><span><span className={checked.includes(task.id)?'advisor-checklist-done':''}>{task.text}</span></span></label>
   </li>)}</ol>
   {phase==='Implement'&&group.capability&&<AIAdvisorCode capability={group.capability} inline/>}
  </div>)}
  {group.guide&&<Link to={`/integrations/${group.guide}`}>Open integration guide</Link>}
 </div>;
}