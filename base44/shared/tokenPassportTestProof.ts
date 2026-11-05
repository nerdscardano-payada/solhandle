import { PublicKey } from 'npm:@solana/web3.js@1.98.4';
import { resolveOnChain } from './solhandleResolver.ts';
import { profileHash } from './handleProfileProof.ts';
import { passportAddress } from './tokenPassportMetadata.ts';
import { changePassportTest, passportFailure, passportEvent } from './tokenPassportTestStore.ts';
export function passportInput(body) {
  const wallet = passportAddress(body.wallet), mint = passportAddress(body.mint);
  if (!PublicKey.isOnCurve(new PublicKey(wallet).toBytes())) throw passportFailure('Use a wallet that supports message signing.');
  const handle = String(body.handle || '').trim().replace(/^@/,'').toLowerCase();
  if (!/^[a-z0-9]{1,20}$/.test(handle) || typeof body.note !== 'string' || body.note.length > 240) throw passportFailure('Choose a valid handle and a note up to 240 characters.');
  return { wallet, mint, handle, note:body.note.trim() };
}
export async function passportOwner(url, handle, wallet, asset = null) {
  const current = await resolveOnChain(url,handle);
  if (!current?.verified || current.address !== wallet || (asset && current.assetAddress !== asset)) throw passportFailure('This wallet no longer owns the selected official SolHandle.',403);
  return current;
}
export async function issuePassportChallenge(db, url, user, input, origin) {
  const current = await passportOwner(url,input.handle,input.wallet), key = crypto.randomUUID(), now = Date.now(), expires_at = new Date(now+180000).toISOString();
  const payload_hash = await profileHash({network:'mainnet-beta',purpose:'TOKEN_PASSPORT_ADMIN_TEST_CREATE',operator:user.id,origin,...input,asset:current.assetAddress});
  const message = `SolHandle Token Passport TEST association\nOrigin: ${origin}\nNetwork: mainnet-beta\nOperator: ${user.id}\nWallet: ${input.wallet}\nHandle: @${input.handle}\nOfficial handle asset: ${current.assetAddress}\nToken mint: ${input.mint}\nChanges SHA-256: ${payload_hash}\nNonce: ${key}\nExpires: ${expires_at}\nI associate this token with my handle for an administrator-only test. This does NOT prove token creation, endorsement or safety. No transaction, payment or public publication.`;
  await changePassportTest(db,state=>{
    state.challenges=state.challenges.filter(row=>Date.parse(row.expires_at)>now);
    if (state.challenges.filter(row=>row.wallet===input.wallet && Date.parse(row.issued_at)>now-60000).length>=5) throw passportFailure('Wait a minute before requesting another signature.',429);
    state.challenges.push({key,operator:user.id,...input,asset:current.assetAddress,payload_hash,message,origin,issued_at:new Date(now).toISOString(),expires_at,used:false});
  });
  return {challengeKey:key,message,expires_at};
}
export async function checkPassportSignature(challenge, signature) {
  if (typeof signature!=='string' || signature.length>100) throw passportFailure('Sign the association with your wallet.',401);
  let valid=false;
  try { const bytes=Uint8Array.from(atob(signature),c=>c.charCodeAt(0)); const key=await crypto.subtle.importKey('raw',new PublicKey(challenge.wallet).toBytes(),'Ed25519',false,['verify']); valid=bytes.length===64 && await crypto.subtle.verify('Ed25519',key,bytes,new TextEncoder().encode(challenge.message)); } catch { valid=false; }
  if (!valid) throw passportFailure('Wallet signature verification failed.',401);
}
export async function savePassportAssociation(db, url, user, body, origin, registry, token) {
  const input=passportInput(body);
  const challenge=registry.challenges.find(row=>row.key===body.challengeKey && row.operator===user.id && row.origin===origin);
  if (!challenge || challenge.used || Date.parse(challenge.expires_at)<=Date.now()) throw passportFailure('This signature request expired or was used. Sign again.',401);
  const hash=await profileHash({network:'mainnet-beta',purpose:'TOKEN_PASSPORT_ADMIN_TEST_CREATE',operator:user.id,origin,...input,asset:challenge.asset});
  if (hash!==challenge.payload_hash) throw passportFailure('The registration changed after the signature request. Sign again.',409);
  await checkPassportSignature(challenge,body.signature);
  const owner=await passportOwner(url,input.handle,input.wallet,challenge.asset);
  return changePassportTest(db,state=>{
    const live=state.challenges.find(row=>row.key===challenge.key);
    if (!live || live.used || Date.parse(live.expires_at)<=Date.now()) throw passportFailure('This signature was already used or expired.',401);
    if (state.items.some(row=>row.wallet===input.wallet && row.mint===input.mint && row.asset===owner.assetAddress)) throw passportFailure('This wallet already has a test association for this handle and mint.',409);
    const item={id:crypto.randomUUID(),revision:1,...input,asset:owner.assetAddress,token,token_name:token.name,token_symbol:token.symbol,proof_level:2,signature:body.signature,signed_message:challenge.message,payload_hash:challenge.payload_hash,operator:user.id,created_at:new Date().toISOString(),checked_at:new Date().toISOString(),ownership:'observed',status:'pending',review_reason:''};
    live.used=true; state.items.push(item); passportEvent(state,item,user.id,'signed_association_created'); return {id:item.id};
  });
}