import type { Commitment, Connection, PublicKey, TransactionInstruction } from "@solana/web3.js";

export declare const PROGRAM_ID: PublicKey;
export declare const COLLECTION_ID: PublicKey;
export declare const MPL_CORE_ID: PublicKey;
export declare const MAINNET_RPC: string;
export declare const NETWORK: "mainnet-beta";
export declare const PROTOCOL_VERSION: 2;

export declare const ERROR_CODES: Readonly<Record<string, string>>;
export declare class SolHandleError extends Error {
  readonly code: string;
  constructor(code: string, message: string, cause?: unknown);
}

export interface SolHandleOptions {
  connection?: Connection;
  rpcUrl?: string;
  commitment?: Commitment;
  resolveSns?: (input: unknown) => unknown | Promise<unknown>;
}

export type DestinationType = "SYSTEM_WALLET" | "UNFUNDED_WALLET" | "REJECTED_PDA" | "PROGRAM_OWNED_ACCOUNT";

export interface ResolveResult {
  handle: string;
  canonicalName: string;
  address: PublicKey;
  addressString: string;
  asset: PublicKey;
  assetAddress: string;
  verified: true;
  collectionVerified: true;
  status: "claimed";
  safeForNativeSol: boolean;
  destinationType: DestinationType;
  handlePda: PublicKey;
  handlePdaAddress: string;
  protocolVersion: 2;
  network: "mainnet-beta";
}

export interface ReverseResolveResult {
  handle: string;
  canonicalName: string;
  address: PublicKey;
  asset: PublicKey;
  verified: true;
}

export declare function normalizeHandle(value: unknown): string;
export declare function validateHandle(value: unknown): boolean;
export declare function isSolHandle(value: unknown): boolean;
export declare function getConfigPda(): PublicKey;
export declare function getHandlePda(value: unknown): PublicKey;
export declare const deriveHandlePda: typeof getHandlePda;
export declare function getAssetPda(value: unknown): PublicKey;
export declare function getPrimaryHandlePda(wallet: string | PublicKey): PublicKey;
export declare function resolveHandle(value: unknown, options?: SolHandleOptions): Promise<ResolveResult | null>;
export declare function resolveHandle(connection: Connection, value: unknown): Promise<ResolveResult | null>;
export declare const getHandle: typeof resolveHandle;
export declare function verifySolHandle(value: unknown, options?: SolHandleOptions): Promise<boolean>;
export declare function verifyOwnership(value: unknown, wallet: string | PublicKey, options?: SolHandleOptions): Promise<boolean>;
export declare function verifyOwnership(connection: Connection, value: unknown, wallet: string | PublicKey): Promise<boolean>;
export declare function isHandleAvailable(value: unknown, options?: SolHandleOptions): Promise<boolean>;
export declare function reverseResolve(wallet: string | PublicKey, options?: SolHandleOptions): Promise<ReverseResolveResult | null>;
export declare function reverseResolve(connection: Connection, wallet: string | PublicKey): Promise<ReverseResolveResult | null>;
export declare const getPrimaryHandle: typeof reverseResolve;
export declare function buildSetPrimaryInstruction(value: unknown, wallet: string | PublicKey): TransactionInstruction;
export declare function resolveRecipient(input: unknown, options?: SolHandleOptions): Promise<ResolveResult | { kind: "address"; address: PublicKey; addressString: string; verified: true } | unknown | null>;
export declare function getHandlesByOwner(wallet: string | PublicKey, options?: SolHandleOptions): Promise<string[]>;