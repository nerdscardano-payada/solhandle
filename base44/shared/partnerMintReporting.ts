import partnerMintStatus from './partnerMintStatus.ts';
import { fault } from './partnerMintCodec.ts';
export default async function partnerMintReporting(base44, user, body, url) {
  const partnerId = body.partnerId;
  if (typeof partnerId !== 'string' || !/^[a-z0-9-]{1,32}$/.test(partnerId)) fault('INVALID_PARTNER_ID', 400);
  if (body.cursor != null && (typeof body.cursor !== 'string' || body.cursor.length > 4000)) fault('INVALID_CURSOR', 400);
  const query = { cluster: 'devnet', partner_id: partnerId };
  if (body.action === 'reconcile') {
    const page = await base44.entities.PartnerMintIntent.filter({ ...query, admin_user_id: user.id,
      transaction_signature: { $exists: true, $ne: '' }, status: { $in: ['SUBMITTED', 'CONFIRMED', 'FINALIZED'] },
      $or: [{ status: { $ne: 'FINALIZED' } }, { receipt_indexed: { $ne: true } }]
    }, { sort: 'created_date', limit: 5, ...(body.cursor ? { cursor: body.cursor } : {}) });
    const results = [];
    for (const intent of page.items) {
      try { const result = await partnerMintStatus(base44, intent, url); results.push({ handle: intent.handle, status: result.status }); }
      catch (error) { results.push({ handle: intent.handle, status: 'RECHECK_REQUIRED', error: error.code || 'RPC_UNAVAILABLE' }); }
    }
    return { results, hasMore: page.has_more, nextCursor: page.next_cursor, checkedAt: new Date().toISOString() };
  }
  const page = await base44.entities.PartnerMintReceipt.filter({ ...query, status: 'FINALIZED' }, { sort: '-minted_at', limit: 20, ...(body.cursor ? { cursor: body.cursor } : {}) });
  let totals;
  if (!body.cursor) {
    const result = await base44.entities.PartnerMintReceipt.aggregate({ query: { ...query, status: 'FINALIZED' }, groupBy: 'partner_id', sum: ['mint_price_lamports', 'partner_share_lamports', 'protocol_share_lamports'] });
    if (result.truncated) fault('REPORT_TOTALS_UNAVAILABLE', 503);
    const row = result.rows[0];
    const exact = name => { const value = row?.[name] ?? 0; if (!Number.isSafeInteger(value) || value < 0) fault('REPORT_AMOUNT_RANGE', 503, 'Totals exceed exact reporting range. Rounded totals are not displayed.'); return String(value); };
    const activity = await base44.entities.PartnerMintEvent.aggregate({ query, groupBy: 'event' });
    const events = Object.fromEntries(activity.rows.map(event => [event.event, event.count]));
    totals = { count: row?.count ?? 0, mintPriceLamports: exact('sum_mint_price_lamports'), partnerShareLamports: exact('sum_partner_share_lamports'), protocolShareLamports: exact('sum_protocol_share_lamports'), events };
  }
  return { receipts: page.items, hasMore: page.has_more, nextCursor: page.next_cursor, ...(totals ? { totals } : {}), checkedAt: new Date().toISOString() };
}