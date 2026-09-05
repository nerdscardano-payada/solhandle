import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { Connection, Keypair, PublicKey, SystemProgram, Transaction, TransactionInstruction, sendAndConfirmTransaction } from "@solana/web3.js";

const PROGRAM_ID = new PublicKey("B7xiwfxGcR2Xz7tcUKrkB8Ly6NV8jU7LH1m6GJZRUuf");
const MAINNET_GENESIS = "5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d";
const authorityPath = process.env.SOLHANDLE_AUTHORITY || `${homedir()}/.config/solana/solhandle-mainnet-authority.json`;
const rpcUrl = process.env.SOLANA_RPC_URL;
const inputPath = process.env.PREMIUM_HANDLES_FILE;
if (!rpcUrl || !inputPath) throw new Error("Set SOLANA_RPC_URL and PREMIUM_HANDLES_FILE.");

const connection = new Connection(rpcUrl, "confirmed");
if (await connection.getGenesisHash() !== MAINNET_GENESIS) throw new Error("Refusing non-mainnet RPC.");
const authority = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(readFileSync(authorityPath, "utf8"))));
const [config] = PublicKey.findProgramAddressSync([Buffer.from("config")], PROGRAM_ID);
const configInfo = await connection.getAccountInfo(config, "confirmed");
if (!configInfo || !new PublicKey(configInfo.data.subarray(8, 40)).equals(authority.publicKey)) throw new Error("Wrong protocol authority.");

const raw = readFileSync(inputPath, "utf8").trim();
const values = raw.startsWith("[")
  ? JSON.parse(raw).map((item) => typeof item === "string" ? item : item.handle)
  : raw.split(/\r?\n/).slice(raw.toLowerCase().startsWith("handle") ? 1 : 0).map((line) => line.split(",")[0]);
const handles = [...new Set(values.map((value) => String(value || "").trim().replace(/^@/, "").toLowerCase()).filter((value) => /^[a-z0-9]{1,20}$/.test(value)))];
if (!handles.length) throw new Error("No valid premium handles found.");

const discriminator = createHash("sha256").update("global:set_premium_status").digest().subarray(0, 8);
const encodeString = (value) => { const text = Buffer.from(value); const size = Buffer.alloc(4); size.writeUInt32LE(text.length); return Buffer.concat([size, text]); };
let migrated = 0;
let skipped = 0;

for (let offset = 0; offset < handles.length; offset += 8) {
  const batch = handles.slice(offset, offset + 8);
  const transaction = new Transaction();
  for (const handle of batch) {
    const [premium] = PublicKey.findProgramAddressSync([Buffer.from("premium"), Buffer.from(handle)], PROGRAM_ID);
    const existing = await connection.getAccountInfo(premium, "confirmed");
    if (existing?.owner.equals(PROGRAM_ID) && existing.data[8] === 1) { skipped += 1; continue; }
    transaction.add(new TransactionInstruction({
      programId: PROGRAM_ID,
      keys: [
        { pubkey: authority.publicKey, isSigner: true, isWritable: true },
        { pubkey: config, isSigner: false, isWritable: false },
        { pubkey: premium, isSigner: false, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }
      ],
      data: Buffer.concat([discriminator, encodeString(handle), Buffer.from([1])])
    }));
  }
  if (transaction.instructions.length) {
    await sendAndConfirmTransaction(connection, transaction, [authority], { commitment: "confirmed", maxRetries: 8 });
    migrated += transaction.instructions.length;
  }
  console.log(`${Math.min(offset + batch.length, handles.length)}/${handles.length} checked; ${migrated} migrated; ${skipped} already active`);
  await new Promise((resolve) => setTimeout(resolve, 500));
}
console.log(JSON.stringify({ premiumHandles: handles.length, migrated, skipped, complete: true }, null, 2));