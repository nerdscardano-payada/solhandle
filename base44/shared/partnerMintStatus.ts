import partnerMintSigned from './partnerMintSigned.ts';
import indexPartnerMint from './partnerMintIndex.ts';
import bs58 from 'npm:bs58@5.0.0';
import { rpc } from './solanaRpc.ts';
import { PROGRAM_ID, CORE, pda, unb64, b64, sha, equal, fault, accountBytes, keyAt, uint, quoteDigest } from './partnerMintCodec.ts';
export default async function partnerMintStatus(base44, intent, url) {
  const q = intent.quote, signature = intent.transaction_signature;
  if (!signature) {
    const clock = await rpc(url, 'getBlockTime', [await rpc(url, 'getSlot', [{ commitment: 'confirmed' }])]);
    if (clock === null) fault('RPC_UNAVAILABLE', 503);
    const expired = clock > q.expiresAtUnix;
    return { intentId: intent.id, status: expired ? 'EXPIRED' : intent.status, signature: null, receipt: null };
  }
  const statuses = await rpc(url, 'getSignatureStatuses', [[signature], { searchTransactionHistory: true }]);
  const status = statuses?.value?.[0];
  if (status?.err) {
    await base44.entities.PartnerMintIntent.update(intent.id, { status: 'FAILED' });
    return { intentId: intent.id, status: 'FAILED', signature, receipt: null, networkFeesMayApply: true };
  }
  if (!status || !['confirmed', 'finalized'].includes(status.confirmationStatus)) {
    if (!status && Number.isSafeInteger(intent.last_valid_block_height) && await rpc(url, 'getBlockHeight', [{ commitment: 'finalized' }]) > intent.last_valid_block_height) {
      const asset = pda('asset', q.handle), receiptAddress = pda('partner_receipt', asset.toBytes());
      const historical = await rpc(url, 'getTransaction', [signature, { encoding: 'base64', commitment: 'finalized', maxSupportedTransactionVersion: 0 }]);
      const record = await rpc(url, 'getAccountInfo', [receiptAddress.toBase58(), { encoding: 'base64', commitment: 'finalized' }]);
      if (!historical && !record.value) {
        await base44.entities.PartnerMintIntent.update(intent.id, { status: 'EXPIRED', receipt_indexed: false });
        return { intentId: intent.id, status: 'EXPIRED', signature, receipt: null, expiredWithoutReceiptVerified: true, networkFeesMayApply: true };
      }
    }
    return { intentId: intent.id, status: 'PENDING', signature, receipt: null, retrySameTransactionOnly: true };
  }
  const commitment = status.confirmationStatus, tx = await rpc(url, 'getTransaction', [signature, { encoding: 'base64', commitment, maxSupportedTransactionVersion: 0 }]);
  if (!tx?.meta || tx.meta.err || !tx.transaction?.[0]) fault('CONFIRMATION_UNAVAILABLE', 503);
  const verifiedTx = await partnerMintSigned(tx.transaction[0], intent);
  if (bs58.encode(verifiedTx.signatures[0]) !== signature) fault('TRANSACTION_MISMATCH', 503);
  const asset = pda('asset', q.handle), receiptAddress = pda('partner_receipt', asset.toBytes());
  const accounts = await rpc(url, 'getMultipleAccounts', [[receiptAddress.toBase58(), asset.toBase58()], { encoding: 'base64', commitment, minContextSlot: tx.slot }]);
  const keys = verifiedTx.message.staticAccountKeys ?? verifiedTx.message.accountKeys;
  const delta = address => {
    const index = keys.findIndex(key => key.toBase58() === address);
    const before = tx.meta.preBalances?.[index], after = tx.meta.postBalances?.[index];
    if (index < 0 || !Number.isSafeInteger(before) || !Number.isSafeInteger(after)) fault('SETTLEMENT_UNAVAILABLE', 503);
    return BigInt(after) - BigInt(before);
  };
  if (delta(q.revenueWallet) !== BigInt(q.partnerShareLamports) || delta(q.treasury) !== BigInt(q.protocolShareLamports)) fault('SETTLEMENT_MISMATCH', 503);
  const recordAddress = pda('handle', q.handle);
  const recordResult = await rpc(url, 'getAccountInfo', [recordAddress.toBase58(), { encoding: 'base64', commitment, minContextSlot: tx.slot }]);
  const handleRecord = await accountBytes(recordResult.value, 'HandleRecord', 86);
  const nameLength = new DataView(handleRecord.buffer, handleRecord.byteOffset, handleRecord.byteLength).getUint32(8, true);
  if (nameLength !== q.handle.length || handleRecord.length < 86 + nameLength || new TextDecoder().decode(handleRecord.slice(12, 12 + nameLength)) !== q.handle || keyAt(handleRecord, 12 + nameLength) !== asset.toBase58() || keyAt(handleRecord, 44 + nameLength) !== q.wallet) fault('HANDLE_RECORD_MISMATCH', 503);
  const accountCosts = delta(recordAddress.toBase58()) + delta(asset.toBase58()) + delta(receiptAddress.toBase58());
  if (!Number.isSafeInteger(tx.meta.fee) || -delta(q.wallet) !== BigInt(q.mintPriceLamports) + accountCosts + BigInt(tx.meta.fee)) fault('COSTS_MISMATCH', 503);
  const r = await accountBytes(accounts.value[0], 'PartnerMintReceipt', 249);
  if (r.length !== 249) fault('RECEIPT_MISMATCH', 503);
  for (const [offset, expected] of [[8, q.partnerPda], [40, asset.toBase58()], [72, q.wallet], [104, q.revenueWallet], [136, q.treasury]]) if (keyAt(r, offset) !== expected) fault('RECEIPT_MISMATCH', 503);
  for (const [offset, expected] of [[168, q.mintPriceLamports], [176, q.partnerShareLamports], [184, q.protocolShareLamports], [192, q.partnerRevision], [200, q.settingsRevision]]) if (uint(r, offset).toString() !== expected) fault('RECEIPT_MISMATCH', 503);
  if (!equal(r.slice(216, 248), await quoteDigest(q))) fault('RECEIPT_MISMATCH', 503);
  const a = accounts.value[1], assetBytes = a?.data?.[0] ? unb64(a.data[0]) : null;
  if (a?.owner !== CORE.toBase58() || !assetBytes || assetBytes.length < 66 || assetBytes[0] !== 1 || assetBytes[33] !== 2 || keyAt(assetBytes, 34) !== q.collection) fault('OFFICIAL_ASSET_MISMATCH', 503);
  const receipt = { cluster: 'devnet', receiptAddress: receiptAddress.toBase58(), partnerId: q.partnerId, handle: q.handle, assetAddress: asset.toBase58(), originalOwner: q.wallet, currentOwner: keyAt(assetBytes, 1), collection: q.collection, revenueWallet: q.revenueWallet, treasury: q.treasury, mintPriceLamports: q.mintPriceLamports, partnerShareLamports: q.partnerShareLamports, protocolShareLamports: q.protocolShareLamports, slot: tx.slot, signature, splitVerified: true, costsExcludedVerified: true, networkFeeLamports: String(tx.meta.fee), accountCostsLamports: accountCosts.toString(), primaryEarnCommissionEligible: false, countsAsFinalizedRevenue: commitment === 'finalized' };
  const finalStatus = commitment === 'finalized' ? 'FINALIZED' : 'CONFIRMED';
  if (finalStatus === 'FINALIZED') {
    const instructions = verifiedTx.message.compiledInstructions ?? verifiedTx.message.instructions;
    const instructionIndex = instructions.findIndex(ix => keys[ix.programIdIndex]?.toBase58() === PROGRAM_ID);
    await indexPartnerMint(base44, intent, receipt, instructionIndex, tx.blockTime);
  }
  await base44.entities.PartnerMintIntent.update(intent.id, { status: finalStatus, receipt, receipt_indexed: finalStatus === 'FINALIZED' });
  return { intentId: intent.id, status: finalStatus, signature, receipt };
}