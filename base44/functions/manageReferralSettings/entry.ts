import { createClientFromRequest } from "npm:@base44/sdk@0.8.44";

const numericFields = ["cookie_duration_days", "minimum_payout_sol", "payout_hold_hours", "commission_percentage", "tier_1_percentage", "tier_2_percentage", "tier_3_percentage", "tier_4_percentage", "tier_2_start", "tier_3_start", "tier_4_start", "tier_qualification_hours", "token_tier_1_minimum", "token_tier_2_minimum", "token_tier_3_minimum", "token_tier_4_minimum", "token_tier_1_percentage", "token_tier_2_percentage", "token_tier_3_percentage", "token_tier_4_percentage", "secondary_referrer_share_percentage", "creator_fee_referrer_share_percentage", "creator_fee_referrer_cap_percentage"];
const defaults = { tier_qualification_hours: 24, token_tier_1_minimum: 25000, token_tier_2_minimum: 100000, token_tier_3_minimum: 250000, token_tier_4_minimum: 1000000, token_tier_1_percentage: 20, token_tier_2_percentage: 30, token_tier_3_percentage: 40, token_tier_4_percentage: 50, secondary_referrer_share_percentage: 50, creator_fee_referrer_share_percentage: 50, creator_fee_referrer_cap_percentage: 30 };

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
      campaign_enabled: Boolean(body.settings?.campaign_enabled),
      campaign_name: String(body.settings?.campaign_name || "Founding Ambassador Program").trim(),
      campaign_start_date: String(body.settings?.campaign_start_date || ""),
      campaign_end_date: String(body.settings?.campaign_end_date || ""),
      premium_referral_eligible: Boolean(body.settings?.premium_referral_eligible),
      auto_payout_enabled: false,
      payouts_paused: Boolean(body.settings?.payouts_paused),
      payout_wallet_address: String(body.settings?.payout_wallet_address || "").trim(),
      earn_network_mode: ["PRELAUNCH", "LIVE", "PAUSED"].includes(body.settings?.earn_network_mode) ? body.settings.earn_network_mode : "PRELAUNCH",
      token_mint_address: String(body.settings?.token_mint_address || "").trim(),
      creator_fee_cycle_token_mints: [...new Set(Array.isArray(body.settings?.creator_fee_cycle_token_mints) ? body.settings.creator_fee_cycle_token_mints.map((value) => String(value).trim()).filter(Boolean) : [])],
      creator_fee_carry_lamports: Number(rows[0].creator_fee_carry_lamports || 0)
    };
    for (const field of numericFields) {
      const value = Number(body.settings?.[field] ?? defaults[field]);
      if (!Number.isFinite(value) || value < 0) return Response.json({ error: `Invalid ${field}.` }, { status: 400 });
      update[field] = value;
    }
    if (update.cookie_duration_days < 1 || update.cookie_duration_days > 365 || update.commission_percentage > 100 || update.tier_1_percentage > 100 || update.tier_2_percentage > 100 || update.tier_3_percentage > 100 || update.tier_4_percentage > 100) return Response.json({ error: "Referral settings are outside allowed limits." }, { status: 400 });
    if (update.campaign_start_date && !Number.isFinite(Date.parse(update.campaign_start_date))) return Response.json({ error: "Invalid campaign start date." }, { status: 400 });
    if (update.campaign_end_date && !Number.isFinite(Date.parse(update.campaign_end_date))) return Response.json({ error: "Invalid campaign end date." }, { status: 400 });
    if (!(update.tier_2_start < update.tier_3_start && update.tier_3_start < update.tier_4_start) || !(update.token_tier_1_minimum < update.token_tier_2_minimum && update.token_tier_2_minimum < update.token_tier_3_minimum && update.token_tier_3_minimum < update.token_tier_4_minimum)) return Response.json({ error: "Tier thresholds must increase." }, { status: 400 });
    if (update.earn_network_mode === "LIVE" && !/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(update.token_mint_address)) return Response.json({ error: "A valid $HANDLE token mint is required before going live." }, { status: 400 });
    if (update.payout_wallet_address && !/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(update.payout_wallet_address)) return Response.json({ error: "Invalid payout wallet address." }, { status: 400 });
    if (update.creator_fee_referrer_cap_percentage < 1 || update.creator_fee_referrer_cap_percentage > 100) return Response.json({ error: "Creator-fee cap must be between 1% and 100%." }, { status: 400 });
    if (update.creator_fee_cycle_token_mints.some((mint) => !/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(mint))) return Response.json({ error: "Invalid creator-fee token mint." }, { status: 400 });
    const settings = await base44.asServiceRole.entities.ReferralSettings.update(rows[0].id, update);
    return Response.json({ settings });
  } catch (error) {
    return Response.json({ error: error.message || "Unable to update referral settings." }, { status: 500 });
  }
}