import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { Connection, Keypair, PublicKey, SystemProgram, Transaction, TransactionInstruction, sendAndConfirmTransaction } from '@solana/web3.js';

assert(process.argv.includes('--enable-devnet'), 'Explicit approval required: pass --enable-devnet. This script never mints.');
const program = new PublicKey('ATJutPfzXiYpf7NXaGPEBek69jHaU8Cy85ekUH8drMGT');
const signer = new PublicKey('9N351uhUi2mzsa4d7LL9B5ii1tbM8q12CVLqPXuFRk2e');
const wallet = new PublicKey('BKWUshcZsL3VKSVo2Ficqr2KJYRzjBDLMuoeyLjH2cqk');
const partnerId = 'devnet-testpartner';
const authority = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(readFileSync(homedir() + '/.config/solana/solhandle-devnet.json', 'utf8'))));
assert.equal(authority.publicKey.toBase58(), 'ECnRhUUS5ccr5RUGyXGbwzNytMSvT9bBn2jdGQgqvQyE', 'Unexpected devnet authority');
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
assert.equal(await connection.getGenesisHash(), 'EtWTRABZaYq6iMfeYKouRu166VU2xqa1wcaWoxPkrZBG', 'Not devnet');
assert((await connection.getAccountInfo(program))?.executable, 'Devnet program missing');
const hash = text => createHash('sha256').update(text).digest();
const pda = (...seeds) => PublicKey.findProgramAddressSync(seeds.map(s => typeof s === 'string' ? Buffer.from(s) : s), program)[0];
const config = pda('config'), settings = pda('partner_mint'), token = pda('token_payment');
const partner = pda('partner', hash(partnerId));
assert.equal(partner.toBase58(), 'XeaPwVGmF9vy9CVdYLc9UNuBiAcbNUoLRhZNB5FU9Tc', 'Partner address mismatch');
function bytes(account, name, size) {
  assert(account && account.owner.equals(program) && !account.executable, name + ': invalid owner or missing account');
  assert(account.data.length >= size && account.data.subarray(0, 8).equals(hash('account:' + name).subarray(0, 8)), name + ': invalid layout');
  return account.data;
}
const [c, s, p] = await connection.getMultipleAccountsInfo([config, settings, partner]);
const configBefore = bytes(c, 'Config', 187), settingsBefore = bytes(s, 'PartnerMintSettings', 82), partnerBefore = bytes(p, 'MintPartner', 88);
assert.equal(configBefore[186], 2, 'Protocol version must be 2');
assert(new PublicKey(configBefore.subarray(8, 40)).equals(authority.publicKey), 'Config authority mismatch');
assert(new PublicKey(settingsBefore.subarray(8, 40)).equals(config), 'Settings config mismatch');
assert(new PublicKey(settingsBefore.subarray(41, 73)).equals(signer), 'Quote signer differs; refusing overwrite');
const length = partnerBefore.readUInt32LE(40), end = 44 + length;
assert(length === partnerId.length && partnerBefore.length >= end + 43 && partnerBefore.subarray(44, end).toString() === partnerId, 'Partner ID mismatch');
assert(new PublicKey(partnerBefore.subarray(8, 40)).equals(config), 'Partner config mismatch');
assert(new PublicKey(partnerBefore.subarray(end, end + 32)).equals(wallet), 'Partner revenue wallet mismatch');
assert.equal(partnerBefore[end + 32], 0, 'Partner must be APPROVED');
assert.equal(partnerBefore.readBigUInt64LE(end + 33), 1n, 'Partner revision changed; review before activation');
assert.equal(partnerBefore[end + 41], 0, 'Self mint must remain disabled');
let signature;
if (settingsBefore[40] === 1) {
  assert.equal(settingsBefore.readBigUInt64LE(73), 2n, 'Settings revision changed; review before continuing');
} else {
  assert.equal(settingsBefore[40], 0, 'Invalid settings flag');
  assert.equal(settingsBefore.readBigUInt64LE(73), 1n, 'Settings revision changed; review before activation');
  const instruction = new TransactionInstruction({ programId: program, keys: [
    { pubkey: authority.publicKey, isSigner: true, isWritable: true },
    { pubkey: config, isSigner: false, isWritable: false },
    { pubkey: settings, isSigner: false, isWritable: true },
    { pubkey: token, isSigner: false, isWritable: false },
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
  ], data: Buffer.concat([hash('global:configure_partner_mint').subarray(0, 8), Buffer.from([1]), signer.toBuffer()]) });
  console.log('Enabling Partner Mint on devnet only. No mint transaction is created.');
  signature = await sendAndConfirmTransaction(connection, new Transaction().add(instruction), [authority], { commitment: 'confirmed', skipPreflight: false });
}
const [afterConfig, afterSettings, afterPartner] = await connection.getMultipleAccountsInfo([config, settings, partner]);
assert(bytes(afterConfig, 'Config', 187).equals(configBefore), 'Protocol Config changed unexpectedly');
assert(bytes(afterPartner, 'MintPartner', 88).equals(partnerBefore), 'Partner changed unexpectedly');
const expected = Buffer.from(settingsBefore); expected[40] = 1; expected.writeBigUInt64LE(2n, 73);
assert(bytes(afterSettings, 'PartnerMintSettings', 82).equals(expected), 'Unexpected Partner Mint settings after activation');
console.log(JSON.stringify({ cluster: 'devnet', program: program.toBase58(), settings: settings.toBase58(), enabled: true, quoteSigner: signer.toBase58(), settingsRevision: '2', partnerId, partner: partner.toBase58(), revenueWallet: wallet.toBase58(), partnerStatus: 'APPROVED', partnerRevision: '1', allowSelfMint: false, protocolConfigUnchanged: true, partnerUnchanged: true, mintExecuted: false, ...(signature ? { signature } : { unchanged: true }) }, null, 2));