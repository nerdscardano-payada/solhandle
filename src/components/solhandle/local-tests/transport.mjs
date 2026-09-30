import { Connection, Transaction, ComputeBudgetProgram } from '@solana/web3.js';
import assert from 'node:assert/strict';
export const connection = new Connection('http://127.0.0.1:18899', 'confirmed');
export async function send(payer, instructions, signers = []) {
  const block = await connection.getLatestBlockhash();
  const tx = new Transaction({ feePayer: payer.publicKey, ...block }).add(ComputeBudgetProgram.setComputeUnitLimit({ units: 1000000 }), ...instructions);
  tx.sign(payer, ...signers);
  const signature = await connection.sendRawTransaction(tx.serialize(), { skipPreflight: true });
  const result = await connection.confirmTransaction({ signature, ...block }, 'confirmed');
  if (result.value.err) {
    let details;
    for (let n = 0; n < 20 && !details; n++) { details = await connection.getTransaction(signature, { commitment: 'confirmed', maxSupportedTransactionVersion: 0 }); if (!details) await new Promise(r => setTimeout(r, 250)); }
    throw new Error(`${JSON.stringify(result.value.err)}\n${details?.meta?.logMessages?.join('\n') || 'No transaction logs available'}`);
  }
  return signature;
}
export async function rejection(action, expected) {
  await assert.rejects(action, expected);
}
export async function chainTime() {
  const clock = await connection.getAccountInfo(new (await import('@solana/web3.js')).PublicKey('SysvarC1ock11111111111111111111111111111111'));
  assert(clock, 'Local clock missing');
  return Number(clock.data.readBigInt64LE(32));
}