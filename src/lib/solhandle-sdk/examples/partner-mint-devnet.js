import { createPartnerMintClient } from '../partner-mint.js';

// Source-package example, not a claim that SDK 1.1.0 is published on npm.
// invoke(name, payload) returns { data: responseBody } using the approved
// authenticated transport. The current service requires a protocol administrator.
export function createDevnetIntegration({ partnerId, invoke }) {
  const mint = createPartnerMintClient({ partnerId, cluster: 'devnet', invoke });
  return {
    checkAvailability: handle => mint.checkAvailability(handle),
    async review(handle, wallet) {
      const quoted = await mint.getMintQuote(handle, wallet);
      const prepared = await mint.prepareMint(quoted);
      // Render prepared.quote, recipients, split, expiry, rent, network fee,
      // estimatedTotalLamports and walletPriorityFeeCapLamports BEFORE confirm().
      return { quoted, prepared };
    },
    // Call only from a separate, explicit user confirmation after review.
    confirm: ({ prepared, wallet, persistSigned }) => mint.mint({
      prepared, wallet, onSigned: persistSigned,
    }),
    status: intentId => mint.getMintStatus(intentId),
    async relaySaved(record) {
      const current = await mint.getMintStatus(record.intentId);
      const terminal = ['FINALIZED', 'CONFIRMED', 'FAILED'].includes(current.status)
        || (current.status === 'EXPIRED' && (!current.signature || current.expiredWithoutReceiptVerified));
      // Never re-sign or create a second intent after a timeout.
      return terminal ? current : mint.submitMint(record);
    },
  };
}