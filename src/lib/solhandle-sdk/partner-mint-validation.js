import { PublicKey, VersionedTransaction } from '@solana/web3.js';
import { mintAssert } from './partner-mint-errors.js';

export const PARTNER_MINT_CLUSTER = 'devnet';
export const PARTNER_MINT_PROGRAM_ID = 'ATJutPfzXiYpf7NXaGPEBek69jHaU8Cy85ekUH8drMGT';
export const fromBase64 = value => Uint8Array.from(atob(value), char => char.charCodeAt(0));
export const toBase64 = value => btoa(Array.from(value, byte => String.fromCharCode(byte)).join(''));
export const canonicalMintHandle = value => {
  mintAssert(typeof value === 'string', 'INVALID_HANDLE', 'Enter a handle.');
  const handle = value.trim().replace(/^@/, '').toLowerCase();
  mintAssert(/^[a-z0-9]{1,20}$/.test(handle), 'INVALID_HANDLE', 'Use 1–20 letters or numbers.');
  return handle;
};
export const walletAddress = wallet => {
  mintAssert(wallet?.publicKey, 'WALLET_REQUIRED', 'Connect your Devnet signing wallet.');
  return new PublicKey(wallet.publicKey).toBase58();
};
const amount = value => typeof value === 'string' && /^[0-9]+$/.test(value);
export function validateQuote(q, partnerId, handle, wallet) {
  mintAssert(q?.cluster === 'devnet' && q.program === PARTNER_MINT_PROGRAM_ID, 'WRONG_CLUSTER', 'Expected the dedicated Devnet Partner Mint program.');
  mintAssert(q.partnerId === partnerId && q.handle === handle && q.wallet === wallet, 'QUOTE_MISMATCH', 'Quote does not match this partner, handle and wallet.');
  mintAssert(q.currency === 'SOL' && Number.isSafeInteger(q.expiresAtUnix), 'INVALID_QUOTE', 'Invalid SOL quote or expiry.');
  const values = [q.mintPriceLamports, q.partnerShareLamports, q.protocolShareLamports];
  mintAssert(values.every(amount), 'INVALID_QUOTE', 'Lamport amounts must be decimal strings.');
  const [price, partner, protocol] = values.map(BigInt);
  mintAssert(price > 0n && price <= 18446744073709551615n && partner === price / 2n && protocol === price - partner, 'INVALID_SPLIT', 'Invalid 50/50 mint-fee split.');
  for (const key of ['revenueWallet', 'treasury', 'collection']) new PublicKey(q[key]);
}
export const reviewFields = ['transactionBase64', 'lastValidBlockHeight', 'estimatedAccountCostsLamports', 'estimatedNetworkFeeLamports', 'estimatedTotalLamports', 'walletPriorityFeeCapLamports'];
export const quoteFields = ['cluster', 'program', 'partnerId', 'handle', 'wallet', 'partnerRevision', 'settingsRevision', 'revenueWallet', 'treasury', 'collection', 'mintPriceLamports', 'partnerShareLamports', 'protocolShareLamports', 'expiresAtUnix', 'quoteDigest', 'quoteSignature'];
export function validatePrepared(prepared, quoted) {
  mintAssert(prepared?.intentId === quoted.intentId && prepared.status === 'PREPARED', 'INTENT_MISMATCH', 'Unexpected preparation response.');
  mintAssert(quoteFields.every(key => prepared.quote?.[key] === quoted.quote[key]), 'QUOTE_MISMATCH', 'Prepared quote changed. Request a new quote.');
  mintAssert(reviewFields.slice(2).every(key => amount(prepared[key])) && Number.isSafeInteger(prepared.lastValidBlockHeight), 'INVALID_PREPARATION', 'Missing total-cost or block-expiry information.');
  mintAssert(BigInt(prepared.estimatedTotalLamports) === BigInt(prepared.quote.mintPriceLamports) + BigInt(prepared.estimatedAccountCostsLamports) + BigInt(prepared.estimatedNetworkFeeLamports) && BigInt(prepared.walletPriorityFeeCapLamports) <= 1000000n, 'INVALID_PREPARATION', 'Cost totals or priority-fee cap do not match the Devnet policy.');
  const transaction = VersionedTransaction.deserialize(fromBase64(prepared.transactionBase64));
  const message = transaction.message, keys = message.staticAccountKeys;
  mintAssert(!message.addressTableLookups?.length && message.header.numRequiredSignatures === 1 && keys?.[0]?.toBase58() === prepared.quote.wallet, 'TRANSACTION_MISMATCH', 'Unexpected payer or signing accounts.');
  const instructions = message.compiledInstructions;
  mintAssert(instructions.length === 2 && keys[instructions[0].programIdIndex]?.toBase58() === 'Ed25519SigVerify111111111111111111111111111' && keys[instructions[1].programIdIndex]?.toBase58() === PARTNER_MINT_PROGRAM_ID, 'TRANSACTION_MISMATCH', 'Expected only quote verification and the Devnet mint.');
  return transaction;
}