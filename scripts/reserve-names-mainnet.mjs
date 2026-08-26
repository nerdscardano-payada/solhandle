// Creates on-chain NameRestriction PDAs. A restriction is not an NFT and has no owner.
import { Connection, Keypair, PublicKey, SystemProgram, Transaction, TransactionInstruction, sendAndConfirmTransaction } from "@solana/web3.js";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { DEFAULT_PROTECTED_NAMES, DEFAULT_RESERVED_NAMES } from "./name-restrictions.mjs";

const programIdText = process.env.SOLHANDLE_PROGRAM_ID;
const authorityPath = process.env.SOLHANDLE_AUTHORITY;
if (!programIdText || !authorityPath) throw new Error("SOLHANDLE_PROGRAM_ID and SOLHANDLE_AUTHORITY are required.");
const rpcUrl = process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com";
const defaults = { reserved: DEFAULT_RESERVED_NAMES, protected: DEFAULT_PROTECTED_NAMES };
const parse = (value, type) => String(value).split(",").map((entry) => { const [rawHandle, reservedFor] = entry.trim().split("|"); const handle = rawHandle.trim().replace(/^@+/, "").toLowerCase(); return { handle, reservedFor: reservedFor || (type === 0 ? handle : "Trademark / Brand"), type }; }).filter((item) => item.handle);
const names = [...parse(process.env.RESERVED_NAMES || defaults.reserved, 0), ...parse(process.env.PROTECTED_NAMES || defaults.protected, 1)];
const programId = new PublicKey(programIdText);
const authority = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(readFileSync(authorityPath, "utf8"))));
const connection = new Connection(rpcUrl, "confirmed");
const [config] = PublicKey.findProgramAddressSync([Buffer.from("config")], programId);
const encoder = new TextEncoder();
const stringBytes = (value) => { const text = encoder.encode(value); const size = new Uint8Array(4); new DataView(size.buffer).setUint32(0, text.length, true); return Uint8Array.from([...size, ...text]); };
const discriminator = createHash("sha256").update("global:set_name_restriction").digest().subarray(0, 8);
const results = [];
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const delayMs = Number(process.env.RESTRICTION_DELAY_MS || 8000);
const maxAttempts = Number(process.env.RESTRICTION_MAX_ATTEMPTS || 6);
const accountExists = async (address) => {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return Boolean(await connection.getAccountInfo(address, "confirmed"));
    } catch (error) {
      if (attempt === maxAttempts) throw error;
      await sleep(Math.min(delayMs * attempt, 30000));
    }
  }
};
for (const [index, item] of names.entries()) {
  const [restriction] = PublicKey.findProgramAddressSync([Buffer.from("restriction"), encoder.encode(item.handle)], programId);
  const type = item.type === 0 ? "RESERVED" : "PROTECTED";
  if (await accountExists(restriction)) {
    console.error(`[${index + 1}/${names.length}] @${item.handle} already exists; skipped.`);
    results.push({ handle: item.handle, type, restriction: restriction.toBase58(), status: "existing" });
    await sleep(delayMs);
    continue;
  }
  const data = Uint8Array.from([...discriminator, ...stringBytes(item.handle), item.type, ...stringBytes(item.reservedFor), 1]);
  const instruction = new TransactionInstruction({ programId, keys: [{ pubkey: authority.publicKey, isSigner: true, isWritable: true }, { pubkey: config, isSigner: false, isWritable: false }, { pubkey: restriction, isSigner: false, isWritable: true }, { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }], data });
  let signature;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      signature = await sendAndConfirmTransaction(connection, new Transaction().add(instruction), [authority], { commitment: "confirmed" });
      break;
    } catch (error) {
      if (await accountExists(restriction).catch(() => false)) {
        signature = error.signature || null;
        break;
      }
      if (attempt === maxAttempts) throw error;
      const retryDelay = Math.min(delayMs * attempt, 30000);
      console.error(`[${index + 1}/${names.length}] @${item.handle} attempt ${attempt} failed; retrying in ${retryDelay / 1000}s.`);
      await sleep(retryDelay);
    }
  }
  console.error(`[${index + 1}/${names.length}] @${item.handle} confirmed.`);
  results.push({ handle: item.handle, type, restriction: restriction.toBase58(), signature, status: "confirmed" });
  await sleep(delayMs);
}
console.log(JSON.stringify({ network: "mainnet", restrictions: results.length, results }, null, 2));