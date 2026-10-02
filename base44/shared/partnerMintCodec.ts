import { PublicKey, Keypair, Ed25519Program, TransactionInstruction, SystemProgram, SYSVAR_INSTRUCTIONS_PUBKEY } from 'npm:@solana/web3.js@1.98.4';
import { Buffer } from 'node:buffer';
// Dedicated devnet pilot identity; never import the production program identity.
export const PROGRAM_ID = 'ATJutPfzXiYpf7NXaGPEBek69jHaU8Cy85ekUH8drMGT';
export const PROGRAM = new PublicKey(PROGRAM_ID);
export const CORE = new PublicKey('CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d');
export const enc = value => new TextEncoder().encode(value);
export const concat = (...parts) => Buffer.concat(parts.map(part => Buffer.from(part)));
export const b64 = bytes => Buffer.from(bytes).toString('base64');
export const unb64 = text => Buffer.from(text, 'base64');
export const equal = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);
export const sha = async bytes => new Uint8Array(await crypto.subtle.digest('SHA-256', bytes));
export const pda = (seed, extra) => PublicKey.findProgramAddressSync([enc(seed), ...(extra ? [typeof extra === 'string' ? enc(extra) : extra] : [])], PROGRAM)[0];
export const keyAt = (bytes, offset) => new PublicKey(bytes.slice(offset, offset + 32)).toBase58();
export const view = bytes => new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
export const uint = (bytes, offset) => view(bytes).getBigUint64(offset, true);
export function fault(code, status, message = code) { const error = new Error(message); Object.assign(error, { code, status }); throw error; }
export function u64(value) { const n = BigInt(value); if (n < 0n || n > 18446744073709551615n) fault('AMOUNT_OVERFLOW', 409); const b = new Uint8Array(8); view(b).setBigUint64(0, n, true); return b; }
export function str(value) { const b = enc(value), size = new Uint8Array(4); view(size).setUint32(0, b.length, true); return concat(size, b); }
export async function accountBytes(account, name, minLength) {
  if (!account || account.owner !== PROGRAM_ID || account.executable || account.data?.[1] !== 'base64') fault('INVALID_CHAIN_ACCOUNT', 503);
  const bytes = unb64(account.data[0]), discriminator = (await sha(enc(`account:${name}`))).slice(0, 8);
  if (bytes.length < minLength || !equal(bytes.slice(0, 8), discriminator)) fault('INVALID_CHAIN_ACCOUNT', 503);
  return bytes;
}
export function loadSigner(secret) {
  let values; try { values = JSON.parse(secret); } catch { fault('SIGNER_NOT_CONFIGURED', 503); }
  if (!Array.isArray(values) || values.length !== 64 || values.some(v => !Number.isInteger(v) || v < 0 || v > 255)) fault('SIGNER_NOT_CONFIGURED', 503);
  return Keypair.fromSecretKey(Uint8Array.from(values));
}
export async function quoteDigest(q) {
  return sha(concat(enc('solhandle:partner-sol:v1\0'), PROGRAM.toBytes(), pda('partner_mint').toBytes(), u64(q.settingsRevision), new PublicKey(q.wallet).toBytes(), new PublicKey(q.partnerPda).toBytes(), new PublicKey(q.revenueWallet).toBytes(), new PublicKey(q.treasury).toBytes(), new PublicKey(q.collection).toBytes(), u64(q.partnerRevision), str(q.handle), await sha(enc(q.uri)), u64(q.mintPriceLamports), u64(q.expiresAtUnix)));
}
export async function mintInstructions(q, signer) {
  const digest = await quoteDigest(q), verification = Ed25519Program.createInstructionWithPrivateKey({ privateKey: signer.secretKey, message: digest });
  const k = (pubkey, isWritable = false, isSigner = false) => ({ pubkey: new PublicKey(pubkey), isWritable, isSigner });
  const asset = pda('asset', q.handle);
  const keys = [k(q.wallet, true, true), k(pda('config'), true), k(pda('partner_mint')), k(q.partnerPda), k(pda('handle', q.handle), true), k(asset, true), k(pda('restriction', q.handle)), k(pda('price', q.handle)), k(pda('rush')), k(pda('premium', q.handle)), k(q.collection, true), k(q.treasury, true), k(q.revenueWallet, true), k(pda('partner_receipt', asset.toBytes()), true), k(SYSVAR_INSTRUCTIONS_PUBKEY), k(SystemProgram.programId), k(CORE)];
  const data = concat((await sha(enc('global:mint_handle_partner_sol'))).slice(0, 8), str(q.handle), str(q.uri), str(q.partnerId), u64(q.partnerRevision), u64(q.settingsRevision), u64(q.mintPriceLamports), u64(q.expiresAtUnix));
  return [verification, new TransactionInstruction({ programId: PROGRAM, keys, data })];
}