export const partnerMintPhases = [
  { number: '1', title: 'Protocol foundation & devnet MVP', deliverables: ['Approved partner registry and authority-controlled on-chain partner accounts', 'Atomic SOL payment: 50% partner, 50% protocol; official NFT minted to the user', 'Availability, current-price quotes, prepare, submit and confirmation contracts', 'Verified attribution, basic analytics and partner mint deep links'], gate: 'Devnet security, concurrency, exact-lamport settlement and legacy-flow regression tests must pass before a separately approved mainnet upgrade.' },
  { number: '2', title: 'SDK, component, widget & partner dashboard', deliverables: ['Extend the existing solhandle-sdk without breaking resolution integrations', 'React mint component, hosted widget and permitted white-label presentation', 'Partner-scoped dashboard, API credentials and domain verification', 'Reliable funnel analytics, wallet compatibility and integration examples'], gate: 'Pilot partners must complete end-to-end acceptance tests; dashboard isolation, widget signing compatibility and credential controls must be reviewed.' },
  { number: '3', title: 'Wallet-native distribution & enterprise tooling', deliverables: ['Wallet-native examples and mobile integration adapters', 'Onboarding portal with approval-controlled registration and wallet changes', 'Signed webhooks, enterprise reporting and partner campaigns', 'Expanded branding, operational monitoring and incident procedures'], gate: 'Production pilots, mobile signing, webhook replay protection and operational readiness must pass before wider rollout.' },
];

export const partnerMintSections = [
  { id: 'status', title: 'Status, scope & partner proposition', body: `**Phase 1 foundation in development · not deployed · 2 October 2026.** Financial policy is approved: treasury receives odd-lamport rounding, network/rent/storage costs are excluded from the split, and Partner Mint excludes Earn primary-mint commission for the same transaction. The first source-code work package adds an authority-controlled on-chain registry and separate settings; it does not yet include the partner mint instruction, API or checkout. Rust/local-validator verification and devnet deployment remain pending. No mainnet upgrade or live revenue-sharing integration has been performed.

**Integrate SolHandle. Offer @handles directly inside your product. Earn 50% of eligible SOL mint revenue.** Your interface. Our protocol. Shared revenue.

An approved wallet, dApp, terminal or marketplace may let its user search, review a live price, sign and receive the official SolHandle NFT without visiting the main website. Phantom and Backpack are illustrative integration targets, **not confirmed partners or endorsements**.

The split applies **only to paid SOL Partner Mints**. Existing direct SOL mints, $HANDLE payment/burn flows, marketplace royalties, SolHandle Pay and free official claims remain unchanged. $HANDLE is not an eligible Partner Mint payment option; currency selection must not silently bypass this rule.

Authority remains **blockchain → indexer → database/cache → UI**. SolHandle never stores user signing keys, takes NFT custody or creates a competing collection.` },
  { id: 'baseline', title: 'Existing implementation & required changes', body: `Repository inspection establishes the starting point, not a verification of the deployed binary:

- The existing Rust **mint_handle** instruction validates protocol state, format, restrictions and price, transfers the full SOL fee to the configured treasury and creates a Metaplex Core asset and deterministic HandleRecord atomically. It has **no approved-partner split instruction**.
- The current client uses **solanaMintTransaction** for prepare/submit. Preserve this ordinary mint flow.
- Existing pricing includes tiers, overrides, premium surcharges and time-dependent Rush configuration. Reuse current pricing and reservation logic; never hardcode this document's examples.
- The existing **Partner** entity describes Integration Rewards with active/inactive status, payout wallet and reward weight. Add a linked Partner Mint profile rather than repurposing its statuses or altering distributions.
- The existing local **solhandle-sdk@1.0.1** focuses on resolution. The partner mint methods and React package below are proposed additions, not available exports.

**Blocking dependency:** implement, review and deploy a backward-compatible Solana program extension before advertising automatic 50/50 links. An extra client-side transfer alongside today's full-treasury mint would overcharge the user. A database update or memo cannot enforce settlement.` },
  { id: 'economics', title: 'SOL settlement, rounding & Earn interaction', body: `Revenue means the **protocol mint fee**, including applicable premium surcharge. Network/priority fees, account rent, Metaplex account creation and metadata/storage costs are separate user costs, disclosed before signing and excluded from the split. No discount or partner-selected price is allowed.

| Example fee | Partner | Protocol treasury |
| --- | --- | --- |
| 0.10 SOL / 100,000,000 lamports | 50,000,000 lamports | 50,000,000 lamports |

Use checked u64 integers on-chain and BigInt in SDK code. Transport lamport amounts as decimal strings; SOL values are display-only. Approved odd-lamport rule (2 October 2026): **partner = floor(price / 2); protocol = price − partner**. The indivisible remainder goes to the treasury. Test 100,000,001 lamports explicitly.

Approved policy (2 October 2026): **Partner Mint and Earn primary-mint commission are mutually exclusive for the same transaction**: pay the partner once, with no additional Earn primary-mint commission. Preserve origin-referral history and unrelated secondary/creator-fee rules; a partner parameter must not rewrite them. This policy still requires enforcement in the upcoming partner indexer/accounting path and regression tests; the existing Earn flow is unchanged.

Free official claims stay in their existing verification flow and earn no partner revenue. No token burn or Integration Rewards Vault distribution is added to the SOL split.` },
  { id: 'registry', title: 'Registry, ownership & approval model', body: `**Proposed application records:**

- **PartnerMintProfile:** unique canonical partner_id, display name, optional existing Partner link, partner PDA, verified revenue wallet, status (pending / approved / suspended / disabled), allowed domains, integration type, approved owner user IDs, revision and verification/audit timestamps. Reuse built-in creation time. Derive totals from receipts, never partner-editable counters.
- **PartnerMintIntent:** ID, cluster, partner ID/revision, claimant wallet, handle, quote digest, metadata URI/hash, expiry, expected accounts, integer fee/split and state (prepared / submitted / confirmed / failed / expired). Preparation neither reserves the handle nor earns revenue.
- **PartnerMintReceipt:** verified signature/instruction index, cluster, partner PDA/ID, handle/asset, owner, exact paid fee/split, recipients, slot and chain time. Idempotency key: cluster + signature + instruction index.
- **PartnerMintEvent:** unique ID, type, partner, intent/session correlation, time, source and verification level. No secrets or seed phrases.
- **Phase 2:** hashed server credentials with scopes/expiry/revocation, domain verification and dashboard memberships. **Phase 3:** webhook endpoints/deliveries and campaign references.

Canonical IDs use 1–32 lowercase ASCII letters, digits or hyphens. Derive a Partner PDA from **[partner, sha256(canonical_partner_id)]**, store the ID and reject mismatches. On-chain initialization enforces uniqueness; do not rely solely on an API read-then-create check.

Protocol authority alone approves, suspends and updates on-chain partners. Revenue-wallet enrollment requires a signed one-time challenge bound to partner ID, cluster, purpose/domain, nonce and expiry, with replay prevention. Dashboard login does not prove wallet ownership. Wallet changes require new proof, authority approval and a revision increment invalidating old quotes.

Phase 1 uses **one verified revenue wallet per partner**; multi-wallet routing requires later review. Passing an arbitrary partner ID never enrolls a wallet or grants revenue.` },
  { id: 'program', title: 'Program extension & authoritative attribution', body: `Proposed accounts/instructions, to be implemented and audited:

1. **PartnerMintSettings PDA:** separate from the existing Config layout, with Config-bound authority, an enable switch and a dedicated quote signer. Settlement is fixed at 5,000 basis points; clients cannot override it. Avoid casually resizing existing accounts.
2. **Partner PDA:** canonical ID, verified System Program revenue wallet, approved status, revision, self-mint exception flag and bump. Authority-signed instructions create/update/disable partners.
3. **mint_handle_partner_sol:** additive instruction reusing name, pause/version, pricing, override, Rush, premium, reservation, collection and deterministic asset validation. Claimant must sign. Enforce partner approval/revision, configured treasury and registered revenue wallet; reject unsupported currencies.
4. Validate a short-lived signed quote on-chain using an Ed25519 verification instruction and the instructions sysvar. Verify the **exact instruction, signer and message bytes**, not merely an Ed25519 program call. Use a dedicated partner quote key, not a user key or implicitly reused $HANDLE quote key.
5. Signed message binds domain separator/version, cluster, program, claimant, normalized handle, partner PDA/revision, revenue wallet, treasury, collection, metadata hash, fee and expiry. Recalculate current pricing on-chain and require the approved quote to match. Check expiry against chain time; proposed validity is 60 seconds.
6. Perform two checked SOL transfers, official NFT creation directly for the claimant and existing deterministic HandleRecord initialization **in one instruction/transaction**. Any failure rolls them back. Failed submitted transactions may still charge Solana network fees; mint revenue cannot settle without the NFT.
7. Emit **PartnerHandleMinted** with partner, owner, asset/handle, fee, split and recipients. Create an immutable Partner Mint receipt PDA derived from the asset for durable attribution when historical logs are unavailable. Receipt rent is separate from mint revenue.

Memo attribution is supplementary, never authoritative. Preserve old Config/HandleRecord serialization and mint interfaces. Share Rust validation helpers rather than creating divergent logic. Finalize account sizes, IDL, compute budget and backward-compatible deployment during implementation review.` },
  { id: 'api', title: 'Proposed API contracts — not live endpoints', body: `These are **target logical REST routes**, not existing endpoints. A gateway/routing layer must implement aliases. Proposed initial Base44 handlers are **partnerMintRead**, **partnerMintTransaction** and **partnerMintEvents** under the published app's /functions/ paths; in-app code invokes them through the SDK. Reuse shared pricing, resolver, metadata and confirmation modules. Backend code owns privileged credentials and quote signing.

| Method and logical route | Inputs | Result |
| --- | --- | --- |
| GET /api/partner/availability | handle, partnerId, cluster | normalized handle; AVAILABLE / CLAIMED / RESERVED / PROTECTED / INVALID; available; checkedSlot |
| GET /api/partner/quote | handle, partnerId, wallet, cluster | live fee/split, quote ID, expiry and program/collection/recipients |
| POST /api/partner/mint/prepare | handle, wallet, partnerId, quoteId, cluster | unsigned transaction, intentId, blockhash, lastValidBlockHeight and expected accounts/split |
| POST /api/partner/mint/submit | intentId, signedTransaction | validated signature and pending state |
| GET /api/partner/mint/status | intentId or signature, cluster | pending / confirmed / failed / expired; verified receipt after success |
| POST /api/partner/events | eventId, event, partnerId, intentId/sessionId | accepted telemetry, never proof of payment |

Illustrative quote, **not a fixed tariff**:

~~~json
{
  "handle": "ansem",
  "partnerId": "example-partner",
  "currency": "SOL",
  "mintPriceLamports": "100000000",
  "partnerShareLamports": "50000000",
  "protocolShareLamports": "50000000",
  "mintPriceSol": "0.10",
  "revenueShareBps": 5000,
  "quoteId": "opaque-server-issued-id",
  "expiresAt": "server-generated ISO timestamp",
  "networkCostsExcluded": true
}
~~~

Prepare **rechecks** the partner, handle, restrictions, price, treasury and collection from chain state. It selects official metadata; supplied revenue wallets, percentages, authorities or asset addresses are not trusted. Reject arbitrary instruction lists/RPC URLs. Use bounded idempotency keys for retries.

Typed errors: INVALID_HANDLE (400), UNAUTHORIZED/PARTNER_NOT_APPROVED (401/403), HANDLE_UNAVAILABLE/QUOTE_STALE (409), QUOTE_EXPIRED (410), RATE_LIMITED (429), RPC_UNAVAILABLE (503), each with a request ID. Pending is distinct from failure. Changed pricing/recipients require a fresh quote and user review, never automatic re-signing.` },
  { id: 'flow', title: 'Atomic flow, submission & recovery', body: `**Search → quote → prepare → wallet review → sign → submit → verify → index → receipt.** Availability is advisory, not a reservation.

- Read selected-cluster chain state and the main site's protected-name policy. Synchronize database protected decisions with on-chain restrictions before activation: a backend-only block cannot secure direct program calls.
- Quote only for approved partners and the intended claimant. Disclose handle, mint fee, split, recipients and separate estimated network/account costs before signing.
- Simulate before approval. Prefer legacy transactions when they fit; use v0 and validated Address Lookup Tables only if needed. Audit resolved addresses, instruction order, size and compute budget. Never bypass wallet warnings; program correctness does not guarantee wallet approval.
- Sign locally. Relay only after validating the signed transaction against its intent, allowed instructions/accounts and cluster. A partner may broadcast directly; indexing must still recover that mint.
- Two claimants cannot both initialize the same deterministic handle. The loser receives no settled mint charge; network fees may apply.
- Retry the **same signed transaction** while its blockhash is valid. After uncertainty query its signature and HandleRecord/receipt before requesting a new signature. An RPC timeout is not proof of failure; never blindly charge again.
- Verify successful official execution, receipt/event, collection, owner, price/split and transfers. Show confirmed state separately; financial totals count finalized receipts. Reconcile confirmation changes/reorgs and recover after outages.
- Save receipts idempotently and reindex durable state. Client mint_confirmed events, URLs and prepared transactions never increase revenue.

A Partner Mint enable switch stops this path without pausing ordinary minting. Suspension invalidates pending partner quotes at execution; completed payments/NFTs remain irreversible.` },
  { id: 'phase-1', title: 'Phase 1 — implementation work packages & acceptance', body: `**Build order:** approve economic/rounding/referral policy → additive program extension → local-validator/devnet tests → approved-profile administration/shared backend → devnet links → independent review → explicit mainnet approval.

Deliver linked profiles and approval UI, unique on-chain IDs, wallet proof, live signed SOL quotes, atomic split, availability/quote/prepare/submit/status services, recoverable receipts, basic events/aggregate reporting and deep-link minting. No self-service dashboard or packaged mint SDK is required in this phase.

Proposed links: **/mint?partner=example-partner** and **/mint?partner=example-partner&handle=ansem**. The future /mint page shows verified partner identity and SOL-only checkout, resolves attribution server-side and preserves it through connect/sign/retry. Bind attribution into the signed quote. Invalid/suspended partners show an explicit error; ordinary minting is a separately chosen fallback, never a silent partner-revenue promise.

**Devnet acceptance matrix:**

| Area | Required cases |
| --- | --- |
| Names | available, claimed, protected, reserved, premium, invalid characters, case normalization, lengths 0/1/20/21 |
| Price | live overrides, Rush start/end, premium, stale/expired quote, odd lamport, overflow, tampered maximum price |
| Partner | approved/pending/suspended/disabled, duplicate ID, wrong PDA/wallet/revision, unauthorized update, changed wallet |
| Mint | success, simultaneous claim, insufficient SOL including rent, cancel, duplicate submit, expired blockhash, uncertain confirmation |
| Security | altered treasury/collection/owner/metadata, forged/replayed/cross-cluster quote, self-mint rule, extra instructions, bad lookups |
| Accounting | exact transfers, no failed-mint revenue, no duplicate Earn primary commission, recovery/idempotency, finalized totals |
| Regression | ordinary SOL mint, $HANDLE burn/treasury, official claims, resolution, primary handle, marketplace, Pay |

Mainnet gate: reviewed program/IDL, reproducible build, devnet evidence, migration assessment, wallet checks including Phantom/Backpack/Solflare, monitoring and suspension controls. Verify deployed artifact/version before enabling links. Publishing this page does not deploy mainnet.` },
  { id: 'phase-2', title: 'Phase 2 — developer products & partner dashboard', body: `Extend **solhandle-sdk** with semantic versioning while keeping resolution compatible. Proposed methods: checkAvailability(handle), getMintQuote(handle, wallet), prepareMint, mint({ handle, wallet }) and getMintStatus. The wallet/provider must supply a public key and local signing method; a wallet-free mint call cannot sign. Type BigInt/string amounts, cluster, expiry, states and errors. Examples default to devnet until release.

Publish a **separate React package** with a proposed SolHandleMint component accepting partnerId, cluster, wallet adapter, theme, buttonText and success/error callbacks. Render search, availability, price, approval, signing, pending and receipt. Allow accessible styling, light/dark, typography, permitted logo visibility and wording. Never expose configurable price, split, protocol rules, collection or authority; payment disclosures remain visible.

Widget target: **/embed/mint?partner=example-partner**. Allow verified frame origins with deliberate security headers. Validate postMessage origin/source, correlation ID and payload. No credentials in URLs. Wallets/browsers may block iframe signing, so implement a top-level link fallback and test mobile behavior before claiming compatibility.

**/partners dashboard (future):** authenticated approved members see only their partner. Enforce membership on every server read/write and data-access rule, not only UI filters. Show Total Searches, Available Searches, Wallet Connections, Mint Attempts, Successful Mints, Conversion Rate, Total Mint Volume, Partner Revenue and Protocol Revenue with network/date filters, loading/empty states and reconciliation time. No invented production activity.

Compute counts/sums/groups server-side from verified receipts and telemetry; paginate details. Proposed conversion: finalized successful mint intents / unique search sessions in the selected period. Handle a zero denominator and annotate late confirmations. Wallet connects are reported telemetry, not verified unique people. Track quote requests separately; deduplicate retries.

Add scoped, expiring, rotatable **server-to-server API keys**, storing hashes only and never shipping secrets in browser SDKs. Public widgets/SDKs use public partner IDs and bounded session/intent tokens; native partners may authenticate through their own backend. Verify domains with DNS TXT or a well-known challenge. CORS/domain allowlists control browser integration, not cryptographic identity or direct on-chain access.

Acceptance: pilot link/SDK/React/widget flows, denied cross-partner dashboard access, revoked credentials/domains, quote tampering, usable errors/iframe fallback and resolution SDK regressions. Publish installation instructions only after packages/endpoints exist.` },
  { id: 'phase-3', title: 'Phase 3 — wallet-native, mobile & enterprise', body: `Wallet reference adapters resolve existing @handles to verified owners, while available names offer a **separate** claim action, reviewed price and official receipt. Preserve payment-destination safety checks. Never mint merely because a handle was entered in a Send field. Phantom and Backpack examples remain hypothetical until each integration is agreed and verified.

Mobile adapters use supported wallet standards, explicit cluster choice, app/universal-link returns, background recovery, expiry and wallet review. A mobile SDK needs a defined native platform/signing interface; a web iframe alone is not a native SDK.

An onboarding portal handles pending applications, domain/wallet proof, memberships and audit history. Registration may be automated, but **activation and revenue-wallet changes remain authority-controlled**. Optional multi-wallet routing requires verified wallets and a deterministic on-chain selection policy bound to each quote.

Signed opt-in webhooks cover finalized mint, partner status and wallet revision. Sign the raw body with timestamp/event ID; implement replay windows, idempotency, backoff/retry, dead-letter inspection and key rotation. Verify endpoint ownership and block private-network/SSRF destinations. Delivery is at least once, not exactly once; never include credentials in payloads.

Enterprise reporting adds paginated exports, reconciliation and consent-aware campaign/cohort analytics. Campaigns change attribution/presentation, **not pricing, 50/50 settlement or protected-name rules**. Future economic changes require separate review.

Expanded branding retains transaction disclosures and invariants. Monitor RPC/index lag, failed quotes, confirmation latency, suspensions, split anomalies and webhook failures; define incident ownership and recovery procedures.

Acceptance: reviewed native/mobile pilots, reconciled receipts, webhook replay/retry/SSRF tests, approval audit trail, retention policy and operational runbook. Reference examples are not endorsements or production partnerships.` },
  { id: 'security', title: 'Abuse controls, privacy & trust boundaries', body: `Phase 1 starts with manually approved partners, verified wallets, on-chain status, signed expiring quotes and IP/session/partner rate limits. Phase 2 adds scoped keys and domain proof. Bound payloads, handle lengths and quote TTL; keep signers in server secrets and audit authority actions.

Default rule: claimant wallet differs from registered revenue wallet. An authority-approved official-partner exemption may allow equality and is recorded on-chain. **This is not Sybil-proof**: a partner can control other wallets. Monitor suspicious patterns and abnormal conversions; suspend abuse without claiming perfect detection.

Only chain-verified receipts generate revenue. Client events are untrusted, labeled, deduplicated and bounded. Partners cannot edit pricing, split, treasury, collection, authority, other partners or confirmed totals. Separate admin permissions from partner membership.

Independently review account constraints and signed-quote parsing. API keys and domains do not replace on-chain authorization; off-chain suspension alone cannot stop direct program calls.

Minimize wallet analytics, define consent/retention/deletion before wider launch and restrict dashboard disclosures. On-chain records are public and immutable: never encode personal contact details in receipts, instructions or memos.` },
  { id: 'integration', title: 'Integration options, rollout & open decisions', body: `**Option A — Mint Link (Phase 1):** link to approved-partner hosted SOL checkout. Lowest integration effort, not a guaranteed five-minute production launch; attribution binds to the quote.

**Option B — Widget (Phase 2):** embed reviewed UI for verified origins, with a top-level signing fallback.

**Option C — SDK/API (Phase 2):** retain native UI while the protocol enforces price, settlement and official NFT identity. API foundations are built in Phase 1; packaged mint SDK follows.

**Phase 3:** native-wallet/mobile adapters, approval-controlled onboarding, webhooks and enterprise distribution.

Approved on 2 October 2026: odd-lamport treasury remainder, separate network/rent/storage costs and Earn primary-mint exclusivity. The initial registry uses a separate quote signer and defaults self-mint permission to false; exemptions and receipt-rent disclosure still require review before the mint route is enabled. Choose a concrete public-domain/API-routing setup and wallet transaction strategy during implementation. This plan creates no domain, key, deployed program or partner account.

Devnet first; then separately approve a mainnet pilot with a small verified allowlist. Keep production Partner Mint disabled until program, API, indexing and accounting are compatible; expand after reconciliation/wallet acceptance. Ordinary minting remains independent.

**Definition of done:** an approved integration mints the same official NFT as the main site to the user's wallet, with exact SOL settlement and durable attribution. Failed mints never settle mint revenue. Financial figures reconcile to finalized receipts. SDKs, widgets and dashboards are layers above this foundation, not substitutes for it.` },
];