import { secrets } from 'base44:runtime';
import { finalizedTransaction, assertChainWindow } from './growthHubTransaction.ts';
import { verifyGrowthMint } from './growthHubMint.ts';
import { verifyGrowthTokenMint } from './growthHubTokenMint.ts';
export async function verifyGrowthReferral(entities, profile, quest, signature) {
  if (typeof signature !== 'string' || !/^[1-9A-HJ-NP-Za-km-z]{64,90}$/.test(signature)) throw new Error('Plak een volledige Solana-transactiehandtekening.');
  const promoters = await entities.ReferralProfile.filter({ wallet_address: profile.wallet, status: 'ACTIVE' }, { limit: 2 });
  if (promoters.items.length !== 1) throw new Error('Activeer eerst je eigen Share & Earn-profiel; een uniek actief referralprofiel is vereist.');
  const promoter = promoters.items[0];
  const conversions = await entities.ReferralConversion.filter({ referral_profile_id: promoter.id, mint_transaction_signature: signature }, { limit: 2 });
  if (conversions.items.length !== 1) throw new Error('Geen unieke geregistreerde referralconversie voor jouw Share & Earn-profiel gevonden. Een klik of losse mint zonder referralregistratie telt niet.');
  const conversion = conversions.items[0];
  if (!['PRELAUNCH', 'PENDING', 'APPROVED', 'AVAILABLE', 'PAID'].includes(conversion.status) || conversion.buyer_wallet === profile.wallet || !(conversion.eligible_referral_revenue_lamports > 0)) throw new Error('Deze conversie is geblokkeerd, een zelfreferral of geen betaalde kwalificerende mint.');
  const [origin, intent, firstOrigin] = await Promise.all([
    entities.OriginReferral.get(String(conversion.origin_referral_id || '')),
    entities.MintIntent.get(conversion.mint_intent_id),
    entities.OriginReferral.filter({ referred_wallet: conversion.buyer_wallet, status: 'LOCKED' }, { sort: 'locked_at', limit: 1 })
  ]);
  if (!origin || origin.status !== 'LOCKED' || firstOrigin.items[0]?.id !== origin.id || origin.origin_profile_id !== promoter.id || origin.referred_wallet !== conversion.buyer_wallet || origin.mint_signature !== signature || origin.referred_handle !== conversion.minted_handle || !intent || intent.referral_profile_id !== promoter.id || intent.buyer_wallet !== conversion.buyer_wallet || intent.handle !== conversion.minted_handle || intent.transaction_signature !== signature || !['CONFIRMED','PROCESSING','PROCESSED'].includes(intent.status)) throw new Error('De oorspronkelijke referral, koper en mintregistratie komen niet overeen. Alleen de eerste vastgelegde referral-mint van deze wallet telt.');
  const url = secrets.get('SOLANA_RPC_URL');
  if (!url) throw new Error('On-chain verificatie is nog niet geconfigureerd.');
  const tx = await finalizedTransaction(url, signature, 'ON_CHAIN_MINT');
  if (!tx) return { pending: true, message: 'De referral-mint is nog niet finalized. Probeer later dezelfde handtekening opnieuw.' };
  assertChainWindow(tx, profile, quest);
  if (!Number.isFinite(Date.parse(intent.created_date)) || !Number.isFinite(Date.parse(intent.expires_at)) || Date.parse(intent.created_date) > tx.blockTime * 1000 + 1000 || Date.parse(intent.expires_at) < tx.blockTime * 1000) throw new Error('De referralregistratie valt buiten het mintvenster.');
  const mint = await verifyGrowthMint(url, tx, conversion.buyer_wallet, false);
  if (mint.handle !== conversion.minted_handle || mint.asset_address !== origin.referred_asset_address) throw new Error('Het on-chain mintbewijs wijkt af van de referralconversie.');
  const tokenPayment = mint.token ? await verifyGrowthTokenMint(url, tx, signature, conversion.buyer_wallet, mint) : {};
  const { instruction, token, ...proof } = mint;
  return { conversion_id: conversion.id, evidence: { ...proof, ...tokenPayment, signature, network: 'mainnet-beta', slot: tx.slot, occurred_at: new Date(tx.blockTime * 1000).toISOString(), kind: 'REFERRAL' } };
}