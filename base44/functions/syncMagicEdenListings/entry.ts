import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { magicEdenListingCheck } from '../../shared/magicEdenListingCheck.ts';

const MARKETPLACE = 'Magic Eden';

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(error => error.status === 401 ? null : Promise.reject(error));
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });
    const entities = base44.asServiceRole.entities;
    const states = await entities.MarketplaceSyncState.filter({ marketplace: MARKETPLACE }, '-created_date', 1);
    const state = states[0] || await entities.MarketplaceSyncState.create({ marketplace: MARKETPLACE, last_asset_id: '', retry_after: 0 });
    if (state.retry_after > Date.now()) return Response.json({ status: 'deferred', checked: 0, reason: 'Waiting after a Magic Eden outage or rate limit.', retryAt: new Date(state.retry_after).toISOString() });
    const query = { status: 'active', ...(state.last_asset_id ? { id: { $gt: state.last_asset_id } } : {}) };
    let page = await entities.HandleIndex.filter(query, { sort: 'id', limit: 10 });
    if (!page.items.length && state.last_asset_id) page = await entities.HandleIndex.filter({ status: 'active' }, { sort: 'id', limit: 10 });
    const handles = page.items;
    const existing = handles.length ? await entities.MarketplaceListing.filter({ marketplace: MARKETPLACE, asset_address: { $in: handles.map(item => item.asset_address).filter(Boolean) } }, '-updated_date', 500) : [];
    const byAsset = new Map(existing.map(row => [row.asset_address, row]));
    const checkedAt = new Date().toISOString(), started = Date.now();
    const updates = [], creates = [], warnings = [];
    let checked = 0, active = 0, attempted = 0, lastId = '', cooldown = 0;
    for (const item of handles) {
      if (Date.now() - started >= 30000) break;
      const result = await magicEdenListingCheck(item.asset_address);
      attempted += 1;
      lastId = item.id;
      if (result.error) {
        warnings.push({ handle: item.handle, error: result.error });
        console.warn(`Magic Eden @${item.handle}: ${result.error}`);
        if (result.rateLimited) { cooldown = result.cooldown * 1000; break; }
        if (warnings.length >= 3) { cooldown = 900000; break; }
      } else {
        checked += 1;
        const previous = byAsset.get(item.asset_address);
        if (result.listing) {
          active += 1;
          const record = { asset_address: item.asset_address, handle: item.handle, marketplace: MARKETPLACE, price: Number(result.listing.price), currency: 'SOL', listing_url: `https://magiceden.io/item-details/${item.asset_address}`, seller: result.listing.seller, status: 'ACTIVE', last_verified_at: checkedAt };
          if (previous) updates.push({ id: previous.id, ...record });
          else creates.push(record);
        } else if (previous) {
          updates.push({ id: previous.id, status: 'INACTIVE', last_verified_at: checkedAt });
        }
      }
      if (attempted < handles.length) await new Promise(resolve => setTimeout(resolve, 1100));
    }
    if (updates.length) await entities.MarketplaceListing.bulkUpdate(updates);
    if (creates.length) await entities.MarketplaceListing.bulkCreate(creates);
    const status = warnings.length || attempted < handles.length ? 'partial' : 'completed';
    const cycleComplete = attempted === handles.length && !page.has_more;
    await entities.MarketplaceSyncState.update(state.id, { last_asset_id: cycleComplete ? '' : lastId, retry_after: cooldown ? Date.now() + cooldown : 0, last_status: status, last_message: warnings.length ? warnings.map(row => row.error).join('; ').slice(0, 500) : `Checked ${checked} assets in this batch.`, last_run_at: checkedAt });
    return Response.json({ status, attempted, checked, active, updated: updates.length, created: creates.length, cycleComplete, warnings, checkedAt, retryAt: cooldown ? new Date(Date.now() + cooldown).toISOString() : null });
  } catch (error) {
    return Response.json({ error: error.message || 'Magic Eden synchronization failed.' }, { status: 500 });
  }
}