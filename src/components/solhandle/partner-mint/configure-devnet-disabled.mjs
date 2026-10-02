import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { Connection, Keypair, PublicKey, SystemProgram, Transaction, TransactionInstruction, sendAndConfirmTransaction } from '@solana/web3.js';

// Explicit devnet target. Never enables minting or modifies the protocol Config.
const program = new PublicKey('ATJutPfzXiYpf7NXaGPEBek69jHaU8Cy85ekUH8drMGT');
const signer = new PublicKey('9N351uhUi2mzsa4d7LL9B5ii1tbM8q12CVLqPXuFRk2e');
const authority = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(readFileSync(`${homedir()}/.config/solana/solhandle-devnet.json`, 'utf8'))));
assert.equal(authority.publicKey.toBase58(), 'ECnRhUUS5ccr5RUGyXGbwzNytMSvT9bBn2jdGQgqvQyE', 'Unexpected devnet authority');
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
assert.equal(await connection.getGenesisHash(), 'EtWTRABZaYq6iMfeYKouRu166VU2xqa1wcaWoxPkrZBG', 'Not devnet');
assert((await connection.getAccountInfo(program))?.executable, 'Devnet program is missing');
const pda = seed => PublicKey.findProgramAddressSync([Buffer.from(seed)], program)[0];
const config = pda('config'), settings = pda('partner_mint'), token = pda('token_payment');
const discriminator = name => createHash('sha256').update(name).digest().subarray(0, 8);
const bytes = (account, name, size) => {
  assert(account && account.owner.equals(program), `${name}: invalid owner or missing account`);
  assert(account.data.length >= size && account.data.subarray(0, 8).equals(discriminator(`account:${name}`)), `${name}: invalid layout`);
  return account.data;
};
const configBefore = bytes(await connection.getAccountInfo(config), 'Config', 187);
assert.equal(configBefore[186], 2, 'Protocol version must be 2');
assert(new PublicKey(configBefore.subarray(8, 40)).equals(authority.publicKey), 'Config authority mismatch');
const describe = account => {
  const data = bytes(account, 'PartnerMintSettings', 82);
  assert(new PublicKey(data.subarray(8, 40)).equals(config), 'Settings Config mismatch');
  assert.equal(data[40], 0, 'Partner Mint must remain disabled');
  assert(new PublicKey(data.subarray(41, 73)).equals(signer), 'Existing quote signer differs; refusing overwrite');
  return { cluster: 'devnet', program: program.toBase58(), settings: settings.toBase58(), enabled: false, quoteSigner: signer.toBase58(), revision: data.readBigUInt64LE(73).toString() };
};
const existing = await connection.getAccountInfo(settings);
if (existing) {
  console.log(JSON.stringify({ ...describe(existing), unchanged: true }, null, 2));
} else {
  const instruction = new TransactionInstruction({ programId: program, keys: [
    { pubkey: authority.publicKey, isSigner: true, isWritable: true },
    { pubkey: config, isSigner: false, isWritable: false },
    { pubkey: settings, isSigner: false, isWritable: true },
    { pubkey: token, isSigner: false, isWritable: false },
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
  ], data: Buffer.concat([discriminator('global:configure_partner_mint'), Buffer.from([0]), signer.toBuffer()]) });
  const signature = await sendAndConfirmTransaction(connection, new Transaction().add(instruction), [authority], { commitment: 'confirmed' });
  assert(bytes(await connection.getAccountInfo(config), 'Config', 187).equals(configBefore), 'Protocol Config changed unexpectedly');
  console.log(JSON.stringify({ ...describe(await connection.getAccountInfo(settings)), signature }, null, 2));
}