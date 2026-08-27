import type { Commitment, Connection, PublicKey } from "@solana/web3.js";

export declare const PROGRAM_ID: PublicKey;
export declare const COLLECTION_ID: PublicKey;
export declare const MPL_CORE_ID: PublicKey;
export declare const MAINNET_RPC: string;
export declare const NETWORK: "mainnet-beta";

export interface SolHandleOptions {
  connection?: Connection;
  rpcUrl?: string;
  commitment?: Commitment;
}

export type DestinationType = "SYSTEM_WALLET" | "UNFUNDED_WALLET" | "REJECTED_PDA" | "PROGRAM_OWNED_ACCOUNT";

export interface ResolvedHandle {
  handle: string;
  address: string;
  status: "claimed";
  verified: true;
  collectionVerified: true;
  safeForNativeSol: boolean;
  destinationType: DestinationType;
  handlePda: string;
  assetAddress: string;
  network: "mainnet-beta";
}

export declare function normalizeHandle(value: unknown): string;
export declare function validateHandle(value: unknown): boolean;
export declare function getHandlePda(value: unknown): PublicKey;
export declare function getAssetPda(value: unknown): PublicKey;
export declare function getPrimaryHandlePda(wallet: string | PublicKey): PublicKey;
export declare function resolveHandle(value: unknown, options?: SolHandleOptions): Promise<ResolvedHandle | null>;
export declare const getHandle: typeof resolveHandle;
export declare function verifySolHandle(value: unknown, options?: SolHandleOptions): Promise<boolean>;
export declare function isHandleAvailable(value: unknown, options?: SolHandleOptions): Promise<boolean>;
export declare function reverseResolve(wallet: string | PublicKey, options?: SolHandleOptions): Promise<string | null>;
export declare const getPrimaryHandle: typeof reverseResolve;
export declare function getHandlesByOwner(wallet: string | PublicKey, options?: SolHandleOptions): Promise<string[]>;