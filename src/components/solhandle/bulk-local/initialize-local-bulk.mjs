import assert from 'node:assert/strict';
import { Keypair } from '@solana/web3.js';
import { connection, send } from '../local-tests/transport.mjs';
import { PROGRAM, CORE, pda, key, instruction, str, systemKey } from '../local-tests/codec.mjs';
const genesis = await connection.getGenesisHash();
assert(!['5eykt4', 'EtWTR', '4uhcV'].some(prefix => genesis.startsWith(prefix)), 'Refusing a public Solana cluster.');
assert.equal(await connection.getAccountInfo(pda('config')), null, 'Refusing to alter an existing protocol configuration.');
assert((await connection.getAccountInfo(PROGRAM))?.executable, 'SolHandle program missing.');
assert((await connection.getAccountInfo(CORE))?.executable, 'Metaplex Core program missing.');
const authority = Keypair.generate(), treasury = Keypair.generate(), rewards = Keypair.generate();
const airdrop = await connection.requestAirdrop(authority.publicKey, 10000000000);
for (let i = 0; i < 60; i++) {
  const state = (await connection.getSignatureStatuses([airdrop])).value[0];
  if (state?.err) throw new Error(JSON.stringify(state.err));
  if (state?.confirmationStatus === 'confirmed' || state?.confirmationStatus === 'finalized') break;
  if (i === 59) throw new Error('Local initialization airdrop timed out.');
  await new Promise(resolve => setTimeout(resolve, 500));
}
await send(authority, [instruction('initialize', [key(authority.publicKey, true, true), key(pda('config'), true), key(pda('collection'), true), systemKey(), key(CORE)], str('http://127.0.0.1:18902/collection.json'), treasury.publicKey.toBuffer(), rewards.publicKey.toBuffer())]);
await send(authority, [instruction('set_paused', [key(authority.publicKey, false, true), key(pda('config'), true)], Buffer.from([0]))]);
console.log(JSON.stringify({ cluster: 'localnet', genesis, program: PROGRAM.toBase58(), collection: pda('collection').toBase58(), treasury: treasury.publicKey.toBase58(), ready: true }, null, 2));
console.log('Only disposable, in-memory setup keys were used. No production configuration was changed.');