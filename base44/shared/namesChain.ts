import { rpc, deriveHandleAccountAddresses, parseHandleRecord, parseNameRestrictionAccount, PROGRAM_ID } from './solanaRpc.ts';
import { externalListingQuery, externalListingMatches } from './externalHandleListings.ts';
export async function namesChain(base44, rpcUrl, handles) {
  if (!handles.length) return [];
  const addresses = handles.map(deriveHandleAccountAddresses);
  const [chain, protections, listings] = await Promise.all([
    rpc(rpcUrl, 'getMultipleAccounts', [addresses.flatMap(a => [a.record, a.restriction]), { encoding: 'base64', commitment: 'confirmed' }]),
    base44.asServiceRole.entities.ProtectedName.filter({ handle: { $in: handles }, status: 'active' }, { limit: 100, fields: ['handle', 'restriction_type'] }),
    base44.asServiceRole.entities.MarketplaceListing.filter({ ...externalListingQuery(), handle: { $in: handles } }, { limit: 100, sort: 'price', fields: ['handle', 'asset_address', 'seller', 'marketplace', 'price', 'currency', 'listing_url', 'last_verified_at'] })
  ]);
  if (!chain?.value || chain.value.length !== handles.length * 2) throw new Error('Live availability could not be verified. Please try again.');
  const assets = [...new Set(listings.items.map(row => row.asset_address))];
  const ownership = assets.length ? await rpc(rpcUrl, 'getAssetBatch', { ids: assets }).catch(() => []) : [];
  const owners = new Map((Array.isArray(ownership) ? ownership : []).filter(Boolean).map(asset => [asset.id, asset.ownership?.owner]));
  return handles.map((handle, i) => {
    const account = chain.value[i * 2];
    if (account && account.owner !== PROGRAM_ID) throw new Error('Invalid handle record owner.');
    const record = account?.data?.[0] ? parseHandleRecord(account.data[0]) : null;
    if (record && record.handle !== handle) throw new Error('Invalid handle record.');
    const restriction = parseNameRestrictionAccount(chain.value[i * 2 + 1], addresses[i].restriction);
    const protectedName = protections.items.find(p => p.handle === handle);
    const listing = record ? listings.items.find(row => row.handle === handle && externalListingMatches(row, record.assetAddress, owners.get(record.assetAddress))) : null;
    const status = record ? listing ? 'FOR_SALE' : 'OWNED' : restriction?.active ? restriction.restrictionType : protectedName ? protectedName.restriction_type || 'PROTECTED' : 'AVAILABLE';
    return { handle, status, asset: record?.assetAddress || null, externalListing: listing ? { marketplace: listing.marketplace, price: listing.price, currency: listing.currency, url: listing.listing_url, checkedAt: listing.last_verified_at } : null, verifiedAt: new Date().toISOString() };
  });
}