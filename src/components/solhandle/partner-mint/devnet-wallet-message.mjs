import assert from 'node:assert/strict';
import { VersionedMessage, TransactionMessage } from '@solana/web3.js';
import { validateWalletExtras } from './devnet-wallet-extras.mjs';
const messageKeys = message => message.staticAccountKeys ?? message.accountKeys;
const sameInstruction = (a, b) => a.programId.equals(b.programId) && Buffer.from(a.data).equals(Buffer.from(b.data)) && a.keys.length === b.keys.length && a.keys.every((key, i) => key.pubkey.equals(b.keys[i].pubkey) && key.isSigner === b.keys[i].isSigner && key.isWritable === b.keys[i].isWritable);
export function validateWalletMessage(actual, expectedBase64, allowWalletAssertions) {
  const actualBytes = Buffer.from(actual.serialize());
  if (actualBytes.toString('base64') === expectedBase64) return;
  assert(allowWalletAssertions, 'Saved signed message differs. Do not remove the saved mint.');
  const expected = VersionedMessage.deserialize(Buffer.from(expectedBase64, 'base64'));
  assert(!actual.addressTableLookups?.length && !expected.addressTableLookups?.length, 'Wallet added a lookup table. Nothing submitted.');
  assert(actual.recentBlockhash === expected.recentBlockhash, 'Wallet changed the blockhash. Nothing submitted; prepare again.');
  const a = TransactionMessage.decompile(actual), e = TransactionMessage.decompile(expected);
  assert(a.payerKey.equals(e.payerKey), 'Wallet changed the payer. Nothing submitted.');
  assert(e.instructions.length === 2, 'Unexpected prepared pilot instructions. Nothing submitted.');
  const keys = messageKeys(actual), expectedKeys = messageKeys(expected);
  assert(new Set(keys.map(key => key.toBase58())).size === keys.length, 'Duplicate message accounts. Nothing submitted.');
  for (const [index, key] of expectedKeys.entries()) {
    const actualIndex = keys.findIndex(item => item.equals(key));
    assert(actualIndex >= 0 && actual.isAccountSigner(actualIndex) === expected.isAccountSigner(index) && actual.isAccountWritable(actualIndex) === expected.isAccountWritable(index), 'Wallet changed an original account permission. Nothing submitted.');
  }
  for (const [index, key] of keys.entries()) if (!expectedKeys.some(item => item.equals(key))) {
    assert(!actual.isAccountSigner(index) && !actual.isAccountWritable(index), 'Wallet granted access to a new writable account. Nothing submitted.');
  }
  const quoteIndex = a.instructions.findIndex(instruction => sameInstruction(instruction, e.instructions[0]));
  assert(quoteIndex >= 0 && sameInstruction(a.instructions[quoteIndex + 1] ?? { programId: e.payerKey, data: [], keys: [] }, e.instructions[1]), 'Wallet changed the quote/mint or separated them. Nothing submitted.');
  const extras = a.instructions.flatMap((instruction, i) => i === quoteIndex || i === quoteIndex + 1 ? [] : [[i, instruction]]);
  validateWalletExtras(extras, quoteIndex);
  const used = new Set([a.payerKey.toBase58()]);
  for (const instruction of a.instructions) { used.add(instruction.programId.toBase58()); for (const key of instruction.keys) used.add(key.pubkey.toBase58()); }
  assert(keys.every(key => used.has(key.toBase58())), 'Wallet added unused accounts. Nothing submitted.');
}