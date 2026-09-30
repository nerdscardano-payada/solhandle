import assert from 'node:assert/strict';
import { Keypair, SystemProgram } from '@solana/web3.js';
import { connection, send } from './transport.mjs';
import { PROGRAM, CORE, key, pda, instruction, str, systemKey } from './codec.mjs';
import { createMint, tokenAccount, fundTokens } from './tokens.mjs';
export async function fixture() {
  assert.equal(await connection.getAccountInfo(pda('config')), null, 'Use a fresh isolated ledger; refusing existing config.');
  const authority = Keypair.generate(), buyer = Keypair.generate(), treasury = Keypair.generate(), rewards = Keypair.generate(), quoteSigner = Keypair.generate();
  const sig = await connection.requestAirdrop(authority.publicKey, 10000000000);
  const block = await connection.getLatestBlockhash();
  await connection.confirmTransaction({ signature: sig, ...block });
  await send(authority, [buyer, treasury, rewards].map(k => SystemProgram.transfer({ fromPubkey: authority.publicKey, toPubkey: k.publicKey, lamports: 1000000000 })));
  const config = pda('config'), collection = pda('collection'), payment = pda('token_payment');
  await send(authority, [instruction('initialize', [key(authority.publicKey, true, true), key(config, true), key(collection, true), systemKey(), key(CORE)], str('https://example.invalid/local-test-collection.json'), treasury.publicKey.toBuffer(), rewards.publicKey.toBuffer())]);
  await send(authority, [instruction('set_paused', [key(authority.publicKey, false, true), key(config, true)], Buffer.from([0]))]);
  const mint = await createMint(authority);
  const payerToken = await tokenAccount(authority, mint, buyer.publicKey);
  const treasuryToken = await tokenAccount(authority, mint, treasury.publicKey);
  await fundTokens(authority, mint, payerToken, 10000000n);
  const f = { authority, buyer, treasury, rewards, quoteSigner, config, collection, payment, mint, payerToken, treasuryToken };
  await configure(f, true);
  assert((await connection.getAccountInfo(PROGRAM))?.executable, 'Local program missing');
  return f;
}
export async function configure(f, enabled, signer = f.quoteSigner.publicKey) {
  await send(f.authority, [instruction('configure_token_payments', [key(f.authority.publicKey, true, true), key(f.config), key(f.payment, true), systemKey()], Buffer.from([enabled ? 1 : 0]), f.mint.toBuffer(), signer.toBuffer(), f.treasuryToken.toBuffer())]);
}