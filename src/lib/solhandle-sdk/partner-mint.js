import { PublicKey, VersionedTransaction } from '@solana/web3.js';
import partnerMintTransport from './partner-mint-transport.js';
import { PartnerMintError, mintAssert } from './partner-mint-errors.js';
import { PARTNER_MINT_PROGRAM_ID, canonicalMintHandle, walletAddress, validateQuote, validatePrepared, reviewFields, fromBase64, toBase64 } from './partner-mint-validation.js';
export { PartnerMintError } from './partner-mint-errors.js';
export { PARTNER_MINT_CLUSTER, PARTNER_MINT_PROGRAM_ID } from './partner-mint-validation.js';

/** Devnet administrator pilot. No auto-connect, wallet discovery or automatic re-signing. */
export function createPartnerMintClient({ partnerId, cluster = 'devnet', invoke } = {}) {
  mintAssert(cluster === 'devnet', 'DEVNET_ONLY', 'Partner Mint SDK currently supports Devnet only.');
  mintAssert(typeof partnerId === 'string' && /^[a-z0-9-]{1,32}$/.test(partnerId), 'INVALID_PARTNER_ID', 'Use the approved canonical partner ID.');
  const call = partnerMintTransport(invoke), signing = new Set(), signedIntents = new Set();
  const intent = id => { mintAssert(typeof id === 'string' && /^[a-f0-9]{24}$/.test(id), 'INVALID_INTENT', 'Invalid intent ID.'); return id; };
  const fresh = quote => mintAssert(Date.now() < quote.expiresAtUnix * 1000, 'QUOTE_EXPIRED', 'Quote expired. Request and review a new quote.');
  const client = {
    cluster: 'devnet', partnerId,
    async checkAvailability(value) {
      const handle = canonicalMintHandle(value), result = await call('availability', { partnerId, handle });
      mintAssert(result.partnerId === partnerId && result.handle === handle && result.program === PARTNER_MINT_PROGRAM_ID, 'RESPONSE_MISMATCH', 'Availability belongs to another handle, partner or program.');
      return result;
    },
    async getMintQuote(value, wallet) {
      const handle = canonicalMintHandle(value), address = new PublicKey(wallet?.publicKey || wallet).toBase58();
      const result = await call('quote', { partnerId, handle, wallet: address });
      intent(result.intentId);
      validateQuote(result.quote, partnerId, handle, address); fresh(result.quote);
      return result;
    },
    async prepareMint(quoted) {
      intent(quoted?.intentId);
      validateQuote(quoted.quote, partnerId, quoted.quote?.handle, quoted.quote?.wallet); fresh(quoted.quote);
      const prepared = await call('prepare', { intentId: quoted.intentId });
      validatePrepared(prepared, quoted);
      return prepared;
    },
    async getMintStatus(id) {
      const result = await call('status', { intentId: intent(id) });
      mintAssert(result.intentId === id && (!result.receipt || result.receipt.partnerId === partnerId), 'INTENT_MISMATCH', 'Status belongs to another intent or partner.');
      return result;
    },
    async submitMint(record) {
      mintAssert(record?.cluster === 'devnet' && record.partnerId === partnerId, 'INTENT_MISMATCH', 'Use a saved Devnet transaction for this partner.');
      intent(record.intentId);
      mintAssert(typeof record.signedTransaction === 'string' && record.signedTransaction.length <= 1644, 'INVALID_TRANSACTION', 'Missing signed transaction.');
      const transaction = VersionedTransaction.deserialize(fromBase64(record.signedTransaction));
      const keys = transaction.message.staticAccountKeys;
      mintAssert(transaction.message.compiledInstructions.some(ix => keys[ix.programIdIndex]?.toBase58() === PARTNER_MINT_PROGRAM_ID), 'WRONG_CLUSTER', 'Not a Devnet Partner Mint transaction.');
      const result = await call('submit', { intentId: record.intentId, signedTransaction: record.signedTransaction });
      mintAssert(result.intentId === record.intentId, 'INTENT_MISMATCH', 'Unexpected submit response.');
      return result;
    },
    async mint({ prepared, wallet, onSigned } = {}) {
      const id = intent(prepared?.intentId);
      mintAssert(!signing.has(id) && !signedIntents.has(id), 'ALREADY_SIGNED', 'This intent is signing or was signed. Check its status or relay the saved bytes.');
      mintAssert(typeof wallet?.signTransaction === 'function' && typeof onSigned === 'function', 'SIGNER_REQUIRED', 'Provide the connected wallet and an onSigned persistence callback.');
      signing.add(id);
      let signedRecord;
      try {
        const address = walletAddress(wallet);
        validateQuote(prepared.quote, partnerId, prepared.quote?.handle, address); fresh(prepared.quote);
        validatePrepared(prepared, prepared);
        // Never silently sign a newly prepared transaction or changed costs.
        const latest = await call('prepare', { intentId: id });
        validatePrepared(latest, prepared);
        if (!reviewFields.every(key => latest[key] === prepared[key])) throw new PartnerMintError('REVIEW_CHANGED', 'Preparation changed. Review the updated costs before signing.', { prepared: latest });
        mintAssert(walletAddress(wallet) === address, 'WALLET_CHANGED', 'The connected wallet changed.');
        fresh(prepared.quote);
        const signed = await wallet.signTransaction(VersionedTransaction.deserialize(fromBase64(prepared.transactionBase64)));
        mintAssert(signed?.signatures?.[0]?.some(byte => byte !== 0), 'INVALID_SIGNATURE', 'The wallet returned no signature.');
        signedIntents.add(id);
        signedRecord = { cluster: 'devnet', intentId: id, partnerId, handle: prepared.quote.handle, wallet: address, signedTransaction: toBase64(signed.serialize()), status: 'SIGNED' };
        await onSigned(signedRecord); // Must complete before any broadcast attempt.
        mintAssert(walletAddress(wallet) === address, 'WALLET_CHANGED', 'Wallet changed after signing. Check the saved intent before continuing.');
        return { ...signedRecord, ...await client.submitMint(signedRecord) };
      } catch (error) {
        if (signedRecord) error.signedRecord = signedRecord;
        throw error;
      } finally { signing.delete(id); }
    },
  };
  return Object.freeze(client);
}