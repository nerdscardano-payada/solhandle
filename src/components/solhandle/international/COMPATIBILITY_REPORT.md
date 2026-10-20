# SolHandle International Handles V1 — Phase A compatibility report

Date: 2026-10-20
Status: PRELIMINARY SOURCE + READ-ONLY MAINNET INVENTORY. NOT A RELEASE APPROVAL.

Follow-up design baseline (2026-10-20): ARCHITECTURE_DECISIONS.md and REGISTRATION_CONTRACT.md now resolve proposed alternatives; UNICODE_DATA_MANIFEST.json pins candidate source-data checksums. The observations and unexecuted checks below remain historical, not completed by those documents. Where design alternatives differ, the follow-up contract takes precedence: four V2 mint entrypoints instead of optional legacy remaining accounts, dedicated validator governance, permanent occupancy-based replay prevention instead of a generic nonce account, and mutually exclusive primary accounts. No runtime or mainnet change follows from these decisions.
Scope: architecture and compatibility only. No program, UI, entity, signing configuration, mint instruction or mainnet state was changed. No transactions were signed or submitted.

## 1. Executive decision

A versioned extension is a viable design direction, not yet a demonstrated implementation. Keep every existing registry address and Core asset unchanged. Do not relax the current ASCII validator or enlarge legacy structures in place. International registration needs new bounded accounts, separate policy configuration and a shared registration gate covering every mint entry point.

The supplied specification is accepted as the requirements baseline, subject to the blockers and refinements below. It does not authorize a deployment, activate international registration, or authorize replacement of the existing mint behavior.

## 2. Evidence and limits

Inspected: Anchor.toml; programs/solhandle/Cargo.toml; programs/solhandle/src/lib.rs, partner_sol_mint.rs and partner_registry.rs (selected paths); src/lib/solhandleProtocol.js; src/lib/solhandleSdk.js (selected paths); src/lib/solhandle-sdk/index.js and package.json; base44/shared/solhandleProtocol.ts, solhandleResolver.ts, handlePricing.ts, handleTokenTransactions.ts, partnerMintCodec.ts, partnerMintChain.ts, payAssets.ts, usdtPayTransaction.ts and ownedHandles.ts (selected paths); preparePayTransaction and prepareMarketplaceTx selected dependencies; HandleIndex entity definition; existing mainnet deployment instructions.

This is not an exhaustive line-by-line review of the application, an independent audit, or a proof that current source reproduces the deployed program. No devnet mint, application QA, Unicode conformance suite or transaction simulation was run.

### Finalized mainnet snapshot

Snapshot slot: 459161905. All following values are observations at that slot, not future guarantees.

| Item | Observed value |
| --- | --- |
| Mainnet program | B7xiwfxGcR2Xz7tcUKrkB8Ly6NV8jU7LH1m6GJZRUuf |
| Loader | BPFLoaderUpgradeab1e11111111111111111111111 |
| ProgramData | Gyp5dsp8Nrv1nBWL1Kz2wLZPjJBiZNmXppYVxdfSFUpp |
| Upgrade authority | HkChx7cRLjR2bUkHoyosC3NaGf2GCVP1z4vEfc13dA27 |
| Last deployment slot | 451937801 |
| ProgramData bytes, including loader metadata | 715493 |
| ProgramData lamports | 3635354680 |
| Config | 6quNhyJEdFm1wiNsrw3CA8vs6eQEShi8rTZAoWHpPgnS |
| Config bytes / protocol version | 187 / 2 |
| Config authority | HkChx7cRLjR2bUkHoyosC3NaGf2GCVP1z4vEfc13dA27 |
| Official collection | 7XZzcbeFBxQA63n9avz44vnbpv34hDGYyHfCDmTdPBJP |
| Core program | CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d |
| Mainnet paused | false |
| Base prices, 1 / 2 / 3 / 4 / 5+ | 0.30 / 0.20 / 0.10 / 0.05 / 0.01 SOL |
| Config total_minted | 294 |
| Token payment config | 13msGfBhWaJXvei4jFnNUpZNUysnJxPLMtcMLApXVfPz; enabled |
| Partner mint settings PDA | FAFGZqDQTogPThiBnngRtcTcdBmWR8LBEYX8uCsTnnEj; absent |
| Rush config | 3ogWnLDrozzw9AWfEZEnGLocP7fQcTrTMTypW292iBfG; exists |

SHA-256 of deployed ProgramData payload after the 45-byte loader metadata:
`f80aa41369d37aa1c1072e68e8566da190945b83a9a272c56d96d5b7cf2b68e0`

This matches the historical expected fingerprint in the existing HANDLE upgrade instructions. It is NOT a reproducible-build verification against the current Rust source. A local build artifact was not available in this workspace. Presence of a non-null upgrade authority proves the program is upgradeable at this snapshot; it does not prove key custody, signing readiness or multisig governance.

### Legacy registry inventory

A read-only getProgramAccounts query filtered by the Anchor HandleRecord discriminator returned 294 accounts at finalized slot 459161905.

- All 294 decoded names match `[a-z0-9]{1,20}`.
- Every record address matches its current `handle` + literal-name PDA derivation.
- No duplicate literal names were found.
- SHA-256 of JSON-encoded sorted names: `c026f98dab4014188120d6c7999791b2f11e6b97b48c755191d18ae2edad4285`.
- Under the proposed NFC/default-case-fold/NFC pipeline, these lowercase ASCII names remain unchanged. No transformation-induced canonical collisions are expected within this observed set.
- This does NOT establish absence of UTS #39 skeleton collisions. Pinned Unicode security datasets have not been installed or processed.
- Asset existence, present owner, collection membership and burn/retirement state were not individually reverified for all records.
- Reserved/protected names and premium/override accounts have not been exhaustively exported. Registry enumeration is not a complete protection audit.

## 3. Legacy invariants to preserve

Existing source derives these addresses using the current program ID:

| Purpose | Seeds |
| --- | --- |
| Config | `config` |
| Collection | `collection` |
| Handle record | `handle`, raw ASCII handle bytes |
| Core asset | `asset`, raw ASCII handle bytes |
| Primary | `primary`, owner pubkey bytes |
| Restriction | `restriction`, raw ASCII handle bytes |
| Premium | `premium`, raw ASCII handle bytes |
| Price override | `price`, raw ASCII handle bytes |
| Listing | `listing`, asset pubkey bytes |
| Bid | `bid`, asset pubkey bytes, bidder pubkey bytes |

Keep seeds, account discriminators, historical meaning and existing layout decoders intact. Config is decoded with an exact 187-byte requirement in the client. Use a separate InternationalSettings account instead of casually appending to Config or changing protocol_version from 2, which current mints explicitly require.

HandleRecord and PrimaryHandle allocate names with `max_len(20)`: this is serialized byte capacity, not 20 arbitrary grapheme clusters. Both require versioned extensions for an 80-byte international name. Collection membership alone does not tell an old decoder how to parse a new registry account.

## 4. Mint-route coverage and compatibility conflict

Source exposes four registration paths:

1. `mint_handle`: SOL registration, restrictions/pricing, Core CPI and registry write in one instruction.
2. `mint_handle_with_token`: reference SOL price, signed quote, token transfer/burn, Core CPI and registry write.
3. `claim_restricted_handle`: authority-mediated reserved-name claim, creates an asset for a recipient and deactivates the reservation.
4. `mint_handle_partner_sol`: partner policy/quote/revenue split, Core CPI, registry and receipt.

Every path must eventually reserve the shared canonical/safety keys. Admin claims cannot be a silent exemption. Every protection update that affects the shared registry must use compatible authorization and conflict rules.

### Blocking design decision

An unmodified historical mint transaction supplies neither the new safety account nor an international attestation. A program upgrade cannot make it atomically create arbitrary new writable accounts missing from that transaction. Consequently these two goals cannot both be promised without a concrete alternative design:

- all previously constructed mint transactions keep working byte-for-byte;
- all routes enforce new per-name/skeleton account reservations.

Recommended distinction: preserve existing assets, addresses, ownership, prices and legacy reads; deliberately version registration transaction construction. Update first-party/partner builders before activation. Retain instruction discriminators where practical, but require added remaining accounts/attestation when the global gate activates. Old transaction builders then fail closed with a specific update-required error; never fall back to unchecked minting.

This is a compatibility trade-off requiring explicit approval before implementation, not an authorized change in this report. A zero-mint-interruption rollout has not been established. If stale builders cannot be upgraded safely, international activation remains blocked.

## 5. Recommended versioned architecture

- Preserve legacy ASCII canonical identities and PDA selection. A folded input such as Straße -> strasse must resolve/check the existing ASCII identity, not mint a second asset in the international address space.
- Prefer keeping canonical `[a-z0-9]{1,20}` registrations on the legacy address path. New registry and safety reservations must still apply there.
- Canonical hash must represent identity independently of policy version. Do NOT include a changeable policy version in the identity key so that later policies can remint an existing identity. Registration format, policy version and existing protocol version 2 are distinct concepts.
- Freeze the exact domain separator, binary length framing, seeds and account schema before implementation. Proposed handle-v2 labels are provisional only.
- Specify international Core asset derivation and signing seeds as well as handle-record derivation; the supplied plan does not yet settle the asset address.
- Add bounded InternationalHandleAccount, InternationalSettings, canonical occupancy and safety occupancy accounts. All writes and Core mint/payment must be atomic.
- Add versioned hashed restrictions, premium flags and overrides for international names. All three current features use raw-name seeds and cannot accept 80-byte seeds.
- A name/safety occupancy marker must not become reusable merely because a Core asset is burned or an index row is retired. Re-registration policy requires a separate explicit decision.
- Separate international-mint pause from legacy ownership reads, transfers and safe payment resolution.

### Primary and marketplace

Preserve the old `primary` record and add a versioned pointer or companion account with unambiguous precedence for new clients. Setting a new primary must not leave a stale old primary that old clients mistakenly display as the user's current choice. Exact legacy reads remain compatible; old SDKs cannot be promised to understand newly introduced international identities without an update.

Marketplace listing/bid addresses are asset-based and can remain stable, but handlers accept `Account<HandleRecord>`. They cannot deserialize InternationalHandleAccount automatically. Use version-aware, fully verified registration proofs and updated transaction builders. Preserve existing listings/bids and ownership/royalty behavior. Reuse the same market, not the same incompatible account decoder.

## 6. Attestation trust boundary

The proposed signed validator is an availability and validation authority. It does not custody user NFTs, but a compromised signer may lie about grapheme length or a skeleton because the chain does not recompute the full Unicode rules. On-chain unique accounts do not fix a deliberately false signed skeleton. Emergency key revocation cannot undo already minted malicious identities. This limitation must be acknowledged in the threat model and audit scope.

Required payload refinements:

- deterministic binary encoding and domain separation; no ambiguous delimiter concatenation;
- network/genesis identity, program ID, policy-data digest, settings revision and signer epoch;
- canonical bytes and hash, skeleton hash, bounded grapheme length/script profile;
- payer AND recipient, asset/collection identity, metadata URI digest;
- payment asset, token mint/program, exact raw amount/decimals, maximum reference SOL price and applicable burn/treasury/partner split;
- partner identity/revisions when applicable; protection revision, expiry slot and unique nonce.

On-chain: check owner/discriminator of settings and occupancy accounts, canonical bumps and exact account mappings. Validate the Ed25519 precompile program, message/key/signature offsets, message bytes and relevant instruction ordering; prevent references to unintended instructions. Record consumed nonce atomically if generic one-time authorization is required. Keep occupancy tombstones so names cannot be replayed after account lifecycle changes.

Price authorization must not bypass current on-chain prices, premium/override/rush state or reservations. All client quoted amounts must be integer raw units. Stale settings/protection revisions invalidate quotes. Signer loss or outage fails closed for new registrations, never for valid legacy reads.

## 7. Safe bootstrap of shared protection

Before activation:

1. Pin and verify Unicode datasets and policy artifacts; complete a full legacy/protected/reserved export.
2. Compute canonical and safety groups, including numeric and same-script ASCII lookalikes. Distinct ASCII names may share a skeleton even though canonical names do not collide.
3. Preserve every legacy entitlement. Store collision groups or persistent blocked safety markers rather than requiring a false one-owner mapping for existing conflicts.
4. Authenticate on-chain bootstrap entries from actual program-owned HandleRecords and existing protection accounts. Full skeleton validation still uses the disclosed validator trust model.
5. Define who pays new marker rent, idempotent batch processing and audit commitments. No user remint or NFT movement is needed, but auxiliary account funding is real SOL.
6. Prevent a synchronization race: use a controlled temporary mint freeze or a proven write-through gate with catch-up while legacy remains open. A database snapshot alone is not an atomic launch boundary.
7. Verify reconciliation at a finalized activation boundary and activate the shared gate across all four routes together.

Marker account backfill costs are ADDITIONAL to program upload buffer/rent estimates discussed earlier. No complete SOL budget can be claimed until marker counts/layouts, conflicts and bootstrap procedure are known. No markers or accounts have been created here.

## 8. Existing payments and transfer race

preparePayTransaction resolves before build and again before submission; it uses a native SystemProgram transfer and has a strict allowed-program list. Token payment construction uses transfer_checked plus optional ATA creation and memos; signed-transaction validators reconstruct expected instructions. These are not on-chain NFT-owner payment guards.

Adding a guard requires coordinated builder, signing-validator, submission, receipt and chain-evidence changes for SOL and supported token programs. The guard must read-lock the official asset/registry, compare expected owner and destination, and execute the transfer atomically. Do not add a guard instruction that current signed-message validators reject.

PayLink currently rejects links when ownership differs from recipient_wallet_at_creation. Preserve this protection; do not silently retarget historical payment requests to a new NFT owner. Direct name payments and old recipient-bound requests have different semantics.

Reverse resolver already re-resolves ownership; preserve that for both versions. Keep explicit errors for ambiguity rather than selecting a record by search ranking. Preserve contact ownership-change warnings and sender wallet-session protections.

Supported Pay assets observed: SOL, official USDC/USDT, HANDLE; account handling differs for legacy SPL Token and Token-2022. Do not generalize all token handling into one program ID.

## 9. Partners, SDK and indexer

Partner mint backend is explicitly devnet-only and uses ATJutPfzXiYpf7NXaGPEBek69jHaU8Cy85ekUH8drMGT, not the production identity. Mainnet partner settings were absent in the snapshot. Source partner functionality must not be described as an already active mainnet revenue arrangement. Keep the pilot isolated; separately verify deployed devnet state before extending it.

The local public SDK manifest is version 1.0.1. Its normalization, regex validation and record/primary decoders are ASCII-specific. Backend removes multiple leading @ characters whereas SDK removes one; do not silently reinterpret legacy APIs. Define strict new input-envelope behavior with one optional @, exact whitespace rules, invalid UTF-8/surrogate rejection and an explicit returned canonical name.

Use the existing resolve/reverse/backend architecture and add versioned capabilities where needed; the proposed REST URLs are not already implemented endpoints. Avoid duplicate services. New policy artifacts must be shared as pinned data across runtimes; native browser normalize/Intl.Segmenter are not proof of a fixed Unicode implementation.

HandleIndex lacks policy/registration version, canonical/safety hashes and byte-length distinctions. Plan additive fields or dedicated private audit/occupancy entities with explicit access rules later. Database uniqueness is a performance/integrity aid, never proof of on-chain uniqueness. The public registry export need not include wallets or sensitive validation logs. No entity or access rule was changed here.

## 10. Unicode verification and policy gaps

Unicode references fetched during this inventory:
- https://www.unicode.org/versions/latest/
- https://www.unicode.org/reports/tr39/ (version 18.0.0, revision 34)

Additional normative references for the next architecture review (not all fetched in this inventory):
- https://www.unicode.org/reports/tr15/
- https://www.unicode.org/reports/tr29/
- https://solana.com/docs/core/programs/program-deployment
- https://solana.com/docs/core/pda
- https://solana.com/docs/core/programs/precompiles
- https://developers.metaplex.com/core/transfer

The fetched Unicode latest summary labels 18.0.0 but retains a preliminary-draft warning; UTS #39 revision 34 identifies itself as stable. Therefore do not select production datasets from the mutable /latest page alone. Confirm final archived release files, mutually compatible versions, licensing and SHA-256 checksums before locking policy. No Unicode package was installed and no dataset checksum has been certified.

Still specify: allowed characters and marks per script, Script_Extensions resolution, mark repetition limits, Japanese shared marks, Arabic mark contexts, Hangul jamo treatment, Default_Ignorable rejection, and exact behavior for Turkish dotted I/Greek sigma. Vietnamese belongs in Latin acceptance fixtures. One to twenty graphemes AND eighty bytes is the proposed limit, not a claim every twenty-character name fits.

UTS #39 skeleton equality is a policy rule, not a guarantee that every visual impersonation is detected. Do not promise universal visual uniqueness. Render RTL names with display isolation outside stored name bytes; prohibit bidi controls within names.

## 11. Outstanding release blockers

- Reproducible local build match with deployed program and complete dependency/IDL inventory.
- Full registry + reservation/protection snapshot, pinned skeleton analysis and conflict disposition.
- Approval of required old mint-builder updates and safe activation/bootstrap boundary.
- Exact international account, asset, primary, restriction and marketplace compatibility design.
- Accepted validator trust model, signing governance and audited introspection encoding.
- Versioned Unicode implementation and conformance fixtures across runtimes.
- New-marker rent, metadata/storage, compute and transaction-size measurements, not only upgrade cost.
- Local/devnet regression, wallet, transfer-race and partner integration coverage.
- Independent security review, pause/recovery rehearsal and explicit later mainnet authorization.

## 12. Next bounded deliverable

Produce a policy/architecture decision record and pinned-data manifest, with legacy collision export and transaction/account layouts. Only after those decisions are accepted should an isolated devnet proof of concept mint one international asset. Do not deploy or alter active legacy minting to advance this preliminary report.

Phase A is PARTIALLY COMPLETE: actual source/snapshot evidence is recorded; exhaustive protection inventory, skeleton collision analysis, reproducible build and final architecture approval remain open. Phases B–G have not been implemented.