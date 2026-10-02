import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { PublicKey } from '@solana/web3.js';
import { PROGRAM, pda, key, instruction, str, u64, systemKey } from '../local-tests/codec.mjs';
import { connection } from '../local-tests/transport.mjs';
export const settingsPda = () => pda('partner_mint');
export const partnerPda = id => pda('partner', createHash('sha256').update(id).digest());
export const configureIx = (f, signer, enabled = false, authority = f.authority) => instruction('configure_partner_mint', [key(authority.publicKey, true, true), key(f.config), key(settingsPda(), true), key(f.payment), systemKey()], Buffer.from([enabled ? 1 : 0]), signer.toBuffer());
export const createIx = (f, id, wallet = f.buyer.publicKey, walletSigns = true, authority = f.authority) => instruction('create_mint_partner', [key(authority.publicKey, true, true), key(f.config), key(settingsPda()), key(partnerPda(id), true), key(wallet, false, walletSigns), systemKey()], str(id));
export const statusIx = (f, id, revision, status, authority = f.authority, partner = partnerPda(id)) => instruction('set_mint_partner_status', [key(authority.publicKey, false, true), key(f.config), key(partner, true)], str(id), u64(revision), Buffer.from([status]));
export const walletIx = (f, id, revision, wallet, signs = true) => instruction('change_mint_partner_wallet', [key(f.authority.publicKey, false, true), key(f.config), key(partnerPda(id), true), key(wallet, false, signs)], str(id), u64(revision));
export async function accountData(address, type) {
  const account = await connection.getAccountInfo(address);
  assert(account && account.owner.equals(PROGRAM), 'Official program account is required');
  assert(account.data.subarray(0, 8).equals(createHash('sha256').update(`account:${type}`).digest().subarray(0, 8)), 'Account discriminator mismatch');
  return account.data;
}
export async function readPartner(id) {
  const data = await accountData(partnerPda(id), 'MintPartner'), length = data.readUInt32LE(40), end = 44 + length;
  assert.equal(data.subarray(44, end).toString(), id);
  return { config: new PublicKey(data.subarray(8, 40)), wallet: new PublicKey(data.subarray(end, end + 32)), status: data[end + 32], revision: data.readBigUInt64LE(end + 33), allowSelfMint: data[end + 41] };
}