import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { Connection, Keypair, PublicKey, SystemProgram, Transaction, TransactionInstruction, sendAndConfirmTransaction } from "@solana/web3.js";

const PROGRAM_ID = new PublicKey("B7xiwfxGcR2Xz7tcUKrkB8Ly6NV8jU7LH1m6GJZRUuf");
const MAINNET_GENESIS = "5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d";
const authorityPath = process.env.SOLHANDLE_AUTHORITY || `${homedir()}/.config/solana/solhandle-mainnet-authority.json`;
const rpcUrl = process.env.SOLANA_RPC_URL;
if (!rpcUrl) throw new Error("Set SOLANA_RPC_URL to the private Mainnet RPC.");

const connection = new Connection(rpcUrl, "confirmed");
if (await connection.getGenesisHash() !== MAINNET_GENESIS) throw new Error("Refusing non-mainnet RPC.");
const authority = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(readFileSync(authorityPath, "utf8"))));
const [config] = PublicKey.findProgramAddressSync([Buffer.from("config")], PROGRAM_ID);
const [rush] = PublicKey.findProgramAddressSync([Buffer.from("rush")], PROGRAM_ID);
const configInfo = await connection.getAccountInfo(config, "confirmed");
if (!configInfo || !new PublicKey(configInfo.data.subarray(8, 40)).equals(authority.publicKey)) throw new Error("Wrong protocol authority.");

const now = Math.floor(Date.now() / 1000);
const durationSeconds = 72 * 60 * 60;
const startAt = now + 120;
const endAt = startAt + durationSeconds;
const u64 = (value) => { const data = Buffer.alloc(8); data.writeBigUInt64LE(BigInt(value)); return data; };
const i64 = (value) => { const data = Buffer.alloc(8); data.writeBigInt64LE(BigInt(value)); return data; };
const discriminator = createHash("sha256").update("global:set_rush_config").digest().subarray(0, 8);
const data = Buffer.concat([
  discriminator,
  Buffer.from([1]),
  i64(startAt),
  i64(endAt),
  u64(100_000_000),
  u64(5_000),
  u64(500_000_000)
]);
const instruction = new TransactionInstruction({
  programId: PROGRAM_ID,
  keys: [
    { pubkey: authority.publicKey, isSigner: true, isWritable: true },
    { pubkey: config, isSigner: false, isWritable: false },
    { pubkey: rush, isSigner: false, isWritable: true },
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }
  ],
  data
});

console.log(JSON.stringify({ startsAt: new Date(startAt * 1000).toISOString(), endsAt: new Date(endAt * 1000).toISOString(), standardPriceSol: 0.1, shortDiscount: "50%", premiumSurchargeSol: 0.5 }, null, 2));
const signature = await sendAndConfirmTransaction(connection, new Transaction().add(instruction), [authority], { commitment: "confirmed", maxRetries: 8 });
console.log(JSON.stringify({ signature, rushPda: rush.toBase58(), startsAt: new Date(startAt * 1000).toISOString(), endsAt: new Date(endAt * 1000).toISOString() }, null, 2));