import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';
import { verifyNamesWallet } from '../../shared/namesAuthorization.ts';
import { namesInterest, interestFor, clearNamesInterest } from '../../shared/namesInterest.ts';
export default async function(req: Request): Promise<Response> {
  try {
    const body = await req.json(), base44 = createClientFromRequest(req);
    const handle = String(body.handle || '').trim().replace(/^@+/, '').toLowerCase();
    if (!/^[a-z0-9]{1,20}$/.test(handle)) return Response.json({ error: 'Enter a valid handle.' }, { status: 400 });
    if (!['detail', 'set'].includes(body.action)) return Response.json({ error: 'Unsupported request.' }, { status: 400 });
    const wallet = body.proof ? await verifyNamesWallet(body.proof) : null;
    if (body.action === 'set') {
      if (!wallet) return Response.json({ error: 'Verify your wallet first.' }, { status: 401 });
      if (typeof body.watching !== 'boolean') return Response.json({ error: 'Invalid watch action.' }, { status: 400 });
      if (body.watching) await base44.asServiceRole.entities.NameWatch.upsert([{ watch_key: `${wallet}:${handle}`, wallet, handle, watched_at: new Date().toISOString() }], { key: 'watch_key' });
      else await base44.asServiceRole.entities.NameWatch.deleteMany({ wallet, handle });
      clearNamesInterest();
    }
    const [interest, watch] = await Promise.all([
      namesInterest(base44, { handle }),
      wallet ? base44.asServiceRole.entities.NameWatch.filter({ wallet, handle }, { limit: 1, fields: ['handle'] }) : Promise.resolve({ items: [] })
    ]);
    return Response.json({ handle, ...interestFor(interest, handle), watching: watch.items.length > 0, authorized: Boolean(wallet) });
  } catch (error) {
    return Response.json({ error: error.message || 'Could not update your watchlist.' }, { status: 400 });
  }
}