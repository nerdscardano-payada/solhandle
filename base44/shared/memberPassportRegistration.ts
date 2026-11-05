import { passportInput, passportOwner } from './tokenPassportTestProof.ts';
import { passportToken } from './tokenPassportMetadata.ts';
import { memberPassportChallenge, verifyMemberPassport } from './memberPassportProof.ts';
import { passportFailure } from './tokenPassportTestStore.ts';
import { withPassportLock } from './passportLock.ts';
import { insertPassport } from './passportRegistrationStore.ts';
export async function memberRegistration(db,url,wallet,origin,body,operator=wallet,source='MEMBER') {
  const purpose=source==='MEMBER'?'create':`adminCreate:${operator}`;
  const input=passportInput(body);
  if(source==='MEMBER'&&input.flow!=='PROJECT_V1')throw passportFailure('Use the project passport form and provide project evidence.');
  if(input.wallet!==wallet)throw passportFailure('The connected wallet changed. Unlock again.',403);
  if(body.action==='challenge') {
    if(source==='MEMBER'&&await db.TokenPassportRegistration.count({wallet,created_at:{$gt:new Date(Date.now()-60000).toISOString()}})>=5)throw passportFailure('Please wait a minute before registering another association.',429);
    const owner=await passportOwner(url,input.handle,wallet);
    return memberPassportChallenge(wallet,origin,purpose,input,owner.assetAddress);
  }
  const proof=await verifyMemberPassport(body.proof,body.signature,origin,purpose);
  if(proof.wallet!==wallet||JSON.stringify(proof.input)!==JSON.stringify(input))throw passportFailure('The registration changed. Sign again.',409);
  const owner=await passportOwner(url,input.handle,wallet,proof.asset),token=await passportToken(url,input.mint);
  const payloadHash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(proof.message))),b=>b.toString(16).padStart(2,'0')).join('');
  return withPassportLock(db,input.mint,async guard=>{
    if(Date.parse(proof.expires_at)<=Date.now())throw passportFailure('Registration signature expired. Sign again.',401);
    const item={id:crypto.randomUUID(),version:1,revision:1,...input,source,member_nonce:proof.nonce,asset:owner.assetAddress,token,token_name:token.name,token_symbol:token.symbol,proof_level:2,signature:body.signature,signed_message:proof.message,payload_hash:payloadHash,operator,created_at:new Date().toISOString(),checked_at:new Date().toISOString(),ownership:'observed',status:'pending',review_reason:'',public_active:false};
    if(input.flow==='PROJECT_V1')Object.assign(item,{publication_opt_in:true,project_verification:null,public_consent:null,submission_consent:{scope:'PROJECT_PASSPORT_V1',message:proof.message,signature:body.signature,signed_at:item.created_at}});
    return insertPassport(db,item,guard);
  });
}