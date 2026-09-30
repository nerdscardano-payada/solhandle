import { TransactionInstruction } from 'npm:@solana/web3.js@1.98.4';
// Published Lighthouse versions used by Phantom. Only read-only assertion variants are allowed.
// MemoryWrite/MemoryClose (0/1) and Merkle-tree CPI variants are deliberately excluded.
const assertionLimits = new Map([
  ['L1TEVtgA75k273wWz1s6XMmDhQY5i3MwcvKb4VbZzfK', 14],
  ['L2TExMFKdjpN9kozasaurPirfHy9P8sbXoAN1qA3S95', 15],
]);
export default function walletAssertionInstruction(instruction) {
  const limit = assertionLimits.get(instruction.programId.toBase58());
  if (limit === undefined) return null;
  const kind = instruction.data[0];
  if (instruction.data.length < 2 || kind < 2 || kind > limit) throw new Error('The wallet added an unsupported Lighthouse action; only read-only safety assertions are allowed.');
  // Transaction.from exposes global privileges; assertions themselves need no write or signer grants.
  // Compilation with the original protocol instructions restores their necessary global permissions.
  return new TransactionInstruction({
    programId: instruction.programId,
    data: instruction.data,
    keys: instruction.keys.map(item => ({ pubkey: item.pubkey, isSigner: false, isWritable: false })),
  });
}