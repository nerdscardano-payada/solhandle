# SolHandle simplification: Phase 0 evidence and release gates

Date: 21 October 2026. Requested scope: native marketplace, Earn Network, SolHandle Embed and related Partner Mint distribution retirement. This is an audit artifact, not a production shutdown, regulatory determination or acceptance certificate.

## Actions actually performed

- Read repository routes, marketplace transaction builders/relays, on-chain account constraints, Earn writers and maintenance dependencies, widget surfaces and integration catalog.
- Queried finalized Solana Mainnet accounts and checked network genesis. Exported on-chain positions and paginated database records to private storage.
- Inspected official Magic Eden and Tensor API documentation; made a read-only Magic Eden listing request for one official Core asset.
- No transaction was signed, simulated with user funds, or broadcast. No program, authority, ownership, token configuration, runtime setting, workflow or entity schema was changed. No public feature has yet been disabled.

## Mainnet evidence

Network genesis: `5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d`.

Program: `B7xiwfxGcR2Xz7tcUKrkB8Ly6NV8jU7LH1m6GJZRUuf`.

ProgramData: `Gyp5dsp8Nrv1nBWL1Kz2wLZPjJBiZNmXppYVxdfSFUpp`.

Upgrade authority: `HkChx7cRLjR2bUkHoyosC3NaGf2GCVP1z4vEfc13dA27`.

Last deployment slot: `451937801`. SHA-256 of the ProgramData bytes after the 45-byte upgradeable-loader metadata header: `f80aa41369d37aa1c1072e68e8566da190945b83a9a272c56d96d5b7cf2b68e0`. This includes any allocated program padding; it is evidence of retrieved bytes, NOT a reproducible-build comparison.

Official collection read from the Config PDA: `7XZzcbeFBxQA63n9avz44vnbpv34hDGYyHfCDmTdPBJP`.

At finalized slot 459624026 (2026-10-21T12:10:18.202Z export):

| Account group | Open accounts | Account balance, lamports | Interpretation |
| --- | ---: | ---: | --- |
| MarketplaceListing | 103 | 113543080 | Listing-account rent/balances, NOT escrowed purchase price |
| MarketplaceBid | 0 | 0 | No open native bidding principal or bid-account rent found at this slot |

A second discriminator-only scan at finalized slot 459624318 (2026-10-21T12:11:18.736Z), without a data-size prefilter, again found 103 listings, 0 bids, and 294 HandleRecords. All 103 listing positions have the expected 89-byte layout, deterministic listing PDA, corresponding deterministic HandleRecord, and an asset whose parsed Core collection matches the Config collection. All 103 listed sellers still match the parsed asset owner. These checks do NOT verify TransferDelegate plugins, executable sale/cancellation behavior, or source/binary correspondence.

Database contains 123 NativeListing records and 1 NativeBid record. These are historical/cache records, not an alternative escrow balance. Do not mark a historical bid refundable without checking its on-chain account. Do not bulk mark historical records cancelled merely because an account is currently absent.

The zero-bid result is a point-in-time finding. Permissionless users can create new positions while the program remains available. Recovery must support future direct-created positions as well as those in this snapshot.

## Important correction to earlier assumptions

The LIVE database configuration is `referral_enabled=true`, `earn_network_mode=LIVE`, with token mint `BLoVgMLRxxhq3X5x9s7KxaNhnQeMf5Lt7MrEpBkjpump`; payouts are paused and automatic payouts disabled. An empty source-code launch-config field did NOT establish that the token or Earn was prelaunch. Preserve all implemented token mint-payment, burn, treasury and payment functionality.

## Earn and partner accounting inventory

At 2026-10-21T12:09:41Z / supplementary backup 12:11:19Z:

| Entity | Records |
| --- | ---: |
| ReferralProfile | 18 |
| ReferralSettings | 1 |
| ReferralAttribution | 2 |
| ReferralClick | 2 |
| ShareEvent | 25 |
| OriginReferral | 0 |
| ReferralConversion | 0 |
| ReferralLedger | 0 |
| ReferralPayout | 0 |
| EarnRevenueEvent | 0 |
| ReferralNotification | 0 |
| FraudFlag | 0 |
| Partner | 0 |
| PartnerDistribution | 0 |
| CreatorFeeCycle | 0 |
| PartnerMintProfile | 1 |
| PartnerMintIntent | 15 |
| PartnerMintReceipt | 7 |
| PartnerMintAdminIntent | 1 |
| PartnerMintEvent | 62 |
| MintIntent (shared; KEEP) | 351 |
| MintAttempt (shared; KEEP) | 0 |
| FinancialTransaction (shared; KEEP) | 287 |
| TokenMintPayment (KEEP) | 7 |
| MarketplaceListing (external cache) | 2 |

Status-grouped server aggregates for ReferralLedger, ReferralPayout, EarnRevenueEvent and ReferralConversion returned no rows. Cached profile earnings/pending/paid totals were all zero; none of the 351 current MintIntent rows references a referral profile or attribution. This establishes no recorded monetary balance in those checked tables, NOT the absence of contractual entitlements, out-of-system payments, interrupted writes or claims under published terms. Preserve terms, resolve disputes, rerun immediately at cutoff, and obtain accounting/legal sign-off before disabling historical claim access.

The sole Partner Mint profile is approved `devnet-testpartner`, cluster devnet. Repository preparation documentation says external pilot activation was not implemented and routes remain admin-gated. This is not proof of absence of externally embedded public search widgets, private agreements or third-party consumers. Inventory those separately before removal. Existing Devnet receipts and intents still need read/recovery access while that product is retired.

## Private evidence exports

These are private file references, not public download links. Access requires a signed URL. No user identity/financial rows are embedded in the frontend or these source documents.

1. Main chain positions and 23 paginated retirement-related entity snapshots:
   - URI: `mp/private/6a86b7e4bcec5dfac8ee9a44/6590ea076_solhandle-retirement-phase0-2026-10-21.json`
   - SHA-256: `927502845a03ac789f32bec1358f2136f261d0583fe81675a83abd8dc35d825b`
   - JSON bytes: 300079. Capture 2026-10-21T12:10:18.202Z.
2. Unfiltered discriminator scans, handle mappings, deterministic PDA and parsed Core collection/owner checks:
   - URI: `mp/private/6a86b7e4bcec5dfac8ee9a44/d8a676c35_solhandle-retirement-chain-validation-2026-10-21.json`
   - SHA-256: `b94a7da07a0217a1f7294030c93a2155066b699d35bfe8cf25cd237352e6f528`
3. Shared mint and financial history plus settings/profile snapshot:
   - URI: `mp/private/6a86b7e4bcec5dfac8ee9a44/e30666228_solhandle-retirement-shared-accounting-2026-10-21.json`
   - SHA-256: `a2d4ad6d3848266fdeb9ae0697ea47a47caa5f7b3b4f45449051896771cf7d41`

Exports are paginated, read-only and non-transactional across entities. Hashes provide tamper detection against this manifest, not WORM retention or a legal immutable archive. A restore rehearsal and an operator-controlled retention/backup policy remain required. No automated restoration or historical data mutation has been performed.

## Recovery blockers discovered in current code

1. `src/lib/marketplace.js` derives additional delist refund accounts from at most 20 ACTIVE database bids. Recovery must derive live accounts from Mainnet, not this cache. Stale or absent cache entries must not strand withdrawals or make delisting fail.
2. `submitMarketplaceTx` bulk marks up to 20 bids CANCELLED on delist whether or not those precise accounts were refunded. Recovery indexing must reconcile actual closed accounts and finalized transaction evidence only.
3. Submission throws after a confirmation timeout and does not return a durable pending attempt. Recovery needs persistence of the signed attempt/signature before relay, signature polling, reload recovery, blockhash/last-valid-height handling and no blind replacement signature.
4. `prepareMarketplaceTx` currently checks instruction counts and fee payer but does not bind its action label to the opcode in simulation. Any managed-interface shutdown must restrict BOTH requested action and actual instruction discriminator; old signed list/buy/bid/accept transactions must not bypass submit deprecation through a cancellation label.
5. Listing owners must be able to revoke the listing's Core transfer authority and reclaim account rent where supported. UI redirect alone leaves existing listings executable through direct program calls.
6. Source/binary correspondence and cancellation behavior for current TransferDelegate plugin layouts have not been verified. Do not claim all 103 positions are cancellable until this gate has evidence.

## Provider feasibility

Official Magic Eden infrastructure notice (30 June 2026) says the Solana API currently operates but is under evaluation: https://help.magiceden.io/en/articles/13885533-magic-eden-api-infrastructure-changes .

Read-only request on 21 October 2026 to the existing token listings API for official asset GL6L4dCV4uEiqTJjyHi8xazvAyKs9y5hF52DqvqsAe7x returned HTTP 200 and an empty array. This proves that request was served, not that the collection has zero external listings or the adapter is production-ready. Its existing Magic Eden item-details URL returned HTTP 403 to the server-side check, so asset-link browser validation remains OPEN. Do not call the URL tested/verified merely because its domain is official.

Tensor official quickstart: https://dev.tensor.trade/reference/quickstart . API is Alpha, breaking changes may occur without warning; access requires an API key requested from Tensor. No Tensor credential is currently configured in the supplied secret inventory. Official Data API provides Listings and NFTs Info; do not use Trading API endpoints. Collection IDs, Core coverage, currency fields, stable order IDs, links and timestamps require authenticated response fixtures before implementation. Tensor integration remains BLOCKED for real-data verification, not simulated with fabricated listings.

Current Magic Eden synchronization is insufficient: scans only 100 indexed handles and 200 cache rows, fetches sequentially without timeout, picks a price without explicit order validation, constructs an item URL, and does not establish current on-chain collection/owner verification. It must not be relabelled as the requested verified aggregation layer.

## Gate status

- COMPLETE: initial affected-surface inventory, live chain position export, recorded-balance inventory, private paginated backups, provider documentation/one-Magic-Eden-request feasibility findings.
- OPEN: source/binary correspondence, independent cancellation evidence and wallet compatibility, operator notification/recovery period, terms/claims review, archive restore/retention policy, external widget consumer/dependency confirmation, Tensor authorized fixtures and outgoing-link validation.
- SEPARATE OWNER ACTION: upgrade authority custody/hardware/multisig choice and owner-authorized on-chain transfer. The blockchain address alone does not identify whether the key is hot, hardware-backed or multisig-controlled. Do not generate a new authority in the app, ask for private keys, revoke upgradeability or combine this with application release.
- NOT IMPLEMENTED: runtime trading restrictions, recovery page, Earn cutoff, route deprecations, provider adapters and public/documentation cleanup. Follow MIGRATION_SEQUENCE.md; no claim of final completion.