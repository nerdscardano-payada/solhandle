import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { PublicKey } from 'npm:@solana/web3.js@1.98.4';
import { secrets } from 'base44:runtime';
import { deriveHandleAccountAddresses, getAssetOwner, parseHandleRecord, parseNameRestrictionAccount, PROGRAM_ID, rpc } from '../../shared/solanaRpc.ts';
import { cacheProtocolConfigAccount, readLatestProtocolConfigCache, readProtocolConfigCache } from '../../shared/protocolConfigCache.ts';
import { SEEDS } from '../../shared/solhandleProtocol.ts';
import { calculateHandlePrice, normalizeHandle } from '../../shared/handlePricing.ts';
import { getRushPricing } from '../../shared/rushPricing.ts';

function calculateHandleScore(handle: string) {
  const lengthPoints = [0, 24, 14, 16, 14, 12, 10, 8, 6, 5, 4];
  const lettersOnly = /^[a-z]+$/.test(handle);
  const numbersOnly = /^\d+$/.test(handle);
  const characterPoints = lettersOnly ? 4 : numbersOnly ? 4 : -5;
  const uniqueRatio = new Set(handle).size / handle.length;
  const uniquenessPoints = numbersOnly && handle.length <= 3 ? 4 : uniqueRatio >= 0.8 ? 4 : uniqueRatio >= 0.5 ? 1 : -4;
  const pronounceablePoints = lettersOnly && /[aeiouy]/.test(handle) && /[bcdfghjklmnpqrstvwxz]/.test(handle) ? 6 : 0;
  const numericPatternPoints = numbersOnly ? handle.length === 2 ? 6 : handle.length === 3 ? 8 : 0 : 0;
  const repetitionPenalty = !numbersOnly && /(.)\1\1/.test(handle) ? 8 : 0;
  const score = 48 + (lengthPoints[Math.min(handle.length, 10)] || 3) + characterPoints + uniquenessPoints + pronounceablePoints + numericPatternPoints - repetitionPenalty;
  return Math.min(82, Math.max(35, score));
}

export default async function(req: Request): Promise<Response> {
  try {
    const { handle: rawHandle } = await req.json();
    const handle = normalizeHandle(rawHandle);
    if (!/^[a-z0-9]{1,20}$/.test(handle)) return Response.json({ handle, available: false, status: 'INVALID' }, { status: 400 });
    const base44 = createClientFromRequest(req);
    const rpcUrl = secrets.get('SOLANA_RPC_URL');
    const [indexed, premiumRows, discoveryRows, protectedRows, cachedProtocol, rush] = await Promise.all([
      base44.asServiceRole.entities.HandleIndex.filter({ handle }, '-updated_date', 1),
      base44.asServiceRole.entities.PremiumHandle.filter({ handle }, '-updated_date', 1),
      base44.asServiceRole.entities.HandleDiscovery.filter({ handle, active: true }, '-updated_date', 1),
      base44.asServiceRole.entities.ProtectedName.filter({ handle, status: 'active' }, '-updated_date', 1),
      readProtocolConfigCache(base44),
      getRushPricing(rpcUrl)
    ]);
    const derived = deriveHandleAccountAddresses(handle);
    const accountAddresses = [derived.record, derived.restriction];
    if (!cachedProtocol) {
      const program = new PublicKey(PROGRAM_ID);
      const [config] = PublicKey.findProgramAddressSync([new TextEncoder().encode(SEEDS.config)], program);
      accountAddresses.push(config.toBase58());
    }
    let accountData = null;
    try {
      accountData = await rpc(rpcUrl, 'getMultipleAccounts', [accountAddresses, { encoding: 'base64', commitment: 'confirmed' }]);
    } catch (rpcError) {
      console.warn('getHandleAvailability using index fallback', rpcError?.message || String(rpcError));
    }
    const rpcVerified = Boolean(accountData);
    const chainRecord = accountData?.value?.[0]?.data?.[0] ? { ...parseHandleRecord(accountData.value[0].data[0]), handlePda: derived.record } : null;
    const restriction = accountData ? parseNameRestrictionAccount(accountData?.value?.[1], derived.restriction) : null;
    const protocol = cachedProtocol || (accountData ? await cacheProtocolConfigAccount(base44, accountData?.value?.[2]) : await readLatestProtocolConfigCache(base44));
    if (!protocol) throw new Error('Protocol pricing is temporarily unavailable.');
    const record = indexed[0];
    const indexedClaimed = record?.status === 'active';
    const currentOwner = chainRecord ? await getAssetOwner(rpcUrl, chainRecord.assetAddress, record?.current_owner_cached || '') : indexedClaimed ? record.current_owner_cached || null : null;
    console.info('getHandleAvailability RPC calls', { rpcCalls: rpcVerified ? (chainRecord ? 2 : 1) : 0, configCacheHit: Boolean(cachedProtocol), verificationSource: rpcVerified ? 'blockchain' : 'indexer' });
    const assetAddress = chainRecord?.assetAddress || (indexedClaimed ? record.asset_address : null);
    const listings = assetAddress ? await base44.asServiceRole.entities.MarketplaceListing.filter({ asset_address: assetAddress, status: 'ACTIVE', marketplace: 'Magic Eden' }, 'price', 1) : [];
    if (record && chainRecord && (record.current_owner_cached !== currentOwner || record.last_chain_sync === null)) await base44.asServiceRole.entities.HandleIndex.update(record.id, { current_owner_cached: currentOwner, last_chain_sync: new Date().toISOString() });
    const claimed = rpcVerified ? Boolean(chainRecord) : indexedClaimed;
    const indexedRestriction = protectedRows[0] ? { active: true, restrictionType: protectedRows[0].restriction_type || 'PROTECTED', reservedFor: protectedRows[0].reserved_for || '' } : null;
    const activeRestriction = rpcVerified ? (restriction?.active ? restriction : null) : indexedRestriction;
    const status = claimed ? 'CLAIMED' : activeRestriction?.restrictionType || 'AVAILABLE';
    const pricing = calculateHandlePrice(handle, protocol.pricesLamports, premiumRows.length > 0, rush);
    const baseHandleScore = discoveryRows[0]?.handle_score ?? calculateHandleScore(handle);
    const isExactSolIdentity = handle === 'sol' || handle === 'solana';
    const isProtectedBrand = protectedRows.length > 0;
    const solIdentityBonus = handle.includes('sol') ? 15 : 0;
    const solNumberBonus = /^(?:sol|solana)\d+$/.test(handle) ? 15 : 0;
    const handleScore = isExactSolIdentity
      ? 100
      : isProtectedBrand
        ? 90
        : Math.min(100, baseHandleScore + (pricing.isPremium ? 20 : 0) + solIdentityBonus + solNumberBonus);
    return Response.json({ handle, display: `@${handle}`, available: status === 'AVAILABLE', status, currentOwner, assetAddress, verificationSource: rpcVerified ? 'blockchain' : 'indexer', priceLamports: pricing.finalPriceLamports, basePriceLamports: pricing.basePriceLamports, premiumSurchargeLamports: pricing.premiumSurchargeLamports, premium: pricing.isPremium, nameClass: pricing.isPremium ? 'Premium' : 'Standard', categories: discoveryRows[0]?.categories || ['identity'], tags: discoveryRows[0]?.tags || ['personal', 'solana'], handleScore, restriction: activeRestriction, listing: listings[0] ? { price: listings[0].price, currency: listings[0].currency, url: listings[0].listing_url, marketplace: listings[0].marketplace } : null });
  } catch (error) {
    console.error('getHandleAvailability failed', error?.stack || error?.message || String(error));
    return Response.json({ error: error?.message || 'Unable to verify handle availability.' }, { status: 500 });
  }
}