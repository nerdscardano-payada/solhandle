# Phase 1 implementation record

21 October 2026. Scope in this increment: Marketplace Recovery and stopping new managed native trades/escrow. Earn cutoff and external providers remain separate subsequent work; no Earn setting or accrual policy changed here.

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
- Initial frontend production build completed without a reported compilation error. Final build/status checks are separate from functional wallet acceptance.

## Explicit remaining release/evidence gates

- Wallet-authorized executed cancellation and refund acceptance in a controlled environment, including real supported wallets, reload/timeouts, switch/disconnect and mixed-opcode rejection. No user funds were signed for or moved during implementation.
- There are currently no live native bids in the Phase 0 snapshot, so actual Mainnet cancel_bid refund was not exercised; source path and canonical instruction remain available. Do not manufacture a live bid for testing.
- No independent reproducible-build/source-to-deployed-binary correspondence established, no upgrade authority migration performed, no Mainnet program instruction, pause flag, collection, token supply or NFT ownership modified.
- Operator announcement/recovery communication and source/binary review remain required. Browser storage is durable only within the current browser, not a server-side receipt archive or WORM backup; users are told to retain signatures/browser data. On-chain wallet-based position recovery works independently of local cached position data.
- External Magic Eden/Tensor aggregation, Earn/Embed cutoff, broad navigation/docs cleanup, historical terms/retention sign-off and final end-to-end acceptance are not claimed complete.