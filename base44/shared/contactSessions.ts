import { PublicKey } from 'npm:@solana/web3.js@1.98.4';
export const contactError = (message, status = 400) => Object.assign(new Error(message), { status });
const hex = bytes => Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
export const hashContactToken = async token => hex(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token))));
export async function requireContactSession(client, body) {
  if (typeof body.contactsToken !== 'string' || !/^[a-f0-9]{64}$/.test(body.contactsToken)) throw contactError('Unlock My Contacts with your wallet first.', 401);
  const wallet = new PublicKey(String(body.wallet || body.senderWallet || '')).toBase58();
  const page = await client.entities.ContactsSession.filter({ wallet, token_hash: await hashContactToken(body.contactsToken), expires_at: { $gt: new Date().toISOString() } }, { limit: 1 });
  if (!page.items[0]) throw contactError('Your contacts access expired. Unlock with your wallet again.', 401);
  return page.items[0];
}
export async function contactAccess(client, body) {
  const wallet = new PublicKey(String(body.wallet || '')).toBase58();
  if (!PublicKey.isOnCurve(new PublicKey(wallet).toBytes())) throw contactError('Use a wallet that supports message signing.');
  if (body.action === 'challenge') {
    const now = new Date(), expires_at = new Date(now.getTime() + 5 * 60000).toISOString();
    const recent = await client.entities.ContactsChallenge.count({ wallet, created_date: { $gt: new Date(now.getTime() - 60000).toISOString() } });
    if (recent >= 5) throw contactError('Please wait a minute before requesting another signature.', 429);
    const message = `SolHandle My Contacts\nDomain: solhandle.io\nWallet: ${wallet}\nAuthorize private contact synchronization for 30 days on this device.\nNo transactions, funds, or blockchain fees.\nNonce: ${crypto.randomUUID()}\nIssued: ${now.toISOString()}\nChallenge expires: ${expires_at}`;
    const record = await client.entities.ContactsChallenge.create({ wallet, message, expires_at, status: 'issued' });
    return { challengeId: record.id, message, expires_at };
  }
  if (body.action !== 'verify') throw contactError('Unsupported access action.');
  if (typeof body.challengeId !== 'string' || !/^[a-f0-9]{24}$/.test(body.challengeId) || typeof body.signature !== 'string' || body.signature.length > 100) throw contactError('Invalid wallet proof.');
  const page = await client.entities.ContactsChallenge.filter({ id: body.challengeId, wallet, status: 'issued', expires_at: { $gt: new Date().toISOString() } }, { limit: 1 });
  const challenge = page.items[0];
  if (!challenge) throw contactError('This verification request expired or was already used.', 401);
  const signature = Uint8Array.from(atob(body.signature), c => c.charCodeAt(0));
  const key = await crypto.subtle.importKey('raw', new PublicKey(wallet).toBytes(), { name: 'Ed25519' }, false, ['verify']);
  if (signature.length !== 64 || !await crypto.subtle.verify('Ed25519', key, signature, new TextEncoder().encode(challenge.message))) throw contactError('Wallet signature verification failed.', 401);
  const claimed = await client.entities.ContactsChallenge.updateMany({ id: challenge.id, wallet, status: 'issued', expires_at: { $gt: new Date().toISOString() } }, { $set: { status: 'used' } });
  if (claimed.updated !== 1) throw contactError('This verification request was already used.', 401);
  const token = hex(crypto.getRandomValues(new Uint8Array(32)));
  const expires_at = new Date(Date.now() + 30 * 86400000).toISOString();
  await client.entities.ContactsSession.create({ wallet, token_hash: await hashContactToken(token), expires_at });
  return { wallet, token, expires_at };
}