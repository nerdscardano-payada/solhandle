export function advisorUnavailableOutcome(request, analysis, reason) {
 const completed=analysis?.completed_at||request.updated_date||new Date().toISOString();
 return {website:request.website,status:'partial',knowledge_version:analysis?.knowledge_version||'Not established',prompt_version:analysis?.prompt_version||'Not established',completed_at:completed,expires_at:analysis?.expires_at||new Date(Date.parse(request.created_date)+30*86400000).toISOString(),report:{
  project_name:request.project_name||new URL(request.website).hostname,
  summary:'The submitted project could not be fully assessed. This is a diagnostic result, not a completed AI product analysis.',
  audience:'Not established from verified public sources.',categories:[],technology_stack:[],
  findings:[{claim:reason,certainty:'inference',source_indexes:[]}],
  unknowns:['Product features, target audience and technical stack have not been reliably established.','Whether forward resolution, primary-handle labels or SOL recipient validation fit this project remains unassessed.'],
  limitations:['No evidence-backed recommendation is presented without a successfully validated research report. This does not mean the project is unsuitable for integration.'],
  no_fit_reason:'Integration suitability could not be determined. No implementation should be based on this incomplete result.',sources:[],opportunities:[],
  next_actions:['Retry the analysis with the public project website.','If research remains unavailable, request technical review through the integration intake.']
 }};
}