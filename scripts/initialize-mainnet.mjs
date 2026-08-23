import { Connection, Keypair, PublicKey, SystemProgram, Transaction, TransactionInstruction, sendAndConfirmTransaction } from "@solana/web3.js";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const programIdText = process.env.SOLHANDLE_PROGRAM_ID;
if (!programIdText) throw new Error("SOLHANDLE_PROGRAM_ID is required.");
const authorityPath = process.env.SOLHANDLE_AUTHORITY;
if (!authorityPath) throw new Error("SOLHANDLE_AUTHORITY is required.");
const collectionUri = process.env.SOLHANDLE_COLLECTION_URI;
if (!collectionUri) throw new Error("SOLHANDLE_COLLECTION_URI is required (upload collection metadata to Irys mainnet first).");
const treasuryEnv = process.env.SOLHANDLE_TREASURY;
const rewardsEnv = process.env.SOLHANDLE_REWARDS_VAULT;
if (!treasuryEnv || !rewardsEnv) throw new Error("SOLHANDLE_TREASURY and SOLHANDLE_REWARDS_VAULT are required.");

const rpcUrl = process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com";
const mplCore = new PublicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");
const programId = new PublicKey(programIdText);
const authority = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(readFileSync(authorityPath, "utf8"))));
const treasury = new PublicKey(treasuryEnv);
const rewardsVault = new PublicKey(rewardsEnv);
const connection = new Connection(rpcUrl, "confirmed");
const [config] = PublicKey.findProgramAddressSync([Buffer.from("config")], programId);
const [collection] = PublicKey.findProgramAddressSync([Buffer.from("collection")], programId);

if (await connection.getAccountInfo(config, "confirmed")) throw new Error("A Config already exists for this program ID.");
const balance = await connection.getBalance(authority.publicKey, "confirmed");
if (balance < 100_000_000) throw new Error(`The mainnet authority needs at least 0.1 SOL for initialize (has ${balance / 1e9} SOL).`);

const uri = Buffer.from(collectionUri, "utf8");
const uriLength = Buffer.alloc(4); uriLength.writeUInt32LE(uri.length);
const discriminator = createHash("sha256").update("global:initialize").digest().subarray(0, 8);
const data = Buffer.concat([discriminator, uriLength, uri, treasury.toBuffer(), rewardsVault.toBuffer()]);
const instruction = new TransactionInstruction({
  programId,
  keys: [
    { pubkey: authority.publicKey, isSigner: true, isWritable: true },
    { pubkey: config, isSigner: false, isWritable: true },
    { pubkey: collection, isSigner: false, isWritable: true },
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    { pubkey: mplCore, isSigner: false, isWritable: false },
  ],
  data,
});
const signature = await sendAndConfirmTransaction(connection, new Transaction().add(instruction), [authority], { commitment: "confirmed" });
console.log(JSON.stringify({
  network: "mainnet",
  programId: programId.toBase58(),
  config: config.toBase58(),
  collection: collection.toBase58(),
  treasury: treasury.toBase58(),
  rewardsVault: rewardsVault.toBase58(),
  pausedByDefault: true,
  signature,
}, null, 2));