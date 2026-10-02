import { PROGRAM_ID, fault } from './partnerMintCodec.ts';
import partnerMintEvent from './partnerMintEvents.ts';
export default async function indexPartnerMint(base44, intent, receipt, instructionIndex, blockTime) {
  if (receipt.cluster !== 'devnet' || !receipt.countsAsFinalizedRevenue || !receipt.splitVerified || !receipt.costsExcludedVerified || receipt.primaryEarnCommissionEligible !== false) fault('UNVERIFIED_RECEIPT', 503);
  if (!Number.isSafeInteger(instructionIndex) || instructionIndex < 0 || !Number.isSafeInteger(blockTime) || blockTime <= 0) fault('RECEIPT_CONTEXT_UNAVAILABLE', 503);
  const price = BigInt(receipt.mintPriceLamports), partner = BigInt(receipt.partnerShareLamports), protocol = BigInt(receipt.protocolShareLamports);
  if (partner !== price / 2n || protocol !== price - partner) fault('SETTLEMENT_MISMATCH', 503);
  for (const amount of [price, partner, protocol]) if (amount < 0n || amount > BigInt(Number.MAX_SAFE_INTEGER)) fault('REPORT_AMOUNT_RANGE', 503, 'Receipt exceeds exact reporting range. No rounded financial values were saved.');
  const record = {
    receipt_key: `devnet:${receipt.signature}:${instructionIndex}`, cluster: 'devnet', program: PROGRAM_ID,
    signature: receipt.signature, instruction_index: instructionIndex, intent_id: intent.id,
    partner_id: receipt.partnerId, partner_pda: intent.quote.partnerPda, handle: receipt.handle,
    asset_address: receipt.assetAddress, receipt_address: receipt.receiptAddress, original_owner: receipt.originalOwner,
    collection: receipt.collection, revenue_wallet: receipt.revenueWallet, treasury: receipt.treasury,
    mint_price_lamports: Number(price), partner_share_lamports: Number(partner), protocol_share_lamports: Number(protocol),
    mint_price_raw: price.toString(), partner_share_raw: partner.toString(), protocol_share_raw: protocol.toString(),
    network_fee_raw: receipt.networkFeeLamports, account_costs_raw: receipt.accountCostsLamports,
    slot: receipt.slot, minted_at: new Date(blockTime * 1000).toISOString(), verified_at: new Date().toISOString(),
    status: 'FINALIZED', primary_earn_commission_eligible: false
  };
  await base44.entities.PartnerMintReceipt.upsert([record], { key: 'receipt_key' });
  await partnerMintEvent(base44, receipt.partnerId, 'FINALIZED', record.receipt_key, intent.id);
}