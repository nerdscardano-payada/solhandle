export function externalListingQuery() {
  return { status: 'ACTIVE', marketplace: 'Magic Eden', currency: 'SOL', price: { $gt: 0 }, last_verified_at: { $gte: new Date(Date.now() - 15 * 60000).toISOString() } };
}
export function externalListingMatches(row, asset, owner) {
  return row.asset_address === asset && row.seller === owner && !!owner && Number.isFinite(row.price) && row.price > 0 && row.currency === 'SOL' && row.marketplace === 'Magic Eden' && row.listing_url === `https://magiceden.io/item-details/${asset}` && Date.parse(row.last_verified_at) >= Date.now() - 15 * 60000 && Date.parse(row.last_verified_at) <= Date.now();
}