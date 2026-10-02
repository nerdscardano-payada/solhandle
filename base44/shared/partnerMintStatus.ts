import { Transaction } from 'npm:@solana/web3.js@1.98.4';
import { rpc } from './solanaRpc.ts';
import { CORE, pda, unb64, b64, sha, equal, fault, accountBytes, keyAt, uint, quoteDigest } from './partnerMintCodec.ts';
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
  if (!status || !['confirmed', 'finalized'].includes(status.confirmationStatus)) return { intentId: intent.id, status: 'PENDING', signature, receipt: null, retrySameTransactionOnly: true };
  const commitment = status.confirmationStatus, tx = await rpc(url, 'getTransaction', [signature, { encoding: 'base64', commitment, maxSupportedTransactionVersion: 0 }]);
  if (!tx?.meta || tx.meta.err || !tx.transaction?.[0]) fault('CONFIRMATION_UNAVAILABLE', 503);
  const verifiedTx = Transaction.from(unb64(tx.transaction[0]));
  if (b64(await sha(verifiedTx.serializeMessage())) !== intent.message_hash || !verifiedTx.verifySignatures()) fault('TRANSACTION_MISMATCH', 503);
  const asset = pda('asset', q.handle), receiptAddress = pda('partner_receipt', asset.toBytes());
  const accounts = await rpc(url, 'getMultipleAccounts', [[receiptAddress.toBase58(), asset.toBase58()], { encoding: 'base64', commitment, minContextSlot: tx.slot }]);
  const r = await accountBytes(accounts.value[0], 'PartnerMintReceipt', 249);
  if (r.length !== 249) fault('RECEIPT_MISMATCH', 503);
  for (const [offset, expected] of [[8, q.partnerPda], [40, asset.toBase58()], [72, q.wallet], [104, q.revenueWallet], [136, q.treasury]]) if (keyAt(r, offset) !== expected) fault('RECEIPT_MISMATCH', 503);
  for (const [offset, expected] of [[168, q.mintPriceLamports], [176, q.partnerShareLamports], [184, q.protocolShareLamports], [192, q.partnerRevision], [200, q.settingsRevision]]) if (uint(r, offset).toString() !== expected) fault('RECEIPT_MISMATCH', 503);
  if (!equal(r.slice(216, 248), await quoteDigest(q))) fault('RECEIPT_MISMATCH', 503);
  const a = accounts.value[1], assetBytes = a?.data?.[0] ? unb64(a.data[0]) : null;
  if (a?.owner !== CORE.toBase58() || !assetBytes || assetBytes.length < 66 || assetBytes[0] !== 1 || assetBytes[33] !== 2 || keyAt(assetBytes, 34) !== q.collection) fault('OFFICIAL_ASSET_MISMATCH', 503);
  const receipt = { cluster: 'devnet', receiptAddress: receiptAddress.toBase58(), partnerId: q.partnerId, handle: q.handle, assetAddress: asset.toBase58(), originalOwner: q.wallet, currentOwner: keyAt(assetBytes, 1), collection: q.collection, revenueWallet: q.revenueWallet, treasury: q.treasury, mintPriceLamports: q.mintPriceLamports, partnerShareLamports: q.partnerShareLamports, protocolShareLamports: q.protocolShareLamports, slot: tx.slot, signature, primaryEarnCommissionEligible: false, countsAsFinalizedRevenue: commitment === 'finalized' };
  const finalStatus = commitment === 'finalized' ? 'FINALIZED' : 'CONFIRMED';
  await base44.entities.PartnerMintIntent.update(intent.id, { status: finalStatus, receipt });
  return { intentId: intent.id, status: finalStatus, signature, receipt };
}