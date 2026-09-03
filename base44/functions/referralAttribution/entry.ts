import { createClientFromRequest } from "npm:@base44/sdk@0.8.44";
import { getReferralSettings } from "../../shared/referralEngine.ts";

const reserved = new Set(["admin", "api", "referral", "referrals", "earn", "dashboard", "login", "signup", "support", "terms", "privacy", "solhandle"]);

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const code = String(body.code || "").trim().replace(/^@+/, "").toLowerCase();
    const sessionId = String(body.browser_session_id || "").trim();
    if (!/^[a-z0-9-]{1,40}$/.test(code) || reserved.has(code) || !/^[a-f0-9-]{16,64}$/i.test(sessionId)) return Response.json({ valid: false }, { status: 400 });
    const settings = await getReferralSettings(base44);
    if (!settings?.referral_enabled) return Response.json({ enabled: false, valid: false });
    const profiles = await base44.asServiceRole.entities.ReferralProfile.filter({ referral_code: code }, "-created_date", 1);
    const profile = profiles[0];
    if (!profile || profile.status !== "ACTIVE") return Response.json({ enabled: true, valid: false });
    const now = new Date();
    const expiresAt = new Date(now.getTime() + settings.cookie_duration_days * 86400000).toISOString();
    const existing = await base44.asServiceRole.entities.ReferralAttribution.filter({ browser_session_id: sessionId }, "-updated_date", 1);
    let attribution;
    if (existing[0]) attribution = await base44.asServiceRole.entities.ReferralAttribution.update(existing[0].id, { referral_profile_id: profile.id, referral_code: code, last_click_at: now.toISOString(), expires_at: expiresAt, status: "ACTIVE" });
    else attribution = await base44.asServiceRole.entities.ReferralAttribution.create({ referral_profile_id: profile.id, referral_code: code, browser_session_id: sessionId, visitor_wallet_address: "", first_click_at: now.toISOString(), last_click_at: now.toISOString(), expires_at: expiresAt, status: "ACTIVE" });
    const recentClicks = await base44.asServiceRole.entities.ReferralClick.filter({ browser_session_id: sessionId, referral_code: code }, "-clicked_at", 1);
    if (!recentClicks[0] || Date.parse(recentClicks[0].clicked_at) < now.getTime() - 60000) await base44.asServiceRole.entities.ReferralClick.create({ referral_profile_id: profile.id, referral_code: code, browser_session_id: sessionId, clicked_at: now.toISOString() });
    return Response.json({ enabled: true, valid: true, attributionId: attribution.id, referralCode: attribution.referral_code, expiresAt: attribution.expires_at });
  } catch (error) {
    return Response.json({ error: error.message || "Unable to register referral." }, { status: 500 });
  }
}