import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const type = String(body.type || "");
    const timestamp = new Date().toISOString();
    if (type === "page_view") {
      if (!body.session_id || !body.route) return Response.json({ error: "Invalid page view" }, { status: 400 });
      await base44.asServiceRole.entities.PageView.create({ route: String(body.route).slice(0, 300), referrer: String(body.referrer || "").slice(0, 500), session_id: String(body.session_id).slice(0, 100), wallet_connected: Boolean(body.wallet_connected), referral_code: String(body.referral_code || "").slice(0, 80), timestamp });
    } else if (type === "search") {
      if (!body.handle || !body.session_id) return Response.json({ error: "Invalid search" }, { status: 400 });
      await base44.asServiceRole.entities.SearchAnalytics.create({ handle: String(body.handle).slice(0, 20), available_at_search: Boolean(body.available), status: String(body.status || (body.available ? "AVAILABLE" : "UNAVAILABLE")), session_hash: String(body.session_id).slice(0, 100), referral_code: String(body.referral_code || "").slice(0, 80), timestamp });
    } else if (type === "funnel") {
      const allowed = ["SEARCH", "CLAIM_CLICK", "WALLET_CONNECTED", "MINT_STARTED", "MINT_CONFIRMED"];
      if (!body.session_id || !allowed.includes(body.step)) return Response.json({ error: "Invalid funnel event" }, { status: 400 });
      await base44.asServiceRole.entities.FunnelEvent.create({ session_id: String(body.session_id).slice(0, 100), step: body.step, handle: String(body.handle || "").slice(0, 20), referral_code: String(body.referral_code || "").slice(0, 80), timestamp });
    } else return Response.json({ error: "Unknown event" }, { status: 400 });
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}