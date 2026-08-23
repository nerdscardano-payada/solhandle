// Re-creates protected-name reservations on the mainnet program (PDA seeds are
// program-bound, so devnet reservations must be re-applied after a mainnet deploy).
import { Connection, Keypair, PublicKey, SystemProgram, Transaction, TransactionInstruction, sendAndConfirmTransaction } from "@solana/web3.js";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const programIdText = process.env.SOLHANDLE_PROGRAM_ID;
const authorityPath = process.env.SOLHANDLE_AUTHORITY;
if (!programIdText || !authorityPath) throw new Error("SOLHANDLE_PROGRAM_ID and SOLHANDLE_AUTHORITY are required.");

const rpcUrl = process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com";
const DEFAULT_RESERVED = "apple,google,nike,microsoft,amazon,cocacola,facebook,instagram,youtube,whatsapp,tiktok,meta,x,twitter,openai,chatgpt,solhandle,solana,sol,solanafoundation,solanalabs,phantom,solflare,backpack";
const names = String(process.env.RESERVE_NAMES || DEFAULT_RESERVED).split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);

const programId = new PublicKey(programIdText);
const authority = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(readFileSync(authorityPath, "utf8"))));
const connection = new Connection(rpcUrl, "confirmed");
const [config] = PublicKey.findProgramAddressSync([Buffer.from("config")], programId);

const encoder = new TextEncoder();
const stringBytes = (value) => {
  const text = encoder.encode(value);
  const size = new Uint8Array(4);
  new DataView(size.buffer).setUint32(0, text.length, true);
  return Uint8Array.from([...size, ...text]);
};
const discriminator = createHash("sha256").update("global:set_reserved_handle").digest().subarray(0, 8);

const results = [];
for (const handle of names) {
  const [reserved] = PublicKey.findProgramAddressSync([Buffer.from("reserved"), encoder.encode(handle)], programId);
  const data = Uint8Array.from([...discriminator, ...stringBytes(handle), 1]);
  const instruction = new TransactionInstruction({
    programId,
    keys: [
      { pubkey: authority.publicKey, isSigner: true, isWritable: true },
      { pubkey: config, isSigner: false, isWritable: false },
      { pubkey: reserved, isSigner: false, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    data,
  });
  const signature = await sendAndConfirmTransaction(connection, new Transaction().add(instruction), [authority], { commitment: "confirmed" });
  results.push({ handle, reserved: reserved.toBase58(), signature });
}
console.log(JSON.stringify({ network: "mainnet", reserved: results.length, totalRequested: names.length, results }, null, 2));