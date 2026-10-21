import { PublicKey, SystemProgram, Transaction, TransactionInstruction } from "npm:@solana/web3.js@1.98.4";
import { PROGRAM_ID } from "./solhandleProtocol.ts";
export const program = new PublicKey(PROGRAM_ID);
export const core = new PublicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");
export const recoveryActions = new Set(["delist", "cancel_bid"]);
export const bytes = value => Uint8Array.from(atob(value), c => c.charCodeAt(0));
export const base64 = value => btoa(String.fromCharCode(...value));
export const same = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);
export const key = value => new PublicKey(value).toBase58();
export const pda = seeds => PublicKey.findProgramAddressSync(seeds, program)[0];
export const seed = value => new TextEncoder().encode(value);
export const u64 = (data, offset) => new DataView(data.buffer, data.byteOffset, data.byteLength).getBigUint64(offset, true);
export async function discriminator(name) { return new Uint8Array(await crypto.subtle.digest("SHA-256", seed(name))).slice(0, 8); }
export function encode58(data) {
  const alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  let n = 0n, out = ""; for (const b of data) n = n * 256n + BigInt(b);
  while (n) { out = alphabet[Number(n % 58n)] + out; n /= 58n; }
  for (const b of data) { if (b) break; out = "1" + out; } return out;
}
export function retired() { return Response.json({ code: "NATIVE_MARKETPLACE_RETIRED", error: "Native trading has ended. Only listing and bid cancellation remain available.", recoveryPath: "/marketplace-recovery" }, { status: 410 }); }
export async function cancellationInstruction({ action, wallet, asset, handle, collection }) {
  if (!recoveryActions.has(action)) throw new Error("Only cancellations are permitted.");
  const owner = new PublicKey(wallet), nft = new PublicKey(asset);
  const record = pda([seed("handle"), seed(handle)]);
  const position = pda(action === "delist" ? [seed("listing"), nft.toBytes()] : [seed("bid"), nft.toBytes(), owner.toBytes()]);
  const accounts = [[owner, true, true], [record, false, false], [nft, false, action === "delist"], [position, false, true]];
  if (action === "delist") accounts.push([new PublicKey(collection), false, true], [SystemProgram.programId, false, false], [core, false, false]);
  return new TransactionInstruction({ programId: program, data: await discriminator(`global:${action === "delist" ? "delist_handle" : "cancel_bid"}`), keys: accounts.map(([pubkey, isSigner, isWritable]) => ({ pubkey, isSigner, isWritable })) });
}
export async function parseCancellation(body, signed = false) {
  if (!recoveryActions.has(body.action)) throw new Error("Only cancellations are permitted.");
  if (typeof body.transaction_base64 !== "string" || body.transaction_base64.length > 2000) throw new Error("A bounded cancellation transaction is required.");
  const tx = Transaction.from(bytes(body.transaction_base64));
  const wallet = key(body.wallet), ix = tx.instructions[0];
  const expected = await discriminator(`global:${body.action === "delist" ? "delist_handle" : "cancel_bid"}`);
  if (tx.instructions.length !== 1 || !ix.programId.equals(program) || !same(ix.data, expected)) throw new Error("Only one matching cancellation instruction is allowed. Trading instructions are blocked.");
  if (tx.feePayer?.toBase58() !== wallet || tx.signatures.length !== 1 || tx.signatures[0].publicKey.toBase58() !== wallet) throw new Error("Cancellation signer/fee payer mismatch.");
  if (signed && !tx.verifySignatures()) throw new Error("A valid wallet signature is required.");
  return { tx, wallet, ix, signature: tx.signature ? encode58(tx.signature) : null };
}