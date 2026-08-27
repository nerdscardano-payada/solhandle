import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

const MARKETPLACE = 'Magic Eden';
const API_ROOT = 'https://api-mainnet.magiceden.dev/v2';

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const handles = await base44.asServiceRole.entities.HandleIndex.filter({ status: 'active' }, '-minted_at', 100);
    const existing = await base44.asServiceRole.entities.MarketplaceListing.filter({ marketplace: MARKETPLACE }, '-updated_date', 200);
    const byAsset = new Map(existing.map((row) => [row.asset_address, row]));
    const checkedAt = new Date().toISOString();
    const active = [];

    for (let index = 0; index < handles.length; index += 1) {
      const item = handles[index];
      const response = await fetch(`${API_ROOT}/tokens/${item.asset_address}/listings?listingAggMode=true`, { headers: { accept: 'application/json' } });
      if (!response.ok) throw new Error(`Magic Eden returned ${response.status} for @${item.handle}.`);
      const listings = await response.json();
      const listing = Array.isArray(listings)
        ? listings.filter((row) => Number.isFinite(Number(row.price))).sort((a, b) => Number(a.price) - Number(b.price))[0]
        : null;
      if (listing) active.push({ item, listing });
      if (index < handles.length - 1) await new Promise((resolve) => setTimeout(resolve, 550));
    }

    const activeAssets = new Set(active.map(({ item }) => item.asset_address));
    const updates = existing
      .filter((row) => handles.some((item) => item.asset_address === row.asset_address) && !activeAssets.has(row.asset_address) && row.status !== 'INACTIVE')
      .map((row) => ({ id: row.id, status: 'INACTIVE', last_verified_at: checkedAt }));
    const creates = [];

    for (const { item, listing } of active) {
      const record = {
        asset_address: item.asset_address,
        handle: item.handle,
        marketplace: MARKETPLACE,
        price: Number(listing.price),
        currency: 'SOL',
        listing_url: `https://magiceden.io/item-details/${item.asset_address}`,
        seller: String(listing.seller || ''),
        status: 'ACTIVE',
        last_verified_at: checkedAt,
      };
      const previous = byAsset.get(item.asset_address);
      if (previous) updates.push({ id: previous.id, ...record });
      else creates.push(record);
    }

    if (updates.length) await base44.asServiceRole.entities.MarketplaceListing.bulkUpdate(updates);
    if (creates.length) await base44.asServiceRole.entities.MarketplaceListing.bulkCreate(creates);
    return Response.json({ checked: handles.length, active: active.length, updated: updates.length, created: creates.length, checkedAt });
  } catch (error) {
    return Response.json({ error: error.message || 'Magic Eden synchronization failed.' }, { status: 500 });
  }
}