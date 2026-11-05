import { PublicKey } from 'npm:@solana/web3.js@1.98.4';
import { profileHash, profileError } from './handleProfileProof.ts';
import { verifyHuman } from './integrationSecurity.ts';
export function passportInput(body) {
  const input = { operation: body.operation, pilot_id: String(body.pilot_id || ''), wallet: String(body.wallet || ''), handle: String(body.handle || '').trim().replace(/^@/, '').toLowerCase(), mint: String(body.mint || '').trim(), project_name: String(body.project_name || '').trim(), description: String(body.description || '').trim(), launch_tx: String(body.launch_tx || '').trim(), invite: String(body.invite || ''), maker_type: body.maker_type };
  if (!['start','publish','withdraw'].includes(input.operation) || !/^[a-f0-9]{24}$/.test(input.pilot_id) || !/^[a-z0-9]{1,20}$/.test(input.handle) || !['existing','new'].includes(input.maker_type)) throw profileError('Kies een geldige pilot, handle en deelnemersgroep.');
  try { if (!PublicKey.isOnCurve(new PublicKey(input.wallet).toBytes())) throw new Error(); new PublicKey(input.mint); } catch { throw profileError('Gebruik een geldige Solana-wallet en tokenmint.'); }
  if (input.project_name.length > 80 || input.description.length > 300 || input.invite.length > 40 || (input.launch_tx && !/^[1-9A-HJ-NP-Za-km-z]{64,90}$/.test(input.launch_tx))) throw profileError('Controleer de lengte van de projectgegevens en de transactiehandtekening.');
  return input;
}
export async function issuePassportProof(req, db, input, body, origin) {
  await verifyHuman(req, body, db, { action: 'token_passport', scope: 'token_passport', limit: 20 });
  if (await db.TokenPassportChallenge.count({ wallet: input.wallet, created_date: { $gt: new Date(Date.now() - 60000).toISOString() } }) >= 6) throw profileError('Wacht een minuut voordat je opnieuw ondertekent.', 429);
  const key = crypto.randomUUID(), expires_at = new Date(Date.now() + 180000).toISOString(), payload_hash = await profileHash({ input, origin });
  const message = `SolHandle Token Passport pilot\nOrigin: ${origin}\nOperation: ${input.operation}\nWallet: ${input.wallet}\nHandle: @${input.handle}\nToken mint: ${input.mint}\nNetwork: Solana Mainnet-beta\nProject: ${input.project_name}\nDescription: ${input.description}\nLaunch transaction: ${input.launch_tx || 'not provided'}\nPayload SHA-256: ${payload_hash}\nNonce: ${key}\nExpires: ${expires_at}\n${input.operation === 'publish' ? 'I consent to publish this wallet, handle, mint, project text and signature as a public time-bound registration.' : input.operation === 'withdraw' ? 'Withdraw my participation and hide my Passport.' : 'Join the pilot. Store my progress privately with the pilot operator.'}\nNo payment, transfer, spending permission, safety endorsement or proof of a real person.`;
  await db.TokenPassportChallenge.create({ key, wallet: input.wallet, payload_hash, message, expires_at, status: 'issued' });
  return { challengeKey: key, message };
}
export async function verifyPassportProof(db, input, body, origin) {
  if (!/^[a-f0-9-]{36}$/.test(body.challengeKey || '') || typeof body.signature !== 'string' || body.signature.length > 100) throw profileError('Onderteken dit verzoek met je wallet.', 401);
  const payload_hash = await profileHash({ input, origin });
  const { items } = await db.TokenPassportChallenge.filter({ key: body.challengeKey, wallet: input.wallet, payload_hash, status: 'issued', expires_at: { $gt: new Date().toISOString() } }, { limit: 1 });
  const proof = items[0]; if (!proof) throw profileError('Dit verzoek is verlopen of al gebruikt. Onderteken opnieuw.', 401);
  let valid = false;
  try { const signature = Uint8Array.from(atob(body.signature), c => c.charCodeAt(0)); const key = await crypto.subtle.importKey('raw', new PublicKey(input.wallet).toBytes(), 'Ed25519', false, ['verify']); valid = signature.length === 64 && await crypto.subtle.verify('Ed25519', key, signature, new TextEncoder().encode(proof.message)); } catch { valid = false; }
  if (!valid) throw profileError('De wallet-handtekening is ongeldig.', 401);
  const result = await db.TokenPassportChallenge.updateMany({ id: proof.id, status: 'issued' }, { $set: { status: 'used' } });
  if (result.updated !== 1) throw profileError('Dit verzoek is al gebruikt.', 401);
  return proof;
}