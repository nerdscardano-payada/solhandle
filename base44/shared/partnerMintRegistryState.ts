import { rpc } from './solanaRpc.ts';
import { pda, sha, enc, accountBytes, keyAt, view, uint, fault } from './partnerMintCodec.ts';
export function registryId(id) { if (typeof id !== 'string' || !/^[a-z0-9-]{1,32}$/.test(id)) fault('INVALID_PARTNER_ID', 400); return id; }
export async function registryState(url, id, commitment = 'finalized', minContextSlot) {
  if (id) registryId(id);
  const config = pda('config'), partner = id ? pda('partner', await sha(enc(id))) : null;
  const page = await rpc(url, 'getMultipleAccounts', [[config.toBase58(), pda('partner_mint').toBase58(), ...(partner ? [partner.toBase58()] : [])], { encoding: 'base64', commitment, ...(minContextSlot ? { minContextSlot } : {}) }]);
  const c = await accountBytes(page.value[0], 'Config', 187), s = await accountBytes(page.value[1], 'PartnerMintSettings', 82);
  if (c[186] !== 2 || keyAt(s, 8) !== config.toBase58()) fault('INVALID_CHAIN_ACCOUNT', 503);
  const result = { authority: keyAt(c, 8), treasury: keyAt(c, 72), enabled: s[40] === 1, quoteSigner: keyAt(s, 41), settingsRevision: uint(s, 73).toString(), slot: page.context.slot, partner: null };
  if (id && page.value[2]) {
    const p = await accountBytes(page.value[2], 'MintPartner', 88), length = view(p).getUint32(40, true), end = 44 + length;
    if (length < 1 || length > 32 || p.length < end + 43 || new TextDecoder().decode(p.slice(44, end)) !== id || keyAt(p, 8) !== config.toBase58() || p[end + 32] > 2) fault('INVALID_CHAIN_ACCOUNT', 503);
    result.partner = { partner_id: id, partner_pda: partner.toBase58(), revenue_wallet: keyAt(p, end), status: ['approved', 'suspended', 'disabled'][p[end + 32]], revision: uint(p, end + 33).toString(), allow_self_mint: p[end + 41] === 1 };
  }
  return result;
}
export async function registryPartnerLink(base44, id) {
  if (id === undefined) return undefined;
  if (id === '') return '';
  if (typeof id !== 'string' || !/^[a-f0-9]{24}$/.test(id)) fault('INVALID_PARTNER_LINK', 400);
  const page = await base44.entities.Partner.filter({ id }, { limit: 1 });
  if (!page.items[0]) fault('INTEGRATION_PARTNER_NOT_FOUND', 404);
  return id;
}
export async function syncRegistryProfile(base44, state, id, displayName, partnerLink) {
  if (!state.partner) fault('PARTNER_NOT_FOUND', 404);
  const key = `devnet:${id}`, existing = await base44.entities.PartnerMintProfile.filter({ profile_key: key }, { limit: 1 });
  const record = { profile_key: key, cluster: 'devnet', ...state.partner, display_name: displayName || existing.items[0]?.display_name || id, partner_link: partnerLink ?? existing.items[0]?.partner_link ?? '', chain_slot: state.slot, verified_at: new Date().toISOString() };
  await base44.entities.PartnerMintProfile.upsert([record], { key: 'profile_key' });
  return record;
}