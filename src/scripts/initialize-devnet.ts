import * as anchor from "@coral-xyz/anchor";
import { Connection, Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const RPC_URL = "https://api.devnet.solana.com";
const PROGRAM_ID = new PublicKey("FQ5yTNhKMbdTYbAcAD4YjcdwRhsFroYN4UpvXbAFuCK5");
const MPL_CORE_PROGRAM = new PublicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");
const COLLECTION_URI = "https://gateway.irys.xyz/Cv3wpNeLQeBSizP81zhUjMyDfRUs7pSh1hhzJJATcMRr";
const TREASURY = new PublicKey("Ak7QZ2xQMAjUsvVB93pZit3e15SSJkiQQeeMiGRdzA8p");
const REWARDS_VAULT = new PublicKey("87mU9ddoxUd8Y9wahXWL9fWve2s2krGghjx2HRzmUpPC");

const keypairPath = join(homedir(), ".config/solana/solhandle-devnet.json");
const authority = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(readFileSync(keypairPath, "utf8"))));
const connection = new Connection(RPC_URL, "confirmed");
const provider = new anchor.AnchorProvider(connection, new anchor.Wallet(authority), { commitment: "confirmed" });
const idl = JSON.parse(readFileSync("target/idl/solhandle.json", "utf8"));
const program = new anchor.Program(idl, provider);

const [config] = PublicKey.findProgramAddressSync([Buffer.from("config")], PROGRAM_ID);
const [collection] = PublicKey.findProgramAddressSync([Buffer.from("collection")], PROGRAM_ID);

const balance = await connection.getBalance(authority.publicKey);
if (balance < 100_000_000) throw new Error("The SolHandle Devnet authority needs at least 0.1 SOL.");

const signature = await program.methods
  .initialize({ collectionUri: COLLECTION_URI, treasury: TREASURY, rewardsVault: REWARDS_VAULT })
  .accounts({
    authority: authority.publicKey,
    config,
    collection,
    systemProgram: SystemProgram.programId,
    mplCoreProgram: MPL_CORE_PROGRAM,
  })
  .rpc();

console.log("SolHandle initialized on Devnet.");
console.log("Authority:", authority.publicKey.toBase58());
console.log("Config PDA:", config.toBase58());
console.log("Collection:", collection.toBase58());
console.log("Transaction:", `https://explorer.solana.com/tx/${signature}?cluster=devnet`);