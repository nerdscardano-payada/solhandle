import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { earnRetiredResponse } from '../../shared/earnRetirement.ts';
export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });
    const body = await req.json();
    if (body.action !== 'get') return earnRetiredResponse();
    const rows = await base44.asServiceRole.entities.ReferralSettings.list('-updated_date', 1);
    return Response.json({ settings: rows[0] ? { ...rows[0], referral_enabled: false, campaign_enabled: false, earn_network_mode: 'PAUSED', auto_payout_enabled: false } : null });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}