import test from "node:test";
import assert from "node:assert/strict";
import { COLLECTION_ID, NETWORK, PROGRAM_ID, getAssetPda, getHandlePda, normalizeHandle, validateHandle } from "../index.js";

test("exports the immutable Mainnet deployment", () => {
  assert.equal(NETWORK, "mainnet-beta");
  assert.equal(PROGRAM_ID.toBase58(), "B7xiwfxGcR2Xz7tcUKrkB8Ly6NV8jU7LH1m6GJZRUuf");
  assert.equal(COLLECTION_ID.toBase58(), "7XZzcbeFBxQA63n9avz44vnbpv34hDGYyHfCDmTdPBJP");
});

test("normalizes and validates protocol handles", () => {
  assert.equal(normalizeHandle("  @@Ansem "), "ansem");
  assert.equal(validateHandle("@ansem"), true);
  assert.equal(validateHandle("not-valid"), false);
  assert.equal(validateHandle("a".repeat(21)), false);
  assert.equal(validateHandle(""), false);
});

test("derives deterministic and separate protocol accounts", () => {
  assert.equal(getHandlePda("@Ansem").toBase58(), getHandlePda("ansem").toBase58());
  assert.equal(getAssetPda("@Ansem").toBase58(), getAssetPda("ansem").toBase58());
  assert.notEqual(getHandlePda("ansem").toBase58(), getAssetPda("ansem").toBase58());
});