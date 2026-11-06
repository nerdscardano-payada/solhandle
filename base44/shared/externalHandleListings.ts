import { magicEdenListingCheck } from './magicEdenListingCheck.ts';
const cache = new Map();
let retryAfter = 0;
export function externalListingQuery() {
  // Synced rows are candidates, not proof: every displayed offer is checked live below.
  return { status: 'ACTIVE', marketplace: 'Magic Eden', currency: 'SOL', price: { $gt: 0 } };
}
export function externalListingMatches(row, asset) {
  // Magic Eden may escrow the NFT. Its seller need not equal the on-chain custodian.
  return row.asset_address === asset && !!row.seller && Number.isFinite(row.price) && row.price > 0 && row.currency === 'SOL' && row.marketplace === 'Magic Eden' && row.listing_url === `https://magiceden.io/item-details/${asset}` && Date.parse(row.last_verified_at) >= Date.now() - 60000 && Date.parse(row.last_verified_at) <= Date.now();
}
export async function checkedExternalListings(rows, strict = true) {
  const results = [];
  for (let start = 0; start < rows.length; start += 3) {
    const checked = await Promise.all(rows.slice(start, start + 3).map(async row => {
      const cached = cache.get(row.asset_address);
      let result = cached && Date.now() - cached.at < 60000 ? cached : null;
      if (!result) {
        if (Date.now() < retryAfter) return { error: 'Magic Eden is temporarily rate limited. Please try again later.' };
        const response = await magicEdenListingCheck(row.asset_address);
        if (response.error) {
          if (response.rateLimited) retryAfter = Date.now() + response.cooldown * 1000;
          return { error: 'Magic Eden offers could not be verified right now. Please try again later.' };
        }
        result = { at: Date.now(), listing: response.listing };
        if (cache.size >= 200) cache.delete(cache.keys().next().value);
        cache.set(row.asset_address, result);
      }
      if (!result.listing) return null;
      const verified = { ...row, seller: result.listing.seller, price: Number(result.listing.price), currency: 'SOL', marketplace: 'Magic Eden', listing_url: `https://magiceden.io/item-details/${row.asset_address}`, last_verified_at: new Date(result.at).toISOString() };
      return externalListingMatches(verified, row.asset_address) ? verified : null;
    }));
    const failure = checked.find(row => row?.error);
    if (failure && strict) throw new Error(failure.error);
    results.push(...checked.filter(row => row && !row.error));
    if (failure) break;
  }
  return results;
}