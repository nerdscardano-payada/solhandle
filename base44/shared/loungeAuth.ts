import nacl from 'npm:tweetnacl@1.0.3';
import bs58 from 'npm:bs58@6.0.0';

export const hashToken = async (token) => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token)))).map((byte) => byte.toString(16).padStart(2, '0')).join('');
export const loungeChallenge = (wallet, timestamp, nonce) => `SolHandle Holder Lounge\nWallet: ${wallet}\nTimestamp: ${timestamp}\nNonce: ${nonce}\n\nThis request will not trigger a transaction.`;
export const validWallet = (wallet) => /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(wallet);
export function verifyLoungeSignature(wallet, timestamp, nonce, signature) {
  if (!validWallet(wallet) || !Number.isFinite(Number(timestamp)) || Math.abs(Date.now() - Number(timestamp)) > 120000 || !/^[a-zA-Z0-9-]{16,80}$/.test(nonce)) return false;
  try { return nacl.sign.detached.verify(new TextEncoder().encode(loungeChallenge(wallet, timestamp, nonce)), Uint8Array.from(atob(signature), (char) => char.charCodeAt(0)), bs58.decode(wallet)); } catch { return false; }
}
export async function getLoungeSession(base44, token) {
  if (!/^[A-Za-z0-9_-]{40,80}$/.test(String(token || ''))) return null;
  const sessions = await base44.asServiceRole.entities.LoungeSession.filter({ token_hash: await hashToken(token) }, '-created_date', 1);
  const session = sessions[0];
  return session && new Date(session.expires_at) > new Date() ? session : null;
}