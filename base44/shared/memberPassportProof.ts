import { secrets } from 'base44:runtime';
import { passportFailure } from './tokenPassportTestStore.ts';
import { checkPassportSignature } from './tokenPassportTestProof.ts';
const encode = value => btoa(String.fromCharCode(...new TextEncoder().encode(value)));
const decode = value => new TextDecoder().decode(Uint8Array.from(atob(value), c => c.charCodeAt(0)));
async function signingKey() {
  const secret=secrets.get('TOKEN_PASSPORT_AUTH_SECRET');
  if(!secret||secret.length<32)throw passportFailure('Wallet authorization is temporarily unavailable.',503);
  return crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign','verify']);
}
export async function memberPassportChallenge(wallet, origin, purpose, input = null, asset = null) {
  const expires_at=new Date(Date.now()+(purpose==='access'?3600000:180000)).toISOString(), nonce=crypto.randomUUID();
  const message=`SolHandle Token Passport ${purpose==='access'?'private wallet access':'private registration'}\nOrigin: ${origin}\nNetwork: mainnet-beta\nWallet: ${wallet}\nNonce: ${nonce}\nExpires: ${expires_at}\n${purpose==='access'?'Allow access to my own registrations for one hour. This does not create or publish an association.':`Handle: @${input.handle}\nHandle asset: ${asset}\nToken mint: ${input.mint}\nNote: ${JSON.stringify(input.note)}\nI submit this association for administrator review. It remains private until I give separate signed publication consent.`}\nNo payment or blockchain transaction. No proof of token creation, endorsement or safety.`;
  const payload=encode(JSON.stringify({scope:'SOLHANDLE_MEMBER_PASSPORT_V1',wallet,origin,purpose,input,asset,nonce,expires_at,message}));
  const mac=await crypto.subtle.sign('HMAC',await signingKey(),new TextEncoder().encode(payload));
  return {proof:payload+'.'+btoa(String.fromCharCode(...new Uint8Array(mac))),message,expires_at};
}
export async function verifyMemberPassport(proof, signature, origin, purpose) {
  if(typeof proof!=='string'||proof.length>6000)throw passportFailure('Unlock Token Passport with your wallet first.',401);
  let data;
  try {
    const parts=proof.split('.');
    if(parts.length!==2||!await crypto.subtle.verify('HMAC',await signingKey(),Uint8Array.from(atob(parts[1]),c=>c.charCodeAt(0)),new TextEncoder().encode(parts[0])))throw new Error();
    data=JSON.parse(decode(parts[0]));
  }catch{throw passportFailure('Invalid wallet authorization. Sign again.',401);}
  if(data.scope!=='SOLHANDLE_MEMBER_PASSPORT_V1'||data.origin!==origin||data.purpose!==purpose||!Number.isFinite(Date.parse(data.expires_at))||Date.parse(data.expires_at)<=Date.now())throw passportFailure('Wallet authorization expired. Unlock again.',401);
  await checkPassportSignature(data,signature);
  return data;
}