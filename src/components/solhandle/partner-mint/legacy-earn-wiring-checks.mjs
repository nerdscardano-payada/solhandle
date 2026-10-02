import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';
export default async function checkLegacyWiring(source) {
  if (!globalThis.crypto) globalThis.crypto = webcrypto;
  const stripped = source.replace(/^import .*;\r?\n/gm, '').replaceAll('export ', '');
  const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
  const build = new AsyncFunction('checkPrimaryMintEarn', 'PublicKey', 'PROGRAM_ID', 'Deno', stripped + '\nreturn processConfirmedReferral;');
  for (const mode of ['partner', 'rpc_failure', 'ordinary']) {
    let writes = 0, gates = 0;
    const sentinel = new Error('reached legacy processing');
    const entity = name => ({
      list: async () => [{ referral_enabled: true }],
      filter: async () => name === 'MintIntent' ? [{ id: 'intent', referral_profile_id: 'profile', status: 'CONFIRMED' }] : [],
      updateMany: async () => { writes++; throw sentinel; },
      update: async () => { writes++; throw new Error('unexpected update'); },
      create: async () => { writes++; throw new Error('unexpected create'); },
    });
    const base44 = { asServiceRole: { entities: new Proxy({}, { get: (_, name) => entity(name) }) } };
    const guard = async (input, url) => {
      gates++; assert.equal(input.source, 'MINT'); assert.equal(input.assetAddress, 'asset'); assert.equal(url, 'rpc');
      if (mode === 'rpc_failure') throw new Error('RPC unavailable');
      return { eligible: mode === 'ordinary', reason: 'partner_mint_primary_excluded' };
    };
    const process = await build(guard, {}, 'program', { env: { get: () => 'rpc' } });
    const input = { signature: 'sig', handle: 'ansem', buyerWallet: 'buyer', assetAddress: 'asset', source: 'SECONDARY_ROYALTY' };
    if (mode === 'partner') assert.deepEqual(await process(base44, input), { credited: false, reason: 'partner_mint_primary_excluded' });
    else if (mode === 'rpc_failure') await assert.rejects(process(base44, input), /RPC unavailable/);
    else await assert.rejects(process(base44, input), error => error === sentinel);
    assert.equal(gates, 1); assert.equal(writes, mode === 'ordinary' ? 1 : 0);
    console.log(`PASS legacy wiring: ${mode}`);
  }
  console.log('3 LEGACY WIRING CHECKS PASSED (mocked, no network/database writes).');
}