import { PublicKey } from "npm:@solana/web3.js@1.98.4";
import { rpc } from "./solanaRpc.ts";

const nowIso = () => new Date().toISOString();
const clean = (value) => String(value || "").replace(/^@/, "").toLowerCase();

export function earnNetworkMode(settings) {
  const mint = String(settings?.token_mint_address || "");
  const validMint = (() => { try { return new PublicKey(mint).toBase58() === mint; } catch { return false; } })();
  return settings?.earn_network_mode === "LIVE" && validMint ? "LIVE" : settings?.earn_network_mode === "PAUSED" ? "PAUSED" : "PRELAUNCH";
}

export function tierForTokenBalance(balance, settings) {
  const tiers = [
    [Number(settings?.token_tier_4_minimum ?? 1000000), Number(settings?.token_tier_4_percentage ?? 50)],
    [Number(settings?.token_tier_3_minimum ?? 250000), Number(settings?.token_tier_3_percentage ?? 40)],
    [Number(settings?.token_tier_2_minimum ?? 100000), Number(settings?.token_tier_2_percentage ?? 30)],
    [Number(settings?.token_tier_1_minimum ?? 25000), Number(settings?.token_tier_1_percentage ?? 20)]
  ];
  return tiers.find(([minimum]) => balance >= minimum)?.[1] || 0;
}

async function tokenBalance(rpcUrl, wallet, mint) {
  const result = await rpc(rpcUrl, "getTokenAccountsByOwner", [wallet, { mint }, { encoding: "jsonParsed", commitment: "confirmed" }]);
  return (result?.value || []).reduce((sum, row) => sum + Number(row.account?.data?.parsed?.info?.tokenAmount?.uiAmountString || 0), 0);
}

export async function refreshEarningTier(base44, profile, settings, rpcUrl) {
  if (earnNetworkMode(settings) !== "LIVE") return { profile, balance: 0, percentage: 0 };
  const balance = await tokenBalance(rpcUrl, profile.wallet_address, settings.token_mint_address);
  const candidate = tierForTokenBalance(balance, settings);
  const current = Number(profile.earning_tier_percentage || 0);
  const now = Date.now();
  const update = { token_balance_cached: balance, tier_checked_at: nowIso() };
  let percentage = current;
  if (candidate < current) Object.assign(update, { earning_tier_percentage: candidate, pending_tier_percentage: 0, tier_qualified_at: "", tier_activates_at: "" }), percentage = candidate;
  else if (candidate === current) Object.assign(update, { pending_tier_percentage: 0, tier_qualified_at: "", tier_activates_at: "" });
  else if (Number(profile.pending_tier_percentage || 0) === candidate && Date.parse(profile.tier_activates_at || "") <= now) Object.assign(update, { earning_tier_percentage: candidate, pending_tier_percentage: 0, tier_qualified_at: "", tier_activates_at: "" }), percentage = candidate;
  else if (Number(profile.pending_tier_percentage || 0) !== candidate) {
    const activatesAt = new Date(now + Number(settings?.tier_qualification_hours ?? 24) * 3600000).toISOString();
    Object.assign(update, { pending_tier_percentage: candidate, tier_qualified_at: nowIso(), tier_activates_at: activatesAt });
  }
  const updated = await base44.asServiceRole.entities.ReferralProfile.update(profile.id, update);
  return { profile: updated, balance, percentage };
}

async function createEvent(base44, settings, origin, input, sharePercentage) {
  const existing = await base44.asServiceRole.entities.EarnRevenueEvent.filter({ source: input.source, source_signature: input.signature }, "-created_date", 1);
  if (existing[0]) return existing[0];
  const live = earnNetworkMode(settings) === "LIVE";
  const earning = live ? Math.floor(Number(input.actualReceivedLamports || 0) * sharePercentage / 100) : 0;
  const occurredAt = input.occurredAt || nowIso();
  const availableAt = new Date(Date.parse(occurredAt) + Number(settings?.payout_hold_hours ?? 24) * 3600000).toISOString();
  const event = await base44.asServiceRole.entities.EarnRevenueEvent.create({
    referral_profile_id: origin.origin_profile_id, origin_referral_id: origin.id, source: input.source,
    source_signature: input.signature, referred_wallet: input.referredWallet || origin.referred_wallet,
    asset_address: input.assetAddress || origin.referred_asset_address, handle: clean(input.handle || origin.referred_handle),
    gross_activity_lamports: Number(input.grossActivityLamports || 0), actual_received_lamports: Number(input.actualReceivedLamports || 0),
    share_percentage: live ? sharePercentage : 0, earning_lamports: earning, status: live ? "HELD" : "PRELAUNCH",
    occurred_at: occurredAt, available_at: availableAt, payout_id: ""
  });
  if (earning > 0) {
    const type = input.source === "MINT" ? "MINT_REWARD" : input.source === "SECONDARY_ROYALTY" ? "SECONDARY_REWARD" : "CREATOR_FEE_REWARD";
    await base44.asServiceRole.entities.ReferralLedger.create({ referral_profile_id: origin.origin_profile_id, type, amount_lamports: earning, conversion_id: "", revenue_event_id: event.id, payout_id: "", status: "PENDING" });
  }
  return event;
}

export async function lockMintOrigin(base44, settings, input, rpcUrl) {
  const duplicate = await base44.asServiceRole.entities.OriginReferral.filter({ mint_signature: input.signature }, "-locked_at", 1);
  if (duplicate[0]) return { origin: duplicate[0], duplicate: true };
  const walletOrigins = await base44.asServiceRole.entities.OriginReferral.filter({ referred_wallet: input.referredWallet, status: "LOCKED" }, "locked_at", 1);
  const profileId = walletOrigins[0]?.origin_profile_id || input.referralProfileId;
  if (!profileId) return { origin: null, reason: "no_referral" };
  const profiles = await base44.asServiceRole.entities.ReferralProfile.filter({ id: profileId, status: "ACTIVE" }, "-created_date", 1);
  let profile = profiles[0];
  if (!profile) return { origin: null, reason: "inactive_profile" };
  if (profile.wallet_address === input.referredWallet) return { origin: null, reason: "self_referral" };
  const tier = await refreshEarningTier(base44, profile, settings, rpcUrl);
  profile = tier.profile;
  const origin = await base44.asServiceRole.entities.OriginReferral.create({
    origin_profile_id: profile.id, origin_handle: clean(profile.display_handle), referred_wallet: input.referredWallet,
    referred_handle: clean(input.handle), referred_asset_address: input.assetAddress, mint_signature: input.signature,
    mint_price_lamports: Number(input.actualReceivedLamports || 0), locked_tier_percentage: tier.percentage,
    status: "LOCKED", locked_at: input.occurredAt || nowIso()
  });
  const event = await createEvent(base44, settings, origin, { ...input, source: "MINT" }, tier.percentage);
  return { origin, event, profile, percentage: tier.percentage, earningLamports: event.earning_lamports, mode: earnNetworkMode(settings) };
}

export async function recordOriginRevenue(base44, settings, input, rpcUrl) {
  const query = input.assetAddress ? { referred_asset_address: input.assetAddress, status: "LOCKED" } : { referred_wallet: input.referredWallet, status: "LOCKED" };
  const origins = await base44.asServiceRole.entities.OriginReferral.filter(query, "locked_at", 1);
  const origin = origins[0];
  if (!origin) return { credited: false, reason: "no_origin" };
  const profiles = await base44.asServiceRole.entities.ReferralProfile.filter({ id: origin.origin_profile_id, status: "ACTIVE" }, "-created_date", 1);
  if (!profiles[0]) return { credited: false, reason: "inactive_profile" };
  const tier = await refreshEarningTier(base44, profiles[0], settings, rpcUrl);
  const qualified = tier.percentage > 0;
  const configuredShare = input.source === "SECONDARY_ROYALTY" ? Number(settings?.secondary_referrer_share_percentage ?? 50) : Number(settings?.creator_fee_referrer_share_percentage ?? 50);
  const event = await createEvent(base44, settings, origin, input, qualified ? configuredShare : 0);
  return { credited: event.earning_lamports > 0, event, origin, mode: earnNetworkMode(settings) };
}