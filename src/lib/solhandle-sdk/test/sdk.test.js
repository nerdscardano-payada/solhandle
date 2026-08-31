import test from "node:test";
import assert from "node:assert/strict";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import {
  COLLECTION_ID, ERROR_CODES, NETWORK, PROGRAM_ID, PROTOCOL_VERSION,
  buildSetPrimaryInstruction, deriveHandlePda, getAssetPda, getConfigPda,
  getHandlePda, isSolHandle, normalizeHandle, resolveHandle, reverseResolve,
  validateHandle, verifyOwnership,
} from "../index.js";

const walletA = new PublicKey("7xuwNteAPApjMQ6Bv8P7qfKLnvbsKCRN84KjqKQzjv4R");
const walletB = new PublicKey("6feT2ZrS9SZqV4EBUr9PKG9V4dKVQWsKr2MGYNQyPMtg");

function recordData(handle, asset) {
  const name = new TextEncoder().encode(handle);
  const data = new Uint8Array(77 + name.length);
  new DataView(data.buffer).setUint32(8, name.length, true);
  data.set(name, 12); data.set(asset.toBytes(), 12 + name.length);
  return data;
}

function assetData(owner, collection = COLLECTION_ID) {
  const data = new Uint8Array(66);
  data[0] = 1; data.set(owner.toBytes(), 1); data[33] = 2; data.set(collection.toBytes(), 34);
  return data;
}

function configData(version = PROTOCOL_VERSION) {
  const data = new Uint8Array(187); data[186] = version; return data;
}

function primaryData(handle, asset) {
  const name = new TextEncoder().encode(handle);
  const data = new Uint8Array(53 + name.length);
  new DataView(data.buffer).setUint32(8, name.length, true);
  data.set(name, 12); data.set(asset.toBytes(), 12 + name.length);
  return data;
}

function mockConnection(owner = walletA, overrides = {}) {
  const handle = "ansem";
  const asset = getAssetPda(handle);
  return {
    getMultipleAccountsInfo: async (keys) => keys.length === 3 ? [
      overrides.record === null ? null : { owner: overrides.recordOwner || PROGRAM_ID, data: recordData(handle, asset) },
      overrides.asset === null ? null : { owner: overrides.assetOwner || new PublicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d"), data: assetData(owner, overrides.collection) },
      { owner: PROGRAM_ID, data: configData(overrides.version) },
    ] : [],
    getAccountInfo: async (key) => {
      if (key.equals(SystemProgram.programId)) return null;
      if (key.equals(new PublicKey(owner))) return null;
      if (key.equals(getConfigPda())) return { owner: PROGRAM_ID, data: configData() };
      return overrides.primary === false ? null : { owner: PROGRAM_ID, data: primaryData(handle, asset) };
    },
  };
}

test("exports immutable Mainnet protocol constants", () => {
  assert.equal(NETWORK, "mainnet-beta");
  assert.equal(PROTOCOL_VERSION, 2);
  assert.equal(PROGRAM_ID.toBase58(), "B7xiwfxGcR2Xz7tcUKrkB8Ly6NV8jU7LH1m6GJZRUuf");
  assert.equal(COLLECTION_ID.toBase58(), "7XZzcbeFBxQA63n9avz44vnbpv34hDGYyHfCDmTdPBJP");
});

test("normalizes exactly one @ and validates deployed v2 syntax", () => {
  assert.equal(normalizeHandle("  @Ansem "), "ansem");
  assert.equal(normalizeHandle("@@Ansem"), "@ansem");
  assert.equal(isSolHandle("@ansem"), true);
  assert.equal(validateHandle("@@ansem"), false);
  assert.equal(validateHandle("not-valid"), false);
  assert.equal(validateHandle("a".repeat(21)), false);
});

test("derives deterministic deployed protocol accounts", () => {
  assert.equal(deriveHandlePda("@Ansem").toBase58(), getHandlePda("ansem").toBase58());
  assert.notEqual(getHandlePda("ansem").toBase58(), getAssetPda("ansem").toBase58());
});

test("resolves directly from registry, Core asset and Config accounts", async () => {
  const result = await resolveHandle(mockConnection(walletA), "@ansem");
  assert.equal(result.canonicalName, "ansem");
  assert.equal(result.address.toBase58(), walletA.toBase58());
  assert.equal(result.verified, true);
  assert.equal(await verifyOwnership(mockConnection(walletA), "@ansem", walletA), true);
});

test("resolution follows a Core transfer without registry mutation", async () => {
  assert.equal((await resolveHandle(mockConnection(walletA), "@ansem")).address.toBase58(), walletA.toBase58());
  assert.equal((await resolveHandle(mockConnection(walletB), "@ansem")).address.toBase58(), walletB.toBase58());
});

test("reverse resolution rejects a stale primary after transfer", async () => {
  assert.equal((await reverseResolve(mockConnection(walletA), walletA)).handle, "@ansem");
  assert.equal(await reverseResolve(mockConnection(walletB), walletA), null);
});

test("a burned Core asset is permanently treated as retired", async () => {
  await assert.rejects(() => resolveHandle(mockConnection(walletA, { asset: null }), "@ansem"), error => error.code === ERROR_CODES.HANDLE_RETIRED);
});

test("rejects fake registry ownership, collection and protocol versions", async () => {
  await assert.rejects(() => resolveHandle(mockConnection(walletA, { recordOwner: SystemProgram.programId }), "@ansem"), error => error.code === ERROR_CODES.INVALID_REGISTRY_ACCOUNT);
  await assert.rejects(() => resolveHandle(mockConnection(walletA, { collection: walletB }), "@ansem"), error => error.code === ERROR_CODES.INVALID_COLLECTION);
  await assert.rejects(() => resolveHandle(mockConnection(walletA, { version: 99 }), "@ansem"), error => error.code === ERROR_CODES.UNSUPPORTED_PROTOCOL_VERSION);
});

test("builds the Anchor set-primary instruction without Anchor", () => {
  const instruction = buildSetPrimaryInstruction("@ansem", walletA);
  assert.equal(instruction.programId.toBase58(), PROGRAM_ID.toBase58());
  assert.equal(instruction.keys[0].isSigner, true);
  assert.equal(instruction.keys[3].pubkey.toBase58().length > 30, true);
});