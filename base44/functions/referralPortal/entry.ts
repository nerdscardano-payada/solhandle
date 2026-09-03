import { createClientFromRequest } from "npm:@base44/sdk@0.8.46";
import { secrets } from "base44:runtime";
import { ensurePromoterProfile, getReferralSettings } from "../../shared/referralEngine.ts";
import { getAssetOwner } from "../../shared/solanaRpc.ts";

const safeWallet = (value) => /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(String(value || ""));
const publicSettings = (s) => s ? ({ enabled: s.referral_enabled, minimumPayoutSol: s.minimum_payout_sol, tiers: [{ start: 1, percentage: s.tier_1_percentage }, { start: s.tier_2_start, percentage: s.tier_2_percentage }, { start: s.tier_3_start, percentage: s.tier_3_percentage }, { start: s.tier_4_start, percentage: s.tier_4_percentage }] }) : null;

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req); const body = await req.json().catch(() => ({})); const action = String(body.action || "get");
    const settings = await getReferralSettings(base44);
    if (action === "program_info") {
      return Response.json({ enabled: Boolean(settings?.referral_enabled), cookieDays: settings?.cookie_duration_days, minimumPayoutSol: settings?.minimum_payout_sol, holdHours: settings?.payout_hold_hours, premiumEligible: Boolean(settings?.premium_referral_eligible), tier1: settings?.tier_1_percentage, tier2: settings?.tier_2_percentage, tier3: settings?.tier_3_percentage, tier4: settings?.tier_4_percentage, tier2Start: settings?.tier_2_start, tier3Start: settings?.tier_3_start, tier4Start: settings?.tier_4_start });
    }
    if (action === "leaderboard") {
      const profiles = await base44.asServiceRole.entities.ReferralProfile.filter({ status: "ACTIVE", show_on_leaderboard: true }, "-successful_referrals", 20);
      return Response.json({ enabled: Boolean(settings?.referral_enabled), leaders: profiles.map((p) => ({ handle: p.display_handle, referrals: p.successful_referrals })) });
    }
    if (action === "badge") {
      const display = `@${String(body.handle || "").replace(/^@/, "").toLowerCase()}`; const profiles = await base44.asServiceRole.entities.ReferralProfile.filter({ display_handle: display, status: "ACTIVE" }, "-successful_referrals", 1);
      return Response.json({ profile: profiles[0] ? { handle: profiles[0].display_handle, referrals: profiles[0].successful_referrals } : null });
    }
    const wallet = String(body.wallet || ""); if (!safeWallet(wallet)) return Response.json({ error: "Valid wallet required." }, { status: 400 });
    let profiles = await base44.asServiceRole.entities.ReferralProfile.filter({ wallet_address: wallet }, "-created_date", 1); let profile = profiles[0] || null;
    if (action === "activate") {
      if (!settings?.referral_enabled) return Response.json({ error: "Referral program is disabled." }, { status: 409 });
      const handle = String(body.handle || "").replace(/^@/, "").toLowerCase(); const rows = await base44.asServiceRole.entities.HandleIndex.filter({ handle, status: "active" }, "-minted_at", 1);
      if (!rows[0]?.asset_address) return Response.json({ error: "Active handle not found." }, { status: 404 });
      const owner = await getAssetOwner(secrets.get("SOLANA_RPC_URL"), rows[0].asset_address, rows[0].current_owner_cached);
      if (owner !== wallet) return Response.json({ error: "Wallet does not own this handle." }, { status: 403 });
      profile = await ensurePromoterProfile(base44, wallet, handle);
    }
    if (action === "share" && profile) {
      await base44.asServiceRole.entities.ShareEvent.create({ referral_profile_id: profile.id, handle: String(body.handle || "").replace(/^@/, "").toLowerCase(), platform: body.platform === "X" ? "X" : "COPY", shared_at: new Date().toISOString() });
      return Response.json({ tracked: true });
    }
    if (!profile) return Response.json({ settings: publicSettings(settings), profile: null, conversions: [], payouts: [], notifications: [] });
    const [conversions, payouts, notifications] = await Promise.all([
      base44.asServiceRole.entities.ReferralConversion.filter({ referral_profile_id: profile.id }, "-created_date", 100),
      base44.asServiceRole.entities.ReferralPayout.filter({ referral_profile_id: profile.id }, "-initiated_at", 50),
      base44.asServiceRole.entities.ReferralNotification.filter({ referral_profile_id: profile.id }, "-created_date", 20)
    ]);
    return Response.json({ settings: publicSettings(settings), profile, conversions: conversions.map((c) => ({ id: c.id, handle: c.minted_handle, grossLamports: c.gross_mint_amount_lamports, rewardLamports: c.reward_amount_lamports, percentage: c.reward_percentage_used, status: c.status, date: c.created_date })), payouts: payouts.map((p) => ({ amountLamports: p.amount_lamports, status: p.status, signature: p.transaction_signature, date: p.initiated_at })), notifications });
  } catch (error) { return Response.json({ error: error.message || "Unable to load Share & Earn." }, { status: 500 }); }
}