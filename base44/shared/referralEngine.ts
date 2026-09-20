import { PublicKey } from "npm:@solana/web3.js@1.98.4";
import { lockMintOrigin } from "./earnNetwork.ts";

const RESERVED_CODES = new Set(["admin", "api", "referral", "referrals", "earn", "dashboard", "login", "signup", "support", "terms", "privacy", "solhandle"]);

export async function getReferralSettings(base44) {
  const rows = await base44.asServiceRole.entities.ReferralSettings.list("-updated_date", 1);
  return rows[0] || null;
}

export function activeCommissionPercentage(settings, at = new Date()) {
  const starts = settings?.campaign_start_date ? Date.parse(settings.campaign_start_date) : 0;
  const ends = settings?.campaign_end_date ? Date.parse(settings.campaign_end_date) : Infinity;
  const active = settings?.campaign_enabled !== false && at.getTime() >= starts && at.getTime() <= ends;
  return active ? Number(settings?.commission_percentage ?? 20) : Number(settings?.tier_1_percentage ?? 10);
}

export async function ensurePromoterProfile(base44, wallet, handle = "") {
  const existingWallet = await base44.asServiceRole.entities.ReferralProfile.filter({ wallet_address: wallet }, "-created_date", 1);
  if (existingWallet[0]) return existingWallet[0];
  const cleanHandle = String(handle || "").replace(/^@/, "").toLowerCase();
  const preferred = cleanHandle && !RESERVED_CODES.has(cleanHandle) ? cleanHandle : "";
  const existingCode = preferred ? await base44.asServiceRole.entities.ReferralProfile.filter({ referral_code: preferred }, "-created_date", 1) : [];
  const walletCode = `${wallet.slice(0, 6)}-${wallet.slice(-4)}`.toLowerCase();
  const referralCode = preferred && !existingCode[0] ? preferred : walletCode;
  const display = preferred ? `@${preferred}` : `${wallet.slice(0, 4)}…${wallet.slice(-4)}`;
  return await base44.asServiceRole.entities.ReferralProfile.create({
    wallet_address: wallet, referral_code: referralCode, display_handle: display, status: "ACTIVE",
    show_on_leaderboard: true, successful_referrals: 0, total_earnings_lamports: 0,
    pending_earnings_lamports: 0, paid_earnings_lamports: 0
  });
}

export async function createReferralMintIntent(base44, input) {
  const settings = await getReferralSettings(base44);
  if (!settings?.referral_enabled) return null;
  const buyerWallet = String(input.buyerWallet || "").trim();
  try {
    if (new PublicKey(buyerWallet).toBase58() !== buyerWallet) throw new Error("Non-canonical wallet");
  } catch {
    throw new Error("A valid buyer wallet is required for the mint intent.");
  }
  let attribution = null;
  let profile = null;
  const lockedOrigins = await base44.asServiceRole.entities.OriginReferral.filter({ referred_wallet: buyerWallet, status: "LOCKED" }, "locked_at", 1);
  if (lockedOrigins[0]) {
    const profiles = await base44.asServiceRole.entities.ReferralProfile.filter({ id: lockedOrigins[0].origin_profile_id }, "-created_date", 1);
    if (profiles[0]?.status === "ACTIVE") profile = profiles[0];
  } else if (input.attributionId) {
    const rows = await base44.asServiceRole.entities.ReferralAttribution.filter({ id: input.attributionId }, "-created_date", 1);
    const candidate = rows[0];
    if (candidate?.status === "ACTIVE" && Date.parse(candidate.expires_at) > Date.now()) {
      const profiles = await base44.asServiceRole.entities.ReferralProfile.filter({ id: candidate.referral_profile_id }, "-created_date", 1);
      if (profiles[0]?.status === "ACTIVE") { attribution = candidate; profile = profiles[0]; }
    }
  }
  const intent = await base44.asServiceRole.entities.MintIntent.create({
    buyer_wallet: buyerWallet, handle: input.handle, base_price_lamports: input.basePriceLamports,
    premium_surcharge_lamports: input.premiumSurchargeLamports, total_price_lamports: input.totalPriceLamports,
    referral_profile_id: profile?.id || "", referral_code: profile?.referral_code || "", attribution_id: attribution?.id || "",
    transaction_signature: "", expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(), status: "CREATED"
  });
  if (attribution) await base44.asServiceRole.entities.ReferralAttribution.update(attribution.id, { visitor_wallet_address: buyerWallet });
  return intent;
}

export async function lockReferralMintIntent(base44, input) {
  const settings = await getReferralSettings(base44);
  if (!settings?.referral_enabled) return null;
  if (!input.mintIntentId) throw new Error("A valid referral mint intent is required.");
  const rows = await base44.asServiceRole.entities.MintIntent.filter({ id: input.mintIntentId }, "-created_date", 1);
  const intent = rows[0];
  if (!intent || intent.status !== "CREATED" || Date.parse(intent.expires_at) <= Date.now()) throw new Error("Mint intent is missing or expired.");
  if (intent.buyer_wallet !== input.buyerWallet || intent.handle !== input.handle || intent.total_price_lamports !== input.totalPriceLamports) throw new Error("Mint intent does not match the signed transaction.");
  await base44.asServiceRole.entities.MintIntent.update(intent.id, { status: "PAYMENT_PENDING" });
  return intent;
}

export async function reconcileReferralProfile(base44, profile) {
  const [conversions, ledgers] = await Promise.all([
    base44.asServiceRole.entities.ReferralConversion.filter({ referral_profile_id: profile.id }, "-created_date", 500),
    base44.asServiceRole.entities.ReferralLedger.filter({ referral_profile_id: profile.id }, "-created_date", 500)
  ]);
  const successful = conversions.filter((item) => ["APPROVED", "AVAILABLE", "PAID"].includes(item.status)).length;
  const active = ledgers.filter((item) => item.status !== "REVERSED");
  const total = active.reduce((sum, item) => sum + item.amount_lamports, 0);
  const paid = active.filter((item) => item.status === "PAID").reduce((sum, item) => sum + item.amount_lamports, 0);
  await base44.asServiceRole.entities.ReferralProfile.update(profile.id, { successful_referrals: successful, total_earnings_lamports: total, pending_earnings_lamports: total - paid, paid_earnings_lamports: paid });
}

export async function processConfirmedReferral(base44, mint) {
  const settings = await getReferralSettings(base44);
  if (!settings?.referral_enabled) return { credited: false, reason: "disabled" };
  const intents = await base44.asServiceRole.entities.MintIntent.filter({ transaction_signature: mint.signature }, "-created_date", 1);
  const intent = intents[0];
  if (!intent?.referral_profile_id) return { credited: false, reason: "no_referral" };
  const token = crypto.randomUUID();
  if (intent.status === "CONFIRMED") await base44.asServiceRole.entities.MintIntent.updateMany({ id: intent.id, status: "CONFIRMED" }, { $set: { status: "PROCESSING", processing_token: token, processing_started_at: new Date().toISOString() } });
  const claimedRows = await base44.asServiceRole.entities.MintIntent.filter({ id: intent.id }, "-created_date", 1);
  if (claimedRows[0]?.processing_token !== token) return { credited: false, reason: "duplicate" };
  const existing = await base44.asServiceRole.entities.ReferralConversion.filter({ mint_transaction_signature: mint.signature }, "-created_date", 1);
  if (existing[0]) { await base44.asServiceRole.entities.MintIntent.update(intent.id, { status: "PROCESSED", processing_token: "" }); return { credited: false, reason: "duplicate" }; }
  const eligible = Math.min(mint.netRevenueLamports, intent.base_price_lamports + (settings.premium_referral_eligible ? intent.premium_surcharge_lamports : 0));
  const result = await lockMintOrigin(base44, settings, { referralProfileId: intent.referral_profile_id, signature: mint.signature, handle: mint.handle, assetAddress: mint.assetAddress, referredWallet: mint.buyerWallet, grossActivityLamports: mint.grossAmountLamports, actualReceivedLamports: eligible, occurredAt: mint.occurredAt }, mint.rpcUrl);
  if (!result.origin) {
    await base44.asServiceRole.entities.MintIntent.update(intent.id, { status: "PROCESSED", processing_token: "" });
    return { credited: false, reason: result.reason || "origin_not_locked" };
  }
  const conversion = await base44.asServiceRole.entities.ReferralConversion.create({
    mint_intent_id: intent.id, mint_transaction_signature: mint.signature, minted_handle: mint.handle,
    buyer_wallet: mint.buyerWallet, referral_profile_id: result.origin.origin_profile_id, origin_referral_id: result.origin.id,
    gross_mint_amount_lamports: mint.grossAmountLamports, eligible_referral_revenue_lamports: eligible,
    reward_percentage_used: result.percentage || 0, reward_amount_lamports: result.earningLamports || 0,
    status: result.mode === "LIVE" ? "PENDING" : "PRELAUNCH"
  });
  if (result.earningLamports > 0) {
    await base44.asServiceRole.entities.ReferralNotification.create({ referral_profile_id: result.origin.origin_profile_id, type: "REWARD_EARNED", title: "Your network earned SOL", message: `A confirmed mint of @${mint.handle} generated an Earn Network reward.`, amount_lamports: result.earningLamports, read: false });
    await reconcileReferralProfile(base44, result.profile);
  }
  await base44.asServiceRole.entities.MintIntent.update(intent.id, { status: "PROCESSED", processing_token: "" });
  return { credited: result.earningLamports > 0, prelaunch: result.mode !== "LIVE", conversionId: conversion.id, rewardLamports: result.earningLamports || 0, percentage: result.percentage || 0 };
}