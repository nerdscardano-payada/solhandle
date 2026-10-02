import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';
import { secrets } from 'base44:runtime';
import { devnetRpc } from './partnerMintChain.ts';
import { fault, loadSigner } from './partnerMintCodec.ts';
export async function pilotRequest(req, allowedActions) {
  const base44 = createClientFromRequest(req);
  if (!await base44.auth.isAuthenticated()) fault('UNAUTHORIZED', 401);
  const user = await base44.auth.me();
  if (user?.role !== 'admin') fault('ADMIN_PILOT_ONLY', 403);
  if (req.method !== 'POST') fault('METHOD_NOT_ALLOWED', 405);
  const text = await req.text();
  if (text.length > 12000) fault('PAYLOAD_TOO_LARGE', 413);
  let body; try { body = JSON.parse(text); } catch { fault('INVALID_REQUEST', 400); }
  if (!body || typeof body !== 'object' || !allowedActions.includes(body.action)) fault('INVALID_ACTION', 400);
  const url = await devnetRpc(secrets.get('PARTNER_MINT_DEVNET_RPC_URL'), body.cluster);
  return { base44, user, body, url };
}
export const pilotSigner = () => loadSigner(secrets.get('PARTNER_MINT_DEVNET_QUOTE_SIGNER_KEYPAIR'));
export async function getPilotIntent(base44, user, id) {
  if (typeof id !== 'string' || !/^[a-f0-9]{24}$/.test(id)) fault('INVALID_INTENT', 400);
  const { items } = await base44.entities.PartnerMintIntent.filter({ id, admin_user_id: user.id, cluster: 'devnet' }, { limit: 1 });
  if (!items[0]) fault('INTENT_NOT_FOUND', 404);
  return items[0];
}
export function pilotError(error, requestId) {
  const limited = /rate.?limit|429/i.test(error.message || '');
  const status = error.status || (limited ? 429 : 503);
  return Response.json({ error: { code: error.code || (limited ? 'RATE_LIMITED' : 'RPC_UNAVAILABLE'), message: error.code ? error.message : 'Devnet service unavailable; do not sign again until transaction status is checked.' }, requestId }, { status, headers: { 'Cache-Control': 'no-store', ...(status === 429 ? { 'Retry-After': '5' } : {}) } });
}