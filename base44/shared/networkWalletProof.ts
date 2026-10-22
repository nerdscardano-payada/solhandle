import { PublicKey } from 'npm:@solana/web3.js@1.98.4';
import { fail } from './networkLabContext.ts';
export function proofOrigin(req) {
  const value = req.headers.get('X-Base44-App-Url') || 'https://sol-handle-core.base44.app';
  const url = new URL(value);
  if (url.protocol !== 'https:') fail('Secure application origin required.', 400);
  return url.origin;
}
export async function createDevelopmentProof(db, user, actor, input, origin) {
  let wallet;
  try { const key = new PublicKey(String(input.wallet || '')); if (!PublicKey.isOnCurve(key.toBytes())) fail('Use a wallet capable of message signing.'); wallet = key.toBase58(); }
  catch { fail('Connect a valid Solana wallet.'); }
  const handle = String(input.handle || '').replace(/^@/, '').toLowerCase();
  if (handle && !/^[a-z0-9]{1,20}$/.test(handle)) fail('Choose a valid owned SolHandle.');
  if (await db.NetworkWalletChallenge.count({ operator_user_id: user.id, created_date: { $gt: new Date(Date.now() - 60000).toISOString() } }) >= 5) fail('Wait a minute before requesting another wallet proof.', 429);
  const issued = new Date().toISOString(); const expires = new Date(Date.now() + 180000).toISOString();
  const message = `${new URL(origin).host} requests a SolHandle Network development identity proof.\nWallet: ${wallet}\n\nVerify control of this wallet to bind an owned SolHandle to your existing development Network account. This is not a transaction, does not spend funds and does not create a production login session.\n\nURI: ${origin}/network/lab\nPurpose: DEVELOPMENT_BIND_HANDLE\nNetwork account: ${actor.public_id}\nHandle: ${handle ? '@' + handle : 'current valid Primary Handle'}\nNonce: ${crypto.randomUUID()}\nIssued At: ${issued}\nExpiration Time: ${expires}`;
  const record = await db.NetworkWalletChallenge.create({ account_public_id: actor.public_id, operator_user_id: user.id, wallet, handle, message, purpose: 'DEVELOPMENT_BIND_HANDLE', origin, expires_at: expires, status: 'ISSUED' });
  return { challengeId: record.id, message, expiresAt: expires, wallet };
}
export async function consumeDevelopmentProof(db, user, actor, input, origin) {
  if (typeof input.challengeId !== 'string' || !/^[a-f0-9]{24}$/.test(input.challengeId) || typeof input.signature !== 'string' || input.signature.length > 100) fail('This wallet proof is invalid. Please sign again.', 401);
  const page = await db.NetworkWalletChallenge.filter({ id: input.challengeId, account_public_id: actor.public_id, operator_user_id: user.id, origin, purpose: 'DEVELOPMENT_BIND_HANDLE', status: 'ISSUED', expires_at: { $gt: new Date().toISOString() } }, { limit: 1 });
  const challenge = page.items[0];
  if (!challenge) fail('This wallet proof expired or was already used. Please sign again.', 401);
  let valid = false;
  try { const signature = Uint8Array.from(atob(input.signature), c => c.charCodeAt(0)); const key = await crypto.subtle.importKey('raw', new PublicKey(challenge.wallet).toBytes(), { name: 'Ed25519' }, false, ['verify']); valid = signature.length === 64 && await crypto.subtle.verify('Ed25519', key, signature, new TextEncoder().encode(challenge.message)); } catch { valid = false; }
  if (!valid) fail('We could not verify your wallet. Please try signing again.', 401);
  const result = await db.NetworkWalletChallenge.updateMany({ id: challenge.id, status: 'ISSUED', expires_at: { $gt: new Date().toISOString() } }, { $set: { status: 'USED' } });
  if (result.updated !== 1) fail('This wallet proof was already used. Please sign again.', 401);
  return challenge;
}