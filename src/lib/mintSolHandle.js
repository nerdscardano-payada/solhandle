import { PublicKey, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
import { base44 } from "@/api/base44Client";
import { PROGRAM_ID, SEEDS } from "@/lib/solhandleProtocol";
import { getReferralAttributionId } from "@/lib/referralAttribution";

const MPL_CORE = new PublicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");
const encoder = new TextEncoder();
const bytes = (...parts) => Uint8Array.from(parts.flatMap((part) => [...part]));
const stringBytes = (value) => {
  const text = encoder.encode(value);
  const size = new Uint8Array(4);
  new DataView(size.buffer).setUint32(0, text.length, true);
  return bytes(size, text);
};
const u64Bytes = (value) => {
  const data = new Uint8Array(8);
  new DataView(data.buffer).setBigUint64(0, BigInt(value), true);
  return data;
};
const seedBytes = (seed) => encoder.encode(seed);
const instructionHash = async (name) => new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(`global:${name}`)));

export async function setPrimarySolHandle({ handle, wallet, signTransaction }) {
  const prepared = await base44.functions.invoke("solanaMintTransaction", { action: "prepare_primary", handle });
  const protocol = prepared.data;
  const seed = encoder.encode(handle);
  const [record] = PublicKey.findProgramAddressSync([seedBytes(SEEDS.handle), seed], PROGRAM_ID);
  const [asset] = PublicKey.findProgramAddressSync([seedBytes(SEEDS.asset), seed], PROGRAM_ID);
  const [primary] = PublicKey.findProgramAddressSync([seedBytes(SEEDS.primary), wallet.toBytes()], PROGRAM_ID);
  const hash = await instructionHash("set_primary_handle");
  const instruction = new TransactionInstruction({
    programId: PROGRAM_ID,
    keys: [
      { pubkey: wallet, isSigner: true, isWritable: true }, { pubkey: record, isSigner: false, isWritable: false },
      { pubkey: asset, isSigner: false, isWritable: false }, { pubkey: primary, isSigner: false, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }
    ],
    data: bytes(hash.slice(0, 8), stringBytes(handle))
  });
  if (!signTransaction) throw new Error("This wallet cannot sign Solana transactions.");
  const transaction = new Transaction({ feePayer: wallet, recentBlockhash: protocol.blockhash }).add(instruction);
  const signed = await signTransaction(transaction);
  const transactionBase64 = btoa(String.fromCharCode(...signed.serialize()));
  const submitted = await base44.functions.invoke("solanaMintTransaction", { action: "submit_primary", transaction_base64: transactionBase64 });
  return { signature: submitted.data.signature };
}

export async function claimRestrictedSolHandle({ handle, uri, recipientWallet, wallet, signTransaction }) {
  const recipient = new PublicKey(recipientWallet);
  const prepared = await base44.functions.invoke("solanaAdminTransaction", { action: "prepare" });
  const protocol = prepared.data;
  if (protocol.authority !== wallet.toBase58()) throw new Error(`Connect the protocol authority wallet: ${protocol.authority}`);
  const config = new PublicKey(protocol.config);
  const seed = encoder.encode(handle);
  const [restriction] = PublicKey.findProgramAddressSync([seedBytes(SEEDS.restriction), seed], PROGRAM_ID);
  const [record] = PublicKey.findProgramAddressSync([seedBytes(SEEDS.handle), seed], PROGRAM_ID);
  const [asset] = PublicKey.findProgramAddressSync([seedBytes(SEEDS.asset), seed], PROGRAM_ID);
  const hash = await instructionHash("claim_restricted_handle");
  const instruction = new TransactionInstruction({ programId: PROGRAM_ID, keys: [
    { pubkey: wallet, isSigner: true, isWritable: true }, { pubkey: config, isSigner: false, isWritable: true },
    { pubkey: restriction, isSigner: false, isWritable: true }, { pubkey: record, isSigner: false, isWritable: true },
    { pubkey: asset, isSigner: false, isWritable: true }, { pubkey: recipient, isSigner: false, isWritable: false },
    { pubkey: new PublicKey(protocol.collection), isSigner: false, isWritable: true }, { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    { pubkey: MPL_CORE, isSigner: false, isWritable: false }
  ], data: bytes(hash.slice(0, 8), stringBytes(handle), stringBytes(uri)) });
  const transaction = new Transaction({ feePayer: wallet, recentBlockhash: protocol.blockhash }).add(instruction);
  const signed = await signTransaction(transaction);
  const transactionBase64 = btoa(String.fromCharCode(...signed.serialize()));
  const submitted = await base44.functions.invoke("solanaAdminTransaction", { action: "submit", transaction_base64: transactionBase64 });
  return { signature: submitted.data.signature, asset: asset.toBase58() };
}

export async function mintSolHandle({ handle, uri, maxPriceLamports, wallet, signTransaction }) {
  base44.analytics.track({ eventName: "referral_mint_started", properties: { handle } });
  const prepared = await base44.functions.invoke("solanaMintTransaction", { action: "prepare", handle, wallet: wallet.toBase58(), attribution_id: getReferralAttributionId() });
  const protocol = prepared.data;
  const config = new PublicKey(protocol.config);
  const seed = encoder.encode(handle);
  const [record] = PublicKey.findProgramAddressSync([seedBytes(SEEDS.handle), seed], PROGRAM_ID);
  const [asset] = PublicKey.findProgramAddressSync([seedBytes(SEEDS.asset), seed], PROGRAM_ID);
  const [restriction] = PublicKey.findProgramAddressSync([seedBytes(SEEDS.restriction), seed], PROGRAM_ID);
  const [price] = PublicKey.findProgramAddressSync([seedBytes(SEEDS.price), seed], PROGRAM_ID);
  const [rush] = PublicKey.findProgramAddressSync([seedBytes(SEEDS.rush)], PROGRAM_ID);
  const [premium] = PublicKey.findProgramAddressSync([seedBytes(SEEDS.premium), seed], PROGRAM_ID);
  const hash = await instructionHash("mint_handle");
  const instruction = new TransactionInstruction({
    programId: PROGRAM_ID,
    keys: [
      { pubkey: wallet, isSigner: true, isWritable: true }, { pubkey: config, isSigner: false, isWritable: true },
      { pubkey: record, isSigner: false, isWritable: true }, { pubkey: asset, isSigner: false, isWritable: true },
      { pubkey: restriction, isSigner: false, isWritable: false }, { pubkey: price, isSigner: false, isWritable: false },
      { pubkey: rush, isSigner: false, isWritable: false }, { pubkey: premium, isSigner: false, isWritable: false },
      { pubkey: new PublicKey(protocol.collection), isSigner: false, isWritable: true }, { pubkey: new PublicKey(protocol.treasury), isSigner: false, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }, { pubkey: MPL_CORE, isSigner: false, isWritable: false }
    ],
    data: bytes(hash.slice(0, 8), stringBytes(handle), stringBytes(uri), u64Bytes(maxPriceLamports))
  });
  if (!signTransaction) throw new Error("This wallet cannot sign Solana transactions.");
  if (Number(maxPriceLamports) !== Number(protocol.finalPriceLamports)) throw new Error("The handle price changed. Please review the updated price.");
  const transaction = new Transaction({ feePayer: wallet, recentBlockhash: protocol.blockhash }).add(instruction);
  const signed = await signTransaction(transaction);
  const transactionBase64 = btoa(String.fromCharCode(...signed.serialize()));
  base44.analytics.track({ eventName: "referral_mint_submitted", properties: { handle } });
  const submitted = await base44.functions.invoke("solanaMintTransaction", { action: "submit", transaction_base64: transactionBase64, mint_intent_id: protocol.mintIntentId || "" });
  base44.analytics.track({ eventName: "referral_mint_confirmed", properties: { handle } });
  return { signature: submitted.data.signature, asset: asset.toBase58(), mintIntentId: protocol.mintIntentId || "" };
}