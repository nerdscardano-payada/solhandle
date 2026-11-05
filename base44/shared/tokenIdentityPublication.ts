import { changePassportTest, passportFailure, passportItem } from './tokenPassportTestStore.ts';
import { passportOwner, checkPassportSignature } from './tokenPassportTestProof.ts';
export async function publicIdentityRows(db, mint) {
  const page=await db.PublicTokenIdentity.filter({mint},{limit:2});
  if(page.items.length>1) throw passportFailure('Conflicting public records. Administrator review is required.',409);
  return page.items[0]||null;
}
export async function passportPublication(db,url,user,registry,item,body,origin) {
  const existing=await publicIdentityRows(db,item.mint);
  if(body.action==='publication') return {publication:existing?.association_id===item.id?{status:existing.status,published_at:existing.published_at}:null};
  if(body.action==='withdrawPublic') {
    if(existing?.association_id!==item.id) throw passportFailure('No public association found for this registration.',404);
    await db.PublicTokenIdentity.update(existing.id,{status:'WITHDRAWN',withdrawn_at:new Date().toISOString()});
    return {status:'WITHDRAWN'};
  }
  if(item.status!=='approved') throw passportFailure('The association must be approved before requesting public publication.',409);
  if(existing&&existing.association_id!==item.id) throw passportFailure('This mint already has another public association. Review it before replacing anything.',409);
  await passportOwner(url,item.handle,item.wallet,item.asset);
  if(body.action==='publishChallenge') {
    const key=crypto.randomUUID(),now=Date.now(),expires_at=new Date(now+180000).toISOString();
    const message=`SolHandle PUBLIC token identity publication\nOrigin: ${origin}\nNetwork: mainnet-beta\nOperator: ${user.id}\nAssociation: ${item.id}\nRevision: ${item.revision}\nToken mint: ${item.mint}\nHandle: @${item.handle}\nWallet: ${item.wallet}\nOfficial handle asset: ${item.asset}\nNonce: ${key}\nExpires: ${expires_at}\nI consent to publicly display this token-to-handle association, wallet, handle asset and publication dates. This is a new public consent, separate from the private registration signature. It does not prove token creation, endorsement or safety. No payment or blockchain transaction.`;
    await changePassportTest(db,state=>{
      state.challenges=state.challenges.filter(row=>Date.parse(row.expires_at)>now);
      if(state.challenges.filter(row=>row.wallet===item.wallet&&Date.parse(row.issued_at)>now-60000).length>=5) throw passportFailure('Wait a minute before signing again.',429);
      state.challenges.push({key,purpose:'PUBLIC_TOKEN_IDENTITY',operator:user.id,wallet:item.wallet,association_id:item.id,revision:item.revision,origin,message,issued_at:new Date(now).toISOString(),expires_at,used:false});
    });
    return {challengeKey:key,message,expires_at};
  }
  const proof=registry.challenges.find(row=>row.key===body.challengeKey&&row.purpose==='PUBLIC_TOKEN_IDENTITY'&&row.operator===user.id&&row.origin===origin&&row.association_id===item.id&&row.revision===item.revision);
  if(!proof||proof.used||Date.parse(proof.expires_at)<=Date.now()) throw passportFailure('Publication consent expired. Sign again.',401);
  await checkPassportSignature(proof,body.signature);
  await changePassportTest(db,state=>{
    const live=passportItem(state,item.id),challenge=state.challenges.find(row=>row.key===proof.key);
    if(live.status!=='approved'||live.revision!==proof.revision||!challenge||challenge.used||Date.parse(challenge.expires_at)<=Date.now()) throw passportFailure('Registration or consent changed. Reload and sign again.',409);
    challenge.used=true;
    live.public_consent={message:proof.message,signature:body.signature,signed_at:new Date().toISOString()};
  });
  const now=new Date().toISOString(),data={mint:item.mint,handle:item.handle,wallet:item.wallet,asset:item.asset,association_id:item.id,token_name:item.token_name||'',token_symbol:item.token_symbol||'',status:'ACTIVE',signed_at:now,published_at:now,last_verified_at:now,withdrawn_at:null};
  if(existing) await db.PublicTokenIdentity.update(existing.id,data); else await db.PublicTokenIdentity.create(data);
  return {status:'ACTIVE'};
}