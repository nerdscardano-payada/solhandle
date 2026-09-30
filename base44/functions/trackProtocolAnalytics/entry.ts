import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';
import { clearNamesInterest } from '../../shared/namesInterest.ts';

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const type = String(body.type || "");
    const timestamp = new Date().toISOString();
    if (type === "page_view") {
      if (!body.session_id || !body.route) return Response.json({ error: "Invalid page view" }, { status: 400 });
      await base44.asServiceRole.entities.PageView.create({ route: String(body.route).slice(0, 300), referrer: String(body.referrer || "").slice(0, 500), session_id: String(body.session_id).slice(0, 100), wallet_connected: Boolean(body.wallet_connected), referral_code: String(body.referral_code || "").slice(0, 80), timestamp });
    } else if (type === "search") {
      if (body.source !== 'manual_confirmed_v1') return Response.json({ ok: true, recorded: false, ignored: true });
      const handle = String(body.handle || '').trim().replace(/^@+/, '').toLowerCase();
      const session = String(body.session_id || '');
      if (!/^[a-z0-9]{1,20}$/.test(handle) || !/^[a-zA-Z0-9_-]{8,100}$/.test(session)) return Response.json({ error: 'Invalid confirmed search.' }, { status: 400 });
      const status = String(body.status || (body.available ? 'AVAILABLE' : 'UNAVAILABLE'));
      if (!['AVAILABLE', 'CLAIMED', 'RESERVED', 'PROTECTED', 'UNAVAILABLE'].includes(status)) return Response.json({ error: 'Invalid search status.' }, { status: 400 });
      const saved = await base44.asServiceRole.entities.SearchAnalytics.upsert([{ event_key: `manual-v1:${session}:${handle}`, handle, available_at_search: Boolean(body.available), status, session_hash: session, referral_code: String(body.referral_code || '').slice(0, 80), timestamp, source: 'manual_confirmed_v1' }], { key: 'event_key' });
      clearNamesInterest();
      return Response.json({ ok: true, recorded: true, duplicate: saved.created === 0 });
    } else if (type === "funnel") {
      if (body.step === 'SEARCH' && body.source !== 'manual_confirmed_v1') return Response.json({ ok: true, recorded: false, ignored: true });
      const allowed = ["SEARCH", "CLAIM_CLICK", "WALLET_CONNECTED", "MINT_STARTED", "MINT_CONFIRMED"];
      if (!body.session_id || !allowed.includes(body.step)) return Response.json({ error: "Invalid funnel event" }, { status: 400 });
      await base44.asServiceRole.entities.FunnelEvent.create({ session_id: String(body.session_id).slice(0, 100), step: body.step, handle: String(body.handle || "").slice(0, 20), referral_code: String(body.referral_code || "").slice(0, 80), timestamp });
    } else return Response.json({ error: "Unknown event" }, { status: 400 });
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}