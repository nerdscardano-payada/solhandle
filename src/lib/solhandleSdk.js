import { Connection, PublicKey, SystemProgram } from "@solana/web3.js";

export const PROGRAM_ID = new PublicKey("ATJutPfzXiYpf7NXaGPEBek69jHaU8Cy85ekUH8drMGT");
export const COLLECTION_ID = new PublicKey("3jiMQX6QJ4qZfKxmFahRinrQGLSog9Z86cymBcnjjV2b");
export const MPL_CORE_ID = new PublicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");
export const DEVNET_RPC = "https://api.devnet.solana.com";
const encoder = new TextEncoder();
const seed = value => encoder.encode(value);
const connectionFor = options => options?.connection || new Connection(options?.rpcUrl || DEVNET_RPC, "confirmed");
export const normalizeHandle = value => String(value || "").trim().replace(/^@+/, "").toLowerCase();
export const validateHandle = value => /^[a-z0-9]{1,20}$/.test(normalizeHandle(value));
export const getHandlePda = value => PublicKey.findProgramAddressSync([seed("handle"), seed(normalizeHandle(value))], PROGRAM_ID)[0];
export const getAssetPda = value => PublicKey.findProgramAddressSync([seed("asset"), seed(normalizeHandle(value))], PROGRAM_ID)[0];
export const getPrimaryHandlePda = wallet => PublicKey.findProgramAddressSync([seed("primary"), new PublicKey(wallet).toBytes()], PROGRAM_ID)[0];
const readU32 = (data, offset) => new DataView(data.buffer, data.byteOffset, data.byteLength).getUint32(offset, true);
const decodeRecord = data => { const length = readU32(data, 8); return { handle: new TextDecoder().decode(data.slice(12, 12 + length)), asset: new PublicKey(data.slice(12 + length, 44 + length)) }; };
const decodeAsset = data => ({ owner: new PublicKey(data.slice(1, 33)), collection: data[33] === 2 ? new PublicKey(data.slice(34, 66)) : null });

async function classifyDestination(connection, address) {
  const info = await connection.getAccountInfo(address, "confirmed"); const onCurve = PublicKey.isOnCurve(address.toBytes());
  if (!info) return { safeForNativeSol: onCurve, destinationType: onCurve ? "UNFUNDED_WALLET" : "REJECTED_PDA" };
  const systemOwned = info.owner.equals(SystemProgram.programId); const safe = onCurve && systemOwned;
  return { safeForNativeSol: safe, destinationType: safe ? "SYSTEM_WALLET" : !onCurve ? "REJECTED_PDA" : "PROGRAM_OWNED_ACCOUNT" };
}
export async function resolveHandle(value, options = {}) {
  const handle = normalizeHandle(value); if (!validateHandle(handle)) throw new Error("Invalid SolHandle.");
  const connection = connectionFor(options); const handlePda = getHandlePda(handle); const assetPda = getAssetPda(handle);
  const [recordInfo, assetInfo] = await connection.getMultipleAccountsInfo([handlePda, assetPda], "confirmed");
  if (!recordInfo) return null;
  if (!recordInfo.owner.equals(PROGRAM_ID) || !assetInfo?.owner.equals(MPL_CORE_ID)) throw new Error("SolHandle verification failed.");
  const record = decodeRecord(recordInfo.data); const asset = decodeAsset(assetInfo.data);
  const collectionVerified = record.handle === handle && record.asset.equals(assetPda) && asset.collection?.equals(COLLECTION_ID);
  if (!collectionVerified) throw new Error("Official collection verification failed.");
  return { handle: `@${handle}`, address: asset.owner.toBase58(), verified: true, collectionVerified: true, ...(await classifyDestination(connection, asset.owner)), handlePda: handlePda.toBase58(), assetAddress: assetPda.toBase58(), network: "devnet" };
}
export const getHandle = resolveHandle;
export const verifySolHandle = async (value, options) => Boolean((await resolveHandle(value, options))?.verified);
export async function isHandleAvailable(value, options = {}) {
  const handle = normalizeHandle(value); if (!validateHandle(handle)) return false;
  const connection = connectionFor(options); const restriction = PublicKey.findProgramAddressSync([seed("restriction"), seed(handle)], PROGRAM_ID)[0];
  const [record, restrictionInfo] = await connection.getMultipleAccountsInfo([getHandlePda(handle), restriction], "confirmed");
  return !record && !(restrictionInfo?.owner.equals(PROGRAM_ID) && restrictionInfo.data[9] === 1);
}
export async function reverseResolve(wallet, options = {}) {
  const address = new PublicKey(wallet); const connection = connectionFor(options); const primaryPda = getPrimaryHandlePda(address);
  const info = await connection.getAccountInfo(primaryPda, "confirmed"); if (!info?.owner.equals(PROGRAM_ID)) return null;
  const length = readU32(info.data, 8); const handle = new TextDecoder().decode(info.data.slice(12, 12 + length));
  const asset = new PublicKey(info.data.slice(12 + length, 44 + length)); const resolved = await resolveHandle(handle, { connection });
  return resolved?.address === address.toBase58() && resolved.assetAddress === asset.toBase58() ? `@${handle}` : null;
}
export const getPrimaryHandle = reverseResolve;
export async function getHandlesByOwner(wallet, options = {}) {
  const owner = new PublicKey(wallet); const connection = connectionFor(options); const accounts = await connection.getProgramAccounts(PROGRAM_ID, { commitment: "confirmed" }); const records = [];
  for (const account of accounts) { try { const record = decodeRecord(account.account.data); if (validateHandle(record.handle) && getHandlePda(record.handle).equals(account.pubkey) && getAssetPda(record.handle).equals(record.asset)) records.push(record); } catch (_) { /* not a HandleRecord */ } }
  const matches = [];
  for (let index = 0; index < records.length; index += 100) { const batch = records.slice(index, index + 100); const assets = await connection.getMultipleAccountsInfo(batch.map(item => item.asset), "confirmed"); assets.forEach((info, offset) => { if (info?.owner.equals(MPL_CORE_ID)) { const asset = decodeAsset(info.data); if (asset.owner.equals(owner) && asset.collection?.equals(COLLECTION_ID)) matches.push(`@${batch[offset].handle}`); } }); }
  return matches;
}