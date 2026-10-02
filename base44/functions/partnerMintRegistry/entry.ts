import { pilotRequest, pilotSigner, pilotError } from '../../shared/partnerMintRequest.ts';
import { registryId, registryState, syncRegistryProfile, registryPartnerLink } from '../../shared/partnerMintRegistryState.ts';
import registryPrepare from '../../shared/partnerMintRegistryPrepare.ts';
import registryTransaction from '../../shared/partnerMintRegistryTransaction.ts';
import { fault } from '../../shared/partnerMintCodec.ts';
export default async function(req) {
  const requestId = crypto.randomUUID();
  try {
    const { base44, user, body, url } = await pilotRequest(req, ['list', 'sync', 'prepare', 'submit', 'status']);
    let result;
    if (body.action === 'list') {
      if (body.cursor != null && (typeof body.cursor !== 'string' || body.cursor.length > 4000)) fault('INVALID_CURSOR', 400);
      const [page, settings, history] = await Promise.all([
        base44.entities.PartnerMintProfile.filter({ cluster: 'devnet' }, { sort: 'partner_id', limit: 20, ...(body.cursor ? { cursor: body.cursor } : {}) }),
        registryState(url, ''),
        base44.entities.PartnerMintAdminIntent.filter({ cluster: 'devnet', admin_user_id: user.id }, { sort: '-created_date', limit: 10, fields: ['partner_id', 'operation', 'status', 'signature'] })
      ]);
      result = { profiles: page.items, hasMore: page.has_more, nextCursor: page.next_cursor, settings, history: history.items };
    } else if (body.action === 'sync') {
      const id = registryId(body.partnerId), state = await registryState(url, id);
      result = { profile: await syncRegistryProfile(base44, state, id, typeof body.displayName === 'string' ? body.displayName.trim().slice(0, 80) : '', await registryPartnerLink(base44, body.partnerLink)) };
    } else if (body.action === 'prepare') result = await registryPrepare(base44, user, body, url, pilotSigner());
    else result = await registryTransaction(base44, user, body, url);
    return Response.json({ ...result, cluster: 'devnet', requestId }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) { return pilotError(error, requestId); }
}