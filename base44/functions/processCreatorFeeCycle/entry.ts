import { createClientFromRequest } from "npm:@base44/sdk@0.8.48";
import { PublicKey } from "npm:@solana/web3.js@1.98.4";
import { secrets } from "base44:runtime";
import { rpc } from "../../shared/solanaRpc.ts";
import { earnNetworkMode, recordOriginRevenue, refreshEarningTier } from "../../shared/earnNetwork.ts";

const PUMP_PROGRAMS = new Set(["6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P", "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA", "pfeeUxB6jkeY1Hxd7CsFCAjcbHA9rWtchMGdZ6VojVZ"]);
const WSOL = "So11111111111111111111111111111111111111112";
const validKey = (value) => { try { return new PublicKey(value).toBase58() === value; } catch { return false; } };
const keysOf = (tx) => (tx?.transaction?.message?.accountKeys || []).map((key) => typeof key === "string" ? { pubkey: key, signer: false } : key);
const usesPump = (tx) => keysOf(tx).some((key) => PUMP_PROGRAMS.has(key.pubkey));
const tokenAmount = (items, wallet) => (items || []).filter((item) => item.owner === wallet && item.mint === WSOL).reduce((sum, item) => sum + Number(item.uiTokenAmount?.amount || 0), 0);

async function signaturesInWindow(rpcUrl, mint, start, end) {
  const found = []; let before = undefined;
  for (let page = 0; page < 10; page += 1) {
    const options: Record<string, unknown> = { limit: 100, commitment: "confirmed" }; if (before) options.before = before;
    const rows = await rpc(rpcUrl, "getSignaturesForAddress", [mint, options]);
    if (!rows?.length) break;
    for (const row of rows) if (!row.err && Number(row.blockTime || 0) >= start && Number(row.blockTime || 0) <= end) found.push(row.signature);
    if (Number(rows[rows.length - 1].blockTime || 0) < start) break;
    before = rows[rows.length - 1].signature;
  }
  return found;
}

async function transactions(rpcUrl, signatures) {
  const rows = [];
  for (let offset = 0; offset < signatures.length; offset += 50) {
    const batch = signatures.slice(offset, offset + 50); const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const payload = batch.map((signature, index) => ({ jsonrpc: "2.0", id: index, method: "getTransaction", params: [signature, { encoding: "jsonParsed", commitment: "confirmed", maxSupportedTransactionVersion: 0 }] }));
      const response = await fetch(rpcUrl, { method: "POST", headers: { "Content-Type": "application/json", "User-Agent": "SolHandle/1.0" }, body: JSON.stringify(payload), signal: controller.signal });
      const result = await response.json(); if (!response.ok || !Array.isArray(result)) throw new Error("Solana RPC transaction batch failed.");
      rows.push(...result.sort((a, b) => a.id - b.id).map((item) => item.result).filter(Boolean));
    } finally { clearTimeout(timeout); }
  }
  return rows;
}

function tradeVolume(tx, wallet) {
  const keys = keysOf(tx); const index = keys.findIndex((key) => key.pubkey === wallet && key.signer);
  if (index < 0 || tx.meta?.err) return 0;
  const delta = Number(tx.meta.postBalances[index] || 0) - Number(tx.meta.preBalances[index] || 0);
  const native = delta < 0 ? Math.max(0, -delta - (index === 0 ? Number(tx.meta.fee || 0) : 0)) : delta;
  const wrapped = Math.abs(tokenAmount(tx.meta.postTokenBalances, wallet) - tokenAmount(tx.meta.preTokenBalances, wallet));
  return Math.max(native, wrapped);
}

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req); const user = await base44.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "admin") return Response.json({ error: "Forbidden" }, { status: 403 });
    const body = await req.json().catch(() => ({})); const action = body.action;
    if (!['preview', 'confirm'].includes(action)) return Response.json({ error: "Choose preview or confirm." }, { status: 400 });
    const signature = String(body.claim_signature || "").trim(); const startMs = Date.parse(body.cycle_start); const endMs = Date.parse(body.cycle_end);
    if (!/^[1-9A-HJ-NP-Za-km-z]{80,90}$/.test(signature)) return Response.json({ error: "Enter a valid Solana claim signature." }, { status: 400 });
    if (!Number.isFinite(startMs) || !Number.isFinite(endMs) || startMs >= endMs || endMs - startMs > 7 * 86400000) return Response.json({ error: "Choose a valid cycle of no more than 7 days." }, { status: 400 });
    const settingsRows = await base44.asServiceRole.entities.ReferralSettings.list("-updated_date", 1); const settings = settingsRows[0];
    if (!settings) return Response.json({ error: "Referral settings are missing." }, { status: 409 });
    const duplicate = await base44.asServiceRole.entities.CreatorFeeCycle.filter({ claim_signature: signature }, "-created_date", 1);
    if (duplicate[0]) return Response.json({ cycle: duplicate[0], duplicate: true });
    const receiver = String(settings.payout_wallet_address || "").trim(); const mints = [...new Set(settings.creator_fee_cycle_token_mints || [])];
    if (!validKey(receiver)) return Response.json({ error: "Save the protocol payout wallet before processing creator fees." }, { status: 409 });
    if (!mints.length || mints.some((mint) => !validKey(mint))) return Response.json({ error: "Save at least one valid creator-fee token mint." }, { status: 409 });
    const rpcUrl = secrets.get("SOLANA_RPC_URL"); const claim = await rpc(rpcUrl, "getTransaction", [signature, { encoding: "jsonParsed", commitment: "confirmed", maxSupportedTransactionVersion: 0 }]);
    if (!claim || claim.meta?.err || !usesPump(claim)) return Response.json({ error: "The signature is not a confirmed pump.fun creator-fee claim." }, { status: 400 });
    const receiverIndex = keysOf(claim).findIndex((key) => key.pubkey === receiver); const received = receiverIndex < 0 ? 0 : Number(claim.meta.postBalances[receiverIndex] || 0) - Number(claim.meta.preBalances[receiverIndex] || 0);
    if (received <= 0) return Response.json({ error: "The configured payout wallet did not receive SOL in this claim." }, { status: 400 });
    const [origins, profiles] = await Promise.all([
      base44.asServiceRole.entities.OriginReferral.filter({ status: "LOCKED" }, "locked_at", 500),
      base44.asServiceRole.entities.ReferralProfile.filter({ status: "ACTIVE" }, "-created_date", 500)
    ]);
    const profileMap = new Map(profiles.map((profile) => [profile.id, profile])); const originMap = new Map(origins.filter((origin) => profileMap.has(origin.origin_profile_id)).map((origin) => [origin.referred_wallet, origin]));
    const signatureLists = []; const referredWallets = [...originMap.keys()];
    for (let offset = 0; offset < referredWallets.length; offset += 20) signatureLists.push(...await Promise.all(referredWallets.slice(offset, offset + 20).map((wallet) => signaturesInWindow(rpcUrl, wallet, Math.floor(startMs / 1000), Math.floor(endMs / 1000)))));
    const signatures = [...new Set(signatureLists.flat())]; const txs = await transactions(rpcUrl, signatures); const volumes = new Map();
    for (const tx of txs) {
      if (!usesPump(tx) || !mints.some((mint) => keysOf(tx).some((key) => key.pubkey === mint))) continue;
      for (const [wallet, origin] of originMap) { const volume = tradeVolume(tx, wallet); if (volume > 0) volumes.set(origin.origin_profile_id, (volumes.get(origin.origin_profile_id) || 0) + volume); }
    }
    const mode = earnNetworkMode(settings); const participating = [...volumes.keys()].map((id) => profileMap.get(id)).filter(Boolean); const qualified = new Set();
    if (mode === "LIVE") for (const profile of participating) { const tier = await refreshEarningTier(base44, profile, settings, rpcUrl); if (tier.percentage > 0) qualified.add(profile.id); }
    else participating.forEach((profile) => qualified.add(profile.id));
    const eligible = [...volumes.entries()].filter(([id]) => qualified.has(id)); const totalVolume = eligible.reduce((sum, [, volume]) => sum + volume, 0);
    const carryIn = Number(settings.creator_fee_carry_lamports || 0); const pot = received + carryIn; const capPercentage = Number(settings.creator_fee_referrer_cap_percentage ?? 30); const cap = Math.floor(pot * capPercentage / 100);
    const allocations = eligible.map(([id, volume]) => { const profile = profileMap.get(id); const origin = origins.find((item) => item.origin_profile_id === id); const raw = totalVolume ? Math.floor(pot * volume / totalVolume) : 0; return { referral_profile_id: id, display_handle: profile.display_handle, representative_wallet: origin.referred_wallet, referred_volume_lamports: volume, raw_share_lamports: raw, cap_lamports: cap, final_lamports: mode === "LIVE" ? Math.min(raw, cap) : 0 }; });
    const distributed = allocations.reduce((sum, item) => sum + item.final_lamports, 0); const carryOut = pot - distributed;
    const cycle = { claim_signature: signature, receiver_wallet: receiver, cycle_start: new Date(startMs).toISOString(), cycle_end: new Date(endMs).toISOString(), token_mints: mints, received_lamports: received, carry_in_lamports: carryIn, pot_lamports: pot, distributed_lamports: distributed, carry_out_lamports: carryOut, total_referred_volume_lamports: totalVolume, cap_percentage: capPercentage, cap_lamports: cap, mode: mode === "LIVE" ? "LIVE" : "PRELAUNCH", status: "CONFIRMED", allocations };
    if (action === "preview") return Response.json({ cycle: { ...cycle, status: "PREVIEW" }, scanned_transactions: txs.length });
    for (const allocation of allocations) await recordOriginRevenue(base44, settings, { source: "CREATOR_FEE", signature, referredWallet: allocation.representative_wallet, grossActivityLamports: allocation.referred_volume_lamports, actualReceivedLamports: allocation.final_lamports, occurredAt: new Date(endMs).toISOString(), sharePercentageOverride: 100 }, rpcUrl);
    const saved = await base44.asServiceRole.entities.CreatorFeeCycle.create(cycle); await base44.asServiceRole.entities.ReferralSettings.update(settings.id, { creator_fee_carry_lamports: carryOut });
    return Response.json({ cycle: saved, duplicate: false });
  } catch (error) { return Response.json({ error: error.message || "Unable to process creator-fee cycle." }, { status: 500 }); }
}