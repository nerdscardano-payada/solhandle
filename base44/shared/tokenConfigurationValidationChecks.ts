import { Keypair, PublicKey, Transaction, TransactionInstruction, ComputeBudgetProgram, SystemProgram } from 'npm:@solana/web3.js@1.98.4';
import { configurationInstructions } from './handleTokenTransactions.ts';
import validateTokenConfiguration from './validateTokenConfiguration.ts';

// Entirely local, ephemeral signatures: never submit or fund these fixture transactions.
export default async function tokenConfigurationValidationChecks(treasury, signer, tokenProgram) {
  const authority = Keypair.generate();
  const original = await configurationInstructions(authority.publicKey, treasury, signer, tokenProgram);
  const assertion = new TransactionInstruction({ programId: new PublicKey('L2TExMFKdjpN9kozasaurPirfHy9P8sbXoAN1qA3S95'), keys: [{ pubkey: authority.publicKey, isSigner: false, isWritable: false }], data: Uint8Array.of(5, 0, 0) });
  const budget = ComputeBudgetProgram.setComputeUnitLimit({ units: 600000 });
  const fixture = (extra = [], reviewed = original) => {
    const tx = new Transaction({ feePayer: authority.publicKey, recentBlockhash: Keypair.generate().publicKey.toBase58() }).add(budget, ...reviewed, ...extra);
    tx.sign(authority);
    return Transaction.from(tx.serialize());
  };
  const results = [];
  const check = (name, tx, shouldPass) => {
    let accepted = false, reason = '';
    try { validateTokenConfiguration(tx, original, authority.publicKey); accepted = true; }
    catch (error) { reason = error.message; }
    if (accepted !== shouldPass) throw new Error(`Configuration validation regression: ${name}. ${reason}`);
    results.push({ name, passed: true, accepted });
  };
  check('Original signed configuration', fixture(), true);
  check('Read-only Lighthouse assertion', fixture([assertion]), true);
  check('Lighthouse with bounded wallet fee', fixture([ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 1000000 }), assertion]), true);
  check('Additional transfer blocked', fixture([SystemProgram.transfer({ fromPubkey: authority.publicKey, toPubkey: Keypair.generate().publicKey, lamports: 1 })]), false);
  check('Excessive wallet fee blocked', fixture([ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 9000000 })]), false);
  check('Lighthouse memory actions blocked', fixture([new TransactionInstruction({ ...assertion, data: Uint8Array.of(0, 0, 0) })]), false);
  const changed = [...original];
  changed[1] = new TransactionInstruction({ ...original[1], data: Uint8Array.of(1) });
  check('Changed protocol settings blocked', fixture([], changed), false);
  const unsigned = fixture(); unsigned.signatures[0].signature = null;
  check('Missing authority signature blocked', unsigned, false);
  return { submitted: false, checks: results };
}