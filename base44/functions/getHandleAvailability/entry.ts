import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';
import { findHandleOnChain, getAssetOwner, getNameRestriction, getProtocolConfig } from '../../shared/solanaRpc.ts';
import { calculateHandlePrice, normalizeHandle } from '../../shared/handlePricing.ts';

function calculateHandleScore(handle: string) {
  const lengthScore = Math.max(52, 100 - Math.max(0, handle.length - 1) * 4);
  const characterBonus = /^[a-z]+$/.test(handle) ? 2 : /^\d+$/.test(handle) ? 1 : 0;
  const uniquenessBonus = new Set(handle).size === handle.length ? 2 : 0;
  const repetitionPenalty = /(.)\1\1/.test(handle) ? 4 : 0;
  return Math.min(100, Math.max(0, lengthScore + characterBonus + uniquenessBonus - repetitionPenalty));
}

export default async function(req: Request): Promise<Response> {
  try {
    const { handle: rawHandle } = await req.json();
    const handle = normalizeHandle(rawHandle);
    if (!/^[a-z0-9]{1,20}$/.test(handle)) return Response.json({ handle, available: false, status: 'INVALID' }, { status: 400 });
    const base44 = createClientFromRequest(req);
    const rpcUrl = secrets.get('SOLANA_RPC_URL');
    const [indexed, premiumRows, discoveryRows, chainRecord, restriction, protocol] = await Promise.all([
      base44.asServiceRole.entities.HandleIndex.filter({ handle }, '-updated_date', 1),
      base44.asServiceRole.entities.PremiumHandle.filter({ handle }, '-updated_date', 1),
      base44.asServiceRole.entities.HandleDiscovery.filter({ handle, active: true }, '-updated_date', 1),
      findHandleOnChain(rpcUrl, handle),
      getNameRestriction(rpcUrl, handle),
      getProtocolConfig(rpcUrl)
    ]);
    const record = indexed[0];
    const currentOwner = chainRecord ? await getAssetOwner(rpcUrl, chainRecord.assetAddress, record?.current_owner_cached || '') : null;
    const listings = chainRecord ? await base44.asServiceRole.entities.MarketplaceListing.filter({ asset_address: chainRecord.assetAddress, status: 'ACTIVE', marketplace: 'Magic Eden' }, 'price', 1) : [];
    if (record && chainRecord && (record.current_owner_cached !== currentOwner || record.last_chain_sync === null)) await base44.asServiceRole.entities.HandleIndex.update(record.id, { current_owner_cached: currentOwner, last_chain_sync: new Date().toISOString() });
    const claimed = Boolean(chainRecord);
    const activeRestriction = restriction?.active ? restriction : null;
    const status = claimed ? 'CLAIMED' : activeRestriction?.restrictionType || 'AVAILABLE';
    const pricing = calculateHandlePrice(handle, protocol.pricesLamports, premiumRows.length > 0);
    return Response.json({ handle, display: `@${handle}`, available: status === 'AVAILABLE', status, currentOwner, assetAddress: chainRecord?.assetAddress || null, priceLamports: pricing.finalPriceLamports, basePriceLamports: pricing.basePriceLamports, premiumSurchargeLamports: pricing.premiumSurchargeLamports, premium: pricing.isPremium, nameClass: pricing.isPremium ? 'Premium' : 'Standard', categories: discoveryRows[0]?.categories || ['identity'], tags: discoveryRows[0]?.tags || ['personal', 'solana'], handleScore: discoveryRows[0]?.handle_score ?? calculateHandleScore(handle), restriction: activeRestriction, listing: listings[0] ? { price: listings[0].price, currency: listings[0].currency, url: listings[0].listing_url, marketplace: listings[0].marketplace } : null });
  } catch (error) { return Response.json({ error: error.message }, { status: 500 }); }
}