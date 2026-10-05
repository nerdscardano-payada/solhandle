import { PublicKey, SystemProgram, TransactionInstruction } from 'npm:@solana/web3.js@1.98.4';
import { PROGRAM_ID, SEEDS } from './solhandleProtocol.ts';
import { rpc } from './solanaRpc.ts';
const encoder = new TextEncoder();
const program = new PublicKey(PROGRAM_ID);
const derive = (seed, value) => PublicKey.findProgramAddressSync([encoder.encode(seed), value], program)[0];
export async function needsDefaultPrimary(rpcUrl, wallet) {
  const address = derive(SEEDS.primary, new PublicKey(wallet).toBytes());
  const account = await rpc(rpcUrl, 'getAccountInfo', [address.toBase58(), { encoding: 'base64', commitment: 'confirmed' }]);
  // Any existing primary account is preserved, even if its selected NFT was transferred.
  return !account.value;
}
export async function defaultPrimaryInstruction(wallet, handle) {
  const owner = new PublicKey(wallet), name = encoder.encode(handle);
  const data = new Uint8Array(12 + name.length);
  data.set(new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode('global:set_primary_handle'))).slice(0, 8));
  new DataView(data.buffer).setUint32(8, name.length, true); data.set(name, 12);
  return new TransactionInstruction({ programId: program, data, keys: [
    { pubkey: owner, isSigner: true, isWritable: true },
    { pubkey: derive(SEEDS.handle, name), isSigner: false, isWritable: false },
    { pubkey: derive(SEEDS.asset, name), isSigner: false, isWritable: false },
    { pubkey: derive(SEEDS.primary, owner.toBytes()), isSigner: false, isWritable: true },
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }
  ] });
}
export async function validateDefaultPrimary(rpcUrl, instruction, wallet, handle) {
  const expected = await defaultPrimaryInstruction(wallet, handle);
  if (!instruction.programId.equals(expected.programId) || instruction.data.length !== expected.data.length || !instruction.data.every((byte, i) => byte === expected.data[i]) || instruction.keys.length !== expected.keys.length || instruction.keys.some((key, i) => !key.pubkey.equals(expected.keys[i].pubkey)) || !instruction.keys[0].isSigner || !instruction.keys[3].isWritable) throw new Error('Only the newly minted handle may become the default primary.');
  if (!(await needsDefaultPrimary(rpcUrl, wallet))) throw new Error('A primary name was already set. Prepare this mint again to preserve your selection.');
  return expected;
}