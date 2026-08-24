import { Connection, PublicKey, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
import { decodeSolHandleConfig, PROGRAM_ID, PROTOCOL_VERSION, SEEDS } from "@/lib/solhandleProtocol";

const MPL_CORE = new PublicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");
const connection = new Connection("https://api.devnet.solana.com", "confirmed");
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

export async function setPrimarySolHandle({ handle, wallet, sendTransaction }) {
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
  const { blockhash } = await connection.getLatestBlockhash("confirmed");
  const signature = await sendTransaction(new Transaction({ feePayer: wallet, recentBlockhash: blockhash }).add(instruction), connection);
  await connection.confirmTransaction(signature, "confirmed");
  return { signature };
}

export async function mintSolHandle({ handle, uri, maxPriceLamports, wallet, sendTransaction }) {
  const [config] = PublicKey.findProgramAddressSync([seedBytes(SEEDS.config)], PROGRAM_ID);
  const configInfo = await connection.getAccountInfo(config, "confirmed");
  if (!configInfo || !configInfo.owner.equals(PROGRAM_ID)) throw new Error("SolHandle V2 is not initialized on Solana Devnet.");
  const protocol = decodeSolHandleConfig(configInfo.data);
  if (protocol.protocolVersion !== PROTOCOL_VERSION) throw new Error(`Protocol version mismatch: website expects V${PROTOCOL_VERSION}.`);
  if (protocol.paused) throw new Error("SolHandle minting is currently paused.");
  const seed = encoder.encode(handle);
  const [record] = PublicKey.findProgramAddressSync([seedBytes(SEEDS.handle), seed], PROGRAM_ID);
  const [asset] = PublicKey.findProgramAddressSync([seedBytes(SEEDS.asset), seed], PROGRAM_ID);
  const [restriction] = PublicKey.findProgramAddressSync([seedBytes(SEEDS.restriction), seed], PROGRAM_ID);
  const [price] = PublicKey.findProgramAddressSync([seedBytes(SEEDS.price), seed], PROGRAM_ID);
  const hash = await instructionHash("mint_handle");
  const instruction = new TransactionInstruction({
    programId: PROGRAM_ID,
    keys: [
      { pubkey: wallet, isSigner: true, isWritable: true }, { pubkey: config, isSigner: false, isWritable: true },
      { pubkey: record, isSigner: false, isWritable: true }, { pubkey: asset, isSigner: false, isWritable: true },
      { pubkey: restriction, isSigner: false, isWritable: false }, { pubkey: price, isSigner: false, isWritable: false },
      { pubkey: protocol.collection, isSigner: false, isWritable: true }, { pubkey: protocol.treasury, isSigner: false, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }, { pubkey: MPL_CORE, isSigner: false, isWritable: false }
    ],
    data: bytes(hash.slice(0, 8), stringBytes(handle), stringBytes(uri), u64Bytes(maxPriceLamports))
  });
  const { blockhash } = await connection.getLatestBlockhash("confirmed");
  const signature = await sendTransaction(new Transaction({ feePayer: wallet, recentBlockhash: blockhash }).add(instruction), connection);
  await connection.confirmTransaction(signature, "confirmed");
  return { signature, asset: asset.toBase58() };
}