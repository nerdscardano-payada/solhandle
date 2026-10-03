import { localRpc, localGenesis, decodeAccount } from '@/components/solhandle/bulk-local/localRpc';
import { PROGRAM, CORE, pda, checkedData, keyAt, viewOf } from '@/components/solhandle/bulk-local/localCodec';
export async function confirmLocalBatch(batch, order) {
  await localGenesis(order.genesis);
  const state = (await localRpc('getSignatureStatuses', [[batch.signature], { searchTransactionHistory: true }])).value[0];
  if (state?.err) return { ...batch, status: 'failed', error: `Transaction failed: ${JSON.stringify(state.err)}` };
  if (!state || !['confirmed', 'finalized'].includes(state.confirmationStatus)) {
    const height = await localRpc('getBlockHeight', [{ commitment: 'confirmed' }]);
    if (!state && height > batch.lastValidBlockHeight) return { ...batch, status: 'expired', error: 'This transaction expired without confirmation. It can now be retried.' };
    return batch;
  }
  const tx = await localRpc('getTransaction', [batch.signature, { encoding: 'json', commitment: 'confirmed', maxSupportedTransactionVersion: 0 }]);
  if (!tx) return batch;
  if (tx.meta?.err) return { ...batch, status: 'failed', error: JSON.stringify(tx.meta.err) };
  const { value } = await localRpc('getMultipleAccounts', [batch.items.flatMap(item => [pda('handle', item.handle).toBase58(), pda('asset', item.handle).toBase58()]), { encoding: 'base64', commitment: 'confirmed', minContextSlot: tx.slot }]);
  for (let index = 0; index < batch.items.length; index++) {
    const item = batch.items[index], record = await checkedData(value[index * 2], 'HandleRecord'), asset = decodeAccount(value[index * 2 + 1]);
    const length = viewOf(record).getUint32(8, true);
    if (length !== item.handle.length || new TextDecoder().decode(record.slice(12, 12 + length)) !== item.handle || keyAt(record, 12 + length) !== pda('asset', item.handle).toBase58() || keyAt(record, 44 + length) !== order.wallet) throw new Error('Local handle receipt verification failed. Do not retry this transaction.');
    if (value[index * 2 + 1]?.owner !== CORE.toBase58() || !asset || asset.length < 66 || asset[0] !== 1 || keyAt(asset, 1) !== order.wallet || asset[33] !== 2 || keyAt(asset, 34) !== batch.collection) throw new Error('Local NFT ownership or official collection verification failed.');
    const addresses = tx.transaction.message.accountKeys.map(key => typeof key === 'string' ? key : key.pubkey);
    if (!addresses.includes(PROGRAM.toBase58()) || !addresses.includes(pda('handle', item.handle).toBase58()) || addresses[0] !== order.wallet) throw new Error('Local transaction does not match this order.');
  }
  return { ...batch, status: 'confirmed', actualDebit: tx.meta.preBalances[0] - tx.meta.postBalances[0], actualFee: tx.meta.fee, slot: tx.slot, raw: undefined, error: '' };
}