import type { PublicKey, VersionedTransaction } from '@solana/web3.js';
export declare const PARTNER_MINT_CLUSTER: 'devnet';
export declare const PARTNER_MINT_PROGRAM_ID: 'ATJutPfzXiYpf7NXaGPEBek69jHaU8Cy85ekUH8drMGT';
/** All monetary values are exact base-10 lamport strings. */
export type Lamports = string;
export type MintStatus = 'QUOTED' | 'PREPARED' | 'SIGNED' | 'SUBMITTED' | 'PENDING' | 'CONFIRMED' | 'FINALIZED' | 'FAILED' | 'EXPIRED';
export interface MintWallet {
  publicKey: PublicKey | null;
  signTransaction(transaction: VersionedTransaction): Promise<VersionedTransaction>;
}
export interface PartnerMintQuote {
  cluster: 'devnet'; program: string; partnerId: string; handle: string; wallet: string;
  partnerPda: string; partnerRevision: string; settingsRevision: string;
  revenueWallet: string; treasury: string; collection: string; quoteSigner: string;
  mintPriceLamports: Lamports; partnerShareLamports: Lamports; protocolShareLamports: Lamports;
  currency: 'SOL'; expiresAtUnix: number; quoteDigest: string; quoteSignature: string;
  uri: string; networkCostsExcluded: true; primaryEarnCommissionEligible: false;
}
export interface MintQuoteResult {
  intentId: string; quoteId: string; quote: PartnerMintQuote; expiresAt: string;
  preparationDoesNotReserveHandle: true; requestId?: string;
}
export interface PreparedMint {
  cluster: 'devnet'; intentId: string; status: 'PREPARED'; transactionBase64: string;
  lastValidBlockHeight: number; blockhash?: string; quote: PartnerMintQuote;
  estimatedAccountCostsLamports: Lamports; estimatedNetworkFeeLamports: Lamports;
  estimatedTotalLamports: Lamports; walletPriorityFeeCapLamports: Lamports; requestId?: string;
}
export interface SignedMintRecord {
  cluster: 'devnet'; intentId: string; partnerId: string; handle: string; wallet: string;
  signedTransaction: string; status: MintStatus;
}
export interface MintReceipt {
  originalOwner: string; partnerId: string; assetAddress: string; countsAsFinalizedRevenue: boolean;
  [field: string]: unknown;
}
export interface MintResult {
  cluster: 'devnet'; intentId: string; status: MintStatus; signature: string | null;
  receipt: MintReceipt | null; expiredWithoutReceiptVerified?: boolean;
  retrySameTransactionOnly?: boolean; networkFeesMayApply?: boolean; requestId?: string;
}
export interface MintAvailability {
  cluster: 'devnet'; program: string; partnerId: string; handle: string; available: boolean;
  status: 'AVAILABLE' | 'CLAIMED' | 'RESERVED' | 'PROTECTED'; advisoryOnly: true;
  [field: string]: unknown;
}
export type PartnerMintInvoke = (name: 'partnerMintRead' | 'partnerMintTransaction', payload: Record<string, unknown>) => Promise<{ data: unknown }>;
export declare class PartnerMintError extends Error {
  readonly code: string; readonly status?: number; readonly requestId?: string;
  readonly prepared?: PreparedMint; readonly signedRecord?: SignedMintRecord;
  constructor(code: string, message: string, details?: Record<string, unknown>);
}
export interface PartnerMintClient {
  readonly cluster: 'devnet'; readonly partnerId: string;
  checkAvailability(handle: string): Promise<MintAvailability>;
  getMintQuote(handle: string, wallet: PublicKey | string | MintWallet): Promise<MintQuoteResult>;
  prepareMint(quoted: MintQuoteResult): Promise<PreparedMint>;
  getMintStatus(intentId: string): Promise<MintResult>;
  submitMint(record: SignedMintRecord): Promise<MintResult>;
  /** Explicitly call only after showing prepared costs; onSigned must persist before broadcast. */
  mint(options: { prepared: PreparedMint; wallet: MintWallet; onSigned: (record: SignedMintRecord) => void | Promise<void> }): Promise<SignedMintRecord & MintResult>;
}
export declare function createPartnerMintClient(options: { partnerId: string; cluster?: 'devnet'; invoke: PartnerMintInvoke }): PartnerMintClient;