import { PublicKey } from "npm:@solana/web3.js@1.98.4";
import { PROGRAM_ID, SEEDS } from "./solhandleProtocol.ts";

function base64Bytes(value: string) { const binary = atob(value); return Uint8Array.from(binary, (character) => character.charCodeAt(0)); }
function readU32(bytes: Uint8Array, offset: number) { return bytes[offset] | (bytes[offset + 1] << 8) | (bytes[offset + 2] << 16) | (bytes[offset + 3] << 24); }
function readU64(bytes: Uint8Array, offset: number) { let value = 0n; for (let index = 0; index < 8; index += 1) value |= BigInt(bytes[offset + index]) << BigInt(index * 8); return Number(value); }
function encodeBase58(bytes: Uint8Array) { const alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"; let value = 0n; for (const byte of bytes) value = (value << 8n) + BigInt(byte); let result = ""; while (value > 0n) { result = alphabet[Number(value % 58n)] + result; value /= 58n; } for (const byte of bytes) { if (byte === 0) result = "1" + result; else break; } return result || "1"; }

export async function rpc(rpcUrl: string, method: string, params: unknown = []) {
  const maxAttempts = 2;
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    let response;
    try {
      response = await fetch(rpcUrl, { method: "POST", headers: { "Content-Type": "application/json", "User-Agent": "SolHandle/1.0" }, body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }), signal: controller.signal });
    } finally {
      clearTimeout(timeout);
    }
    const text = await response.text();
    let payload = null;
    try { payload = text ? JSON.parse(text) : null; } catch {}
    const rateLimited = response.status === 429 || payload?.error?.code === 429;
    if (rateLimited && attempt < maxAttempts - 1) {
      const retryAfter = Number(response.headers.get("retry-after"));
      const delayMs = Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 1000 * (2 ** attempt);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      continue;
    }
    if (!response.ok || payload?.error || !payload) throw new Error(payload?.error?.message || text || `Solana RPC request failed with HTTP ${response.status}.`);
    return payload.result;
  }
  throw new Error("Solana RPC rate limit persisted after retries.");
}
export function parseHandleRecord(encoded: string) { const bytes = base64Bytes(encoded); const length = readU32(bytes, 8); const handle = new TextDecoder().decode(bytes.slice(12, 12 + length)); const assetOffset = 12 + length; return { handle, assetAddress: encodeBase58(bytes.slice(assetOffset, assetOffset + 32)) }; }
export function parseProtocolConfigAccount(account) {
  if (!account?.data?.[0] || account.owner !== PROGRAM_ID) throw new Error("SolHandle V2 protocol configuration was not found on Mainnet-beta.");
  const bytes = base64Bytes(account.data[0]); let cursor = 8;
  const authority = encodeBase58(bytes.slice(cursor, cursor += 32)); const collection = encodeBase58(bytes.slice(cursor, cursor += 32));
  const treasury = encodeBase58(bytes.slice(cursor, cursor += 32)); const rewardsVault = encodeBase58(bytes.slice(cursor, cursor += 32));
  const pricesLamports = Array.from({ length: 5 }, () => { const value = readU64(bytes, cursor); cursor += 8; return value; });
  const totalMinted = readU64(bytes, cursor); cursor += 8;
  return { authority, collection, treasury, rewardsVault, pricesLamports, totalMinted, paused: bytes[cursor] === 1 };
}
export async function getProtocolConfig(rpcUrl: string) {
  const program = new PublicKey(PROGRAM_ID); const [configPda] = PublicKey.findProgramAddressSync([new TextEncoder().encode(SEEDS.config)], program);
  const account = await rpc(rpcUrl, "getAccountInfo", [configPda.toBase58(), { encoding: "base64", commitment: "confirmed" }]);
  return parseProtocolConfigAccount(account?.value);
}
export function parseMintEvent(encoded: string) {
  try {
    const bytes = base64Bytes(encoded);
    const discriminator = [0x91, 0xd5, 0x97, 0xa2, 0x37, 0xd0, 0xe8, 0x4f];
    if (bytes.length < 84 || !discriminator.every((byte, index) => bytes[index] === byte)) return null;
    const length = readU32(bytes, 8);
    const assetOffset = 12 + length;
    if (length < 1 || length > 20 || bytes.length < assetOffset + 72) return null;
    const handle = new TextDecoder().decode(bytes.slice(12, assetOffset));
    if (!/^[a-z0-9]{1,20}$/.test(handle)) return null;
    return { handle, assetAddress: encodeBase58(bytes.slice(assetOffset, assetOffset + 32)), owner: encodeBase58(bytes.slice(assetOffset + 32, assetOffset + 64)), priceLamports: readU64(bytes, assetOffset + 64) };
  } catch {
    return null;
  }
}
export async function getAssetOwner(rpcUrl: string, assetAddress: string, fallbackOwner = "") { try { const asset = await rpc(rpcUrl, "getAsset", [assetAddress]); return asset?.ownership?.owner || fallbackOwner; } catch { return fallbackOwner; } }
export async function getAssetOwnersBatch(rpcUrl: string, records) {
  if (!records.length) return new Map();
  try {
    const assets = await rpc(rpcUrl, "getAssetBatch", { ids: records.map((record) => record.asset_address) });
    return new Map(records.map((record, index) => [record.asset_address, assets?.[index]?.ownership?.owner || record.current_owner_cached || ""]));
  } catch {
    return new Map(records.map((record) => [record.asset_address, record.current_owner_cached || ""]));
  }
}
export async function getHandleOnChain(rpcUrl: string, handlePda: string) { const account = await rpc(rpcUrl, "getAccountInfo", [handlePda, { encoding: "base64", commitment: "confirmed" }]); if (!account?.value?.data?.[0]) return null; return parseHandleRecord(account.value.data[0]); }
export function deriveHandleAccountAddresses(handle: string) {
  const program = new PublicKey(PROGRAM_ID); const encoder = new TextEncoder(); const seed = encoder.encode(handle);
  const [record] = PublicKey.findProgramAddressSync([encoder.encode(SEEDS.handle), seed], program);
  const [restriction] = PublicKey.findProgramAddressSync([encoder.encode(SEEDS.restriction), seed], program);
  return { record: record.toBase58(), restriction: restriction.toBase58() };
}
export function parseNameRestrictionAccount(account, pda: string) {
  if (!account?.data?.[0] || account.owner !== PROGRAM_ID) return null;
  const bytes = base64Bytes(account.data[0]); const restrictionType = bytes[8] === 0 ? "RESERVED" : "PROTECTED"; const active = bytes[9] === 1; const length = readU32(bytes, 10); const reservedFor = new TextDecoder().decode(bytes.slice(14, 14 + length));
  return { pda, restrictionType, active, reservedFor };
}
export async function getNameRestriction(rpcUrl: string, handle: string) {
  const addresses = deriveHandleAccountAddresses(handle);
  const account = await rpc(rpcUrl, "getAccountInfo", [addresses.restriction, { encoding: "base64", commitment: "confirmed" }]);
  return parseNameRestrictionAccount(account?.value, addresses.restriction);
}
export async function getPrimaryHandle(rpcUrl: string, wallet: string) { try { const owner = new PublicKey(wallet); const program = new PublicKey(PROGRAM_ID); const [primaryPda] = PublicKey.findProgramAddressSync([new TextEncoder().encode(SEEDS.primary), owner.toBytes()], program); const account = await rpc(rpcUrl, "getAccountInfo", [primaryPda.toBase58(), { encoding: "base64", commitment: "confirmed" }]); if (!account?.value?.data?.[0]) return null; const bytes = base64Bytes(account.value.data[0]); const length = readU32(bytes, 8); const handle = new TextDecoder().decode(bytes.slice(12, 12 + length)); return { handle, assetAddress: encodeBase58(bytes.slice(12 + length, 44 + length)) }; } catch { return null; } }
export async function findHandleOnChain(rpcUrl: string, handle: string) { const program = new PublicKey(PROGRAM_ID); const [handlePda] = PublicKey.findProgramAddressSync([new TextEncoder().encode(SEEDS.handle), new TextEncoder().encode(handle)], program); const record = await getHandleOnChain(rpcUrl, handlePda.toBase58()); return record ? { ...record, handlePda: handlePda.toBase58() } : null; }
export { PROGRAM_ID };