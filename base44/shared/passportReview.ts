import { passportFailure } from './tokenPassportTestStore.ts';
import { passportOwner } from './tokenPassportTestProof.ts';
import { withPassportLock } from './passportLock.ts';
import { getPassport, commitPassport } from './passportRegistrationStore.ts';
import { publicIdentityRows } from './tokenIdentityPublication.ts';
export async function reviewPassport(db,url,user,item,body) {
  if(!['approved','rejected','suspended'].includes(body.status)||typeof body.reason!=='string'||body.reason.trim().length<5||body.reason.length>300||!Number.isInteger(body.revision))throw passportFailure('Choose a decision and give a reason of 5–300 characters.');
  if(body.status==='approved')await passportOwner(url,item.handle,item.wallet,item.asset);
  return withPassportLock(db,item.mint,async guard=>{
    const live=await getPassport(db,item.id);
    if(live.revision!==body.revision)throw passportFailure('This registration changed. Reload before reviewing.',409);
    const changes={status:body.status,review_reason:body.reason.trim(),revision:live.revision+1,reviewed_at:new Date().toISOString(),public_active:false,publication_challenge:null};
    if(body.status==='approved'){changes.checked_at=new Date().toISOString();changes.ownership='observed';}
    await commitPassport(db,live,changes,user.id,'review_'+body.status,guard,changes.review_reason);
    const published=await publicIdentityRows(db,item.mint);
    if(published?.association_id===item.id&&published.status==='ACTIVE') {
      await guard();
      await db.PublicTokenIdentity.update(published.id,{status:'WITHDRAWN',withdrawn_at:new Date().toISOString()});
    }
    return {id:item.id};
  });
}