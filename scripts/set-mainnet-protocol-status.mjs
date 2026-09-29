import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { Connection, Keypair, PublicKey, SystemProgram, Transaction, TransactionInstruction, sendAndConfirmTransaction } from "@solana/web3.js";

const PROGRAM_ID = new PublicKey("B7xiwfxGcR2Xz7tcUKrkB8Ly6NV8jU7LH1m6GJZRUuf");
const MAINNET_GENESIS_HASH = "5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d";
const authorityPath = process.env.SOLHANDLE_AUTHORITY || `${homedir()}/.config/solana/solhandle-mainnet-authority.json`;
const rpcUrl = process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com";
const requestedStatus = process.argv[2];

if (!new Set(["active", "paused", "token-paused", "token-active"]).has(requestedStatus)) throw new Error("Usage: node scripts/set-mainnet-protocol-status.mjs active|paused|token-paused|token-active");

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

if (requestedStatus.startsWith("token-")) {
  const enabled = requestedStatus === "token-active";
  if (enabled && process.env.SOLHANDLE_ENABLE_TOKEN_PAYMENTS !== "YES") throw new Error("Token payments require explicit SOLHANDLE_ENABLE_TOKEN_PAYMENTS=YES after full testing.");
  const mint = new PublicKey("BLoVgMLRxxhq3X5x9s7KxaNhnQeMf5Lt7MrEpBkjpump");
  const signer = new PublicKey(process.env.SOLHANDLE_QUOTE_SIGNER_PUBKEY || "");
  const treasuryToken = new PublicKey(process.env.SOLHANDLE_TOKEN_TREASURY || "");
  const tokenAccount = await connection.getParsedAccountInfo(treasuryToken, "confirmed");
  const parsed = tokenAccount.value?.data?.parsed;
  if (parsed?.type !== "account" || parsed.info.mint !== mint.toBase58() || parsed.info.owner !== new PublicKey(configInfo.data.subarray(72, 104)).toBase58()) throw new Error("Treasury token account must hold official $HANDLE and belong to the configured treasury.");
  const [paymentConfig] = PublicKey.findProgramAddressSync([Buffer.from("token_payment")], PROGRAM_ID);
  const discriminator = createHash("sha256").update("global:configure_token_payments").digest().subarray(0, 8);
  const instruction = new TransactionInstruction({
    programId: PROGRAM_ID,
    keys: [
      { pubkey: authority.publicKey, isSigner: true, isWritable: true },
      { pubkey: config, isSigner: false, isWritable: false },
      { pubkey: paymentConfig, isSigner: false, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }
    ],
    data: Buffer.concat([discriminator, Buffer.from([enabled ? 1 : 0]), mint.toBuffer(), signer.toBuffer(), treasuryToken.toBuffer()])
  });
  const signature = await sendAndConfirmTransaction(connection, new Transaction().add(instruction), [authority], { commitment: "confirmed" });
  const updated = await connection.getAccountInfo(paymentConfig, "confirmed");
  if (!updated?.owner.equals(PROGRAM_ID) || updated.data.length !== 106 || updated.data[8] !== (enabled ? 1 : 0) || !updated.data.subarray(9, 41).equals(mint.toBuffer()) || !updated.data.subarray(41, 73).equals(signer.toBuffer()) || !updated.data.subarray(73, 105).equals(treasuryToken.toBuffer())) throw new Error("Token payment configuration could not be verified on-chain.");
  console.log(JSON.stringify({ network: "mainnet-beta", paymentConfig: paymentConfig.toBase58(), enabled, signature, verified: true }, null, 2));
  process.exit(0);
}

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