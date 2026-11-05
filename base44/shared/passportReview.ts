import { passportFailure } from './tokenPassportTestStore.ts';
import { passportOwner, checkPassportSignature } from './tokenPassportTestProof.ts';
import { publicPassportData } from './projectPassportFlow.ts';
import { passportTokenLogo } from './passportTokenLogo.ts';
import { withPassportLock } from './passportLock.ts';
import { getPassport, commitPassport } from './passportRegistrationStore.ts';
import { publicIdentityRows } from './tokenIdentityPublication.ts';
export async function reviewPassport(db,url,user,item,body) {
  if(!['approved','rejected','suspended'].includes(body.status)||typeof body.reason!=='string'||body.reason.trim().length<5||body.reason.length>300||!Number.isInteger(body.revision))throw passportFailure('Choose a decision and give a reason of 5–300 characters.');
  const approving=body.status==='approved',project=item.flow==='PROJECT_V1';
  if(approving&&project&&body.projectVerified!==true)throw passportFailure('Review the project evidence and explicitly confirm project representation.');
  if(approving)await passportOwner(url,item.handle,item.wallet,item.asset);
  const logo=approving&&project?await passportTokenLogo(url,item.mint):null;
  return withPassportLock(db,item.mint,async guard=>{
    let live=await getPassport(db,item.id);
    if(live.revision!==body.revision)throw passportFailure('This registration changed. Reload before reviewing.',409);
    const published=await publicIdentityRows(db,item.mint),now=new Date().toISOString();
    const auto=approving&&project&&live.publication_opt_in===true;
    if(auto) {
      const consent=live.submission_consent;
      if(consent?.scope!=='PROJECT_PASSPORT_V1'||consent.message!==live.signed_message||consent.signature!==live.signature||!live.project_website||!live.project_evidence_url)throw passportFailure('Fresh project evidence and signed publication consent are required.',409);
      await checkPassportSignature({wallet:live.wallet,message:consent.message},consent.signature);
      if(published&&published.association_id!==live.id)throw passportFailure('This token has another public association. Resolve that association before approving publication.',409);
    }
    const changes={status:body.status,review_reason:body.reason.trim(),revision:live.revision+1,reviewed_at:now,public_active:false,publication_challenge:null};
    if(approving){changes.checked_at=now;changes.ownership='observed';}
    if(project){changes.project_verification=approving?{status:'reviewed',method:'manual_evidence',reviewed_at:now,reviewer:user.id,evidence_url:live.project_evidence_url}:null;if(!approving)changes.publication_opt_in=false;}
    live=await commitPassport(db,live,changes,user.id,'review_'+body.status,guard,changes.review_reason);
    if(published?.association_id===live.id&&published.status==='ACTIVE'){await guard();await db.PublicTokenIdentity.update(published.id,{status:'WITHDRAWN',withdrawn_at:now});}
    if(auto) {
      const consent={...live.submission_consent,revision:live.revision};
      const data=publicPassportData({...live,public_consent:consent},logo);
      await guard();
      const projection=published?await db.PublicTokenIdentity.update(published.id,{...data,status:'WITHDRAWN'}):await db.PublicTokenIdentity.create({...data,status:'WITHDRAWN'});
      await commitPassport(db,live,{public_active:true,public_consent:consent},user.id,'project_passport_published',guard);
      await guard();await db.PublicTokenIdentity.update(projection.id,{status:'ACTIVE',withdrawn_at:null});
    }
    return {id:live.id,published:auto};
  });
}