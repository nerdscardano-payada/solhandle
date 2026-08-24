import { Connection, Keypair, PublicKey, SystemProgram, Transaction, TransactionInstruction, sendAndConfirmTransaction } from "@solana/web3.js";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { LEGACY_NAMES_TO_RELEASE } from "./name-restrictions.mjs";

const programIdText = process.env.SOLHANDLE_PROGRAM_ID;
if (!programIdText) throw new Error("SOLHANDLE_PROGRAM_ID is required.");
const authorityPath = process.env.SOLHANDLE_AUTHORITY || `${homedir()}/.config/solana/solhandle-devnet.json`;
const rpcUrl = process.env.SOLANA_RPC_URL || "https://api.devnet.solana.com";
const programId = new PublicKey(programIdText);
const authority = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(readFileSync(authorityPath, "utf8"))));
const connection = new Connection(rpcUrl, "confirmed");
const [config] = PublicKey.findProgramAddressSync([Buffer.from("config")], programId);
const encoder = new TextEncoder();
const discriminator = createHash("sha256").update("global:set_name_restriction").digest().subarray(0, 8);
const stringBytes = (value) => { const text = encoder.encode(value); const size = new Uint8Array(4); new DataView(size.buffer).setUint32(0, text.length, true); return Uint8Array.from([...size, ...text]); };
const results = [];

for (const handle of LEGACY_NAMES_TO_RELEASE) {
  const [restriction] = PublicKey.findProgramAddressSync([Buffer.from("restriction"), encoder.encode(handle)], programId);
  if (!await connection.getAccountInfo(restriction, "confirmed")) { results.push({ handle, status: "absent" }); continue; }
  const data = Uint8Array.from([...discriminator, ...stringBytes(handle), 1, ...stringBytes("Legacy baseline release"), 0]);
  const instruction = new TransactionInstruction({ programId, keys: [
    { pubkey: authority.publicKey, isSigner: true, isWritable: true }, { pubkey: config, isSigner: false, isWritable: false },
    { pubkey: restriction, isSigner: false, isWritable: true }, { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }
  ], data });
  const signature = await sendAndConfirmTransaction(connection, new Transaction().add(instruction), [authority], { commitment: "confirmed" });
  results.push({ handle, status: "released", restriction: restriction.toBase58(), signature });
}
console.log(JSON.stringify({ checked: results.length, released: results.filter((item) => item.status === "released").length, results }, null, 2));