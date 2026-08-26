import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { Connection, Keypair, PublicKey, Transaction, TransactionInstruction, sendAndConfirmTransaction } from "@solana/web3.js";

const PROGRAM_ID = new PublicKey("B7xiwfxGcR2Xz7tcUKrkB8Ly6NV8jU7LH1m6GJZRUuf");
const MAINNET_GENESIS_HASH = "5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp";
const authorityPath = process.env.SOLHANDLE_AUTHORITY || `${homedir()}/.config/solana/solhandle-mainnet-authority.json`;
const rpcUrl = process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com";
const requestedStatus = process.argv[2];

if (!new Set(["active", "paused"]).has(requestedStatus)) throw new Error("Usage: node scripts/set-mainnet-protocol-status.mjs active|paused");

const connection = new Connection(rpcUrl, "confirmed");
const genesisHash = await connection.getGenesisHash();
if (genesisHash !== MAINNET_GENESIS_HASH) throw new Error("Refusing to continue: RPC is not Solana Mainnet-beta.");

const authority = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(readFileSync(authorityPath, "utf8"))));
const [config] = PublicKey.findProgramAddressSync([Buffer.from("config")], PROGRAM_ID);
const configInfo = await connection.getAccountInfo(config, "confirmed");
if (!configInfo || !configInfo.owner.equals(PROGRAM_ID)) throw new Error("SolHandle V2 Mainnet config was not found.");
if (configInfo.data.length !== 187) throw new Error(`Unexpected config size: ${configInfo.data.length}.`);

const configuredAuthority = new PublicKey(configInfo.data.subarray(8, 40));
if (!configuredAuthority.equals(authority.publicKey)) throw new Error(`Wrong authority keypair. Expected ${configuredAuthority.toBase58()}.`);

const paused = requestedStatus === "paused";
if ((configInfo.data[184] === 1) === paused) {
  console.log(JSON.stringify({ network: "mainnet-beta", programId: PROGRAM_ID.toBase58(), authority: authority.publicKey.toBase58(), paused, status: "unchanged" }, null, 2));
  process.exit(0);
}

const discriminator = createHash("sha256").update("global:set_paused").digest().subarray(0, 8);
const instruction = new TransactionInstruction({
  programId: PROGRAM_ID,
  keys: [
    { pubkey: authority.publicKey, isSigner: true, isWritable: false },
    { pubkey: config, isSigner: false, isWritable: true }
  ],
  data: Buffer.concat([discriminator, Buffer.from([paused ? 1 : 0])])
});

const signature = await sendAndConfirmTransaction(connection, new Transaction().add(instruction), [authority], { commitment: "confirmed" });
console.log(JSON.stringify({ network: "mainnet-beta", programId: PROGRAM_ID.toBase58(), authority: authority.publicKey.toBase58(), paused, status: paused ? "paused" : "active", signature }, null, 2));