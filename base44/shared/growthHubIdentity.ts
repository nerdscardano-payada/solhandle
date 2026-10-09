import { PublicKey } from 'npm:@solana/web3.js@1.98.4';
export function walletAddress(value) { return new PublicKey(String(value || '')).toBase58(); }
export async function issueChallenge(entities, value) {
  const wallet = walletAddress(value);
  const recent = await entities.GrowthHubChallenge.count({ wallet, created_date: { $gte: new Date(Date.now() - 15 * 60000).toISOString() } });
  if (recent >= 12) throw new Error('Te veel verificatieaanvragen. Probeer over 15 minuten opnieuw.');
  const nonce = crypto.randomUUID(), issued = new Date(), expires = new Date(Date.now() + 15 * 60000);
  const message = `solhandle.io wants you to sign in with your Solana account:\n${wallet}\n\nSolHandle Growth Hub pilot. View my profile and submit knowledge quests. No transactions or access to funds.\n\nURI: https://solhandle.io/quests\nVersion: 1\nNonce: ${nonce}\nIssued At: ${issued.toISOString()}\nExpiration Time: ${expires.toISOString()}`;
  const row = await entities.GrowthHubChallenge.create({ wallet, nonce, message, expires_at: expires.toISOString() });
  return { challenge_id: row.id, message, expires_at: row.expires_at, wallet };
}
export async function verifiedWallet(entities, proof) {
  if (!proof?.challenge_id || typeof proof.signature !== 'string' || proof.signature.length > 100) throw new Error('Verifieer eerst je wallet.');
  const row = await entities.GrowthHubChallenge.get(String(proof.challenge_id));
  if (!row || Date.parse(row.expires_at) <= Date.now()) throw new Error('Walletverificatie verlopen. Verifieer opnieuw.');
  const bytes = Uint8Array.from(atob(proof.signature), c => c.charCodeAt(0));
  if (bytes.length !== 64) throw new Error('Ongeldige walletsignature.');
  const key = await crypto.subtle.importKey('raw', new PublicKey(row.wallet).toBytes(), { name: 'Ed25519' }, false, ['verify']);
  if (!await crypto.subtle.verify('Ed25519', key, bytes, new TextEncoder().encode(row.message))) throw new Error('Walletsignature klopt niet.');
  return row.wallet;
}
export async function getProfile(entities, wallet) {
  const page = await entities.GrowthHubProfile.filter({ wallet }, { sort: 'created_date', limit: 2 });
  if (page.items.length > 1) throw new Error('Dubbele profielregistratie vereist beheercontrole. XP is tijdelijk geblokkeerd.');
  return page.items[0] || null;
}
export async function requireProfile(entities, proof) {
  const wallet = await verifiedWallet(entities, proof), profile = await getProfile(entities, wallet);
  if (!profile || profile.status !== 'ACTIVE') throw new Error('Dit Growth Hub-profiel is niet actief.');
  return profile;
}