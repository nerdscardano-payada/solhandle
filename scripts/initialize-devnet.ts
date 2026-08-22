import * as anchor from "@coral-xyz/anchor";
import { Connection, Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { readFileSync } from "node:fs";
import { homedir } from "node:os";

const rpcUrl = "https://api.devnet.solana.com";
const programId = new PublicKey(process.env.SOLHANDLE_PROGRAM_ID || "");
const authorityPath = process.env.SOLHANDLE_AUTHORITY || `${homedir()}/.config/solana/solhandle-devnet.json`;
const collectionUri = "https://devnet.irys.xyz/Cv3wpNeLQeBSizP81zhUjMyDfRUs7pSh1hhzJJATcMRr";
const treasury = new PublicKey("Ak7QZ2xQMAjUsvVB93pZit3e15SSJkiQQeeMiGRdzA8p");
const rewardsVault = new PublicKey("87mU9ddoxUd8Y9wahXWL9fWve2s2krGghjx2HRzmUpPC");

const authority = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(readFileSync(authorityPath, "utf8"))));
const connection = new Connection(rpcUrl, "confirmed");
const provider = new anchor.AnchorProvider(connection, new anchor.Wallet(authority), { commitment: "confirmed" });
const idl = JSON.parse(readFileSync("target/idl/solhandle.json", "utf8"));
const program = new anchor.Program(idl, provider);
const [config] = PublicKey.findProgramAddressSync([Buffer.from("config")], programId);
const [collection] = PublicKey.findProgramAddressSync([Buffer.from("collection")], programId);

if (await connection.getAccountInfo(config, "confirmed")) throw new Error(`Config already exists for ${programId.toBase58()}.`);
if ((await connection.getBalance(authority.publicKey, "confirmed")) < 1_000_000_000) throw new Error("Devnet authority needs at least 1 SOL before initialize.");

const signature = await program.methods.initialize({ collectionUri, treasury, rewardsVault }).accounts({
  authority: authority.publicKey,
  config,
  collection,
  systemProgram: SystemProgram.programId,
  mplCoreProgram: new PublicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d"),
}).rpc();

console.log(JSON.stringify({ programId: programId.toBase58(), config: config.toBase58(), collection: collection.toBase58(), treasury: treasury.toBase58(), rewardsVault: rewardsVault.toBase58(), signature }, null, 2));