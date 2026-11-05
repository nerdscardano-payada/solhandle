import { passportFailure } from './tokenPassportTestStore.ts';
export function projectFields(body) {
  if(body.flow===undefined)return {};
  if(body.flow!=='PROJECT_V1'||body.publish_after_review!==true)throw passportFailure('Confirm publication after project verification.');
  const link=value=>{if(typeof value!=='string'||value.length>400)throw passportFailure('Provide an HTTPS project website and evidence link (up to 400 characters).');let url;try{url=new URL(value.trim());}catch{throw passportFailure('Provide valid HTTPS project and evidence links.');}if(url.protocol!=='https:'||url.username||url.password||url.href.length>400)throw passportFailure('Use HTTPS links without embedded credentials.');return url.href;};
  return {flow:'PROJECT_V1',project_website:link(body.project_website),project_evidence_url:link(body.project_evidence_url),publish_after_review:true};
}
export function publicPassportData(item,logo=null) {
  const reviewed=item.flow==='PROJECT_V1'&&item.project_verification?.status==='reviewed';
  return {mint:item.mint,handle:item.handle,wallet:item.wallet,asset:item.asset,association_id:item.id,token_name:item.token_name||'',token_symbol:item.token_symbol||'',status:'ACTIVE',signed_at:item.public_consent.signed_at,published_at:new Date().toISOString(),last_verified_at:item.checked_at||new Date().toISOString(),withdrawn_at:null,project_reviewed:reviewed,project_website:reviewed?item.project_website:'',project_reviewed_at:reviewed?item.project_verification.reviewed_at:null,token_logo:logo};
}