import { passportInput, passportOwner } from './tokenPassportTestProof.ts';
import { passportToken } from './tokenPassportMetadata.ts';
import { memberPassportChallenge, verifyMemberPassport } from './memberPassportProof.ts';
import { changePassportTest, passportFailure, passportEvent } from './tokenPassportTestStore.ts';
export async function memberRegistration(db,url,wallet,origin,body) {
  const input=passportInput(body);
  if(input.wallet!==wallet)throw passportFailure('The connected wallet changed. Unlock again.',403);
  if(body.action==='challenge') {
    const owner=await passportOwner(url,input.handle,wallet);
    return memberPassportChallenge(wallet,origin,'create',input,owner.assetAddress);
  }
  const proof=await verifyMemberPassport(body.proof,body.signature,origin,'create');
  if(proof.wallet!==wallet||JSON.stringify(proof.input)!==JSON.stringify(input))throw passportFailure('The registration changed. Sign again.',409);
  const owner=await passportOwner(url,input.handle,wallet,proof.asset),token=await passportToken(url,input.mint);
  const payloadHash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(proof.message))),b=>b.toString(16).padStart(2,'0')).join('');
  return changePassportTest(db,state=>{
    if(Date.parse(proof.expires_at)<=Date.now())throw passportFailure('Registration signature expired. Sign again.',401);
    if(state.items.some(row=>row.member_nonce===proof.nonce))throw passportFailure('This registration signature was already used.',409);
    if(state.items.some(row=>row.wallet===wallet&&row.mint===input.mint&&row.asset===owner.assetAddress))throw passportFailure('This handle and token already have a registration from your wallet.',409);
    const item={id:crypto.randomUUID(),revision:1,...input,source:'MEMBER',member_nonce:proof.nonce,asset:owner.assetAddress,token,token_name:token.name,token_symbol:token.symbol,proof_level:2,signature:body.signature,signed_message:proof.message,payload_hash:payloadHash,operator:wallet,created_at:new Date().toISOString(),checked_at:new Date().toISOString(),ownership:'observed',status:'pending',review_reason:''};
    state.items.push(item);passportEvent(state,item,wallet,'member_signed_association_created');
    return {id:item.id};
  });
}