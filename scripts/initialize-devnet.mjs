import { Connection, Keypair, PublicKey, SystemProgram, Transaction, TransactionInstruction, sendAndConfirmTransaction } from "@solana/web3.js";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { homedir } from "node:os";

const programIdText = process.env.SOLHANDLE_PROGRAM_ID;
if (!programIdText) throw new Error("SOLHANDLE_PROGRAM_ID is required.");
const authorityPath = process.env.SOLHANDLE_AUTHORITY || `${homedir()}/.config/solana/solhandle-devnet.json`;
const rpcUrl = "https://api.devnet.solana.com";
const collectionUri = "https://devnet.irys.xyz/Cv3wpNeLQeBSizP81zhUjMyDfRUs7pSh1hhzJJATcMRr";
const treasury = new PublicKey("Ak7QZ2xQMAjUsvVB93pZit3e15SSJkiQQeeMiGRdzA8p");
const rewardsVault = new PublicKey("87mU9ddoxUd8Y9wahXWL9fWve2s2krGghjx2HRzmUpPC");
const mplCore = new PublicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");
const programId = new PublicKey(programIdText);
const authority = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(readFileSync(authorityPath, "utf8"))));
const connection = new Connection(rpcUrl, "confirmed");
const [config] = PublicKey.findProgramAddressSync([Buffer.from("config")], programId);
const [collection] = PublicKey.findProgramAddressSync([Buffer.from("collection")], programId);
if (await connection.getAccountInfo(config, "confirmed")) throw new Error("A Config already exists for this program ID.");
if ((await connection.getBalance(authority.publicKey, "confirmed")) < 1_000_000_000) throw new Error("The Devnet authority needs at least 1 SOL.");
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
console.log(JSON.stringify({ programId: programId.toBase58(), config: config.toBase58(), collection: collection.toBase58(), treasury: treasury.toBase58(), rewardsVault: rewardsVault.toBase58(), signature }, null, 2));