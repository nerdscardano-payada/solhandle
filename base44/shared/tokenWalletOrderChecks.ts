import { Message, Transaction } from 'npm:@solana/web3.js@1.98.4';
import { Buffer } from 'node:buffer';
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
  const tx = Transaction.populate(message);
  tx.sign(sender);
  if (Buffer.from(tx.serializeMessage()).equals(Buffer.from(original.serialize()))) throw new Error('Fixture did not change wallet account ordering.');
  validateUsdtSigned(to64(tx.serialize()), context);
}