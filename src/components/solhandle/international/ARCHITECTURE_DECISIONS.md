# International Handles V1 — architecture decisions

Date: 2026-10-20
State: PAUSED / BACKLOG as explicitly requested on 2026-10-20. Preserved proposed design only; NOT IMPLEMENTED OR AUTHORIZED FOR DEVNET OR DEPLOYMENT. See PLAN_STATUS.md before any continuation.
Companion documents: COMPATIBILITY_REPORT.md, REGISTRATION_CONTRACT.md, UNICODE_DATA_MANIFEST.json.

This document resolves design alternatives for review before devnet. It creates no accounts, modifies no active mint path, installs no Unicode implementation and changes no runtime settings. Evidence from the compatibility report remains historical; no new mainnet inventory was taken for this document.

## 1. Decision summary

| Question | Chosen design | Consequence |
| --- | --- | --- |
| New program or extension? | Same protocol program and official collection; versioned new accounts/instructions | Existing assets are not reminted, transferred or moved |
| ASCII/international split? | One canonical namespace; canonical ASCII always selects legacy addresses | A case-folded international input cannot create a duplicate ASCII asset |
| Unicode version? | Explicitly pinned Unicode 17.0.0 candidate dataset, not mutable latest | Exact checksums captured; final release provenance and algorithm conformance remain pre-devnet gates |
| Full Unicode on chain? | Deterministic off-chain engine plus dedicated signed attestations | Validator is a security trust boundary, not a trustless Unicode proof |
| Legacy mint transactions? | V2 registration entrypoints; obsolete registration instructions rejected in a future coordinated upgrade | Old NFT ownership/reads continue; old mint builders must update |
| Collision scope? | One cross-script UTS #39 safety namespace, including ASCII | Script labels do not grant a second visually confusable registration |
| Existing lookalike collisions? | Grandfather each existing canonical identity; block additional registrations in the safety group | No forced renames, confiscation or user remint |
| Bootstrap? | Explicit short registration freeze; finalized export/backfill/reconciliation | No promise of uninterrupted minting; ownership and safe reads stay available |
| Primary handle? | Mutually exclusive legacy PrimaryHandle and new PrimaryHandleV2 | Old clients show no primary for an international selection, never a fabricated ASCII alias |
| Marketplace? | Same asset-based listing/bid addresses, new international handlers and shared verification | Legacy orders remain compatible; no separate international market |
| Payment race? | Dedicated atomic pay-to-handle instructions, not a standalone preflight guard | Lookup and actual transfer validate the same owner in one execution |
| Rollback? | Pause new issuance, retain new record readers permanently | Old binary rollback is not a safe recovery after new records exist |

These are proposed product/security choices, not assertions that the implementation already supports them. Two choices need the builder's explicit sign-off before devnet work: updating old mint/primary builders, and accepting the signed-validator security model. Any later mainnet change needs separate authorization.

## 2. Identity and canonicalization

### Strict new input envelope

New V2 APIs accept a UTF-8 string of at most 512 bytes before canonicalization. Reject malformed UTF-8, unpaired JavaScript surrogates, embedded NUL and control characters. Strip only leading/trailing ASCII U+0020 spaces as an input convenience. Remove at most one leading literal ASCII @ after that strip. Reject any remaining @, internal whitespace, Unicode spaces or a second prefix. Do not use runtime-dependent trim/lowercase as the protocol definition.

Pipeline: strict envelope -> pinned NFC -> Unicode Default Full Case Folding -> pinned NFC -> repertoire/script/mark validation -> pinned extended-grapheme counting -> 1..20 graphemes and 1..80 canonical UTF-8 bytes -> canonical key and safety skeleton. Default folding uses C/F mappings, not Turkic T mappings or locale-dependent lowercase; S mappings do not replace available F mappings. Skeleton is UTS #39 revision 32's skeleton of the canonical name using the matching 17.0.0 data: NFD, confusable mapping, NFD. It is a collision key, not a display label.

Validate the submitted spelling before folding as well: forbid invisible/control/format/compatibility characters in the source rather than allowing folding to hide them. NFC-equivalent composed/decomposed spellings are allowed if their normalized repertoire is allowed. Normalization never strips accents, transliterates scripts or applies NFKC.

Examples defining intended semantics, not executed fixtures:
- @ANSEM and ansem select existing ASCII ansem.
- Straße and strasse canonicalize to strasse, not separate records.
- composed/decomposed é select the same canonical name; e is a distinct canonical name, though safety policy may still block it.
- Greek final sigma folds consistently with sigma.
- Turkish dotted capital I uses default full folding, without a Turkish-locale exception.
- @@ansem, emoji, zero-width joiners and bidi controls fail, not silently clean up.

Display the canonical name before signing, particularly when folding expands characters. NFT metadata uses that canonical name. Any optional user-entered spelling is a non-authoritative UI value, never a lookup key or claimed alternate entitlement. Do not store an unvalidated spelling in a public protocol field.

### Repertoire and script profiles

V1 admits letters and necessary combining marks from these profiles: LATIN (including Vietnamese), GREEK, CYRILLIC, HAN, JAPANESE (Han/Hiragana/Katakana), HANGUL, ARABIC. Start from the pinned Identifier_Status=Allowed repertoire, intersect with the following restrictions; there are no blanket Unicode-letter or script-block allowances.

- ASCII digits 0..9 are the only digits. They are neutral and may accompany one permitted profile. Digit-only identities take the legacy path. Arabic-Indic/fullwidth digits, numeric lookalikes from other categories and all punctuation/symbols are rejected in V1.
- Each letter must be compatible with the chosen profile through Script/Script_Extensions. Neutral digits cannot make a mixed-script word legal. Common/Inherited alone is not permission to use a character.
- Han-only resolves to HAN. Hiragana or Katakana selects JAPANESE; Japanese may include Han. Reject Han plus Latin, Han plus Hangul, and Greek/Cyrillic plus Latin.
- Combining marks must remain attached to a permitted base in the same grapheme, have compatible Script_Extensions and be Identifier_Status=Allowed. Maximum three combining marks per canonical grapheme; reject an identical repeated mark within that grapheme and all leading/standalone marks. This is a deliberately stricter SolHandle profile, not universal language coverage.
- NFC-normalized modern precomposed Hangul syllables are allowed; standalone/conjoining jamo remaining after NFC are out of V1. Han/Hiragana/Katakana cannot gain arbitrary Inherited marks.
- Japanese iteration/prolongation characters are allowed only when their pinned identifier status/category and Script_Extensions satisfy the profile. No block-wide exception for them. Arabic harakat likewise require the same status/base/script/mark limits.
- Reject Default_Ignorable_Code_Point, noncharacters, unassigned/private-use characters, variation selectors, join controls, bidi controls and compatibility presentation forms. Reject compatibility-decomposable source characters even if folding could make them ASCII. Reject emoji characters as name symbols, not ASCII digits merely because they can participate in keycap sequences.

Generate the exact admitted codepoint/mark tables from these rules and freeze their artifact digest before devnet. If a sample fails Identifier_Status or a rule, it stays rejected pending an explicit policy amendment; do not quietly add exceptions to make a demo pass.

Store a compact profile enum, not a user-supplied script string. Browser rendering uses bidi isolation outside the stored bytes. These controls mitigate impersonation; they do not prove universal visual uniqueness across fonts.

### Policy permanence

Canonical identity hash excludes policy version. Existing canonical bytes are immutable. Future Unicode policies must perform a compatibility/collision audit and preserve old resolver mappings; a new policy is not a new namespace. The V1 safety hash names its fixed UTS #39 data generation. A future safety generation must reserve/check both generations during migration and may not reopen occupied groups.

## 3. Program/account boundaries

Keep Config at its existing 187 bytes and protocol_version=2. International registration format=2 and registration API=2 are independent version numbers, not a Config version bump.

Program-owned PDAs proposed for implementation:

| Account | Seeds | Role |
| --- | --- | --- |
| InternationalSettings | intl_settings | Phase, signer, policy digest, revisions, bootstrap commitment |
| CanonicalOccupancy | canonical, canonical_hash[32] | Permanent identity/protection entitlement |
| SafetyOccupancy | safety, skeleton_hash[32] | Persistent cross-script collision state |
| InternationalHandleAccount | handle_v2, canonical_hash[32] | Immutable non-ASCII registration |
| International Core asset | asset_v2, canonical_hash[32] | Core asset created with program PDA signer |
| InternationalNamePolicy | name_policy, canonical_hash[32] | Restriction, premium, override and revision |
| PrimaryHandleV2 | primary_v2, wallet[32] | Current international primary |

Legacy ASCII still uses handle/asset/restriction/premium/price raw-byte PDAs. V2 registration creates CanonicalOccupancy and SafetyOccupancy for ASCII too. InternationalNamePolicy is for non-ASCII; do not create conflicting second premium/price sources for legacy names. CanonicalOccupancy also prevents claimed protection entries from being misread as free.

Every name record links the exact asset. Every consumer checks account owner/discriminator, seeds, canonical bytes/hash, matching asset, official Core program and collection. Core asset's current owner is authoritative; an indexed owner never authorizes a transfer or payment. Update authorities/delegates do not become payment recipients.

Do not close/recycle name or safety occupancy accounts after burn, retirement or sale. Sale changes Core ownership, not identity. Retired identities stay retired in V1. New marker rent is paid by registrant, bootstrap rent by the protocol's authorized funding wallet. Never debit wallets through unsigned background work.

### Occupancy semantics

CanonicalOccupancy has one of RESERVED, PROTECTED, MINTED, RETIRED, recording canonical hash, versioned record/asset pointers as applicable, and the fixed skeleton hash.

SafetyOccupancy has CLAIMABLE_FOR(canonical_hash) or BLOCKED. A new ordinary mint may initialize an absent marker and turn it BLOCKED in the same instruction. A reserved-name claim may use CLAIMABLE_FOR only when its canonical hash matches and its canonical entry is an authorized reservation. Successful mint turns it BLOCKED permanently.

Multiple existing canonical names sharing a skeleton retain separate canonical records and one BLOCKED safety marker. A safety marker never asserts they are the same identity. No new mint/claim may bypass BLOCKED, including an admin claim. Pending reservations colliding with existing mints remain unclaimable until an explicit future policy decision; authority does not permit overriding the protection silently. Exact existing identities still resolve normally.

Unreserving a canonical entry does not automatically free its safety group. Conservative permanent blocking is the V1 default. A future audited group-release process is outside V1, not an implied admin escape hatch.

## 4. Mint API cutover and bootstrap

### Chosen migration instead of optional remaining accounts

Implement four new internal registration entrypoints sharing one gate: mint_handle_v2, mint_handle_with_token_v2, claim_restricted_handle_v2, mint_handle_partner_sol_v2. They preserve the established payment and ownership behavior but supply all safety/attestation accounts explicitly. Existing backend function names are reused to build the new instructions; no duplicate public mint service.

At the eventual coordinated release upgrade, old registration handlers must fail with REGISTRATION_API_UPGRADE_REQUIRED. No fail-open legacy bypass, and no conditional settings check that depends on an absent account. Legacy registration account constraints must avoid init side effects before the rejection where possible; transaction rollback prevents protocol payment/mint but cannot eliminate a Solana transaction fee for a submitted obsolete transaction. Builders detect the required API before requesting a wallet signature.

The choice is intentional: byte-for-byte compatibility for old mint transactions is not promised. Existing legacy resolver, ownership and asset-based order instructions stay supported. Nothing is disabled by writing this document.

### Finite activation state machine

InternationalSettings phase: BACKFILL -> LEGACY_GATED -> INTERNATIONAL_LIVE. A separate registration_paused flag can stop all new registrations. international_paused can stop only non-ASCII registration after activation. Settings always exist for V2 calls; unknown policy, absent state or incomplete bootstrap fails closed.

Release sequence, only with later approval:
1. Reproduce/review the deployed source and stage updated SDK/backend/client builders without routing users to unsupported instructions.
2. Use existing authorized pause control to freeze old registration. No automated signing; obtain required authority signatures.
3. Take finalized exports of mints, restrictions/reservations and policy accounts. Record genesis/program/collection, boundary slot, sorted canonical inventory and cryptographic commitments. Source-of-truth verification occurs on chain, not by trusting database rows.
4. Review collision groups, unresolved reservations and protection decisions. Reject malformed/unverifiable historical data; do not omit it from the proof of completeness.
5. Upgrade to reviewed V2 implementation with new registration disabled; initialize InternationalSettings in BACKFILL. Old mint entrypoints remain rejected.
6. Backfill idempotently in bounded batches. Legacy records and policy PDAs authenticate canonical entries; the dedicated validator attests skeletons. Publish audit records containing public names/commitments, not personal logs.
7. Reconcile immutable commitments and operator-reviewed counts. On chain verify authorized batch writes and expected committed export root/count; acknowledge that proving every program account was exported still requires finalized off-chain enumeration/reconciliation. An admin-set boolean alone is not completeness evidence.
8. Enter LEGACY_GATED: resume ASCII only via V2, now reserving safety state write-through. Verify catch-up against the gate. International remains off.
9. Enter INTERNATIONAL_LIVE only after independent approval and acceptance criteria. No second unprotected legacy window.

No users remint or move their NFTs. A temporary registration outage and protocol-funded marker rent are explicit costs. The full collision export/backfill tools are not implemented by these decisions.

## 5. Validator and authorization governance

Use a dedicated international attestation key, distinct from treasury, upgrade/config authority and existing monetary quote signers. Do not repurpose HANDLE_QUOTE_SIGNER_KEYPAIR or the devnet partner quote key as the Unicode key.

The validator attests canonicalization, grapheme length and safety skeleton. The chain recomputes canonical hash from signed bytes, validates bounded serialization, verifies identity/occupancy and computes SOL reference prices using existing prices/rush/premium/override logic. Monetary conversion quotes remain separately authorized; validator authorization alone cannot substitute for a HANDLE or partner quote. International grapheme count is still a pricing trust input.

This is NOT permissionless Unicode validation. A compromised validator can attest a false skeleton, script or length and cause inappropriate pricing or impersonation despite account uniqueness checks. Authority cannot custody the asset, but can censor registrations. Accept this limitation explicitly; if trustless Unicode enforcement is required, stop this architecture and redesign rather than claiming signatures solve it.

Signer rotation increments epoch and settings revision and invalidates outstanding old attestations immediately. Permit one active epoch only; planned overlap is not needed in V1. Pause first for emergency rotation. Keep signed, non-secret audit evidence for each mint. Administrative policy/signer changes require the existing protocol authority; no unimplemented multisig is claimed. Production signing custody, offline recovery and any multisig transition require a separate approved operational plan. Devnet uses entirely separate keys and genesis identity.

## 6. Prices, primary handles and marketplace

### Pricing

Price by canonical grapheme count AFTER folding, not bytes, submitted-spelling count or JavaScript string length. ASCII tiers and current pricing formula remain unchanged; international uses the same five tiers with 5+ clamped. Preserve current override/rush/premium arithmetic and checked u64 amounts. Bind relevant account revisions/contents into authorization so stale quotes fail on chain.

No new international surcharge, hidden registration fee or invented SOL price. Registrants review additional account rent/network fees separately. Protection/premium/override updates use the same shared policy governance and must not release occupied groups.

### Primary

Existing primary selections remain untouched until the owner changes one. New set_primary_handle_v2 accepts either verified record type and owner signature:
- selecting ASCII writes legacy PrimaryHandle and closes a verified existing PrimaryHandleV2 to its wallet owner;
- selecting international writes PrimaryHandleV2 and closes a verified existing legacy PrimaryHandle to its wallet owner.

The old set_primary_handle handler must reject in the future upgrade to prevent a stale second source being created. New setters require both PDA addresses even when one is absent, verify exact ownership/seeds before any close, and never close arbitrary accounts. Both absent means no primary. Both present is an invariant error, not timestamp-based precedence. Reverse lookup always rechecks current Core ownership; a transferred primary returns stale/null and never pays an old owner.

Old SDKs can still resolve legacy names, but return no primary after an international selection. This is safer than a stale legacy fallback; no invented ASCII alias is created. Primary changes made by obsolete builders need an update, separately from continued read compatibility.

### Marketplace

Keep listing/bid PDAs and existing account layouts, royalty destinations and delegate behavior. Add international variants for each action that currently takes Account<HandleRecord>, sharing reviewed validation/payment/transfer helpers with legacy handlers. Verify actual linked account constraints for all list/buy/delist/place/accept/cancel actions before implementation; do not assume only listing needs a new decoder.

Legacy orders keep their existing handlers and addresses. International records use the new variants; no unchecked polymorphic deserialization on an old discriminator. Emit versioned international events carrying canonical name/hash, registry format and asset; preserve existing ASCII events expected by older indexers.

## 7. Resolution, SDK and indexer contract

Publish a major SDK capability update; keep stable legacy helper meanings. Add explicit V2 canonicalization/derivation helpers and return canonicalName, canonicalHash, registryFormat, registrationPolicyDigest, recordAddress, assetAddress, current owner, verification and destination-safety fields. Registration capability discovery is distinct from Config.protocol_version=2.

Use an implementation driven by the pinned tables, with one shared deterministic engine artifact in browser/backend and golden vectors for any independent implementation. Runtime normalize, locale casing and Intl.Segmenter may assist display only, never authoritative registration or quote logic. No package is selected or installed here; producing and verifying that engine is a pre-devnet deliverable.

Resolver selects the exact canonical path; no fuzzy resolution or first-match selection. Verify official collection AND linked record/PDA, not merely NFT metadata. CanonicalOccupancy is for registration/protection, not a replacement for verifying ownership. An unavailable validator must not prevent on-chain lookup of already canonical valid names using the pinned local engine; retain historical policy data for existing identities.

Reuse resolveSolHandle, reverseResolveSolHandle, getHandleAvailability, current index synchronization and existing partner/read services. Backend and UI must propagate INVALID_NAME, SAFETY_COLLISION, RESERVED, POLICY_UNAVAILABLE, REGISTRATION_API_UPGRADE_REQUIRED, OWNER_CHANGED, STALE_PRIMARY and RETIRED distinctly. Network errors are not availability.

Additive index fields later: registry_format, canonical_hash, skeleton_hash, policy_digest, canonical_utf8_bytes, grapheme_count, script_profile, verified_slot. Keep the current public handle field canonical. Counts/prices must not reuse its ambiguous legacy length for international data. Sensitive validation/signing logs stay separate and private. No entity or permissions were modified here.

## 8. Atomic payments and scope boundaries

Choose pay_handle_sol_v1 and pay_handle_token_v1 in the SAME program, independent of registration pause. Each instruction verifies exact record/Core collection/current owner and expected recipient, then performs the actual transfer by CPI in that instruction. The Core asset remains read-locked throughout the transaction; a competing transfer cannot race between validation and payment. Do not use a separate guard followed by arbitrary transfer instructions.

Sender signature authorizes the payment, not a saved contact session. Only ordinary validated wallet recipients are supported in V1. Native SOL keeps SystemProgram wallet safety checks. Token paths allow only configured official mint/program pairs and exact raw amounts; ATA address, owner, mint, decimals and destination must be verified. ATA creation can precede the instruction, funded explicitly by sender. Reject unsupported Token-2022 transfer hooks/fees or other extensions instead of assuming a generic token transfer is equivalent. Preserve existing supported HANDLE behavior only after its actual mint extensions are inventoried and supported in the reviewed CPI path.

Bind payer, expected owner, canonical identity, asset, destination, amount and payment asset in the user's signed transaction. Direct payment re-resolves at execution; owner mismatch fails with OWNER_CHANGED rather than silently redirecting. Existing PayLinks remain bound to recipient_wallet_at_creation; a changed owner invalidates the link. Preserve request single-use/submission/receipt semantics in existing backend lifecycle logic; do not claim this new instruction makes database request state trustless.

Atomic payment guard implementation is a distinct later work package, not needed to demonstrate registration on devnet. Until it is ready, do not enable international names in public payment flows or advertise race-safe payments. Existing ASCII payments are unchanged by this document. Full international product activation requires that guard plus updated signed-transaction validators and receipt evidence.

## 9. Operational limits and recovery

Registration uses v0 transactions when the measured account/signature budget requires them. A reviewed, network-specific lookup table may contain only stable public addresses. Payer and required signer keys stay static, and every resolved lookup address is verified against expected accounts. No opaque caller-supplied lookup table, no unchecked legacy fallback, and no weakening validators to make a wallet sign. Packet size <=1232 bytes, compute/rent and Phantom/Backpack support must be measured before choosing final builders. Two authorization domains may require two Ed25519 verifications; retain both unless a separate audited key policy is explicitly approved.

Names/occupancy remain persistent after an emergency. Pause issuance without disabling valid reads, ownership transfer or the independent payment feature. Recover by a forward program upgrade preserving new decoders/state, not blind redeployment of the old binary. A defective Unicode policy requires a reviewed successor and compatibility map; never reinterpret minted identities in place or delete safety markers to reopen sales.

## 10. Before any devnet proof of concept

Required tangible outputs:
1. Explicit acceptance of mint/primary builder cutover and validator trust/censorship limitations.
2. Candidate Unicode source provenance finalized; generated repertoire/engine/data artifact digests frozen; full normalization/grapheme/skeleton conformance and cross-runtime golden vectors.
3. Legacy/protected/reserved canonical and skeleton collision export, with every conflict classified and proposed blocking behavior reviewed.
4. Borsh/IDL layouts, discriminator values, account lists, signer/readonly flags, known byte vectors and packet/compute plan from REGISTRATION_CONTRACT.md materialized and reviewed.
5. Reproducible build/source review and isolated devnet identity/key plan; no accidental production-program imports.

These are engineering deliverables, not unresolved competing architecture choices. The first devnet experiment is one international SOL mint, one ASCII V2 mint, one canonical-alias rejection and one cross-script safety rejection under an isolated test configuration. Partner/token/marketplace/payment regressions follow in separate coherent work packages; nothing is presented as already tested or deployed.