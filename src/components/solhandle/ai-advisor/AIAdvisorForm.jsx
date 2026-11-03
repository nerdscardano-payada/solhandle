import { useState } from 'react';
import IntakeTurnstile from '@/components/solhandle/onboarding/IntakeTurnstile';
export default function AIAdvisorForm({ flow }) {
 const [token,setToken]=useState('');
 const config=flow.config;
 function submit(event){event.preventDefault();const values=Object.fromEntries(new FormData(event.currentTarget));flow.start({...values,human_token:token,consent:values.consent==='on'});setToken('');}
 if(config.isPending)return <p role="status">Preparing secure project submission…</p>;
 if(config.isError)return <div role="alert"><p>The submission form could not be loaded.</p><button className="ep-button" onClick={()=>config.refetch()}>Try again</button></div>;
 return <div className="advisor-panel"><form className="advisor-form" onSubmit={submit}>
 <label className="advisor-wide">Project website <input name="website" type="url" placeholder="https://…" maxLength={500} required pattern="https://.*"/></label>
 <label>Project name (optional)<input name="project_name" maxLength={80}/></label>
 <label>Preferred development language<select name="language" defaultValue="Automatic"><option>Automatic</option><option>TypeScript</option><option>JavaScript</option><option>Other</option></select></label>
 <label className="advisor-wide">Project description (optional)<textarea name="description" maxLength={1000} placeholder="AI will independently research the public website."/></label>
 <label className="advisor-consent advisor-wide"><input name="consent" type="checkbox" required/><span>I agree to sending these project details to the AI research service and saving a private report accessible through my recovery link for 30 days. I will not submit confidential information.</span></label>
 <div className="advisor-wide"><IntakeTurnstile siteKey={config.data.site_key} onToken={setToken} resetKey={flow.resetKey} action="ai_advisor"/></div>
 <div className="advisor-wide"><button className="ep-button" type="submit" disabled={flow.busy||!token}>{flow.busy?'Submitting…':'Analyze My Project'}</button>{flow.error&&<p role="alert" className="advisor-error">{flow.error}</p>}</div>
 </form><p className="advisor-muted">No wallet or account required. Independent public research does not establish project ownership. Reports are not listed publicly. Anyone holding your private recovery link can open the report, including without login. SolHandle administrators can access submissions for operation and review.</p></div>;
}