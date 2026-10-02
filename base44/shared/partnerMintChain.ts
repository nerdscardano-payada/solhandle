import { PublicKey } from 'npm:@solana/web3.js@1.98.4';
import { rpc } from './solanaRpc.ts';
import { normalizeHandle } from './handlePricing.ts';
import { PROGRAM_ID } from './partnerMintCodec.ts';
import { enc, pda, sha, fault, accountBytes, keyAt, uint, view } from './partnerMintCodec.ts';
export async function devnetRpc(url, cluster) {
  if (cluster !== 'devnet') fault('DEVNET_ONLY', 403, 'Partner Mint pilot accepts only devnet.');
  if (!url || !String(url).startsWith('https://')) fault('RPC_NOT_CONFIGURED', 503);
  if (await rpc(url, 'getGenesisHash') !== 'EtWTRABZaYq6iMfeYKouRu166VU2xqa1wcaWoxPkrZBG') fault('WRONG_CLUSTER', 503, 'Configured RPC is not Solana devnet.');
  return url;
}
export function validatePartnerInput(body, requireWallet = false) {
  const handle = normalizeHandle(body.handle), partnerId = String(body.partnerId || '');
  if (!/^[a-z0-9]{1,20}$/.test(handle)) fault('INVALID_HANDLE', 400);
  if (!/^[a-z0-9-]{1,32}$/.test(partnerId)) fault('INVALID_PARTNER_ID', 400);
  let wallet;
  if (requireWallet) { try { wallet = new PublicKey(body.wallet).toBase58(); } catch { fault('INVALID_WALLET', 400); } if (wallet !== body.wallet) fault('INVALID_WALLET', 400); }
  return { handle, partnerId, ...(wallet ? { wallet } : {}) };
}
export async function readPartnerState(url, input, signer) {
  const partner = pda('partner', await sha(enc(input.partnerId))), config = pda('config');
  const seeds = ['handle', 'restriction', 'price', 'premium'];
  const addresses = [config, pda('partner_mint'), partner, ...seeds.map(s => pda(s, input.handle)), pda('rush'), new PublicKey('SysvarC1ock11111111111111111111111111111111')];
  const page = await rpc(url, 'getMultipleAccounts', [addresses.map(a => a.toBase58()), { encoding: 'base64', commitment: 'confirmed' }]);
  if (!page?.value?.[0] || !page.value[1]) fault('PARTNER_MINT_NOT_CONFIGURED', 409, 'Devnet program or Partner Mint settings are not initialized.');
  if (!page.value[2]) fault('PARTNER_NOT_APPROVED', 403);
  const c = await accountBytes(page.value[0], 'Config', 187), s = await accountBytes(page.value[1], 'PartnerMintSettings', 82), p = await accountBytes(page.value[2], 'MintPartner', 88);
  const length = view(p).getUint32(40, true), end = 44 + length;
  if (length < 1 || length > 32 || p.length < end + 43 || new TextDecoder().decode(p.slice(44, end)) !== input.partnerId || keyAt(p, 8) !== config.toBase58() || keyAt(s, 8) !== config.toBase58()) fault('INVALID_CHAIN_ACCOUNT', 503);
  if (c[186] !== 2 || c[184] !== 0) fault('PROTOCOL_UNAVAILABLE', 409);
  if (s[40] !== 1) fault('PARTNER_MINT_DISABLED', 409);
  if (p[end + 32] !== 0) fault('PARTNER_NOT_APPROVED', 403);
  const quoteSigner = keyAt(s, 41), treasury = keyAt(c, 72), revenueWallet = keyAt(p, end);
  if (signer && (quoteSigner !== signer.publicKey.toBase58() || quoteSigner === keyAt(c, 8) || quoteSigner === treasury)) fault('SIGNER_MISMATCH', 503);
  if (input.wallet && (input.wallet === treasury || (input.wallet === revenueWallet && p[end + 41] !== 1))) fault('SELF_MINT_NOT_ALLOWED', 403);
  const optional = async (index, name, size) => page.value[index] ? accountBytes(page.value[index], name, size) : null;
  const [record, restriction, override, premium, rush] = await Promise.all([optional(3, 'HandleRecord', 86), optional(4, 'NameRestriction', 10), optional(5, 'PriceOverride', 18), optional(6, 'PremiumHandle', 10), optional(7, 'RushConfig', 50)]);
  const clock = page.value[8];
  if (!clock || clock.owner !== 'Sysvar1111111111111111111111111111111111111') fault('RPC_UNAVAILABLE', 503);
  const rawClock = Uint8Array.from(atob(clock.data[0]), x => x.charCodeAt(0));
  if (rawClock.length < 40) fault('RPC_UNAVAILABLE', 503);
  const now = Number(view(rawClock).getBigInt64(32, true));
  if (!Number.isSafeInteger(now) || now <= 0) fault('RPC_UNAVAILABLE', 503);
  let price = override?.[16] === 1 ? uint(override, 8) : uint(c, 136 + 8 * Math.min(input.handle.length - 1, 4));
  let surcharge = premium?.[8] === 1 ? 100000000n : 0n;
  if (rush?.[8] === 1 && BigInt(now) >= view(rush).getBigInt64(9, true) && BigInt(now) < view(rush).getBigInt64(17, true)) {
    if (input.handle.length >= 3) price = uint(rush, 25);
    else { const product = price * uint(rush, 33); if (product > 18446744073709551615n) fault('AMOUNT_OVERFLOW', 409); price = product / 10000n; }
    if (premium?.[8] === 1) surcharge = uint(rush, 41);
  }
  price += surcharge;
  if (price <= 0n || price > 18446744073709551615n) fault('INVALID_MINT_PRICE', 409);
  const status = record ? 'CLAIMED' : restriction?.[9] === 1 ? restriction[8] === 0 ? 'RESERVED' : 'PROTECTED' : 'AVAILABLE';
  return { ...input, status, available: status === 'AVAILABLE', checkedSlot: page.context.slot, chainTime: now, program: PROGRAM_ID, partnerPda: partner.toBase58(), partnerRevision: uint(p, end + 33).toString(), settingsRevision: uint(s, 73).toString(), quoteSigner, revenueWallet, treasury, collection: keyAt(c, 40), mintPriceLamports: price.toString(), partnerShareLamports: (price / 2n).toString(), protocolShareLamports: (price - price / 2n).toString(), currency: 'SOL', networkCostsExcluded: true, primaryEarnCommissionEligible: false };
}
export function assertFresh(quote, state) {
  if (!state.available) fault('HANDLE_UNAVAILABLE', 409);
  if (state.chainTime > quote.expiresAtUnix) fault('QUOTE_EXPIRED', 410);
  for (const field of ['partnerPda', 'partnerRevision', 'settingsRevision', 'quoteSigner', 'revenueWallet', 'treasury', 'collection', 'mintPriceLamports']) if (quote[field] !== state[field]) fault('QUOTE_STALE', 409);
}