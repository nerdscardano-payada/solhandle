import { Connection, Keypair, PublicKey, Transaction, TransactionInstruction, sendAndConfirmTransaction } from "@solana/web3.js";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { homedir } from "node:os";

const programIdText = process.env.SOLHANDLE_PROGRAM_ID;
if (!programIdText) throw new Error("SOLHANDLE_PROGRAM_ID is required.");
const authorityPath = process.env.SOLHANDLE_AUTHORITY || `${homedir()}/.config/solana/solhandle-devnet.json`;
const rpcUrl = process.env.SOLANA_RPC_URL || "https://api.devnet.solana.com";
const programId = new PublicKey(programIdText);
const authority = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(readFileSync(authorityPath, "utf8"))));
const connection = new Connection(rpcUrl, "confirmed");
const [config] = PublicKey.findProgramAddressSync([Buffer.from("config")], programId);
const configInfo = await connection.getAccountInfo(config, "confirmed");
if (!configInfo || !configInfo.owner.equals(programId)) throw new Error("No initialized SolHandle V2 Config was found for this Devnet program ID.");
if (configInfo.data[184] !== 1) {
  console.log(JSON.stringify({ programId: programId.toBase58(), config: config.toBase58(), paused: false, status: "already_live" }, null, 2));
  process.exit(0);
}
const data = createHash("sha256").update("global:set_paused").digest().subarray(0, 8);
const instruction = new TransactionInstruction({
  programId,
  keys: [
    { pubkey: authority.publicKey, isSigner: true, isWritable: false },
    { pubkey: config, isSigner: false, isWritable: true }
  ],
  data: Buffer.concat([data, Buffer.from([0])])
});
const signature = await sendAndConfirmTransaction(connection, new Transaction().add(instruction), [authority], { commitment: "confirmed" });
console.log(JSON.stringify({ programId: programId.toBase58(), config: config.toBase58(), paused: false, signature }, null, 2));