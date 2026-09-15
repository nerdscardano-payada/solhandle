import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { Connection, Keypair, PublicKey, SystemProgram, Transaction, TransactionInstruction, sendAndConfirmTransaction } from "@solana/web3.js";

const PROGRAM_ID = new PublicKey("B7xiwfxGcR2Xz7tcUKrkB8Ly6NV8jU7LH1m6GJZRUuf");
const MAINNET_GENESIS = "5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d";
const PRICES = [300_000_000, 200_000_000, 100_000_000, 50_000_000, 10_000_000];
const authorityPath = process.env.SOLHANDLE_AUTHORITY || `${homedir()}/.config/solana/solhandle-mainnet-authority.json`;
const rpcUrl = process.env.SOLANA_RPC_URL;
if (!rpcUrl) throw new Error("Set SOLANA_RPC_URL to the private Mainnet RPC.");

const u64 = (value) => { const data = Buffer.alloc(8); data.writeBigUInt64LE(BigInt(value)); return data; };
const discriminator = (name) => createHash("sha256").update(`global:${name}`).digest().subarray(0, 8);
const connection = new Connection(rpcUrl, "confirmed");
if (await connection.getGenesisHash() !== MAINNET_GENESIS) throw new Error("Refusing non-mainnet RPC.");

const authority = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(readFileSync(authorityPath, "utf8"))));
const [config] = PublicKey.findProgramAddressSync([Buffer.from("config")], PROGRAM_ID);
const [rush] = PublicKey.findProgramAddressSync([Buffer.from("rush")], PROGRAM_ID);
const [configInfo, rushInfo] = await Promise.all([
  connection.getAccountInfo(config, "confirmed"),
  connection.getAccountInfo(rush, "confirmed")
]);
if (!configInfo || configInfo.data.length !== 187) throw new Error("Invalid SolHandle Mainnet config.");
if (!new PublicKey(configInfo.data.subarray(8, 40)).equals(authority.publicKey)) throw new Error("Wrong protocol authority.");

const transaction = new Transaction().add(new TransactionInstruction({
  programId: PROGRAM_ID,
  keys: [
    { pubkey: authority.publicKey, isSigner: true, isWritable: false },
    { pubkey: config, isSigner: false, isWritable: true }
  ],
  data: Buffer.concat([discriminator("set_prices"), ...PRICES.map(u64)])
}));

if (rushInfo) {
  const now = Math.floor(Date.now() / 1000);
  const disabledRushData = Buffer.concat([
    discriminator("set_rush_config"), Buffer.from([0]), u64(now), u64(now + 1), u64(1), u64(10_000), u64(0)
  ]);
  transaction.add(new TransactionInstruction({
    programId: PROGRAM_ID,
    keys: [
      { pubkey: authority.publicKey, isSigner: true, isWritable: true },
      { pubkey: config, isSigner: false, isWritable: false },
      { pubkey: rush, isSigner: false, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }
    ],
    data: disabledRushData
  }));
}

const signature = await sendAndConfirmTransaction(connection, transaction, [authority], { commitment: "confirmed", maxRetries: 8 });
const updated = await connection.getAccountInfo(config, "confirmed");
const actualPrices = PRICES.map((_, index) => Number(updated.data.readBigUInt64LE(136 + index * 8)));
if (actualPrices.some((price, index) => price !== PRICES[index])) throw new Error(`Price verification failed: ${actualPrices.join(",")}`);
console.log(JSON.stringify({
  network: "mainnet-beta",
  signature,
  rushDisabled: Boolean(rushInfo),
  pricesSol: actualPrices.map((price) => price / 1_000_000_000),
  premiumSurchargeSol: 0.10,
  verified: true
}, null, 2));