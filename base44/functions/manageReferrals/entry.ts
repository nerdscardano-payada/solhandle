import { createClientFromRequest } from "npm:@base44/sdk@0.8.46";
import { secrets } from "base44:runtime";
import { getReferralSettings, reconcileReferralProfile } from "../../shared/referralEngine.ts";
import { rpc } from "../../shared/solanaRpc.ts";

async function requireAdmin(base44) { const user = await base44.auth.me(); if (!user || user.role !== "admin") throw new Error("ADMIN_REQUIRED"); }
export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req); await requireAdmin(base44); const body = await req.json().catch(() => ({})); const action = String(body.action || "list");
    if (action === "list") {
      const [profiles, conversions, payouts, clicks, flags] = await Promise.all([base44.asServiceRole.entities.ReferralProfile.list("-total_earnings_lamports", 100), base44.asServiceRole.entities.ReferralConversion.list("-created_date", 100), base44.asServiceRole.entities.ReferralPayout.list("-initiated_at", 100), base44.asServiceRole.entities.ReferralClick.list("-clicked_at", 500), base44.asServiceRole.entities.FraudFlag.filter({ status: "OPEN" }, "-created_date", 100)]);
      const commission = conversions.filter((c) => c.status !== "REJECTED_SELF_REFERRAL").reduce((s, c) => s + c.reward_amount_lamports, 0); const revenue = conversions.reduce((s, c) => s + c.eligible_referral_revenue_lamports, 0);
      return Response.json({ overview: { clicks: clicks.length, mints: conversions.length, conversionRate: clicks.length ? conversions.length / clicks.length * 100 : 0, revenueLamports: revenue, commissionLamports: commission, activePromoters: profiles.filter((p) => p.status === "ACTIVE").length, openFlags: flags.length }, profiles, conversions, payouts, flags });
    }
    if (action === "status") { if (!["ACTIVE", "PAUSED", "SUSPENDED", "BANNED"].includes(body.status)) return Response.json({ error: "Invalid status." }, { status: 400 }); await base44.asServiceRole.entities.ReferralProfile.update(String(body.profile_id), { status: body.status }); return Response.json({ updated: true }); }
    if (action === "create_payout") {
      const settings = await getReferralSettings(base44); if (settings?.payouts_paused || !settings?.payout_wallet_address) return Response.json({ error: "Configure and unpause the manual payout wallet first." }, { status: 409 });
      const profiles = await base44.asServiceRole.entities.ReferralProfile.filter({ id: String(body.profile_id) }, "-created_date", 1); const profile = profiles[0]; if (!profile) return Response.json({ error: "Profile not found." }, { status: 404 });
      const ledgers = await base44.asServiceRole.entities.ReferralLedger.filter({ referral_profile_id: profile.id, status: "AVAILABLE", type: "REFERRAL_REWARD" }, "created_date", 500); const amount = ledgers.reduce((s, l) => s + l.amount_lamports, 0);
      if (amount < Number(settings.minimum_payout_sol) * 1e9) return Response.json({ error: "Available balance is below the payout minimum." }, { status: 409 });
      const payout = await base44.asServiceRole.entities.ReferralPayout.create({ referral_profile_id: profile.id, wallet_address: profile.wallet_address, amount_lamports: amount, transaction_signature: "", status: "CREATED", initiated_at: new Date().toISOString(), confirmed_at: "", failure_reason: "" });
      return Response.json({ payout, instruction: { from: settings.payout_wallet_address, to: profile.wallet_address, amountLamports: amount } });
    }
    if (action === "confirm_payout") {
      const signature = String(body.signature || ""); if (!/^[1-9A-HJ-NP-Za-km-z]{64,88}$/.test(signature)) return Response.json({ error: "Invalid signature." }, { status: 400 }); const settings = await getReferralSettings(base44);
      const payouts = await base44.asServiceRole.entities.ReferralPayout.filter({ id: String(body.payout_id) }, "-initiated_at", 1); const payout = payouts[0]; if (!payout || payout.status === "CONFIRMED") return Response.json({ error: "Payout is missing or already confirmed." }, { status: 409 });
      const tx = await rpc(secrets.get("SOLANA_RPC_URL"), "getTransaction", [signature, { encoding: "json", commitment: "confirmed", maxSupportedTransactionVersion: 0 }]); if (!tx || tx.meta?.err) return Response.json({ error: "Payout transaction is not confirmed." }, { status: 409 });
      const keys = tx.transaction.message.accountKeys.map((k) => typeof k === "string" ? k : k.pubkey); const from = keys.indexOf(settings.payout_wallet_address); const to = keys.indexOf(payout.wallet_address); if (from < 0 || to < 0 || tx.meta.postBalances[to] - tx.meta.preBalances[to] < payout.amount_lamports || tx.meta.preBalances[from] - tx.meta.postBalances[from] < payout.amount_lamports) return Response.json({ error: "Transaction does not match this payout." }, { status: 409 });
      await base44.asServiceRole.entities.ReferralPayout.update(payout.id, { transaction_signature: signature, status: "CONFIRMED", confirmed_at: new Date().toISOString() }); const ledgers = await base44.asServiceRole.entities.ReferralLedger.filter({ referral_profile_id: payout.referral_profile_id, status: "AVAILABLE", type: "REFERRAL_REWARD" }, "created_date", 500);
      await base44.asServiceRole.entities.ReferralLedger.bulkUpdate(ledgers.map((l) => ({ id: l.id, status: "PAID", payout_id: payout.id }))); await base44.asServiceRole.entities.ReferralConversion.bulkUpdate(ledgers.filter((l) => l.conversion_id).map((l) => ({ id: l.conversion_id, status: "PAID" })));
      const profiles = await base44.asServiceRole.entities.ReferralProfile.filter({ id: payout.referral_profile_id }, "-created_date", 1); if (profiles[0]) { await reconcileReferralProfile(base44, profiles[0]); await base44.asServiceRole.entities.ReferralNotification.create({ referral_profile_id: profiles[0].id, type: "PAYOUT_CONFIRMED", title: "Payout confirmed", message: "Your referral payout was confirmed on Solana.", amount_lamports: payout.amount_lamports, read: false }); }
      return Response.json({ confirmed: true });
    }
    return Response.json({ error: "Unsupported action." }, { status: 400 });
  } catch (error) { const status = error.message === "ADMIN_REQUIRED" ? 403 : 500; return Response.json({ error: status === 403 ? "Forbidden" : error.message || "Referral admin action failed." }, { status }); }
}