import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { secrets } from 'base44:runtime';
import { advisorHash, publicWebsite } from '../../shared/aiAdvisorContract.ts';
import { advisorResearchLimit } from '../../shared/aiAdvisorResearchLimit.ts';
export default async function(req) {
 try {
  const base44=createClientFromRequest(req), body=await req.json().catch(()=>({}));
  if(body.action==='config') return Response.json({site_key:secrets.get('TURNSTILE_SITE_KEY')});
  if(body.action==='start') {
   let website;try{website=publicWebsite(body.website);}catch{return Response.json({error:'Enter a public HTTPS project website.'},{status:400});}
   if(typeof body.human_token!=='string'||!body.human_token||body.human_token.length>2048||typeof body.description!=='string'||body.description.length>1000||typeof body.project_name!=='string'||body.project_name.length>80||!['Automatic','TypeScript','JavaScript','Other'].includes(body.language)||body.consent!==true) return Response.json({error:'Check the form and complete the anti-spam check.'},{status:400});
   const token=crypto.randomUUID()+crypto.randomUUID(),accessHash=await advisorHash(token);
   // Public submission is user-scoped. Only an authenticated admin workflow may validate CAPTCHA and spend AI credits.
   const record=await base44.entities.AIAnalysisRequest.create({website,project_name:body.project_name.trim(),description:body.description.trim(),language:body.language,access_hash:accessHash,human_token:body.human_token,status:'queued',message:'Waiting for the protected research workflow.'});
   return Response.json({id:record.id,token},{status:202});
  }
  if(body.action!=='status') return Response.json({error:'Unsupported operation.'},{status:400});
  if(typeof body.id!=='string'||body.id.length>100||typeof body.token!=='string'||body.token.length!==72) return Response.json({error:'A valid private recovery link is required.'},{status:400});
  // Deliberately public receipt lookup: a long random secret is the authorization, never a record id alone.
  const {items}=await base44.asServiceRole.entities.AIAnalysisRequest.filter({id:body.id,access_hash:await advisorHash(body.token)},{limit:1});
  const request=items[0];
  if(!request||Date.parse(request.created_date)<Date.now()-30*86400000) return Response.json({error:'Analysis not found or recovery link expired.'},{status:404});
  const {items:results}=await base44.asServiceRole.entities.AIIntegrationAnalysis.filter({request_id:request.id},{sort:'-created_date',limit:1});
  const analysis=results[0];
  const stalled=['queued','researching'].includes(analysis?.status||request.status)&&Date.parse(analysis?.started_at||request.created_date)<Date.now()-10*60000;
  const status=stalled?'failed':analysis?.status||request.status;
  const message=stalled?'The background job has not finished within ten minutes. A diagnostic result is shown; a later completed report can still replace it.':request.message||'';
  const stage=status==='queued'?(message.startsWith('Checking the submission')?'submission':'queued'):message.startsWith('Checking source references')?'validation':message.startsWith('Preparing concrete integration')?'proposals':'research';
  const ready=analysis&&['completed','partial'].includes(analysis.status);
  const limited=status==='failed'&&/research limit has been reached|research limit for this website has been reached/.test(message);
  const limit=limited?await advisorResearchLimit(base44.asServiceRole.entities,request.website):null;
  const outcome=ready?{website:analysis.website,status:analysis.status,report:analysis.report,knowledge_version:analysis.knowledge_version,prompt_version:analysis.prompt_version,completed_at:analysis.completed_at,expires_at:analysis.expires_at}:null;
  const failureMessage=stalled?'The background job has not finished within ten minutes. No completed report is available yet. A later completed report can still appear.':limited?(limit?.message||'This request was blocked by the research limit. Capacity is available again; start a new analysis and complete the anti-spam check.'):message;
  return Response.json({id:request.id,status,stage,message:failureMessage,error_code:limited?(limit?.code||'DAILY_LIMIT'):undefined,retry_after:limit?.retry_after||null,analysis:outcome});
 } catch(error) {console.error('Advisor request failed',error.message);return Response.json({error:'The analysis service is temporarily unavailable. Please try again.'},{status:500});}
}