import { PublicKey } from "npm:@solana/web3.js@1.98.4";
import { rpc } from "./solanaRpc.ts";
import { PROGRAM_ID, SEEDS } from "./solhandleProtocol.ts";

export const MPL_CORE_ID = "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d";
export const COLLECTION_ID = "7XZzcbeFBxQA63n9avz44vnbpv34hDGYyHfCDmTdPBJP";
const SYSTEM_PROGRAM_ID = "11111111111111111111111111111111";
const encoder = new TextEncoder();

export function normalizeHandle(value: string) { return String(value || "").trim().replace(/^@+/, "").toLowerCase(); }
export function validateHandle(value: string) { return /^[a-z0-9]{1,20}$/.test(normalizeHandle(value)); }
function base64Bytes(value: string) { const binary = atob(value); return Uint8Array.from(binary, character => character.charCodeAt(0)); }
function readU32(bytes: Uint8Array, offset: number) { return bytes[offset] | (bytes[offset + 1] << 8) | (bytes[offset + 2] << 16) | (bytes[offset + 3] << 24); }
function key(bytes: Uint8Array) { return new PublicKey(bytes).toBase58(); }
function derive(seed: string, value: Uint8Array) { return PublicKey.findProgramAddressSync([encoder.encode(seed), value], new PublicKey(PROGRAM_ID))[0]; }

function decodeHandleRecord(encoded: string) {
  const bytes = base64Bytes(encoded); const length = readU32(bytes, 8);
  if (length < 1 || length > 20 || bytes.length < 44 + length) throw new Error("Invalid HandleRecord.");
  return { handle: new TextDecoder().decode(bytes.slice(12, 12 + length)), asset: key(bytes.slice(12 + length, 44 + length)) };
}
function decodeCoreAsset(encoded: string) {
  const bytes = base64Bytes(encoded);
  if (bytes.length < 66 || bytes[0] !== 1) throw new Error("Invalid Metaplex Core asset.");
  return { owner: key(bytes.slice(1, 33)), collection: bytes[33] === 2 ? key(bytes.slice(34, 66)) : null };
}
async function classifyNativeSolDestination(rpcUrl: string, address: string) {
  const publicKey = new PublicKey(address); const account = await rpc(rpcUrl, "getAccountInfo", [address, { encoding: "base64", commitment: "confirmed" }]);
  const onCurve = PublicKey.isOnCurve(publicKey.toBytes());
  if (!account?.value) return { safeForNativeSol: onCurve, destinationType: onCurve ? "UNFUNDED_WALLET" : "REJECTED_PDA" };
  const systemOwned = account.value.owner === SYSTEM_PROGRAM_ID; const safe = onCurve && systemOwned;
  return { safeForNativeSol: safe, destinationType: safe ? "SYSTEM_WALLET" : !onCurve ? "REJECTED_PDA" : "PROGRAM_OWNED_ACCOUNT" };
}

export async function resolveOnChain(rpcUrl: string, value: string) {
  const handle = normalizeHandle(value); if (!validateHandle(handle)) throw new Error("Handle must use 1-20 lowercase letters or numbers.");
  const seed = encoder.encode(handle); const handlePda = derive(SEEDS.handle, seed); const assetPda = derive(SEEDS.asset, seed);
  const accounts = await rpc(rpcUrl, "getMultipleAccounts", [[handlePda.toBase58(), assetPda.toBase58()], { encoding: "base64", commitment: "confirmed" }]);
  const [recordInfo, assetInfo] = accounts?.value || [];
  if (!recordInfo?.data?.[0]) return null;
  if (recordInfo.owner !== PROGRAM_ID || !assetInfo?.data?.[0] || assetInfo.owner !== MPL_CORE_ID) throw new Error("SolHandle verification failed.");
  const record = decodeHandleRecord(recordInfo.data[0]); const asset = decodeCoreAsset(assetInfo.data[0]);
  const collectionVerified = record.handle === handle && record.asset === assetPda.toBase58() && asset.collection === COLLECTION_ID;
  if (!collectionVerified) throw new Error("Official collection verification failed.");
  const safety = await classifyNativeSolDestination(rpcUrl, asset.owner);
  return { handle: `@${handle}`, address: asset.owner, status: "claimed", verified: true, collectionVerified, ...safety, handlePda: handlePda.toBase58(), assetAddress: assetPda.toBase58(), network: "mainnet-beta" };
}

export async function reverseOnChain(rpcUrl: string, wallet: string) {
  const owner = new PublicKey(wallet); const primaryPda = derive(SEEDS.primary, owner.toBytes());
  const account = await rpc(rpcUrl, "getAccountInfo", [primaryPda.toBase58(), { encoding: "base64", commitment: "confirmed" }]);
  if (!account?.value?.data?.[0] || account.value.owner !== PROGRAM_ID) return null;
  const bytes = base64Bytes(account.value.data[0]); const length = readU32(bytes, 8);
  if (length < 1 || length > 20) return null;
  const handle = new TextDecoder().decode(bytes.slice(12, 12 + length)); const primaryAsset = key(bytes.slice(12 + length, 44 + length));
  const resolved = await resolveOnChain(rpcUrl, handle);
  if (!resolved || resolved.address !== owner.toBase58() || resolved.assetAddress !== primaryAsset) return null;
  return { address: owner.toBase58(), primaryHandle: `@${handle}`, verified: true, assetAddress: primaryAsset, primaryPda: primaryPda.toBase58(), network: "mainnet-beta" };
}