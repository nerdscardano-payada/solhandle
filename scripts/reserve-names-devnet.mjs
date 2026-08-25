// Creates the SolHandle NameRestriction PDAs on Devnet for the full current test list.
// Safe to rerun: existing restriction PDAs are skipped.
import { Connection, Keypair, PublicKey, SystemProgram, Transaction, TransactionInstruction, sendAndConfirmTransaction } from "@solana/web3.js";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { DEFAULT_PROTECTED_NAMES, DEFAULT_RESERVED_NAMES } from "./name-restrictions.mjs";

const programIdText = process.env.SOLHANDLE_PROGRAM_ID;
if (!programIdText) throw new Error("SOLHANDLE_PROGRAM_ID is required.");
const authorityPath = process.env.SOLHANDLE_AUTHORITY || `${homedir()}/.config/solana/solhandle-devnet.json`;
const rpcUrl = process.env.SOLANA_RPC_URL || "https://api.devnet.solana.com";
const defaults = { reserved: DEFAULT_RESERVED_NAMES, protected: DEFAULT_PROTECTED_NAMES };
const parse = (value, type) => String(value).split(",").map((entry) => {
  const [rawHandle, reservedFor] = entry.trim().split("|");
  const handle = rawHandle.trim().replace(/^@+/, "").toLowerCase();
  return { handle, reservedFor: reservedFor || (type === 0 ? handle : "Trademark / Brand"), type };
}).filter((item) => item.handle);
const names = [...parse(process.env.RESERVED_NAMES ?? defaults.reserved, 0), ...parse(process.env.PROTECTED_NAMES ?? defaults.protected, 1)];
const forceUpdateNames = new Set(String(process.env.FORCE_UPDATE_NAMES || "").split(",").map((handle) => handle.trim().replace(/^@+/, "").toLowerCase()).filter(Boolean));
const programId = new PublicKey(programIdText);
const authority = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(readFileSync(authorityPath, "utf8"))));
const connection = new Connection(rpcUrl, "confirmed");
const ITEM_DELAY_MS = 15000;
const RETRY_BASE_DELAY_MS = 15000;
const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const isRetryableRpcError = (error) => /429|Too Many Requests|Blockhash not found|blockhash expired|fetch failed|timeout/i.test(String(error?.message || error));
const rpcWithRetry = async (operation, maxAttempts = 8) => {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      if (!isRetryableRpcError(error) || attempt === maxAttempts) throw error;
      const delay = RETRY_BASE_DELAY_MS * attempt;
      console.warn(`RPC tijdelijk begrensd; nieuwe poging ${attempt + 1}/${maxAttempts} over ${delay / 1000}s...`);
      await sleep(delay);
    }
  }
};
const [config] = PublicKey.findProgramAddressSync([Buffer.from("config")], programId);
const encoder = new TextEncoder();
const stringBytes = (value) => {
  const text = encoder.encode(value);
  const size = new Uint8Array(4);
  new DataView(size.buffer).setUint32(0, text.length, true);
  return Uint8Array.from([...size, ...text]);
};
const discriminator = createHash("sha256").update("global:set_name_restriction").digest().subarray(0, 8);

const configInfo = await rpcWithRetry(() => connection.getAccountInfo(config, "confirmed"));
if (!configInfo || !configInfo.owner.equals(programId)) throw new Error("No initialized SolHandle V2 Config was found for this Devnet program ID.");

const sendWithRetry = async (transaction, maxAttempts = 8) => {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await sendAndConfirmTransaction(connection, transaction, [authority], { commitment: "confirmed" });
    } catch (error) {
      if (!isRetryableRpcError(error) || attempt === maxAttempts) throw error;
      const delay = RETRY_BASE_DELAY_MS * attempt;
      console.warn(`Transactie tijdelijk begrensd; nieuwe poging ${attempt + 1}/${maxAttempts} over ${delay / 1000}s...`);
      await sleep(delay);
    }
  }
};

const results = [];
for (const item of names) {
  const [restriction] = PublicKey.findProgramAddressSync([Buffer.from("restriction"), encoder.encode(item.handle)], programId);
  const existed = Boolean(await rpcWithRetry(() => connection.getAccountInfo(restriction, "confirmed")));
  if (existed && !forceUpdateNames.has(item.handle)) {
    results.push({ handle: item.handle, type: item.type === 0 ? "RESERVED" : "PROTECTED", status: "skipped", restriction: restriction.toBase58() });
    console.log(`@${item.handle}: bestaat al; volgende controle over ${ITEM_DELAY_MS / 1000}s.`);
    await sleep(ITEM_DELAY_MS);
    continue;
  }
  if (existed) console.log(`@${item.handle}: bestaande restrictie wordt bijgewerkt naar ${item.type === 0 ? "RESERVED" : "PROTECTED"}.`);
  const data = Uint8Array.from([...discriminator, ...stringBytes(item.handle), item.type, ...stringBytes(item.reservedFor), 1]);
  const instruction = new TransactionInstruction({ programId, keys: [
    { pubkey: authority.publicKey, isSigner: true, isWritable: true },
    { pubkey: config, isSigner: false, isWritable: false },
    { pubkey: restriction, isSigner: false, isWritable: true },
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }
  ], data });
  const signature = await sendWithRetry(new Transaction().add(instruction));
  results.push({ handle: item.handle, type: item.type === 0 ? "RESERVED" : "PROTECTED", status: "created", restriction: restriction.toBase58(), signature });
  console.log(`@${item.handle}: aangemaakt; volgende naam over ${ITEM_DELAY_MS / 1000}s.`);
  await sleep(ITEM_DELAY_MS);
}

console.log(JSON.stringify({ network: "devnet", restrictions: results.length, created: results.filter((item) => item.status === "created").length, skipped: results.filter((item) => item.status === "skipped").length, results }, null, 2));