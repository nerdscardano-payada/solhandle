import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
export default async function(req) {
 try {
  const base44=createClientFromRequest(req),user=await base44.auth.me().catch(e=>e.status===401?null:Promise.reject(e));
  if(!user)return Response.json({error:'Sign in required.'},{status:401});
  if(user.role!=='admin')return Response.json({error:'Administrator access required.'},{status:403});
  const body=await req.json().catch(()=>({}));
  if(body.action!=='purge_expired')return Response.json({error:'Unsupported operation.'},{status:400});
  const now=new Date().toISOString(),cutoff=new Date(Date.now()-30*86400000).toISOString();
  await base44.entities.AIIntegrationAnalysis.deleteMany({expires_at:{$lt:now}});
  await base44.entities.AIAnalysisRequest.deleteMany({created_date:{$lt:cutoff}});
  return Response.json({completed:true,retention_days:30});
 } catch(error){console.error('Advisor retention failed',error.message);return Response.json({error:'Retention cleanup failed.'},{status:500});}
}