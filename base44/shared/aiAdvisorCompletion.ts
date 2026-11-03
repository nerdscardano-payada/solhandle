import { proposeAdvisorIntegrations } from './aiAdvisorProjectResearch.ts';
import { advisorPromptVersion } from './aiAdvisorKnowledge.ts';
export async function completeAdvisorProposals(base44,request,analysis,research) {
 await base44.entities.AIAnalysisRequest.update(request.id,{message:'Preparing concrete integration proposals based on the researched project features.'});
 const report=await proposeAdvisorIntegrations(base44,request,research);
 await base44.entities.AIAnalysisRequest.update(request.id,{message:'Checking source references, evidence and integration recommendations.'});
 // Routine public-research caveats do not make a successfully completed assessment partial.
 const partial=!report.sources.length||!report.findings.some(f=>f.certainty==='source-supported'),status=partial?'partial':'completed';
 await base44.entities.AIIntegrationAnalysis.update(analysis.id,{status,report,error_code:'',prompt_version:advisorPromptVersion,completed_at:new Date().toISOString()});
 await base44.entities.AIAnalysisRequest.update(request.id,{status,message:partial?'Research returned partial findings. Review the documented limitations.':'Research and product-fit assessment complete. Proposed integrations have not been implemented, tested or officially verified.'});
 return {status,opportunities:report.opportunities.length};
}