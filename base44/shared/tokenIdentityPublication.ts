import { passportFailure } from './tokenPassportTestStore.ts';
import { withPassportLock } from './passportLock.ts';
import { getPassport, commitPassport } from './passportRegistrationStore.ts';
import { passportOwner, checkPassportSignature } from './tokenPassportTestProof.ts';
import { publicPassportData } from './projectPassportFlow.ts';
import { passportTokenLogo } from './passportTokenLogo.ts';
export async function publicIdentityRows(db, mint) {
  const page=await db.PublicTokenIdentity.filter({mint},{limit:2});
  if(page.items.length>1) throw passportFailure('Conflicting public records. Administrator review is required.',409);
  return page.items[0]||null;
}
export async function passportPublication(db,url,user,_registry,item,body,origin) {
  if(body.action==='publication') {
    const existing=await publicIdentityRows(db,item.mint);
    return {auto_publish:item.flow==='PROJECT_V1'&&item.publication_opt_in===true,publication:existing?.association_id===item.id?{status:item.public_active&&item.status==='approved'?existing.status:'WITHDRAWN',published_at:existing.published_at}:null};
  }
  if(body.action!=='withdrawPublic')await passportOwner(url,item.handle,item.wallet,item.asset);
  return withPassportLock(db,item.mint,async guard=>{
    let live=await getPassport(db,item.id);
    const existing=await publicIdentityRows(db,item.mint);
    if(body.action==='withdrawPublic') {
      if(existing?.association_id!==live.id&&!(live.flow==='PROJECT_V1'&&live.publication_opt_in))throw passportFailure('No public association or queued publication found for this registration.',404);
      await commitPassport(db,live,{public_active:false,publication_opt_in:false,publication_challenge:null},user.id,'public_withdrawn',guard);
      if(existing?.association_id===live.id){await guard();await db.PublicTokenIdentity.update(existing.id,{status:'WITHDRAWN',withdrawn_at:new Date().toISOString()});}
      return {status:'WITHDRAWN'};
    }
    if(live.status!=='approved')throw passportFailure('The association must be approved before requesting publication.',409);
    if(live.flow==='PROJECT_V1'&&live.project_verification?.status!=='reviewed')throw passportFailure('Project verification is required before publication.',409);
    if(existing&&existing.association_id!==live.id)throw passportFailure('This token already has another public association. Administrator review is required.',409);
    if(body.action==='publishChallenge') {
      const now=Date.now(),windowStart=live.signature_window||0,count=now-windowStart<60000?(live.signature_count||0):0;
      if(count>=5)throw passportFailure('Wait a minute before requesting another publication signature.',429);
      const key=crypto.randomUUID(),expires_at=new Date(now+180000).toISOString();
      const message=`SolHandle PUBLIC token identity publication\nOrigin: ${origin}\nNetwork: mainnet-beta\nOperator: ${user.id}\nAssociation: ${live.id}\nRevision: ${live.revision}\nToken mint: ${live.mint}\nHandle: @${live.handle}\nWallet: ${live.wallet}\nOfficial handle asset: ${live.asset}\nNonce: ${key}\nExpires: ${expires_at}\nI consent to publicly display this token-to-handle association, wallet, handle asset and publication dates. This is separate from the private registration signature. No proof of token creation, endorsement or safety. No payment or blockchain transaction.`;
      const challenge={key,operator:user.id,wallet:live.wallet,origin,revision:live.revision,message,expires_at,used:false};
      await commitPassport(db,live,{publication_challenge:challenge,signature_window:count?windowStart:now,signature_count:count+1},user.id,'publication_consent_requested',guard);
      return {challengeKey:key,message,expires_at};
    }
    const proof=live.publication_challenge;
    if(!proof||proof.key!==body.challengeKey||proof.operator!==user.id||proof.origin!==origin||proof.revision!==live.revision||Date.parse(proof.expires_at)<=Date.now())throw passportFailure('Publication consent expired or changed. Sign again.',401);
    await checkPassportSignature(proof,body.signature);
    if(proof.used&&(!live.public_active||live.public_consent?.challenge_key!==proof.key))throw passportFailure('Publication consent already used. Sign again.',401);
    if(!proof.used)live=await commitPassport(db,live,{public_active:true,publication_challenge:{...proof,used:true},public_consent:{challenge_key:proof.key,message:proof.message,signature:body.signature,signed_at:new Date().toISOString(),revision:live.revision}},user.id,'public_published',guard);
    const data=publicPassportData(live,live.flow==='PROJECT_V1'?await passportTokenLogo(url,live.mint):null);
    await guard();
    if(existing)await db.PublicTokenIdentity.update(existing.id,data);else await db.PublicTokenIdentity.create(data);
    return {status:'ACTIVE'};
  });
}