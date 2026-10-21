import { Transaction } from "npm:@solana/web3.js@1.98.4";
import { rpc } from "./solanaRpc.ts";
import { base64, same, parseCancellation, cancellationInstruction } from "./marketplaceRecoveryCodec.ts";
import { recoveryPositions } from "./marketplaceRecoveryRead.ts";
export async function recoveryStatus(url, body) {
  const parsed = await parseCancellation(body, true);
  const response = await rpc(url, "getSignatureStatuses", [[parsed.signature], { searchTransactionHistory: true }]);
  const status = response.value?.[0];
  if (status?.err) return { signature: parsed.signature, state: 'failed', error: `On-chain cancellation failed: ${JSON.stringify(status.err)}`, canRebroadcast: false };
  if (status?.confirmationStatus === 'finalized') {
    const receipt = await rpc(url, 'getTransaction', [parsed.signature, { encoding: 'json', commitment: 'finalized', maxSupportedTransactionVersion: 0 }]);
    if (!receipt || receipt.meta?.err) return { signature: parsed.signature, state: 'pending', canRebroadcast: false };
    const keys = receipt.transaction.message.accountKeys.map(k => typeof k === 'string' ? k : k.pubkey);
    const index = keys.indexOf(parsed.wallet);
    if (index < 0) throw new Error('Finalized receipt does not include the cancellation wallet.');
    const returned = BigInt(receipt.meta.postBalances[index]) - BigInt(receipt.meta.preBalances[index]) + BigInt(receipt.meta.fee);
    return { signature: parsed.signature, state: 'finalized', slot: receipt.slot, returnedLamports: returned.toString(), networkFeeLamports: String(receipt.meta.fee), canRebroadcast: false };
  }
  if (status) return { signature: parsed.signature, state: 'pending', confirmationStatus: status.confirmationStatus || 'processed', canRebroadcast: false };
  const valid = await rpc(url, 'isBlockhashValid', [parsed.tx.recentBlockhash, { commitment: 'finalized' }]);
  return { signature: parsed.signature, state: valid.value ? 'pending' : 'expired', canRebroadcast: Boolean(valid.value) };
}
async function validatedPosition(url, body, parsed) {
  const positionAddress = parsed ? parsed.ix.keys[3]?.pubkey.toBase58() : body.position;
  if (!positionAddress) throw new Error('Select a live position on Marketplace Recovery.');
  const report = await recoveryPositions(url, { wallet: body.wallet, position: positionAddress });
  const position = report.items[0];
  if (!position || position.action !== body.action) throw new Error('This cancellation position is no longer open for the connected wallet. Refresh recovery.');
  if (position.validationError) throw new Error(position.validationError);
  const instruction = await cancellationInstruction({ ...position, collection: report.collection });
  if (parsed && (parsed.ix.keys.length !== instruction.keys.length || !same(parsed.ix.data, instruction.data) || parsed.ix.keys.some((k, i) => !k.pubkey.equals(instruction.keys[i].pubkey) || k.isSigner !== instruction.keys[i].isSigner || k.isWritable !== instruction.keys[i].isWritable))) throw new Error('Cancellation accounts differ from the verified position.');
  return { report, position, instruction };
}
async function simulate(url, transaction) {
  const result = await rpc(url, 'simulateTransaction', [transaction, { encoding: 'base64', sigVerify: false, replaceRecentBlockhash: true, commitment: 'confirmed' }]);
  if (result.value?.err) throw new Error(`Cancellation simulation failed. Nothing was relayed. ${JSON.stringify(result.value.err)}. Keep this position and contact support if the error persists.`);
}
export async function prepareRecovery(url, body) {
  const parsed = body.transaction_base64 ? await parseCancellation(body) : null;
  const { report, position, instruction } = await validatedPosition(url, body, parsed);
  if (parsed) { await simulate(url, body.transaction_base64); return { simulation: 'ok' }; }
  const latest = await rpc(url, 'getLatestBlockhash', [{ commitment: 'confirmed' }]);
  const tx = new Transaction({ feePayer: instruction.keys[0].pubkey, recentBlockhash: latest.value.blockhash }).add(instruction);
  const transaction_base64 = base64(tx.serialize({ requireAllSignatures: false, verifySignatures: false }));
  await simulate(url, transaction_base64);
  return { action: position.action, position: position.position, transaction_base64, blockhash: latest.value.blockhash, lastValidBlockHeight: latest.value.lastValidBlockHeight, network: 'mainnet-beta', collection: report.collection, checkedSlot: report.slot };
}
export async function submitRecovery(url, body) {
  const parsed = await parseCancellation(body, true);
  const status = await recoveryStatus(url, body);
  if (status.state !== 'pending' || !status.canRebroadcast) return status;
  await validatedPosition(url, body, parsed);
  // Only the exact wallet-signed, validated single cancellation instruction is relayed.
  try {
    const signature = await rpc(url, 'sendTransaction', [body.transaction_base64, { encoding: 'base64', preflightCommitment: 'confirmed', maxRetries: 2 }]);
    if (signature !== parsed.signature) throw new Error('RPC signature mismatch. Check the saved signature before retrying.');
    return { signature: parsed.signature, state: 'pending', canRebroadcast: false };
  } catch {
    // RPC timeout/rejection is not proof that broadcast failed. The caller already saved these bytes.
    return { signature: parsed.signature, state: 'pending', canRebroadcast: false, error: 'Broadcast outcome is uncertain. Check this saved signature before retrying; do not sign a replacement.' };
  }
}