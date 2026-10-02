# Partner Mint API: administrator-only devnet pilot

This source adds two real Base44 handlers; no program deployment or mainnet activation is performed. Both require an authenticated app administrator and `cluster: "devnet"`. Public wallet-only checkout, partner authentication, events/dashboard totals and mainnet indexing are not part of this pilot. No Partner or Earn settings are changed.

## Prerequisites

Configure `PARTNER_MINT_DEVNET_RPC_URL` and a separate 64-byte JSON `PARTNER_MINT_DEVNET_QUOTE_SIGNER_KEYPAIR`. The backend verifies the devnet genesis hash on every request. The already-reviewed program extension must separately be deployed to devnet, its existing Config initialized, PartnerMintSettings enabled with this exact public quote key, and the partner approved with its verified System Program revenue wallet. This API never creates/approves partners or signs authority transactions.

A missing program/settings account returns PARTNER_MINT_NOT_CONFIGURED. A disabled setting, signer mismatch, unsupported protocol, suspended partner, restriction, self-mint or stale quote fails closed. Do not use a user, treasury, authority or token-payment key as quote signer.

## Calls inside the app

Use `base44.functions.invoke` with these payloads. Do not route ordinary mints through these handlers.

1. `partnerMintRead`: `{action:"availability", cluster:"devnet", partnerId:"example-partner", handle:"ansem"}`.
2. `partnerMintRead`: `{action:"quote", cluster:"devnet", partnerId:"example-partner", handle:"ansem", wallet:"<claimant public key>"}`. Save returned quoteId/intentId and show quote, expiry, treasury/partner recipients, fee and separate network/account costs.
3. `partnerMintTransaction`: `{action:"prepare", cluster:"devnet", quoteId:"<returned ID>"}`. Returns a legacy unsigned transaction. The exact message is persisted, prepared retries reuse it, and simulation must succeed before wallet review.
4. Wallet deserializes transactionBase64, reviews and signs locally. No private user key ever reaches the server. The pilot intentionally accepts NO wallet-added instructions or Address Lookup Tables.
5. `partnerMintTransaction`: `{action:"submit", cluster:"devnet", intentId:"<ID>", signedTransaction:"<signed base64>"}`. Returns locally derived signature and pending state. Broadcast timeouts preserve that signature. Re-submit only identical signed bytes; never obtain a new signature merely because an RPC timed out.
6. `partnerMintTransaction`: `{action:"status", cluster:"devnet", intentId:"<ID>"}`. Confirmation verifies successful exact message, immutable receipt, all amounts/recipients/revisions/digest, official Core asset and collection. Current NFT owner is separate from original mint owner. Only FINALIZED carries countsAsFinalizedRevenue=true.

Expiry does not prove a submitted mint failed. Missing/lagging historical confirmation stays PENDING or returns service-unavailable, never claims the payment failed. QUOTED/PREPARED expire without settled revenue. Failed on-chain execution reports FAILED, but Solana network fees may apply.

Quotes last 50 chain-time seconds, inside the program's 60-second window. Exact BigInt arithmetic follows on-chain overrides, tiers, premium and Rush; amounts travel as decimal strings. Partner receives floor(fee/2); treasury receives the remainder. Rent, network and storage are excluded. Generated devnet NFT artwork/JSON are published publicly for wallets to fetch; no existing mainnet Irys uploader is called.

## Storage and isolation

PartnerMintIntent is administrator-only for read/create/update/delete. Handlers additionally scope intents to the requesting administrator. No frontend state is trusted for price, recipients, metadata or approved partner revision. Quote/intent preparation creates no Earn origin, referral commission or production financial entry. Existing Earn guard remains responsible for ordinary-indexer exclusion; this separate path does not emit legacy mint accounting events.

## Remaining release gates

Run reviewed devnet deployment/configuration, successful wallet mint and receipt recovery, concurrent/retry and regression acceptance. Backend negative-path checks alone do not verify a live mint, settlement or wallet compatibility. Public checkout, partner credentials/domain controls, event analytics, automatic index recovery and mainnet rollout require subsequent work and explicit approval.