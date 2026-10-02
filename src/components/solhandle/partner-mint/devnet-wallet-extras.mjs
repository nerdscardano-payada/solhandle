import assert from 'node:assert/strict';
import { ComputeBudgetProgram } from '@solana/web3.js';
// Only deployed read-only Lighthouse assertions. Never allow memory writes,
// memory closes, Merkle-tree CPIs, transfers, or arbitrary extra programs.
const LIGHTHOUSE = new Map([
  ['L1TEVtgA75k273wWz1s6XMmDhQY5i3MwcvKb4VbZzfK', 14],
  ['L2TExMFKdjpN9kozasaurPirfHy9P8sbXoAN1qA3S95', 15],
]);
export function validateWalletExtras(instructions, quoteIndex) {
  const budget = new Set(); let units = 1400000n, price = 0n;
  for (const [index, instruction] of instructions) {
    const id = instruction.programId.toBase58(), data = Buffer.from(instruction.data);
    if (id === ComputeBudgetProgram.programId.toBase58()) {
      assert(index < quoteIndex && instruction.keys.length === 0, 'Wallet compute settings must precede the signed quote. Nothing submitted.');
      assert(!budget.has(data[0]), 'Duplicate wallet compute setting. Nothing submitted.'); budget.add(data[0]);
      if (data[0] === 2 && data.length === 5) {
        units = BigInt(data.readUInt32LE(1)); assert(units > 0n && units <= 1400000n, 'Unsafe compute limit. Nothing submitted.');
      } else if (data[0] === 3 && data.length === 9) {
        price = data.readBigUInt64LE(1);
      } else throw new Error('Unsupported wallet compute instruction: ' + data[0] + '. Nothing submitted.');
    } else {
      const limit = LIGHTHOUSE.get(id);
      assert(limit !== undefined && data.length >= 2 && data[0] >= 2 && data[0] <= limit, 'Unsupported wallet addition: ' + id + ', instruction ' + data[0] + '. Nothing submitted.');
    }
  }
  // Additional priority fee may never exceed 0.00001 SOL.
  assert(price * units <= 10000n * 1000000n, 'Wallet priority fee exceeds the devnet pilot cap. Nothing submitted.');
}