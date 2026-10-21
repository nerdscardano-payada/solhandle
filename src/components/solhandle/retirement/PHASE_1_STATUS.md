# Phase 1 implementation record

21 October 2026. Scope in this increment: Marketplace Recovery and stopping new managed native trades/escrow. Earn cutoff and external providers remain separate subsequent work; no Earn setting or accrual policy changed here.

## Approved operating policy: Option A

Owner authorization on 21 October 2026: proceed with application/backend marketplace retirement and preserve cancellation and recovery. No Mainnet upgrade is authorized or required for this operated-service shutdown. Do not pause the shared protocol, change collection permissions, revoke upgrade authority, change NFT ownership, or disable delist_handle/cancel_bid. A future protocol-level shutdown requires separate explicit approval.

Existing managed trading blocks remain in place. Shared notices now explicitly distinguish SolHandle service retirement from the still-permissionless on-chain program, and recovery explains owner-paid upfront SOL fees. No minting, Primary Handle, resolver, Pay, Earn, or external-provider behavior is changed by this confirmation.

Prior read-only assessment on 21 October 2026 found 103 non-expiring native listings and zero native bids. All 103 listings matched current owners and listing transfer delegates. Unsigned owner-paid delist simulations succeeded for 95 positions, closing their accounts, preserving ownership and removing the delegate. Eight positions across three unfunded owner wallets succeeded only with a separate simulated fee payer; the current recovery service does not sponsor fees, so those owners must fund their wallets. Direct buy_handle and place_bid simulations also succeeded, confirming that service retirement does not disable direct contract interaction. These are historical snapshots and unsigned simulations, not completed cancellations or a permanent zero-bid guarantee.

## Implemented

- Public wallet-based /marketplace-recovery, without email-account requirement. Lists live finalized Mainnet listing/bid accounts filtered by signer wallet, including expired bids, with 25-position paging, handle/PDA/Core collection/owner validation, exact decimal-string amounts, support route and scan timestamp/slot.
- Existing prepareMarketplaceTx and submitMarketplaceTx allow only delist/cancel_bid. New list/buy/bid/accept requests return HTTP 410 NATIVE_MARKETPLACE_RETIRED. Actual single cancellation instruction/opcode, canonical metas, fee payer and wallet signature are checked before relay. Additional instructions and disguised trade opcodes are rejected. Administrative generic relay also denies these four native trading opcodes without changing other admin operations.
- Listing cancellation uses delist_handle with no appended database bids. This revokes the listing plugin per existing program rules and closes the listing account; it does not silently mark bids refunded. Bidders retain independent cancel_bid. No schema deletion or fake historical status updates.
- Saved signed bytes/signature/blockhash/last-valid-height before relay. Wallet changes abort before relay. Unknown broadcast stays pending. Signature polling/reload checks; only identical signed bytes can be rebroadcast; finalized signature required before successful return display. Expiry derives from signed blockhash validity at finalized commitment, not a caller-supplied height. User must review/sign a new cancellation after terminal expiry/failure and refresh of live positions.
- Wallet-scoped browser history remains available after position closure. Live positions refresh after checks/cancellation. No private keys are stored or obtained.
- Shared trading controls, portfolio, handle detail and notifications lead to recovery, not buying/bidding/listing/accepting. /market and /upcoming/marketplace redirect to Discover For Sale while preserving query context. Search initializes from legacy handle query.
- Discovery remains a clearly labelled legacy read-only transition view, not the future verified external listing layer. Native prices are not relabelled as Magic Eden/Tensor quotes. Primary homepage native listing surfaces now show a retirement/recovery notice.
- Recovery explains direct permissionless on-chain interaction remains possible; existing listings can still execute until owners cancel. No withdrawal deadline imposed. Support uses existing /contact. No claim that operator emails or announcements were sent.

## Read-only verification performed

- marketplaceRecovery list returned 200 for wallet 2TBCz974heFdASKwSyDkDGEo8xxtBFW6ECSAAGjVv5zR at finalized slot 459627147, returning validated live positions and pagination.
- prepareMarketplaceTx action=list returned HTTP 410; submitMarketplaceTx action=bid returned HTTP 410.
- An unsigned transaction containing place_bid but labelled cancel_bid was rejected by both endpoints with HTTP 422 before RPC broadcast.
- prepareMarketplaceTx produced and successfully simulated unsigned delist_handle for position 2SvzCJ6j76Z2gZGLj1h1fiUus14KBhNCUFi42NpDvGgz at checked slot 459627622. No signature or broadcast. This is not evidence of an executed wallet cancellation or proof of every existing plugin layout.
- Final frontend production build passed after all application edits.
- Wallet-scoped pagination returned 44 live positions as 25 + 19, with zero bid principal for that wallet.
- Unsigned cancellation relay was rejected with HTTP 422, an extra place_bid instruction was rejected with HTTP 422, and requesting another wallet's position was rejected with HTTP 422. The admin generic relay rejected list_handle with HTTP 410 while its ordinary read-only preparation still returned 200.
- No signed wallet transaction was created or broadcast during these checks. A build and unsigned simulation are not functional wallet acceptance.

## Explicit remaining release/evidence gates

- Wallet-authorized executed cancellation and refund acceptance in a controlled environment, including real supported wallets, reload/timeouts, switch/disconnect and mixed-opcode rejection. No user funds were signed for or moved during implementation.
- There are currently no live native bids in the Phase 0 snapshot, so actual Mainnet cancel_bid refund was not exercised; source path and canonical instruction remain available. Do not manufacture a live bid for testing.
- No independent reproducible-build/source-to-deployed-binary correspondence established, no upgrade authority migration performed, no Mainnet program instruction, pause flag, collection, token supply or NFT ownership modified.
- Operator announcement/recovery communication and source/binary review remain required. Browser storage is durable only within the current browser, not a server-side receipt archive or WORM backup; users are told to retain signatures/browser data. On-chain wallet-based position recovery works independently of local cached position data.
- External Magic Eden/Tensor aggregation, Earn/Embed cutoff, broad navigation/docs cleanup, historical terms/retention sign-off and final end-to-end acceptance are not claimed complete.