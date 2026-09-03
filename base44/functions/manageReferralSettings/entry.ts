import { createClientFromRequest } from "npm:@base44/sdk@0.8.44";

const numericFields = ["cookie_duration_days", "minimum_payout_sol", "tier_1_percentage", "tier_2_percentage", "tier_3_percentage", "tier_4_percentage", "tier_2_start", "tier_3_start", "tier_4_start"];

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "admin") return Response.json({ error: "Forbidden" }, { status: 403 });
    const body = await req.json().catch(() => ({}));
    const rows = await base44.asServiceRole.entities.ReferralSettings.list("-updated_date", 1);
    if (!rows[0]) return Response.json({ error: "Referral settings are missing." }, { status: 409 });
    if (body.action === "get") return Response.json({ settings: rows[0] });
    if (body.action !== "update") return Response.json({ error: "Unsupported action." }, { status: 400 });
    const update = {
      referral_enabled: Boolean(body.settings?.referral_enabled),
      premium_referral_eligible: Boolean(body.settings?.premium_referral_eligible),
      auto_payout_enabled: false
    };
    for (const field of numericFields) {
      const value = Number(body.settings?.[field]);
      if (!Number.isFinite(value) || value < 0) return Response.json({ error: `Invalid ${field}.` }, { status: 400 });
      update[field] = value;
    }
    if (update.cookie_duration_days < 1 || update.cookie_duration_days > 365 || update.tier_1_percentage > 100 || update.tier_2_percentage > 100 || update.tier_3_percentage > 100 || update.tier_4_percentage > 100) return Response.json({ error: "Referral settings are outside allowed limits." }, { status: 400 });
    if (!(update.tier_2_start < update.tier_3_start && update.tier_3_start < update.tier_4_start)) return Response.json({ error: "Tier thresholds must increase." }, { status: 400 });
    const settings = await base44.asServiceRole.entities.ReferralSettings.update(rows[0].id, update);
    return Response.json({ settings });
  } catch (error) {
    return Response.json({ error: error.message || "Unable to update referral settings." }, { status: 500 });
  }
}