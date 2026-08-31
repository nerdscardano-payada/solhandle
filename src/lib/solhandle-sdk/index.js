import { Connection, PublicKey, SystemProgram, TransactionInstruction } from "@solana/web3.js";
import { ERROR_CODES, SolHandleError } from "./errors.js";

export { ERROR_CODES, SolHandleError };
export const PROGRAM_ID = new PublicKey("B7xiwfxGcR2Xz7tcUKrkB8Ly6NV8jU7LH1m6GJZRUuf");
export const COLLECTION_ID = new PublicKey("7XZzcbeFBxQA63n9avz44vnbpv34hDGYyHfCDmTdPBJP");
export const MPL_CORE_ID = new PublicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");
export const MAINNET_RPC = "https://api.mainnet-beta.solana.com";
export const NETWORK = "mainnet-beta";
export const PROTOCOL_VERSION = 2;

const encoder = new TextEncoder();
const decoder = new TextDecoder();
const seed = (value) => encoder.encode(value);
const connectionFor = (options = {}) => options.connection || new Connection(options.rpcUrl || MAINNET_RPC, options.commitment || "confirmed");
const isConnection = (value) => Boolean(value && typeof value.getAccountInfo === "function");
const sdkError = (code, message, cause) => new SolHandleError(code, message, cause);

export const normalizeHandle = (value) => String(value || "").trim().replace(/^@/, "").toLowerCase();
export const validateHandle = (value) => /^[a-z0-9]{1,20}$/.test(normalizeHandle(value));
export const isSolHandle = (value) => typeof value === "string" && value.trim().startsWith("@") && validateHandle(value);

function canonicalHandle(value) {
  const handle = normalizeHandle(value);
  if (!validateHandle(handle)) throw sdkError(ERROR_CODES.INVALID_HANDLE, "Handle must use 1-20 lowercase letters or numbers.");
  return handle;
}

export const getConfigPda = () => PublicKey.findProgramAddressSync([seed("config")], PROGRAM_ID)[0];
export const getHandlePda = (value) => PublicKey.findProgramAddressSync([seed("handle"), seed(canonicalHandle(value))], PROGRAM_ID)[0];
export const deriveHandlePda = getHandlePda;
export const getAssetPda = (value) => PublicKey.findProgramAddressSync([seed("asset"), seed(canonicalHandle(value))], PROGRAM_ID)[0];
export const getPrimaryHandlePda = (wallet) => PublicKey.findProgramAddressSync([seed("primary"), new PublicKey(wallet).toBytes()], PROGRAM_ID)[0];

function readU32(data, offset) {
  if (data.byteLength < offset + 4) throw sdkError(ERROR_CODES.INVALID_REGISTRY_ACCOUNT, "Invalid SolHandle account data.");
  return new DataView(data.buffer, data.byteOffset, data.byteLength).getUint32(offset, true);
}

function decodeRecord(data) {
  const length = readU32(data, 8);
  if (length < 1 || length > 20 || data.byteLength < 44 + length) throw sdkError(ERROR_CODES.INVALID_REGISTRY_ACCOUNT, "Invalid HandleRecord layout.");
  return { canonicalName: decoder.decode(data.slice(12, 12 + length)), asset: new PublicKey(data.slice(12 + length, 44 + length)) };
}

function decodePrimary(data) {
  const length = readU32(data, 8);
  if (length < 1 || length > 20 || data.byteLength < 44 + length) throw sdkError(ERROR_CODES.PRIMARY_HANDLE_STALE, "Invalid PrimaryHandle layout.");
  return { canonicalName: decoder.decode(data.slice(12, 12 + length)), asset: new PublicKey(data.slice(12 + length, 44 + length)) };
}

function decodeAsset(data) {
  if (data.byteLength < 66 || data[0] !== 1) throw sdkError(ERROR_CODES.OWNERSHIP_INVALID, "Invalid Metaplex Core asset.");
  return { owner: new PublicKey(data.slice(1, 33)), collection: data[33] === 2 ? new PublicKey(data.slice(34, 66)) : null };
}

function verifyProtocolConfig(info) {
  if (!info?.owner.equals(PROGRAM_ID) || info.data.byteLength !== 187) throw sdkError(ERROR_CODES.INVALID_REGISTRY_ACCOUNT, "Invalid SolHandle Config account.");
  const version = info.data[186];
  if (version !== PROTOCOL_VERSION) throw sdkError(ERROR_CODES.UNSUPPORTED_PROTOCOL_VERSION, `Unsupported SolHandle protocol version ${version}.`);
}

async function classifyDestination(connection, address, commitment) {
  const info = await connection.getAccountInfo(address, commitment);
  const onCurve = PublicKey.isOnCurve(address.toBytes());
  if (!info) return { safeForNativeSol: onCurve, destinationType: onCurve ? "UNFUNDED_WALLET" : "REJECTED_PDA" };
  const safe = onCurve && info.owner.equals(SystemProgram.programId);
  return { safeForNativeSol: safe, destinationType: safe ? "SYSTEM_WALLET" : !onCurve ? "REJECTED_PDA" : "PROGRAM_OWNED_ACCOUNT" };
}

function resolverArguments(first, second) {
  return isConnection(first) ? { value: second, options: { connection: first } } : { value: first, options: second || {} };
}

export async function resolveHandle(first, second = {}) {
  const { value, options } = resolverArguments(first, second);
  const canonicalName = canonicalHandle(value);
  const commitment = options.commitment || "confirmed";
  const connection = connectionFor(options);
  const handlePda = getHandlePda(canonicalName);
  const assetPda = getAssetPda(canonicalName);
  let accounts;
  try {
    accounts = await connection.getMultipleAccountsInfo([handlePda, assetPda, getConfigPda()], commitment);
  } catch (cause) {
    throw sdkError(ERROR_CODES.RPC_ERROR, "Unable to read SolHandle accounts from Solana.", cause);
  }
  const [recordInfo, assetInfo, configInfo] = accounts;
  if (!recordInfo) return null;
  if (!recordInfo.owner.equals(PROGRAM_ID)) throw sdkError(ERROR_CODES.INVALID_REGISTRY_ACCOUNT, "HandleRecord is not owned by the SolHandle program.");
  verifyProtocolConfig(configInfo);
  const record = decodeRecord(recordInfo.data);
  if (record.canonicalName !== canonicalName || !record.asset.equals(assetPda) || !handlePda.equals(getHandlePda(record.canonicalName))) {
    throw sdkError(ERROR_CODES.INVALID_REGISTRY_ACCOUNT, "HandleRecord does not match its deterministic protocol address.");
  }
  if (!assetInfo) throw sdkError(ERROR_CODES.HANDLE_RETIRED, `@${canonicalName} is retired because its official asset no longer exists.`);
  if (!assetInfo.owner.equals(MPL_CORE_ID)) throw sdkError(ERROR_CODES.OWNERSHIP_INVALID, "Asset is not owned by Metaplex Core.");
  const asset = decodeAsset(assetInfo.data);
  if (!asset.collection?.equals(COLLECTION_ID)) throw sdkError(ERROR_CODES.INVALID_COLLECTION, "Asset is not in the official SolHandle collection.");
  let safety;
  try {
    safety = await classifyDestination(connection, asset.owner, commitment);
  } catch (cause) {
    throw sdkError(ERROR_CODES.RPC_ERROR, "Unable to verify the resolved destination.", cause);
  }
  return {
    handle: `@${canonicalName}`,
    canonicalName,
    address: asset.owner,
    addressString: asset.owner.toBase58(),
    asset: assetPda,
    assetAddress: assetPda.toBase58(),
    verified: true,
    collectionVerified: true,
    status: "claimed",
    ...safety,
    handlePda,
    handlePdaAddress: handlePda.toBase58(),
    protocolVersion: PROTOCOL_VERSION,
    network: NETWORK,
  };
}

export const getHandle = resolveHandle;
export const verifySolHandle = async (first, second) => Boolean((await resolveHandle(first, second))?.verified);

export async function verifyOwnership(first, second, third) {
  const connectionStyle = isConnection(first);
  const resolved = connectionStyle ? await resolveHandle(first, second) : await resolveHandle(first, third || {});
  const wallet = new PublicKey(connectionStyle ? third : second);
  return Boolean(resolved?.address.equals(wallet));
}

export async function isHandleAvailable(value, options = {}) {
  const handle = canonicalHandle(value);
  const commitment = options.commitment || "confirmed";
  const connection = connectionFor(options);
  const restriction = PublicKey.findProgramAddressSync([seed("restriction"), seed(handle)], PROGRAM_ID)[0];
  try {
    const [record, restrictionInfo] = await connection.getMultipleAccountsInfo([getHandlePda(handle), restriction], commitment);
    return !record && !(restrictionInfo?.owner.equals(PROGRAM_ID) && restrictionInfo.data[9] === 1);
  } catch (cause) {
    throw sdkError(ERROR_CODES.RPC_ERROR, "Unable to check handle availability.", cause);
  }
}

export async function reverseResolve(first, second = {}) {
  const connectionStyle = isConnection(first);
  const wallet = new PublicKey(connectionStyle ? second : first);
  const options = connectionStyle ? { connection: first } : second;
  const commitment = options.commitment || "confirmed";
  const connection = connectionFor(options);
  const primaryPda = getPrimaryHandlePda(wallet);
  let info;
  try {
    info = await connection.getAccountInfo(primaryPda, commitment);
  } catch (cause) {
    throw sdkError(ERROR_CODES.RPC_ERROR, "Unable to read the PrimaryHandle account.", cause);
  }
  if (!info) return null;
  if (!info.owner.equals(PROGRAM_ID)) throw sdkError(ERROR_CODES.PRIMARY_HANDLE_STALE, "PrimaryHandle is not owned by the SolHandle program.");
  const primary = decodePrimary(info.data);
  const resolved = await resolveHandle(primary.canonicalName, { connection, commitment });
  if (!resolved || !resolved.address.equals(wallet) || !resolved.asset.equals(primary.asset)) return null;
  return { handle: resolved.handle, canonicalName: primary.canonicalName, address: wallet, asset: primary.asset, verified: true };
}

export const getPrimaryHandle = reverseResolve;

export function buildSetPrimaryInstruction(value, wallet) {
  const canonicalName = canonicalHandle(value);
  const owner = new PublicKey(wallet);
  const handleBytes = seed(canonicalName);
  const data = new Uint8Array(12 + handleBytes.length);
  data.set([45, 165, 247, 35, 215, 24, 221, 244], 0);
  new DataView(data.buffer).setUint32(8, handleBytes.length, true);
  data.set(handleBytes, 12);
  return new TransactionInstruction({
    programId: PROGRAM_ID,
    data,
    keys: [
      { pubkey: owner, isSigner: true, isWritable: true },
      { pubkey: getHandlePda(canonicalName), isSigner: false, isWritable: false },
      { pubkey: getAssetPda(canonicalName), isSigner: false, isWritable: false },
      { pubkey: getPrimaryHandlePda(owner), isSigner: false, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
  });
}

export async function resolveRecipient(input, options = {}) {
  if (isSolHandle(input)) {
    const result = await resolveHandle(input, options);
    return result ? { kind: "solhandle", ...result } : null;
  }
  try {
    const address = new PublicKey(input);
    return { kind: "address", address, addressString: address.toBase58(), verified: true };
  } catch {
    if (typeof options.resolveSns === "function") return options.resolveSns(input);
    throw sdkError(ERROR_CODES.INVALID_HANDLE, "Recipient is not a valid SolHandle or Solana address.");
  }
}

export async function getHandlesByOwner(wallet, options = {}) {
  const owner = new PublicKey(wallet);
  const commitment = options.commitment || "confirmed";
  const connection = connectionFor(options);
  let accounts;
  try {
    accounts = await connection.getProgramAccounts(PROGRAM_ID, { commitment });
  } catch (cause) {
    throw sdkError(ERROR_CODES.RPC_ERROR, "Unable to scan SolHandle registry accounts.", cause);
  }
  const records = [];
  for (const account of accounts) {
    try {
      const record = decodeRecord(account.account.data);
      if (validateHandle(record.canonicalName) && getHandlePda(record.canonicalName).equals(account.pubkey) && getAssetPda(record.canonicalName).equals(record.asset)) records.push(record);
    } catch {
      // Other SolHandle program account types are intentionally ignored.
    }
  }
  const matches = [];
  for (let index = 0; index < records.length; index += 100) {
    const batch = records.slice(index, index + 100);
    const assets = await connection.getMultipleAccountsInfo(batch.map((item) => item.asset), commitment);
    assets.forEach((info, offset) => {
      if (!info?.owner.equals(MPL_CORE_ID)) return;
      const asset = decodeAsset(info.data);
      if (asset.owner.equals(owner) && asset.collection?.equals(COLLECTION_ID)) matches.push(`@${batch[offset].canonicalName}`);
    });
  }
  return matches;
}