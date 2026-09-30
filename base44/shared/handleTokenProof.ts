import { rpc, parseHandleRecord } from './solanaRpc.ts';
import { HANDLE_MINT } from './handlePaymentStatus.ts';
import { pda, mint, fromBase64, equal, program } from './handleTokenTransactions.ts';
import { PublicKey } from 'npm:@solana/web3.js@1.98.4';
export async function confirmTokenMint(base44, rpcUrl, signature, expected) {
  const tx = await rpc(rpcUrl, 'getTransaction', [signature, { encoding: 'json', commitment: 'confirmed', maxSupportedTransactionVersion: 0 }]);
  if (!tx) return null;
  if (tx.meta?.err) throw new Error(`Transaction failed: ${JSON.stringify(tx.meta.err)}`);
  const disc = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode('event:TokenHandleMinted'))).slice(0, 8);
  let event;
  for (const log of tx.meta.logMessages || []) {
    if (!log.startsWith('Program data: ')) continue;
    const bytes = fromBase64(log.slice(14));
    if (!equal(bytes.slice(0, 8), disc) || bytes.length < 12) continue;
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const length = view.getUint32(8, true), offset = 12 + length;
    if (length < 1 || length > 20 || bytes.length !== offset + 88) continue;
    event = { handle: new TextDecoder().decode(bytes.slice(12, offset)), asset: new PublicKey(bytes.slice(offset, offset + 32)).toBase58(), wallet: new PublicKey(bytes.slice(offset + 32, offset + 64)).toBase58(), amount: view.getBigUint64(offset + 64, true), burned: view.getBigUint64(offset + 72, true), treasury: view.getBigUint64(offset + 80, true) };
  }
  if (!event || event.amount < 2n || event.burned !== event.amount / 2n || event.treasury !== event.amount - event.burned || event.handle !== expected.handle || event.wallet !== expected.wallet || event.amount.toString() !== expected.totalRaw || event.asset !== pda('asset', event.handle).toBase58()) throw new Error('Confirmed token payment proof does not match the signed mint.');
  const keys = tx.transaction.message.accountKeys.map(item => typeof item === 'string' ? item : item.pubkey);
  const delta = account => {
    const index = keys.indexOf(account);
    const before = tx.meta.preTokenBalances?.find(row => row.accountIndex === index && row.mint === HANDLE_MINT);
    const after = tx.meta.postTokenBalances?.find(row => row.accountIndex === index && row.mint === HANDLE_MINT);
    if (!before || !after) throw new Error('Confirmed token account balances are missing.');
    return { change: BigInt(after.uiTokenAmount.amount) - BigInt(before.uiTokenAmount.amount), decimals: after.uiTokenAmount.decimals };
  };
  const debit = delta(expected.payerToken), receipt = delta(expected.treasuryToken);
  if (debit.change !== -event.amount || receipt.change !== event.treasury) throw new Error('Actual token payment balances do not match the 50/50 split.');
  const accounts = await rpc(rpcUrl, 'getMultipleAccounts', [[pda('handle', event.handle).toBase58(), event.asset], { encoding: 'base64', commitment: 'confirmed' }]);
  const [record, asset] = accounts.value || [];
  if (record?.owner !== program.toBase58() || !record.data?.[0] || parseHandleRecord(record.data[0]).assetAddress !== event.asset || asset?.owner !== 'CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d' || new PublicKey(fromBase64(asset.data[0]).slice(1, 33)).toBase58() !== event.wallet) throw new Error('Minted NFT ownership could not be verified.');
  const confirmedAt = new Date((tx.blockTime || Math.floor(Date.now() / 1000)) * 1000).toISOString();
  const payment = { signature, handle: event.handle, asset_address: event.asset, wallet: event.wallet, token_mint: mint.toBase58(), decimals: debit.decimals, amount_raw: event.amount.toString(), burned_raw: event.burned.toString(), treasury_raw: event.treasury.toString(), sol_reference_lamports: expected.solReferenceLamports, confirmed_at: confirmedAt };
  await base44.asServiceRole.entities.TokenMintPayment.upsert([payment], { key: 'signature' });
  await base44.asServiceRole.entities.BurnActivity.upsert([{ signature, type: 'BURN', wallet: event.wallet, token_mint: HANDLE_MINT, token_amount: Number(event.burned) / 10 ** debit.decimals, sol_reported: 0, block_time: confirmedAt }], { key: 'signature' });
  return payment;
}