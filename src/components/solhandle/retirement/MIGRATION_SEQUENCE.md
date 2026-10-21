# Ordered migration and acceptance gates

21 October 2026. Phase 0 findings are in PHASE_0_AUDIT.md; change targets are in AFFECTED_SURFACES.md. This sequence supersedes suggestions to revoke upgradeability or to assume token/Earn prelaunch from source defaults.

## 0. Freeze destructive work, preserve evidence (initial audit done)

Keep existing services until the replacement cancellation path is evidenced. Private exports include all current native positions and retirement tables plus shared MintIntent/financial/token history. Retention/restore rehearsal, deployed-source correspondence, contractual entitlements and external widget consumers remain open gates. Rescan at every release/cutoff; exports are not a permanent zero-balance assertion.

No authority transfer has been signed. The owner must choose hardware-backed/multisig custody, verify the new public authority and authorize the transfer separately. Verify on-chain afterward. No mainnet upgrade, freeze or immutable conversion is part of this project. Evidence that the key was hot versus hardware-backed is currently unavailable.

## 1. Coherent next implementation: recovery + managed trading stop

Implement these in ONE release, not a redirect-only patch:

1. Add read-only Mainnet recovery service that enumerates actual program accounts with Anchor discriminators, validates layout, deterministic position PDA, HandleRecord/asset association and Config collection, and filters by the connected wallet. Public on-chain recovery does not require a platform email account. Cap/paginate response; include snapshot slot and exact decimal-string lamports. Do not rely on NativeBid/NativeListing cache, and do not hide expired bids from cancellation.
2. Add /marketplace-recovery with connect, wallet-switch/reset, all own live listings and bids, no positions/loading/error states, exact bid principal versus account rent, per-position cancellation, confirmation signatures, support instructions and reload/pending recovery. Users sign their own transactions; no admin refund wallet. Wallet authentication never grants transaction signing permission.
3. Preserve cancel_bid and delist_handle through existing code/shared helpers, but derive remaining bid accounts from current chain state or use individually scoped cancellations where the deployed contract allows. Never mark unspecified bids refunded. Listing cancellation revokes transfer permission as well as closes listing state. If plugin or ownership changes prevent a cancellation, show truthful failure and retain recovery access; never report success merely on database update.
4. Save signed bytes/signature/blockhash/last-valid-height BEFORE relay. Reject wallet/cluster/instruction/account mismatch. Query the same signature after timeouts and reloads; distinguish pending from failed. Rebroadcast only the same signed bytes while valid. After expiry, check account state/signature before replacement review/signature. Keep all signing local.
5. Change prepareMarketplaceTx AND submitMarketplaceTx to allow only delist and cancel_bid through managed services. Deny list, buy, bid, accept_bid with HTTP 410 and explicit code NATIVE_MARKETPLACE_RETIRED plus recovery route. Inspect actual instruction discriminator, not just request action; reject disguised old signed trades and mixed trade/cancellation transactions. Ordinary minting/Pay endpoints unchanged.
6. Remove new trade actions at the shared MarketplaceAction boundary and all entry points (Market, portfolio, handle details, inbox and discovery). Preserve cancellation, and replace old buttons with recovery/outgoing discovery links rather than silently failing. /market and /upcoming/marketplace redirect only after recovery route is live. Preserve handle/search URL context and initialize Discover search from it.
7. Explain that direct permissionless contract interaction remains possible and existing listings may still be bought directly until cancelled. Announce a clearly defined operator-approved recovery period and available contact channels; do not invent a deadline or claim notifications were delivered without evidence.

Gate: actual signed-cancellation fixtures for deployed behavior/wallet compatibility, no hidden positions on stale-cache tests, no lost pending attempts, no bypass of API opcode restrictions, no core-regression failures. Do not sign transactions using another user's wallet/funds for testing. Keep recovery maintained even if escrow is currently zero.

## 2. Earn cutoff, obligations and notices

Before changing settings, rerun private exports and accounting/terms review. Define and record a precise UTC effective cutoff; retain archived old terms as published and a dated cessation notice. The audit currently shows LIVE configuration with zero recorded ledgers/events/payouts, not a guarantee of no rights.

- Stop enrollment/profile creation, new attribution/click conversion and reward accrual at all writers. Existing ?ref= URLs still load the normal public mint funnel; do not forward them to the admin-only /mint pilot. Ignore/clear retired referral browser identifiers without interrupting minting.
- Centralize the effective-date policy and check event occurrence time versus cutoff so pre-cutoff eligible late-confirmed events are assessed rather than silently discarded. Preserve already-earned obligations/claims; no retroactive term changes.
- Remove Earn mutation calls from ordinary mint preparation/confirmation/indexing while preserving its own intent/idempotency/financial accounting. Beware createReferralMintIntent currently writes ordinary MintIntent records, too.
- recordEarnRevenue and processCreatorFeeCycle must stop new allocation, not destroy core burn, treasury or creator-fee financial records. preserve financial reconciliation for pre-cutoff activity.
- Keep historical user/admin obligation access until accounting/legal sign-off. Deny new participation explicitly, not by making empty balances look paid.
- Split required MintIntent expiry/recovery from maintainReferralSystem before disabling its schedule. Inspect live workflow state with workflow guide, not just file presence. Do not pause SolHandle Index Sync or token growth/burn jobs.
- Replace /earn, /earn-litepaper, /leaderboard with clear notices and archive links; archive /referral-terms, not silent rewrite. Only retire payout APIs when verified obligations are resolved, otherwise expose maintained, authorized legacy claims.

Gate: zero new post-cutoff attribution/accrual in every writer; pre-cutoff reconciliation preserved; signed-off liabilities/retention policy; SOL and HANDLE mints unchanged, including seven existing token-payment records and mint/financial histories.

## 3. Read-only external For Sale

Adapters consume documented READ endpoints only. Magic Eden has one successful empty-array probe; Tensor fixtures/auth are currently missing. Do not pretend both integrations are ready.

- Obtain authenticated Tensor Data API fixtures and Core collection matching; record provider-specific schema, order identifier, currency/mint, seller, status, timestamps and actual canonical item/collection links. Obtain provider URLs from trusted response/official mapping and validate exact HTTPS hostname/path; reject credentials in URLs, unexpected redirect domains and caller-supplied destinations. A domain allowlist alone does not verify an asset-specific link.
- Separate provider health/status and caching. Retry/backoff only bounded transient failures; timeout all calls. Healthy provider continues if another fails. Distinguish verified empty results from unavailable/unconfigured providers.
- Validate official Core collection and on-chain handle association; seller ownership where applicable. Use integer decimal-string lamports, not floating prices/native cache. Exclude unsupported currency/expired/cancelled/sold orders. Validate escrowed external seller semantics against that marketplace's contract rather than rejecting all legitimate external custody.
- Define provider-specific max-age and soft/hard expiry. A cached row retains last verified time; never advance it on fetch failure. On staleness suppress confirmed-active price/status. NFT ownership change immediately invalidates incompatible order evidence.
- Server-side search/filter/sort/paging, source/price/length and verified/listed time filters. Deduplicate by asset only, keeping each provider's individual order/price; no synthetic merged order.
- Discover keeps Trending/Available/Owned/For Sale/Watchlist. Ownership state and sale verification are separate; lack of sale never implies AVAILABLE. Detail page shows no verified current listing versus listings unavailable distinctly. Display 'Not currently listed for sale' only when coverage is adequate; failure is not proof of absence.
- If providers cannot be verified, show 'Marketplace listings are temporarily unavailable. Please check Magic Eden or Tensor directly.' Link only to actually tested official provider/collection destinations. No fabricated fixtures, prices, floor stats, listings counts or native-price fallback.
- No external buy/sell/bid transactions, order matching, escrow or routing through SolHandle.

Gate: provider fixtures, official collection/owner tests, stale/sold/cancelled cases, duplicate-source prices, failure isolation, exact-currency checks, tested outgoing links/mobile and source timestamp display. Existing syncMagicEdenListings does not satisfy this gate.

## 4. Retire Embed and partner distribution safely

- /developers/resolve currently renders Embed gallery; preserve the standard resolver SDK and /developers identity documentation elsewhere before retiring the gallery route.
- Inventory external iframe consumers, scripts, domains and agreements. Add dated migration notices; do not infer no dependencies just because only one Devnet profile is stored.
- Stop new widget generation and Partner Mint enrollment/quote/prepare after notice. Retain existing Devnet intent/signature status and recovery until resolved. Archive plans; remove 50% revenue sharing and future widget promises.
- Deprecate partner-specific SDK methods without breaking standard resolution exports/package compatibility. Preserve Integration Center, intake/receipts, external identity APIs and general wallet integrations.
- Only remove dedicated keys after all surviving recovery functions stop using them. No signer/key removal as an automatic consequence of page deletion.

Gate: all known consumers notified/migrated, saved intents recoverable, no resolver/API breakage, historical receipts and approval audit retained.

## 5. Public cleanup, release and acceptance

Update navigation/footer/mobile menus, homepage Handles for Sale, handle/search/portfolio surfaces, token docs, roadmap/FAQ/Docs/protocol paper, localized copy, demos, agent and emails, metadata and admin dashboard. Do not advertise native 5% royalty for external transactions or replace it with invented external fees. Retain historical policy/finance archives.

Build/source checks are distinct from functional QA. Use the Testing Agent for requested end-to-end acceptance flows: identity ownership/resolution/primary, SOL mint, HANDLE mint and exact burn/treasury, SOL/token Pay, contacts, wallet switches/disconnects, legacy cancellation with controlled authorization, redirect query context, external stale/downtime/mobile/outgoing links, denied native trade APIs, Earn cutoff, Embed notices and resolver regressions. Independent contract/wallet evidence is still required; Testing Agent or a green build alone is not a Mainnet audit.

Deploy only with the above gates recorded and appropriate authorization. In this phase-0 turn NO public product or backend service was changed. Full project definition of done is not yet achieved. Rollback must never reopen new accrual/trading accidentally and must always retain maintained recovery and archives.