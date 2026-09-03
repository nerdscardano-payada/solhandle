import { createClientFromRequest } from "npm:@base44/sdk@0.8.46";
import { getReferralSettings, reconcileReferralProfile } from "../../shared/referralEngine.ts";

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req); const now = Date.now(); const settings = await getReferralSettings(base44);
    const [created, pending, submitted, processing, approved] = await Promise.all([
      base44.asServiceRole.entities.MintIntent.filter({ status: "CREATED" }, "-expires_at", 500),
      base44.asServiceRole.entities.MintIntent.filter({ status: "PAYMENT_PENDING" }, "-expires_at", 500),
      base44.asServiceRole.entities.MintIntent.filter({ status: "TRANSACTION_SUBMITTED" }, "-expires_at", 500),
      base44.asServiceRole.entities.MintIntent.filter({ status: "PROCESSING" }, "-processing_started_at", 500),
      base44.asServiceRole.entities.ReferralConversion.filter({ status: "APPROVED" }, "created_date", 500)
    ]);
    const expired = [...created, ...pending, ...submitted].filter((i) => Date.parse(i.expires_at) <= now);
    if (expired.length) await base44.asServiceRole.entities.MintIntent.bulkUpdate(expired.map((i) => ({ id: i.id, status: "EXPIRED" })));
    const stuck = processing.filter((i) => Date.parse(i.processing_started_at || i.updated_date) <= now - 15 * 60000);
    if (stuck.length) await base44.asServiceRole.entities.MintIntent.bulkUpdate(stuck.map((i) => ({ id: i.id, status: "CONFIRMED", processing_token: "" })));
    const holdMs = Number(settings?.payout_hold_hours ?? 24) * 3600000; const available = approved.filter((c) => Date.parse(c.created_date) <= now - holdMs); const profileIds = new Set();
    for (const conversion of available) {
      await base44.asServiceRole.entities.ReferralConversion.update(conversion.id, { status: "AVAILABLE" });
      const ledgers = await base44.asServiceRole.entities.ReferralLedger.filter({ conversion_id: conversion.id }, "-created_date", 1);
      if (ledgers[0]) await base44.asServiceRole.entities.ReferralLedger.update(ledgers[0].id, { status: "AVAILABLE" });
      await base44.asServiceRole.entities.ReferralNotification.create({ referral_profile_id: conversion.referral_profile_id, type: "REWARD_AVAILABLE", title: "Reward available", message: `Your reward for @${conversion.minted_handle} is available for payout.`, amount_lamports: conversion.reward_amount_lamports, read: false });
      profileIds.add(conversion.referral_profile_id);
    }
    for (const id of profileIds) { const p = await base44.asServiceRole.entities.ReferralProfile.filter({ id }, "-created_date", 1); if (p[0]) await reconcileReferralProfile(base44, p[0]); }
    return Response.json({ expired: expired.length, recovered: stuck.length, madeAvailable: available.length });
  } catch (error) { return Response.json({ error: error.message || "Referral maintenance failed." }, { status: 500 }); }
}