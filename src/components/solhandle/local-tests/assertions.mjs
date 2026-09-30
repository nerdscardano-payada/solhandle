import assert from 'node:assert/strict';
import { connection } from './transport.mjs';
import { pda, CORE } from './codec.mjs';
import { balance, supply } from './tokens.mjs';
export async function snapshot(f, handle) {
  return { buyer: await balance(f.payerToken), treasury: await balance(f.treasuryToken), supply: await supply(f.mint), config: (await connection.getAccountInfo(f.config)).data.toString('hex'), collection: (await connection.getAccountInfo(f.collection)).data.toString('hex'), handle: (await connection.getAccountInfo(pda('handle', handle)))?.data.toString('hex') ?? null, asset: (await connection.getAccountInfo(pda('asset', handle)))?.data.toString('hex') ?? null };
}
export async function owner(f, handle) {
  const asset = await connection.getAccountInfo(pda('asset', handle));
  assert(asset, 'NFT must exist');
  assert(asset.owner.equals(CORE), 'NFT must be owned by Metaplex Core');
  assert.equal(asset.data[0], 1, 'Expected BaseAssetV1');
  assert(asset.data.subarray(1, 33).equals(f.buyer.publicKey.toBuffer()), 'NFT owner must be buyer');
  const record = await connection.getAccountInfo(pda('handle', handle));
  assert(record, 'Handle record must exist');
  const length = record.data.readUInt32LE(8);
  assert.equal(record.data.subarray(12, 12 + length).toString(), handle);
  assert(record.data.subarray(12 + length, 44 + length).equals(pda('asset', handle).toBuffer()), 'Record must point to minted NFT');
}
export async function split(f, handle, amount, action) {
  const before = await snapshot(f, handle);
  await action();
  const after = await snapshot(f, handle);
  assert.equal(before.buyer - after.buyer, amount);
  assert.equal(after.treasury - before.treasury, amount - amount / 2n);
  assert.equal(before.supply - after.supply, amount / 2n);
  await owner(f, handle);
}
export async function unchanged(f, handle, action) {
  const before = await snapshot(f, handle);
  await action();
  assert.deepEqual(await snapshot(f, handle), before, 'Failed transaction changed tokens, supply, config, collection or NFT');
}