import { Transaction } from '@solana/web3.js';
import { base44 } from '@/api/base44Client';
import { readAttempts, saveAttempt, signature58 } from '@/components/solhandle/retirement/recoveryStorage';
const call = async (name, body) => (await base44.functions.invoke(name, body)).data;
export const listRecovery = body => call('marketplaceRecovery', { ...body, action: 'list' });
export const checkRecovery = attempt => call('marketplaceRecovery', { action: 'status', wallet: attempt.wallet, actionType: attempt.action, transaction_base64: attempt.transaction_base64 });
export async function relayRecovery(attempt) {
  const result = await call('submitMarketplaceTx', attempt);
  saveAttempt(attempt.wallet, { ...attempt, ...result });
  return result;
}
export async function startRecovery(position, publicKey, signTransaction, isCurrentWallet) {
  if (!publicKey || !signTransaction || publicKey.toBase58() !== position.wallet) throw new Error('Connect the wallet authorized to cancel this position.');
  const wallet = publicKey.toBase58();
  if (readAttempts(wallet).some(a => a.position === position.position && a.state === 'pending')) throw new Error('Check the saved cancellation before signing another transaction.');
  const prepared = await call('prepareMarketplaceTx', { action: position.action, wallet, position: position.position });
  if (!isCurrentWallet()) throw new Error('Wallet changed. Review this position again.');
  const unsigned = Transaction.from(Uint8Array.from(atob(prepared.transaction_base64), c => c.charCodeAt(0)));
  const signed = await signTransaction(unsigned);
  if (!isCurrentWallet() || signed.feePayer?.toBase58() !== wallet) throw new Error('Wallet changed while signing. No transaction was relayed.');
  if (!unsigned.serializeMessage().equals(signed.serializeMessage()) || !signed.signature) throw new Error('The wallet changed the reviewed transaction. Nothing was relayed.');
  const attempt = { action: position.action, position: position.position, asset: position.asset, handle: position.handle, wallet, signature: signature58(signed.signature), transaction_base64: btoa(String.fromCharCode(...signed.serialize())), blockhash: prepared.blockhash, lastValidBlockHeight: prepared.lastValidBlockHeight, state: 'pending', savedAt: new Date().toISOString() };
  saveAttempt(wallet, attempt); // Must succeed before any relay. Reloads use these exact signed bytes.
  return { attempt, result: await relayRecovery(attempt) };
}