import { Connection, PublicKey, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";

const PROGRAM_ID = new PublicKey("FQ5yTNhKMbdTYbAcAD4YjcdwRhsFroYN4UpvXbAFuCK5");
const MPL_CORE = new PublicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");
const connection = new Connection("https://api.devnet.solana.com", "confirmed");

const bytes = (...parts) => Uint8Array.from(parts.flatMap((part) => [...part]));
const stringBytes = (value) => {
  const text = new TextEncoder().encode(value);
  const size = new Uint8Array(4);
  new DataView(size.buffer).setUint32(0, text.length, true);
  return bytes(size, text);
};
const u64Bytes = (value) => {
  const data = new Uint8Array(8);
  new DataView(data.buffer).setBigUint64(0, BigInt(value), true);
  return data;
};

export async function setPrimarySolHandle({ handle, wallet, sendTransaction }) {
  const seed = new TextEncoder().encode(handle);
  const [record] = PublicKey.findProgramAddressSync([new TextEncoder().encode("handle"), seed], PROGRAM_ID);
  const [asset] = PublicKey.findProgramAddressSync([new TextEncoder().encode("asset"), seed], PROGRAM_ID);
  const [primary] = PublicKey.findProgramAddressSync([new TextEncoder().encode("primary"), wallet.toBytes()], PROGRAM_ID);
  const hash = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode("global:set_primary_handle")));
  const instruction = new TransactionInstruction({
    programId: PROGRAM_ID,
    keys: [
      { pubkey: wallet, isSigner: true, isWritable: true }, { pubkey: record, isSigner: false, isWritable: false },
      { pubkey: asset, isSigner: false, isWritable: false }, { pubkey: primary, isSigner: false, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }
    ],
    data: bytes(hash.slice(0, 8), stringBytes(handle))
  });
  const { blockhash } = await connection.getLatestBlockhash("confirmed");
  const transaction = new Transaction({ feePayer: wallet, recentBlockhash: blockhash }).add(instruction);
  const signature = await sendTransaction(transaction, connection);
  await connection.confirmTransaction(signature, "confirmed");
  return { signature };
}

export async function mintSolHandle({ handle, uri, maxPriceLamports, wallet, sendTransaction }) {
  const [config] = PublicKey.findProgramAddressSync([new TextEncoder().encode("config")], PROGRAM_ID);
  const configInfo = await connection.getAccountInfo(config, "confirmed");
  if (!configInfo) throw new Error("SolHandle is not initialized on Devnet.");
  const collection = new PublicKey(configInfo.data.slice(40, 72));
  const treasury = new PublicKey(configInfo.data.slice(72, 104));
  const seed = new TextEncoder().encode(handle);
  const [record] = PublicKey.findProgramAddressSync([new TextEncoder().encode("handle"), seed], PROGRAM_ID);
  const [asset] = PublicKey.findProgramAddressSync([new TextEncoder().encode("asset"), seed], PROGRAM_ID);
  const [reserved] = PublicKey.findProgramAddressSync([new TextEncoder().encode("reserved"), seed], PROGRAM_ID);
  const [price] = PublicKey.findProgramAddressSync([new TextEncoder().encode("price"), seed], PROGRAM_ID);
  const hash = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode("global:mint_handle")));
  const instruction = new TransactionInstruction({
    programId: PROGRAM_ID,
    keys: [
      { pubkey: wallet, isSigner: true, isWritable: true }, { pubkey: config, isSigner: false, isWritable: true },
      { pubkey: record, isSigner: false, isWritable: true }, { pubkey: asset, isSigner: false, isWritable: true },
      { pubkey: reserved, isSigner: false, isWritable: false }, { pubkey: price, isSigner: false, isWritable: false },
      { pubkey: collection, isSigner: false, isWritable: true }, { pubkey: treasury, isSigner: false, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }, { pubkey: MPL_CORE, isSigner: false, isWritable: false }
    ],
    data: bytes(hash.slice(0, 8), stringBytes(handle), stringBytes(uri), u64Bytes(maxPriceLamports))
  });
  const { blockhash } = await connection.getLatestBlockhash("confirmed");
  const transaction = new Transaction({ feePayer: wallet, recentBlockhash: blockhash }).add(instruction);
  const signature = await sendTransaction(transaction, connection);
  await connection.confirmTransaction(signature, "confirmed");
  return { signature, asset: asset.toBase58() };
}