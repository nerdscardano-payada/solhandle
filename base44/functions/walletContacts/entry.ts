import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';
import { contactAccess, requireContactSession } from '../../shared/contactSessions.ts';
import { contactRecords } from '../../shared/contactRecords.ts';
export default async function(req: Request): Promise<Response> {
  try {
    if (req.method !== 'POST') return Response.json({ error: 'Use POST.' }, { status: 405 });
    const body = await req.json();
    const client = createClientFromRequest(req).asServiceRole;
    // Wallet signatures, not Base44 accounts, authorize this private address book.
    if (body.action === 'challenge' || body.action === 'verify') return Response.json(await contactAccess(client, body), { headers: { 'Cache-Control': 'no-store' } });
    const session = await requireContactSession(client, body);
    if (body.action === 'lock') {
      await client.entities.ContactsSession.delete(session.id);
      return Response.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
    }
    return Response.json(await contactRecords(client, session.wallet, body), { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return Response.json({ error: error.message || 'Contacts could not be synchronized.' }, { status: error.status || 500, headers: { 'Cache-Control': 'no-store' } });
  }
}