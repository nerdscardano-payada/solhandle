const RESERVED_CODES = new Set(["admin", "api", "referral", "referrals", "earn", "dashboard", "login", "signup", "support", "terms", "privacy", "solhandle"]);

export async function getReferralSettings(base44) {
  const rows = await base44.asServiceRole.entities.ReferralSettings.list("-updated_date", 1);
  return rows[0] || null;
}

function tierPercentage(settings, ordinal) {
  if (ordinal >= settings.tier_4_start) return settings.tier_4_percentage;
  if (ordinal >= settings.tier_3_start) return settings.tier_3_percentage;
  if (ordinal >= settings.tier_2_start) return settings.tier_2_percentage;
  return settings.tier_1_percentage;
}

export async function ensurePromoterProfile(base44, wallet, handle) {
  const existingWallet = await base44.asServiceRole.entities.ReferralProfile.filter({ wallet_address: wallet }, "-created_date", 1);
  if (existingWallet[0]) return existingWallet[0];
  const cleanHandle = String(handle || "").toLowerCase();
  const preferred = RESERVED_CODES.has(cleanHandle) ? "" : cleanHandle;
  const existingCode = preferred ? await base44.asServiceRole.entities.ReferralProfile.filter({ referral_code: preferred }, "-created_date", 1) : [];
  const referralCode = existingCode[0] ? `${cleanHandle}-${wallet.slice(0, 6).toLowerCase()}` : preferred || `ref-${wallet.slice(0, 10).toLowerCase()}`;
  return await base44.asServiceRole.entities.ReferralProfile.create({
    wallet_address: wallet, referral_code: referralCode, display_handle: `@${cleanHandle}`, status: "ACTIVE",
    show_on_leaderboard: true, successful_referrals: 0, total_earnings_lamports: 0,
    pending_earnings_lamports: 0, paid_earnings_lamports: 0
  });
}

export async function createReferralMintIntent(base44, input) {
  const settings = await getReferralSettings(base44);
  if (!settings?.referral_enabled) return null;
  if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(input.buyerWallet)) throw new Error("A valid buyer wallet is required for the mint intent.");
  let attribution = null;
  let profile = null;
  if (input.attributionId) {
    const rows = await base44.asServiceRole.entities.ReferralAttribution.filter({ id: input.attributionId }, "-created_date", 1);
    const candidate = rows[0];
    if (candidate?.status === "ACTIVE" && Date.parse(candidate.expires_at) > Date.now()) {
      const profiles = await base44.asServiceRole.entities.ReferralProfile.filter({ id: candidate.referral_profile_id }, "-created_date", 1);
      if (profiles[0]?.status === "ACTIVE") { attribution = candidate; profile = profiles[0]; }
    }
  }
  const intent = await base44.asServiceRole.entities.MintIntent.create({
    buyer_wallet: input.buyerWallet, handle: input.handle, base_price_lamports: input.basePriceLamports,
    premium_surcharge_lamports: input.premiumSurchargeLamports, total_price_lamports: input.totalPriceLamports,
    referral_profile_id: profile?.id || "", referral_code: profile?.referral_code || "", attribution_id: attribution?.id || "",
    transaction_signature: "", expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(), status: "CREATED"
  });
  if (attribution) await base44.asServiceRole.entities.ReferralAttribution.update(attribution.id, { visitor_wallet_address: input.buyerWallet });
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
  await ensurePromoterProfile(base44, mint.buyerWallet, mint.handle);
  const intents = await base44.asServiceRole.entities.MintIntent.filter({ transaction_signature: mint.signature }, "-created_date", 1);
  const intent = intents[0];
  if (!intent?.referral_profile_id) return { credited: false, reason: "no_referral" };
  const token = crypto.randomUUID();
  if (intent.status === "CONFIRMED") await base44.asServiceRole.entities.MintIntent.updateMany({ id: intent.id, status: "CONFIRMED" }, { $set: { status: "PROCESSING", processing_token: token, processing_started_at: new Date().toISOString() } });
  const claimedRows = await base44.asServiceRole.entities.MintIntent.filter({ id: intent.id }, "-created_date", 1);
  if (claimedRows[0]?.processing_token !== token) return { credited: false, reason: "duplicate" };
  const existing = await base44.asServiceRole.entities.ReferralConversion.filter({ mint_transaction_signature: mint.signature }, "-created_date", 1);
  if (existing[0]) { await base44.asServiceRole.entities.MintIntent.update(intent.id, { status: "PROCESSED", processing_token: "" }); return { credited: false, reason: "duplicate" }; }
  const profiles = await base44.asServiceRole.entities.ReferralProfile.filter({ id: intent.referral_profile_id }, "-created_date", 1);
  const profile = profiles[0];
  if (!profile || profile.status !== "ACTIVE") { await base44.asServiceRole.entities.MintIntent.update(intent.id, { status: "PROCESSED", processing_token: "" }); return { credited: false, reason: "inactive_profile" }; }
  const eligible = Math.min(mint.netRevenueLamports, intent.base_price_lamports + (settings.premium_referral_eligible ? intent.premium_surcharge_lamports : 0));
  const percentage = tierPercentage(settings, profile.successful_referrals + 1); const selfReferral = profile.wallet_address === mint.buyerWallet;
  const conversion = await base44.asServiceRole.entities.ReferralConversion.create({ mint_intent_id: intent.id, mint_transaction_signature: mint.signature, minted_handle: mint.handle, buyer_wallet: mint.buyerWallet, referral_profile_id: profile.id, gross_mint_amount_lamports: mint.grossAmountLamports, eligible_referral_revenue_lamports: eligible, reward_percentage_used: percentage, reward_amount_lamports: selfReferral ? 0 : Math.floor(eligible * percentage / 100), status: selfReferral ? "REJECTED_SELF_REFERRAL" : "APPROVED" });
  if (selfReferral) {
    await base44.asServiceRole.entities.FraudFlag.create({ referral_profile_id: profile.id, conversion_id: conversion.id, reason: "SELF_REFERRAL", severity: "HIGH", status: "BLOCKED" });
  } else {
    await base44.asServiceRole.entities.ReferralLedger.create({ referral_profile_id: profile.id, type: "REFERRAL_REWARD", amount_lamports: conversion.reward_amount_lamports, conversion_id: conversion.id, payout_id: "", status: "PENDING" });
    await base44.asServiceRole.entities.ReferralNotification.create({ referral_profile_id: profile.id, type: "REWARD_EARNED", title: "You earned SOL", message: `Someone claimed @${mint.handle} through your referral link.`, amount_lamports: conversion.reward_amount_lamports, read: false });
    const recent = await base44.asServiceRole.entities.ReferralConversion.filter({ referral_profile_id: profile.id }, "-created_date", 25); const fiveMinutesAgo = Date.now() - 300000;
    if (recent.filter((c) => Date.parse(c.created_date) >= fiveMinutesAgo).length >= 10) await base44.asServiceRole.entities.FraudFlag.create({ referral_profile_id: profile.id, conversion_id: conversion.id, reason: "ABNORMAL_VOLUME", severity: "HIGH", status: "OPEN" });
    if (recent.filter((c) => c.buyer_wallet === mint.buyerWallet).length >= 5) await base44.asServiceRole.entities.FraudFlag.create({ referral_profile_id: profile.id, conversion_id: conversion.id, reason: "RELATED_WALLETS", severity: "MEDIUM", status: "OPEN" });
    await reconcileReferralProfile(base44, profile);
  }
  await base44.asServiceRole.entities.MintIntent.update(intent.id, { status: "PROCESSED", processing_token: "" });
  return selfReferral ? { credited: false, reason: "self_referral" } : { credited: true, rewardLamports: conversion.reward_amount_lamports, percentage };
}