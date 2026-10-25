import { PublicKey } from 'npm:@solana/web3.js@1.98.4';
export const profileError = (message, status = 400) => Object.assign(new Error(message), { status });
export function profileInput(body) {
  const handle = String(body.handle || '').trim().replace(/^@/, '').toLowerCase();
  if (!/^[a-z0-9]{1,20}$/.test(handle)) throw profileError('Enter a valid SolHandle.');
  return handle;
}
export function profilePayload(body) {
  if (typeof body.bio !== 'string' || body.bio.length > 500 || typeof body.published !== 'boolean' || !Array.isArray(body.social_links) || body.social_links.length > 5) throw profileError('Use a bio up to 500 characters and up to five social links.');
  const social_links = body.social_links.map(value => {
    if (typeof value !== 'string' || value.length > 500) throw profileError('Invalid social link.');
    let url; try { url = new URL(value); } catch { throw profileError('Social links must be full HTTPS addresses.'); }
    if (url.protocol !== 'https:' || url.username || url.password) throw profileError('Social links must use HTTPS without credentials.');
    return url.href;
  });
  return { bio: body.bio.trim(), social_links, published: body.published };
}
export async function profileHash(value) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify(value)));
  return Array.from(new Uint8Array(bytes), b => b.toString(16).padStart(2, '0')).join('');
}
export async function profileProof(db, body, origin) {
  const wallet = String(body.wallet || ''); let publicKey;
  try { publicKey = new PublicKey(wallet); if (!PublicKey.isOnCurve(publicKey.toBytes())) throw new Error(); } catch { throw profileError('Connect a wallet that supports message signing.'); }
  const handle = profileInput(body), purpose = body.purpose;
  if (!['load', 'save'].includes(purpose)) throw profileError('Invalid profile operation.');
  const payload = purpose === 'save' ? profilePayload(body) : null;
  const payload_hash = await profileHash({ wallet, handle, purpose, payload, origin });
  if (body.action === 'challenge') {
    if (await db.HandleProfileChallenge.count({ wallet, created_date: { $gt: new Date(Date.now() - 60000).toISOString() } }) >= 5) throw profileError('Please wait a minute before signing again.', 429);
    const key = crypto.randomUUID(), expires_at = new Date(Date.now() + 180000).toISOString();
    const message = `SolHandle profile authorization\nOrigin: ${origin}\nWallet: ${wallet}\nHandle: @${handle}\nOperation: ${purpose === 'load' ? 'Read my private profile' : payload.published ? 'Save and PUBLISH my bio and social links' : 'Save my profile PRIVATELY; hide public profile'}\nChanges SHA-256: ${payload_hash}\nNonce: ${key}\nExpires: ${expires_at}\nNo transaction, funds, or spending permissions.`;
    await db.HandleProfileChallenge.create({ key, wallet, handle, purpose, payload_hash, message, expires_at, status: 'issued' });
    return { challengeKey: key, message };
  }
  if (typeof body.challengeKey !== 'string' || !/^[a-f0-9-]{36}$/.test(body.challengeKey) || typeof body.signature !== 'string' || body.signature.length > 100) throw profileError('Sign this profile operation with your wallet.', 401);
  const { items } = await db.HandleProfileChallenge.filter({ key: body.challengeKey, wallet, handle, purpose, payload_hash, status: 'issued', expires_at: { $gt: new Date().toISOString() } }, { limit: 1 });
  const challenge = items[0]; if (!challenge) throw profileError('This signature request expired or was used. Sign again.', 401);
  let valid = false;
  try { const signature = Uint8Array.from(atob(body.signature), c => c.charCodeAt(0)); const key = await crypto.subtle.importKey('raw', publicKey.toBytes(), 'Ed25519', false, ['verify']); valid = signature.length === 64 && await crypto.subtle.verify('Ed25519', key, signature, new TextEncoder().encode(challenge.message)); } catch { valid = false; }
  if (!valid) throw profileError('Wallet signature verification failed.', 401);
  const result = await db.HandleProfileChallenge.updateMany({ id: challenge.id, status: 'issued', expires_at: { $gt: new Date().toISOString() } }, { $set: { status: 'used' } });
  if (result.updated !== 1) throw profileError('This signature was already used.', 401);
  return payload;
}