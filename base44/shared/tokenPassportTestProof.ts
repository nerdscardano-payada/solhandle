import { PublicKey } from 'npm:@solana/web3.js@1.98.4';
import { resolveOnChain } from './solhandleResolver.ts';
import { passportAddress } from './tokenPassportMetadata.ts';
import { passportFailure } from './tokenPassportTestStore.ts';
import { projectFields } from './projectPassportFlow.ts';
export function passportInput(body) {
  const wallet = passportAddress(body.wallet), mint = passportAddress(body.mint);
  if (!PublicKey.isOnCurve(new PublicKey(wallet).toBytes())) throw passportFailure('Use a wallet that supports message signing.');
  const handle = String(body.handle || '').trim().replace(/^@/,'').toLowerCase();
  if (!/^[a-z0-9]{1,20}$/.test(handle) || typeof body.note !== 'string' || body.note.length > 240) throw passportFailure('Choose a valid handle and a note up to 240 characters.');
  return { wallet, mint, handle, note:body.note.trim(), ...projectFields(body) };
}
export async function passportOwner(url, handle, wallet, asset = null) {
  const current = await resolveOnChain(url,handle);
  if (!current?.verified || current.address !== wallet || (asset && current.assetAddress !== asset)) throw passportFailure('This wallet no longer owns the selected official SolHandle.',403);
  return current;
}
export async function checkPassportSignature(challenge, signature) {
  if (typeof signature!=='string' || signature.length>100) throw passportFailure('Sign the association with your wallet.',401);
  let valid=false;
  try { const bytes=Uint8Array.from(atob(signature),c=>c.charCodeAt(0)); const key=await crypto.subtle.importKey('raw',new PublicKey(challenge.wallet).toBytes(),'Ed25519',false,['verify']); valid=bytes.length===64 && await crypto.subtle.verify('Ed25519',key,bytes,new TextEncoder().encode(challenge.message)); } catch { valid=false; }
  if (!valid) throw passportFailure('Wallet signature verification failed.',401);
}