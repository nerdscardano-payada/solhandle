import { PublicKey, SystemProgram, TransactionInstruction } from '@solana/web3.js';
import { PROGRAM_ID } from '@/lib/solhandleProtocol';
export const PROGRAM = PROGRAM_ID;
export const CORE = new PublicKey('CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d');
export const CLOCK = new PublicKey('SysvarC1ock11111111111111111111111111111111');
const encoder = new TextEncoder();
const join = (...parts) => Uint8Array.from(parts.flatMap(part => [...part]));
export const pda = (seed, handle) => PublicKey.findProgramAddressSync([encoder.encode(seed), ...(handle ? [encoder.encode(handle)] : [])], PROGRAM)[0];
export async function discriminator(name) { return new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(name))).slice(0, 8); }
const str = text => { const value = encoder.encode(text), size = new Uint8Array(4); new DataView(size.buffer).setUint32(0, value.length, true); return join(size, value); };
const u64 = value => { const bytes = new Uint8Array(8); new DataView(bytes.buffer).setBigUint64(0, BigInt(value), true); return bytes; };
const key = (pubkey, isWritable = false, isSigner = false) => ({ pubkey, isWritable, isSigner });
export async function localMintInstruction(item, config, wallet) {
  return new TransactionInstruction({ programId: PROGRAM, keys: [
    key(wallet, true, true), key(pda('config'), true), key(pda('handle', item.handle), true), key(pda('asset', item.handle), true),
    key(pda('restriction', item.handle)), key(pda('price', item.handle)), key(pda('rush')), key(pda('premium', item.handle)),
    key(config.collection, true), key(config.treasury, true), key(SystemProgram.programId), key(CORE)
  ], data: join(await discriminator('global:mint_handle'), str(item.handle), str(item.uri), u64(item.priceLamports)) });
}
export const viewOf = bytes => new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
export const keyAt = (bytes, offset) => new PublicKey(bytes.slice(offset, offset + 32)).toBase58();
export async function checkedData(account, name) {
  if (!account || account.owner !== PROGRAM.toBase58()) throw new Error(`Invalid local ${name} account.`);
  const bytes = Uint8Array.from(atob(account.data[0]), c => c.charCodeAt(0)), hash = await discriminator(`account:${name}`);
  if (hash.some((byte, i) => bytes[i] !== byte)) throw new Error(`Invalid local ${name} layout.`);
  return bytes;
}