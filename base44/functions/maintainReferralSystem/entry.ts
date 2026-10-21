import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
// Preserve shared mint-intent cleanup; reward creation and release have ended.
export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });
    const now = Date.now();
    const [created, pending, submitted, processing] = await Promise.all([
      base44.asServiceRole.entities.MintIntent.filter({ status: 'CREATED' }, '-expires_at', 500),
      base44.asServiceRole.entities.MintIntent.filter({ status: 'PAYMENT_PENDING' }, '-expires_at', 500),
      base44.asServiceRole.entities.MintIntent.filter({ status: 'TRANSACTION_SUBMITTED' }, '-expires_at', 500),
      base44.asServiceRole.entities.MintIntent.filter({ status: 'PROCESSING' }, '-processing_started_at', 500)
    ]);
    const expired = [...created, ...pending, ...submitted].filter(i => Date.parse(i.expires_at) <= now);
    if (expired.length) await base44.asServiceRole.entities.MintIntent.bulkUpdate(expired.map(i => ({ id: i.id, status: 'EXPIRED' })));
    const stuck = processing.filter(i => Date.parse(i.processing_started_at || i.updated_date) <= now - 15 * 60000);
    if (stuck.length) await base44.asServiceRole.entities.MintIntent.bulkUpdate(stuck.map(i => ({ id: i.id, status: 'CONFIRMED', processing_token: '' })));
    return Response.json({ expired: expired.length, recovered: stuck.length, madeAvailable: 0, revenueMadeAvailable: 0 });
  } catch (error) {
    return Response.json({ error: error.message || 'Mint intent maintenance failed.' }, { status: 500 });
  }
}