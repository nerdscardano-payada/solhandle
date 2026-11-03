import { useState } from 'react';
import IntakeTurnstile from '@/components/solhandle/onboarding/IntakeTurnstile';
export default function AIAdvisorForm({ flow }) {
 const [token,setToken]=useState('');
 const config=flow.config;
 const initialWebsite=(new URLSearchParams(window.location.search).get('website')||'').slice(0,500);
 function submit(event){event.preventDefault();const values=Object.fromEntries(new FormData(event.currentTarget));flow.start({...values,human_token:token,consent:values.consent==='on'});setToken('');}
 if(config.isPending)return <p role="status">Preparing secure project submission…</p>;
 if(config.isError)return <div role="alert"><p>The submission form could not be loaded.</p><button className="ep-button" onClick={()=>config.refetch()}>Try again</button></div>;
 return <div className="advisor-panel"><form className="advisor-form" onSubmit={submit}>
 <label className="advisor-wide">Project website <input name="website" type="url" placeholder="https://…" defaultValue={initialWebsite} maxLength={500} required pattern="https://.*"/></label>
 <label>Project name (optional)<input name="project_name" maxLength={80}/></label>
 <label>Preferred development language<select name="language" defaultValue="Automatic"><option>Automatic</option><option>TypeScript</option><option>JavaScript</option><option>Other</option></select></label>
 <label className="advisor-wide">Project description (optional)<textarea name="description" maxLength={1000} placeholder="AI will independently research the public website."/></label>
 <label className="advisor-consent advisor-wide"><input name="consent" type="checkbox" required/><span>I agree to sending these public project details to the AI research service and saving a report for 30 days. Anyone I share the report link with can read it without logging in. I will not submit confidential information.</span></label>
 <div className="advisor-wide"><IntakeTurnstile siteKey={config.data.site_key} onToken={setToken} resetKey={flow.resetKey} action="ai_advisor"/></div>
 <div className="advisor-wide"><button className="ep-button" type="submit" disabled={flow.busy||!token}>{flow.busy?'Submitting…':'Analyze Project'}</button>{flow.error&&<p role="alert" className="advisor-error">{flow.error}</p>}</div>
 </form><p className="advisor-muted">Anyone can analyze a public project website, including community members who are not associated with the project. No wallet or account required. Share the report link with the project owner or team. Reports are not listed publicly, but anyone with the link can read them for 30 days. An analysis does not establish ownership, endorsement or a partnership. SolHandle administrators can access submissions for operation and review.</p></div>;
}