import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { secrets } from 'base44:runtime';
import { advisorUnavailableOutcome } from '../../shared/aiAdvisorOutcome.ts';
import { advisorResearchLimit } from '../../shared/aiAdvisorResearchLimit.ts';
import { publicWebsite } from '../../shared/aiAdvisorContract.ts';
import { researchAdvisorProject, validateProjectResearch } from '../../shared/aiAdvisorProjectResearch.ts';
import { completeAdvisorProposals } from '../../shared/aiAdvisorCompletion.ts';
import { advisorKnowledgeVersion, advisorPromptVersion } from '../../shared/aiAdvisorKnowledge.ts';
export default async function(req) {
 let base44,request,analysis,projectResearch;
 try {
  base44=createClientFromRequest(req);const user=await base44.auth.me().catch(e=>e.status===401?null:Promise.reject(e));
  if(!user) return Response.json({error:'Sign in required.'},{status:401});
  if(user.role!=='admin') return Response.json({error:'Administrator access required.'},{status:403});
  const body=await req.json().catch(()=>({}));
  if(typeof body.request_id!=='string'||body.request_id.length>100) return Response.json({error:'request_id is required.'},{status:400});
  const db=base44.entities;
  request=await db.AIAnalysisRequest.get(body.request_id).catch(e=>e.status===404?null:Promise.reject(e));
  if(!request)return Response.json({error:'Request not found.'},{status:404});
  if(body.action==='reassess_proposals') {
   const page=await db.AIIntegrationAnalysis.filter({request_id:request.id},{sort:'-created_date',limit:1}),saved=page.items[0];
   if(!saved||!['completed','partial'].includes(saved.status)||Date.parse(saved.expires_at)<=Date.now())return Response.json({error:'No retained research available.'},{status:409});
   if(saved.prompt_version===advisorPromptVersion)return Response.json({skipped:true,reason:'Already assessed with the current instructions.'});
   // Admin-only, once per instruction version. Reuse evidence; do not bypass public submission limits.
   projectResearch=validateProjectResearch(saved.report,request.website);
   analysis=saved;
   await db.AIIntegrationAnalysis.update(analysis.id,{status:'researching',prompt_version:advisorPromptVersion});
   await db.AIAnalysisRequest.update(request.id,{status:'researching'});
   return Response.json(await completeAdvisorProposals(base44,request,analysis,projectResearch));
  }
  if(request.status!=='queued') return Response.json({skipped:true});
  await db.AIAnalysisRequest.update(request.id,{message:'Checking the submission, anti-spam verification and research limits.'});
  const website=publicWebsite(request.website);
  if(!/^[a-f0-9]{64}$/.test(request.access_hash)||!request.human_token||!['Automatic','TypeScript','JavaScript','Other'].includes(request.language)||(request.description||'').length>1000||(request.project_name||'').length>80) throw new Error('INVALID_SUBMISSION');
  const validation=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({secret:secrets.get('TURNSTILE_SECRET_KEY'),response:request.human_token}),signal:AbortSignal.timeout(10000)});
  if(!validation.ok) throw new Error('HUMAN_CHECK_UNAVAILABLE');
  const human=await validation.json(),hosts=['solhandle.io','www.solhandle.io','sol-handle-core.base44.app'];
  const appUrl=req.headers.get('x-base44-app-url');if(appUrl)hosts.push(new URL(appUrl).hostname);
  if(!human.success||human.action!=='ai_advisor'||!hosts.includes(human.hostname)) throw new Error('HUMAN_CHECK_FAILED');
  await db.AIAnalysisRequest.update(request.id,{human_token:''});
  const [limit,existing]=await Promise.all([advisorResearchLimit(db,website),db.AIIntegrationAnalysis.count({request_id:request.id})]);
  if(existing) return Response.json({skipped:true});
  if(limit) {
   await db.AIAnalysisRequest.update(request.id,{status:'failed',message:limit.message,human_token:''});
   return Response.json({status:'failed',error:limit.code,retry_after:limit.retry_after});
  }
  analysis=await db.AIIntegrationAnalysis.create({request_id:request.id,website,status:'researching',knowledge_version:advisorKnowledgeVersion,prompt_version:advisorPromptVersion,started_at:new Date().toISOString(),expires_at:new Date(Date.now()+30*86400000).toISOString()});
  await db.AIAnalysisRequest.update(request.id,{status:'researching',message:'Researching the submitted project: product features, audience and public documentation.'});
  projectResearch=await researchAdvisorProject(base44,request,website);
  await db.AIIntegrationAnalysis.update(analysis.id,{report:projectResearch});
  return Response.json(await completeAdvisorProposals(base44,request,analysis,projectResearch));
 } catch(error) {
  console.error('Advisor research failed',error.message);
  const known=['HUMAN_CHECK_FAILED','HUMAN_CHECK_UNAVAILABLE','INVALID_SUBMISSION','DAILY_LIMIT'];
  const code=known.includes(error.message)?error.message:'RESEARCH_FAILED';
  const message=code==='DAILY_LIMIT'?'The daily research limit has been reached. Try another day.':code.startsWith('HUMAN_')?'The anti-spam check expired or failed. Start a new analysis.':'Research could not be completed. Please start a new analysis or contact SolHandle.';
  if(analysis) {
   const reason='Public research was started, but a usable, validated AI report could not be produced. No product claims or integration recommendations have been confirmed.';
   const outcome=advisorUnavailableOutcome(request,analysis,reason);
   const report=projectResearch?{...projectResearch,limitations:[...projectResearch.limitations.slice(0,11),'Project research completed, but the integration proposal stage could not finish. No integration recommendation is presented.'],next_actions:['Retry the analysis to generate project-specific proposals.','Request technical review using the project findings above.']}:outcome.report;
   await base44.entities.AIIntegrationAnalysis.update(analysis.id,{status:'partial',report,error_code:code,completed_at:new Date().toISOString()});
   await base44.entities.AIAnalysisRequest.update(request.id,{status:'partial',message:'A limited result is available. Research could not be completed; review the diagnostic finding and next steps.',human_token:''});
   return Response.json({status:'partial',opportunities:0});
  }
  if(request) await base44.entities.AIAnalysisRequest.update(request.id,{status:'failed',message,human_token:''});
  return Response.json({error:code},{status:500});
 }
}