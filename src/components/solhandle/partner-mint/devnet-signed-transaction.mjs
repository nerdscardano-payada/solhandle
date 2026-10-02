import assert from 'node:assert/strict';
import { createPublicKey, verify } from 'node:crypto';
import { VersionedTransaction } from '@solana/web3.js';
import { validateWalletMessage } from './devnet-wallet-message.mjs';

// Decode without legacy Transaction.from recompilation or account reordering.
// Supports previously saved legacy transactions as well as the v0 pilot.
export function readSignedTransaction(raw, expectedMessage, expectedPayer, allowWalletAssertions = false) {
  assert(raw.length <= 1232, 'Signed transaction exceeds the packet limit. Nothing submitted.');
  const transaction = VersionedTransaction.deserialize(raw);
  const message = Buffer.from(transaction.message.serialize());
  validateWalletMessage(transaction.message, expectedMessage, allowWalletAssertions);
  const keys = transaction.message.staticAccountKeys ?? transaction.message.accountKeys;
  assert(keys[0].equals(expectedPayer) && transaction.message.header.numRequiredSignatures === 1, 'Unexpected mint payer or signer count. Nothing was submitted.');
  assert(transaction.signatures.length === 1, 'Missing buyer signature. Nothing was submitted.');
  const publicKey = createPublicKey({ key: Buffer.concat([Buffer.from('302a300506032b6570032100', 'hex'), keys[0].toBuffer()]), format: 'der', type: 'spki' });
  assert(verify(null, message, publicKey, Buffer.from(transaction.signatures[0])), 'Invalid buyer signature. Nothing was submitted; reconnect Phantom and prepare again.');
  return transaction;
}