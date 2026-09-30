import { ComputeBudgetProgram, Transaction } from 'npm:@solana/web3.js@1.98.4';
import { sameInstruction } from './handleTokenTransactions.ts';

export default function validateTokenConfiguration(tx, instructions, authority) {
  if (!tx.feePayer?.equals(authority)) throw new Error('Configuration must be signed and paid by the protocol authority wallet.');
  if (tx.signatures.length !== 1 || !tx.signatures[0].signature || !tx.verifySignatures()) throw new Error('The protocol authority signature is missing or invalid. Reconnect that wallet and approve again.');
  const budget = [], reviewed = [], seen = new Set();
  for (const instruction of tx.instructions) {
    if (!instruction.programId.equals(ComputeBudgetProgram.programId)) { reviewed.push(instruction); continue; }
    const data = instruction.data, kind = data[0];
    if (instruction.keys.length || seen.has(kind)) throw new Error('The wallet added an unsupported or duplicate network-fee instruction.');
    const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
    if (kind === 2 && data.length === 5) {
      const units = view.getUint32(1, true);
      if (!units || units > 600000) throw new Error('The wallet requested more compute units than the reviewed configuration allows.');
    } else if (kind === 3 && data.length === 9) {
      // At the enforced maximum of 600,000 units, this permits at most 0.005 SOL in priority fees.
      const price = view.getBigUint64(1, true);
      if (price > 8_333_333n) {
        const maximumFeeSol = Number(price * 600000n) / 1e15;
        throw new Error(`Wallet priority fees can reach ${maximumFeeSol.toFixed(6)} SOL, above the configuration limit of 0.005 SOL. Choose a lower priority fee in your wallet.`);
      }
    } else throw new Error('The wallet added an unsupported network-fee instruction.');
    seen.add(kind); budget.push(instruction);
  }
  if (!seen.has(2)) throw new Error('The reviewed compute-unit limit is missing. Prepare configuration again.');
  if (reviewed.length !== instructions.length) throw new Error('The wallet changed the configuration instructions. Additional transfers or other actions are not allowed.');
  for (let i = 0; i < instructions.length; i++) {
    if (!sameInstruction(reviewed[i], instructions[i])) throw new Error(`Configuration instruction ${i + 1} differs from the protocol settings. Prepare configuration again; do not change its accounts or data.`);
  }
  // Compare global privileges after compilation: shared accounts inherit the union of instruction permissions.
  const expected = new Transaction({ feePayer: authority, recentBlockhash: tx.recentBlockhash }).add(...budget, ...instructions).compileMessage();
  const actual = tx.compileMessage();
  if (actual.accountKeys.length !== expected.accountKeys.length) throw new Error('Unexpected configuration accounts are not allowed.');
  expected.accountKeys.forEach((address, index) => {
    const found = actual.accountKeys.findIndex(key => key.equals(address));
    if (found < 0 || actual.isAccountSigner(found) !== expected.isAccountSigner(index) || actual.isAccountWritable(found) !== expected.isAccountWritable(index)) throw new Error('The wallet changed configuration account permissions. Prepare configuration again.');
  });
}