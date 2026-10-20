import { text, url, email, choice, choices, projectKey, fail } from './integrationOptions.ts';
export function validateIntake(body) {
  if (body.consent !== true) fail('Privacy consent is required.');
  if (!['project','nomination'].includes(body.type)) fail('Choose an intake flow.');
  const common = { project_name:text(body.project_name,'project name',120,true), source:['integration-center','demo-lab','direct'].includes(body.source) ? body.source : 'direct', status:'NEW', priority:'NORMAL', privacy_consent_at:new Date().toISOString() };
  if (body.type === 'nomination') {
    if (body.disclaimer !== true) fail('Confirm that this is a community suggestion, not project interest.');
    const project_url = url(body.project_url,true);
    return { ...common, project_url, project_key:projectKey(project_url), category:body.category ? choice(body.category,'product_types') : '', reason:text(body.reason,'reason',1000,true), submitter_contact:text(body.submitter_contact,'your X / email',254), disclaimer_accepted_at:new Date().toISOString() };
  }
  const website = url(body.website,true);
  return { ...common, website, project_key:projectKey(website), x_url:text(body.x_url,'X account',200), contact_name:text(body.contact_name,'contact name',100,true), contact_email:email(body.contact_email), contact_social:text(body.contact_social,'Telegram / Discord',200), contact_role:choice(body.contact_role,'contact_role'), product_types:choices(body.product_types,'product_types'), use_cases:choices(body.use_cases,'use_cases'), network:choice(body.network,'network'), tech_stack:choices(body.tech_stack,'tech_stack'), integration_preference:choices(body.integration_preference,'integration_preference'), project_stage:choice(body.project_stage,'project_stage'), additional_info:text(body.additional_info,'additional information',1000), supporting_link:url(body.supporting_link), rule_version:'1.0', technical_review_requested:false };
}