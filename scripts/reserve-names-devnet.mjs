// Creates the SolHandle NameRestriction PDAs on Devnet for the full current test list.
// Safe to rerun: existing restriction PDAs are skipped.
import { Connection, Keypair, PublicKey, SystemProgram, Transaction, TransactionInstruction, sendAndConfirmTransaction } from "@solana/web3.js";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { homedir } from "node:os";

const programIdText = process.env.SOLHANDLE_PROGRAM_ID;
if (!programIdText) throw new Error("SOLHANDLE_PROGRAM_ID is required.");
const authorityPath = process.env.SOLHANDLE_AUTHORITY || `${homedir()}/.config/solana/solhandle-devnet.json`;
const rpcUrl = process.env.SOLANA_RPC_URL || "https://api.devnet.solana.com";
const defaults = {
  reserved: "solana|Solana,sol|Solana,solanafoundation|Solana Foundation,solanalabs|Solana Labs,anza|Anza,phantom|Phantom,phantomwallet|Phantom,solflare|Solflare,solflarewallet|Solflare,backpack|Backpack,backpackwallet|Backpack,jupiter|Jupiter,jup|Jupiter,raydium|Raydium,orca|Orca,kamino|Kamino,drift|Drift,meteora|Meteora,jito|Jito,metaplex|Metaplex,magiceden|Magic Eden,tensor|Tensor,helius|Helius,pyth|Pyth,squads|Squads,sns|Bonfida,bonfida|Bonfida,helium|Helium,hivemapper|Hivemapper,rendernetwork|Render Network,pumpfun|pump.fun,bonk|BONK",
  protected: "apple|Trademark / Brand,google|Trademark / Brand,nike|Trademark / Brand,microsoft|Trademark / Brand,amazon|Trademark / Brand,cocacola|Trademark / Brand,facebook|Trademark / Brand,instagram|Trademark / Brand,youtube|Trademark / Brand,whatsapp|Trademark / Brand,tiktok|Trademark / Brand,meta|Trademark / Brand,twitter|Trademark / Brand,openai|Trademark / Brand,chatgpt|Trademark / Brand,bmw|BMW"
};
const parse = (value, type) => String(value).split(",").map((entry) => {
  const [rawHandle, reservedFor] = entry.trim().split("|");
  const handle = rawHandle.toLowerCase();
  return { handle, reservedFor: reservedFor || (type === 0 ? handle : "Trademark / Brand"), type };
}).filter((item) => item.handle);
const names = [...parse(process.env.RESERVED_NAMES || defaults.reserved, 0), ...parse(process.env.PROTECTED_NAMES || defaults.protected, 1)];
const programId = new PublicKey(programIdText);
const authority = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(readFileSync(authorityPath, "utf8"))));
const connection = new Connection(rpcUrl, "confirmed");
const [config] = PublicKey.findProgramAddressSync([Buffer.from("config")], programId);
const encoder = new TextEncoder();
const stringBytes = (value) => {
  const text = encoder.encode(value);
  const size = new Uint8Array(4);
  new DataView(size.buffer).setUint32(0, text.length, true);
  return Uint8Array.from([...size, ...text]);
};
const discriminator = createHash("sha256").update("global:set_name_restriction").digest().subarray(0, 8);

const configInfo = await connection.getAccountInfo(config, "confirmed");
if (!configInfo || !configInfo.owner.equals(programId)) throw new Error("No initialized SolHandle V2 Config was found for this Devnet program ID.");

const results = [];
for (const item of names) {
  const [restriction] = PublicKey.findProgramAddressSync([Buffer.from("restriction"), encoder.encode(item.handle)], programId);
  if (await connection.getAccountInfo(restriction, "confirmed")) {
    results.push({ handle: item.handle, type: item.type === 0 ? "RESERVED" : "PROTECTED", status: "skipped", restriction: restriction.toBase58() });
    continue;
  }
  const data = Uint8Array.from([...discriminator, ...stringBytes(item.handle), item.type, ...stringBytes(item.reservedFor), 1]);
  const instruction = new TransactionInstruction({
    programId,
    keys: [
      { pubkey: authority.publicKey, isSigner: true, isWritable: true },
      { pubkey: config, isSigner: false, isWritable: false },
      { pubkey: restriction, isSigner: false, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }
    ],
    data
  });
  const signature = await sendAndConfirmTransaction(connection, new Transaction().add(instruction), [authority], { commitment: "confirmed" });
  results.push({ handle: item.handle, type: item.type === 0 ? "RESERVED" : "PROTECTED", status: "created", restriction: restriction.toBase58(), signature });
}

console.log(JSON.stringify({ network: "devnet", restrictions: results.length, created: results.filter((item) => item.status === "created").length, skipped: results.filter((item) => item.status === "skipped").length, results }, null, 2));