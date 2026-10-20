# International Handles V1 — registration and account contract

Date: 2026-10-20
State: PAUSED / BACKLOG as explicitly requested on 2026-10-20. Preserved design contract only; no IDL, Rust instructions, accounts or keys have been created. See PLAN_STATUS.md; do not begin devnet work without an explicit request to resume.
Use with ARCHITECTURE_DECISIONS.md. Format lengths below specify intended Borsh/binary widths, not a claim that an Anchor build has verified them.

## 1. Byte conventions and identity

All pubkeys/hashes are raw 32 bytes. Integers are unsigned little-endian unless explicitly i64. Enums have explicit u8 tags, booleans are u8=0/1 only. Dynamic bytes/strings use u32 little-endian length + exact bytes. No JSON, base58 text, separators between interpolated fields, optional omitted fields or trailing bytes in a signed structure. Reject overlong input, invalid UTF-8 and non-canonical encodings.

CanonicalHash = SHA-256(ASCII bytes of `solhandle:canonical` followed by one NUL byte || u32 canonical UTF-8 length || canonical UTF-8).

SkeletonHash = SHA-256(ASCII bytes of `solhandle:safety:uts39-17` followed by one NUL byte || u32 skeleton UTF-8 length || skeleton UTF-8).

GenesisHash means the decoded 32 bytes of the chain's genesis hash, not its base58 string. Store it in the network-specific settings on initialization and verify against the deployment plan; the program cannot autonomously query an RPC genesis hash. This prevents cross-network reuse only when initialization governance sets the correct value. Program ID and settings PDA are also bound.

Identity keys do not include a policy version. Canonical ASCII [a-z0-9]{1,20} always derives existing record/asset addresses. Non-ASCII uses [handle_v2, CanonicalHash] and [asset_v2, CanonicalHash]. Reject callers that select a different path than the canonical bytes imply. Always derive canonical bumps with find_program_address and verify them.

## 2. Name-record account

InternationalHandleAccount uses its distinct Anchor account discriminator and the following fields in order:
- format_version u8=2;
- canonical_name String, maximum 80 UTF-8 bytes;
- canonical_hash [32];
- skeleton_hash [32];
- policy_digest [32];
- asset Pubkey;
- original_minter Pubkey;
- minted_at i64;
- grapheme_count u8, 1..20;
- script_profile u8;
- official_claim bool;
- bump u8.

Fixed allocation: 8 discriminator + 1 + 4 + 80 + 32*5 + 8 + 1+1+1+1 = 265 bytes. Two of the five 32-byte fields are pubkeys; there are exactly three hash/digest fields. Allocate maximum string space once; do not realloc at mint. Preserve immutable original_minter semantics, with reserved claims setting it to the direct recipient as current legacy claims do. Current ownership is NOT stored as an authoritative field here.

PrimaryHandleV2 uses distinct discriminator: format_version u8=2, canonical_hash [32], handle_record Pubkey, asset Pubkey, updated_at i64, bump u8. Allocation: 8+1+32+32+32+8+1=114 bytes. Canonical display comes from the verified immutable linked record, not duplicated strings.

CanonicalOccupancy fields: version u8=1, canonical_hash [32], skeleton_hash [32], status u8, record_format u8 (0 when no record), record Pubkey (zero before mint), asset Pubkey (zero before mint), bump u8. Allocation: 8+1+32+32+1+1+32+32+1=140 bytes. Canonical name is reconstructed from a verified linked record or authorized reservation evidence at write time; occupancy alone is not a public resolver result.

SafetyOccupancy fields: version u8=1, skeleton_hash [32], mode u8 (CLAIMABLE_FOR=1, BLOCKED=2), claimable_canonical_hash [32] (zero for BLOCKED), bump u8. Allocation: 8+1+32+1+32+1=75 bytes. Never close on sale/burn. No unbounded collision-name vector; keep the full auditable conflict list in the committed bootstrap export.

InternationalNamePolicy fields: version u8=1, canonical_hash [32], restriction u8 (NONE=0, RESERVED=1, PROTECTED=2), premium bool, override_active bool, override_lamports u64, revision u64, reserved_recipient Pubkey (zero when unset), bump u8. Allocation: 8+1+32+1+1+1+8+8+32+1=93 bytes. For an international reserved claim require a nonzero authorized recipient. Any off-chain proof/claim metadata is not a substitute for this bound recipient. Legacy reservations continue using their existing verification/governance and authority authorization, with recipient bound into the attestation.

InternationalSettings fields, in order: version u8=1, config Pubkey, genesis_hash [32], policy_digest [32], validator Pubkey, signer_epoch u64, revision u64, phase u8, registration_paused bool, international_paused bool, bootstrap_root [32], bootstrap_expected u64, bootstrap_imported u64, bump u8. Allocation: 8+1+32*5+8+8+1+1+1+8+8+1=205 bytes. Five 32-byte fields include bootstrap_root. Settings authority is Config.authority; no second arbitrary admin field. Imported counts increment only on new idempotent writes, never retried existing entries. Off-chain reconciliation is still required to establish export completeness.

Review these sizes against generated Anchor InitSpace and actual serialization before implementation. Allocation size is not a rent quote. All new state writes require explicit owner/discriminator/PDA/authority checks and expected settings/policy revisions.

## 3. Validator attestation bytes

Sign exactly the 32-byte SHA-256 digest of this ordered payload; do not sign human-readable JSON:

1. domain: exact ASCII `solhandle:intl:register:v1` plus one NUL byte;
2. genesis_hash [32], program_id Pubkey, settings Pubkey;
3. settings_revision u64, signer_epoch u64, policy_digest [32];
4. route u8: SOL=1, HANDLE=2, RESERVED_CLAIM=3, PARTNER_SOL=4;
5. payer Pubkey, recipient Pubkey, collection Pubkey;
6. canonical_name String(max80), canonical_hash [32], skeleton_hash [32];
7. grapheme_count u8, script_profile u8, record_format u8;
8. expected_record Pubkey, expected_asset Pubkey;
9. uri_sha256 [32];
10. payment_asset u8: NONE=0, SOL=1, HANDLE=2; token_mint Pubkey, token_program Pubkey; exact_amount_raw u64, reference_sol_lamports u64, max_sol_lamports u64;
11. treasury Pubkey, treasury_token Pubkey, burn_amount_raw u64, treasury_amount_raw u64;
12. partner Pubkey, partner_recipient Pubkey, partner_revision u64, partner_settings_revision u64, partner_amount_lamports u64;
13. name_policy_commitment [32], expires_at_slot u64.

Every inapplicable field has the specified zero value, never an omitted field. Native SOL uses zero token fields and raw lamports. RESERVED_CLAIM uses NONE and zero economic amounts; recipient may differ from authority/payer and must match authorized claim semantics. Partner ID text is validated against the exact partner PDA/state rather than substituting for its pubkey.

name_policy_commitment = SHA-256 of this exact sequence: ASCII `solhandle:name-policy:v1` plus NUL; Config pubkey; Config.authority pubkey; Config.collection pubkey; Config.treasury pubkey; the five Config.prices_lamports as five u64 values; Config.protocol_version u8; record_format u8; then four fixed policy slots. Exclude total_minted so another mint does not invalidate the quote. Pause state is checked independently at execution, never authorized by an old commitment.

Each policy slot is: tag u8 || address Pubkey || present u8 || data_hash[32]. On the ASCII path the ordered slots are restriction(tag1), price_override(tag2), premium(tag3), rush(tag4). On the international path the slots are InternationalNamePolicy(tag5), rush(tag4), unused(tag0), unused(tag0). Unused slots contain zero address/present/hash. For each used slot, address must be the exact derived PDA; present=1 requires correct protocol owner/discriminator and data_hash=SHA-256 of the complete on-chain account data bytes. Authenticated absence uses present=0 and zero data_hash; accept only nonexistent or empty SystemProgram-owned expected PDA accounts, never a wrong-program account as absence. Restrictions, overrides, revisions and reserved recipient are thereby bound to the actual supplied state. Recompute this commitment on chain. Freeze and publish actual byte vectors before devnet; off-chain changes cannot override it.

Metadata URI is supplied in the instruction under the existing bounded URI limit and SHA-256 checked against the attestation. URI contents can still change at a mutable host; this digest binds URI bytes, not remote content. Use the existing metadata storage approach and review its permanence separately.

Script profile tags: DIGITS=0, LATIN=1, GREEK=2, CYRILLIC=3, HAN=4, JAPANESE=5, HANGUL=6, ARABIC=7. DIGITS is valid only on the legacy canonical path. Unknown tags reject.

Settings chooses a maximum attestation horizon of 150 slots in V1. Require current_slot <= expiry <= current_slot+150 at consumption with checked arithmetic. This is a slot bound, not a promised number of seconds. Monetary quotes retain their own existing stricter time validity and all checks must pass. Bind the expiry and epochs in signatures; never extend a signed expiry in a backend retry.

### No generic nonce account

Choose registration-specific replay protection, not an additional generic nonce account: record creation is init-only and canonical/safety occupancy writes are atomic and persistent. A second execution for an already minted canonical identity fails even with a fresh blockhash. Never close those occupancy entries or support remint in V1. A failed transaction may retry the same authorization before expiry because it has not performed a registration. Non-mint admin operations use separate authority-signed state transitions/revisions, not this attestation. This is sufficient for this narrowly scoped registration authorization and avoids one permanent per-attempt account.

## 4. Signature introspection

Use a dedicated native Ed25519 precompile instruction carrying one validator signature over the 32-byte payload digest. Program verifies the precompile ID, the exact configured public key, message length/content, signature count and all offsets/bounds. Require all Ed25519 offsets to refer to that same verification instruction, not external instructions. Require top-level registration execution and a preceding validated precompile instruction; disallow CPI invocation of registration in V1 to avoid introspection ambiguity. Do not accept arbitrary earlier verification of a different message/key.

For HANDLE/partner routes preserve distinct monetary quote authorization and its current configured signer/expiry semantics, updated to bind the new route's recipient/asset/policy where necessary. This requires reviewing and versioning quote messages, not reusing an ASCII message with a different interpretation. Verify each required signature with exact message reconstruction. No fallback accepting validator signature as monetary authorization. Account/signature budgeting and v0 lookup validation are pre-devnet gates.

## 5. Required account roles

Common account roles for all V2 registrations:
- payer: writable signer, pays rent and applicable price;
- config: writable because total_minted increments; verify config PDA;
- international_settings: readonly, exact settings PDA and expected phase/revisions;
- canonical_occupancy and safety_occupancy: writable verified PDAs, initialized or transitioned only through allowed states;
- handle_record and Core asset: writable init/create at selected legacy/international addresses;
- collection: writable official Core collection;
- policy accounts: readonly exact legacy restriction/price/premium/rush PDAs or international name policy plus rush; missing optional accounts verified at their exact expected addresses;
- treasury: writable only for applicable SOL payment;
- recipient: expected wallet; payer for ordinary/partner mint, authorized recipient for reserved claim;
- instructions sysvar: readonly exact sysvar address;
- system program and MPL Core program: readonly exact executable program IDs.

Claim route additionally requires current config authority signer; do not require the recipient to sign receiving its NFT. HANDLE route requires exact configured payment state/mint/program, payer token and treasury token accounts with correct writable flags and token authority. Partner route requires exact settings/partner/receipt/revenue accounts and expected revisions. No arbitrary caller-provided destination or account order is accepted as equivalent.

The final IDL must freeze a separate ordered account array per route; this role inventory does not pretend to be a deployable IDL. Monetary routes must validate official token mint/program and extension support. Use the same checked economic calculations and destination invariants as reviewed legacy behavior.

## 6. Atomic order of work

1. Reject unsupported API/settings/network/policy/phase, CPI use and malformed bounded inputs.
2. Verify correct canonical path/hash/PDA, linked policy accounts, expected collection and authorized recipients.
3. Verify validator attestation and any independent monetary quote; verify current effective price/permissions and max-price cap.
4. Validate allowed canonical/safety transitions; create/lock occupancy and record state. Any subsequent failure rolls the entire transaction back.
5. Execute the established SOL payment, token transfer/burn or partner split; create the Core asset directly for recipient; persist immutable registry and occupancy state; increment count with checked arithmetic and emit correct versioned events.

Never persist success, mark an off-chain intent confirmed or send mint-success notifications until chain confirmation/evidence checks satisfy the existing finalization flow. Failed payment/Core CPI must not leave partial reservations. Storage account rent rollback does not refund the Solana network fee.

## 7. Required deterministic fixtures before devnet

Publish actual expected hex/Base58 vectors, not descriptions only, for: canonical hash, skeleton hash, every PDA/bump, each account discriminator/layout, full attestation bytes/digest, name_policy_commitment for present/absent optional accounts, precompile offsets, each ordered route account list, ASCII selection after folding, malformed encodings, wrong genesis/program/settings/recipient, stale epoch/revision, expiry boundaries and duplicate registration.

No such vectors or signature tests have been run by writing this contract. Do not start devnet claiming this design has already been validated.