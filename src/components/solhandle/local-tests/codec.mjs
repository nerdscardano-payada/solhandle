import { createHash } from 'node:crypto';
import { PublicKey, TransactionInstruction, SystemProgram } from '@solana/web3.js';
export const PROGRAM = new PublicKey('B7xiwfxGcR2Xz7tcUKrkB8Ly6NV8jU7LH1m6GJZRUuf');
export const CORE = new PublicKey('CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d');
export const TOKEN = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
export const u64 = value => { const b = Buffer.alloc(8); b.writeBigUInt64LE(BigInt(value)); return b; };
export const str = value => { const b = Buffer.from(value); const n = Buffer.alloc(4); n.writeUInt32LE(b.length); return Buffer.concat([n, b]); };
export const pda = (seed, extra) => PublicKey.findProgramAddressSync([Buffer.from(seed), ...(extra ? [Buffer.from(extra)] : [])], PROGRAM)[0];
export const key = (pubkey, isWritable = false, isSigner = false) => ({ pubkey, isWritable, isSigner });
export function instruction(name, keys, ...data) {
  return new TransactionInstruction({ programId: PROGRAM, keys, data: Buffer.concat([createHash('sha256').update(`global:${name}`).digest().subarray(0, 8), ...data]) });
}
export const systemKey = () => key(SystemProgram.programId);
export function tokenIx(keys, ...data) { return new TransactionInstruction({ programId: TOKEN, keys, data: Buffer.concat(data) }); }