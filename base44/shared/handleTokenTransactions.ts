import { PublicKey, SystemProgram, TransactionInstruction, Ed25519Program, SYSVAR_INSTRUCTIONS_PUBKEY } from 'npm:@solana/web3.js@1.98.4';
import { PROGRAM_ID } from './solhandleProtocol.ts';
import { HANDLE_MINT } from './handlePaymentStatus.ts';
export const TOKEN = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
const ATA = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');
const CORE = new PublicKey('CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d');
export const program = new PublicKey(PROGRAM_ID);
export const mint = new PublicKey(HANDLE_MINT);
const encoder = new TextEncoder();
export const pda = (seed, handle) => PublicKey.findProgramAddressSync([encoder.encode(seed), ...(handle ? [encoder.encode(handle)] : [])], program)[0];
export const associatedToken = (owner, tokenProgram = TOKEN) => PublicKey.findProgramAddressSync([new PublicKey(owner).toBytes(), tokenProgram.toBytes(), mint.toBytes()], ATA)[0];
export const key = (pubkey, isWritable = false, isSigner = false) => ({ pubkey: new PublicKey(pubkey), isWritable, isSigner });
export const concat = (...values) => Uint8Array.from(values.flatMap(value => [...value]));
export const fromBase64 = value => Uint8Array.from(atob(value), c => c.charCodeAt(0));
export const toBase64 = value => btoa(String.fromCharCode(...value));
export const equal = (a, b) => a.length === b.length && a.every((value, index) => value === b[index]);
export async function discriminator(name) { return new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(`global:${name}`))).slice(0, 8); }
export function str(value) { const text = encoder.encode(value), length = new Uint8Array(4); new DataView(length.buffer).setUint32(0, text.length, true); return concat(length, text); }
export function u64(value) { const bytes = new Uint8Array(8); new DataView(bytes.buffer).setBigUint64(0, BigInt(value), true); return bytes; }
export async function configurationInstructions(authority, treasury, signer, tokenProgram = TOKEN) {
  const treasuryToken = associatedToken(treasury, tokenProgram);
  const create = new TransactionInstruction({ programId: ATA, keys: [key(authority, true, true), key(treasuryToken, true), key(treasury), key(mint), key(SystemProgram.programId), key(tokenProgram)], data: Uint8Array.of(1) });
  const configure = new TransactionInstruction({ programId: program, keys: [key(authority, true, true), key(pda('config')), key(pda('token_payment'), true), key(SystemProgram.programId)], data: concat(await discriminator('configure_token_payments'), Uint8Array.of(1), mint.toBytes(), new PublicKey(signer).toBytes(), treasuryToken.toBytes()) });
  return [create, configure];
}
export async function mintInstructions(wallet, handle, uri, quote, protocol, payment, payerToken, tokenProgram = TOKEN) {
  const verification = Ed25519Program.createInstructionWithPublicKey({ publicKey: new PublicKey(quote.signer).toBytes(), message: encoder.encode(quote.message), signature: fromBase64(quote.signature) });
  const instruction = new TransactionInstruction({ programId: program, keys: [key(wallet, true, true), key(pda('config'), true), key(pda('token_payment')), key(pda('handle', handle), true), key(pda('asset', handle), true), key(pda('restriction', handle)), key(pda('price', handle)), key(pda('rush')), key(pda('premium', handle)), key(protocol.collection, true), key(mint, true), key(payerToken, true), key(payment.treasuryToken, true), key(tokenProgram), key(SYSVAR_INSTRUCTIONS_PUBKEY), key(SystemProgram.programId), key(CORE)], data: concat(await discriminator('mint_handle_with_token'), str(handle), str(uri), u64(quote.solReferenceLamports), u64(quote.totalRaw), u64(quote.expiresAt)) });
  return [verification, instruction];
}
export function sameInstruction(actual, expected) {
  return actual.programId.equals(expected.programId) && equal(actual.data, expected.data) && actual.keys.length === expected.keys.length && actual.keys.every((item, i) => item.pubkey.equals(expected.keys[i].pubkey));
}