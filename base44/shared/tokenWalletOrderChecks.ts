import { Message } from 'npm:@solana/web3.js@1.98.4';
import { Buffer } from 'node:buffer';
import { createPrivateKey, sign } from 'node:crypto';
import { usdtTransaction, validateUsdtSigned, to64 } from './usdtPayTransaction.ts';

export default function tokenWalletOrderChecks(context, blockhash, sender) {
  const original = usdtTransaction(context, blockhash, true).compileMessage();
  // Reverse only unsigned read-only accounts, preserving each account's privileges.
  const firstReadonly = original.accountKeys.length - original.header.numReadonlyUnsignedAccounts;
  const permutation = original.accountKeys.map((_, i) => i < firstReadonly ? i : original.accountKeys.length - 1 - (i - firstReadonly));
  const indexOf = oldIndex => permutation.indexOf(oldIndex);
  const message = new Message({
    header: original.header,
    recentBlockhash: original.recentBlockhash,
    accountKeys: permutation.map(i => original.accountKeys[i]),
    instructions: original.instructions.map(ix => ({ ...ix, programIdIndex: indexOf(ix.programIdIndex), accounts: ix.accounts.map(indexOf) })),
  });
  const bytes = Buffer.from(message.serialize());
  const key = createPrivateKey({ key: Buffer.concat([Buffer.from('302e020100300506032b657004220420', 'hex'), Buffer.from(sender.secretKey.slice(0, 32))]), format: 'der', type: 'pkcs8' });
  const signature = sign(null, bytes, key);
  if (bytes.equals(Buffer.from(original.serialize()))) throw new Error('Fixture did not change wallet account ordering.');
  // Sign the wallet's exact wire message without web3.js re-sorting its keys.
  validateUsdtSigned(to64(Buffer.concat([Buffer.from([1]), signature, bytes])), context);
}