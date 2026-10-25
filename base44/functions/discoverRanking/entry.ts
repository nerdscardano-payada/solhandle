import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { secrets } from 'base44:runtime';
import { checkDiscoverHandle, maintainDiscoverRanking } from '../../shared/discoverRankingChecks.ts';
import { reviewDiscoverRanking } from '../../shared/discoverRankingReview.ts';

export default async function(req) {
  const headers = { 'Cache-Control': 'no-store' };
  try {
    if (req.method !== 'POST') return Response.json({ error: 'POST required.' }, { status: 405, headers });
    const client = createClientFromRequest(req);
    const user = await client.auth.me().catch(() => null);
    if (!user) return Response.json({ error: 'Sign in required.' }, { status: 401, headers });
    if (user.role !== 'admin') return Response.json({ error: 'Administrators only.' }, { status: 403, headers });
    const raw = await req.text();
    if (raw.length > 4000) return Response.json({ error: 'Request too large.' }, { status: 413, headers });
    let body; try { body = JSON.parse(raw); } catch { return Response.json({ error: 'Invalid request.' }, { status: 400, headers }); }
    if (!body || typeof body !== 'object' || Array.isArray(body)) return Response.json({ error: 'Invalid request.' }, { status: 400, headers });
    const db = client.entities, rpcUrl = secrets.get('SOLANA_RPC_URL');
    if (body.action === 'maintenance') return Response.json(await maintainDiscoverRanking(db, rpcUrl), { headers });
    if (!['grant_integration', 'revoke_integration', 'grant_handle', 'revoke_handle', 'recheck'].includes(body.action)) return Response.json({ error: 'Unknown ranking action.' }, { status: 400, headers });
    if (!/^[a-f0-9]{24}$/.test(body.id || '')) return Response.json({ error: 'Invalid listing.' }, { status: 400, headers });
    const listing = await db.NetworkProject.get(body.id);
    if (!listing) return Response.json({ error: 'Listing not found.' }, { status: 404, headers });
    if (body.action === 'recheck') {
      if (!listing.handle_owner_wallet || !listing.handle_verified_asset || Date.parse(listing.handle_valid_until) <= Date.now()) return Response.json({ error: 'Review and approve the handle link first.' }, { status: 400, headers });
      const result = await checkDiscoverHandle(db, listing, rpcUrl);
      const messages = { ACTIVE: 'Current ownership confirmed. The existing review expiry is unchanged.', INACTIVE: 'Handle benefit removed. Listing, handle text and integration benefit are unchanged.', UNCERTAIN: 'Ownership check unavailable. No transfer was assumed; the existing review window remains.', SKIPPED_CHANGED: 'The listing changed during the check. Reload before checking again.' };
      return Response.json({ ...result, message: messages[result.status] }, { headers });
    }
    await reviewDiscoverRanking(db, listing, body, rpcUrl);
    return Response.json({ message: body.action.startsWith('revoke_') ? 'Only this ranking benefit was removed. The listing and other benefit are unchanged.' : 'Ranking benefit approved until the chosen review expiry.' }, { headers });
  } catch (error) {
    console.error('Directory ranking failed', error.message);
    return Response.json({ error: error.status ? error.message : 'Ranking could not be updated. Please retry.' }, { status: error.status || 500, headers });
  }
}