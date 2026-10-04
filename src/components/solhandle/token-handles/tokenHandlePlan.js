export const tokenHandleSections = [
  { id: 'concept', title: '1. One protocol. Two namespaces.', body: `**@ for wallets. $ for tokens.**

Today, @handle resolves to the current wallet owner of a SolHandle NFT. The proposed second namespace resolves a verified $SYMBOL to one exact Solana token mint.

- **@ = who:** wallet identity, NFT ownership, transferable and tradable.
- **$ = what:** verified token identity, bound to a mint, not freely transferable and not speculative.

Example: send 1,000 $HANDLE to @hawk. Two independent resolvers identify the asset and the destination. This plan does not move tokens, hold funds, or change existing @ handles.

**Planned, not live:** token detection, claims, verification, registration and token resolution described here are not yet enabled. The existing $HANDLE payment token is separate from this proposed namespace.` },
  { id: 'rules', title: '2. Binding rules and safety policy', body: `1. One normalized symbol binds to exactly one mint.
2. One mint has exactly one primary token handle.
3. The candidate comes from validated on-chain metadata, never a user-entered ticker.
4. The claimant enters the mint address first.
5. Token control and entitlement to the project identity are separate checks.
6. Known symbols are protected, not first-come-first-served.
7. No marketplace sales, offers, arbitrary transfers or speculative NFTs.
8. Every security-sensitive decision requires recorded evidence.
9. Canonical resolution requires a finalized, active on-chain registration.
10. Uncertainty, conflicting evidence or unavailable verification blocks issuance.

**Strict MVP:** every claim requires two distinct authorized reviewers. An authority match is evidence, not final approval. No absolute guarantee of legitimate project ownership is possible; verification is not an investment recommendation or a guarantee of token safety.` },
  { id: 'detection', title: '3. Enter a mint, detect the token', body: `Planned page: **Claim Token Handle**.

Enter Solana token mint address → Find Token → token details → candidate $handle → verification → reviewed approval → registration.

The server validates the address, Mainnet genesis hash, account owner and actual initialized mint layout. Support the legacy SPL Token program and Token-2022. A public key alone is not enough: token accounts and unrelated accounts must be rejected.

Display name, raw symbol, normalized candidate, full mint, token program, metadata source, metadata update authority, mint authority, freeze authority and relevant extensions. Missing metadata or revoked authorities are shown honestly, not guessed.

Token name and symbol are not globally unique or inherently official. Off-chain metadata is untrusted display content, never ownership proof. If fetched, apply SSRF protection, size limits and timeouts; do not execute its contents.

For SOL, define a separate protected policy: native SOL is not an SPL mint. Wrapped SOL must never silently be presented as the native asset.` },
  { id: 'normalization', title: '4. Symbol normalization and Unicode', body: `The canonical MVP symbol must match:

\`^[A-Z0-9]{1,10}$\`

Preserve the raw symbol in evidence. Trim permitted surrounding ASCII whitespace, apply NFKC, uppercase, remove at most one leading ASCII $, then validate. Interior whitespace, repeated $, punctuation, emoji, zero-width characters and Cyrillic lookalikes are not accepted.

**Strict protection:** inspect the original input before NFKC. Non-ASCII characters, including full-width lookalikes that NFKC would convert to ASCII, require manual review; normalization must not hide their presence.

Examples: handle, Handle, $handle and surrounding ASCII spaces produce HANDLE. The user cannot edit the candidate.

Invalid metadata symbols enter manual review. Manual review is not permission to bypass the on-chain ASCII rule; a compliant, reviewed project path is required.` },
  { id: 'status', title: '5. Availability and claim states', body: `Keep identifier status separate from workflow state.

**Identifier status:** AVAILABLE, RESERVED, PENDING, VERIFIED, SUSPENDED or RETIRED. AVAILABLE only means no known registry restriction; it is not permission to register.

**Claim workflow:** STARTED, EVIDENCE_COLLECTED, AUTHORITY_PROVEN, MANUAL_REVIEW, APPROVED, REGISTRATION_PENDING, FINALIZED, REJECTED or EXPIRED. Recovery adds RECOVERY_PENDING. SYMBOL_MISMATCH is a review flag, not an automatic rename.

A rejected claim does not permanently poison an available symbol. PENDING locks have bounded expiry and must not enable squatting or denial of service. Only final on-chain registration grants canonical verified status.` },
  { id: 'protected', title: '6. Protected token registry and collisions', body: `Maintain a token-specific protected registry, separate from protected @ names.

Record normalized symbol, expected mint where known, project name, verified website, RESERVED or VERIFIED status, reason, provenance and review history. SOL, USDC, USDT, BONK, JUP, JTO and PYTH are proposed protection candidates, not claims that official mints have already been populated.

For a reserved symbol with an expected mint, a different mint must fail with TOKEN_MINT_DOES_NOT_MATCH_RESERVED_TOKEN. The expected mint still requires claimant and project verification.

A second mint cannot claim a VERIFIED symbol. Multiple credible projects sharing an unregistered symbol require manual conflict review. A newly created token with matching metadata does not establish ticker entitlement.

No token index can prove that no competing symbol exists across all of Solana. Record the sources and coverage of conflict checks; incomplete checks are not evidence of absence. Define protection criteria, reviewer policy, appeals and dispute handling before issuance.` },
  { id: 'authority', title: '7. Central authority verification engine', body: `One server-side verification engine accepts mint, claimant wallet and server-derived symbol. Adapters collect evidence:

- **Metaplex:** derive the metadata PDA; validate its program owner, account layout and embedded mint; inspect update authority and mutability.
- **Token-2022:** validate metadata and metadata-pointer extensions, their bindings and relevant authorities. Pointer authority alone is not equivalent to project ownership.
- **Mint authority:** supporting evidence only, never sufficient by itself for approval.
- **Launchpad creator:** use documented, validated on-chain accounts and program versions. Creator history is not necessarily current project control.
- **Manual project review:** official channels, domain control, multisig authorization, documented history and independent corroboration.

Return authorityProven, method, claimant, mint, raw and normalized symbols, evidence confidence, slot and evidence references. Keep approvalStatus separate. Do not let a single verified boolean conflate wallet control, project legitimacy and finalized registration.

Null authorities do not imply fraud or automatic rejection. With no sufficient current proof, use MANUAL_REVIEW_REQUIRED. Historical first-transaction senders and token listings are supporting evidence, never definitive ownership proof.` },
  { id: 'challenge', title: '8. Wallet proof without blind signing', body: `A server-generated, cryptographically random one-time challenge expires after five minutes. Bind its exact signed bytes to:

- SolHandle Token Verification and the trusted application domain.
- Solana network and genesis hash.
- Claim ID, full mint, normalized symbol and claimant public key.
- Nonce, issued time, expiry and purpose.

Before signing, display the token, $handle and full mint with: **This does not transfer tokens or SOL.**

Verify the signature server-side against the exact stored message. Require the matching wallet, claim, domain, mint and symbol. Atomically consume the nonce to prevent concurrent replay; do not use a read-then-update sequence as a security lock.

Message signing proves wallet control, not permission to debit funds. Wallets or project multisigs without compatible message signing require a separately reviewed authorization path, never a bypass.` },
  { id: 'approval', title: '9. Review and verification governance', body: `For the strict MVP, two distinct authorized reviewers must independently approve token control, project identity and ticker entitlement. A claimant cannot approve their own application. Record reasons and evidence for approvals, rejections and disputes.

Protected symbols, authority inconsistencies, ownership disputes, launchpad evidence and missing proof require explicit review. No auto-issuance until an independently audited policy is separately approved.

Approval binds the exact mint, symbol, claimant, network and evidence revision, with a short validity period. Changed metadata or authorities invalidate stale approvals pending re-check.

Immediately before registration, refresh chain evidence at finalized commitment. Relevant current authorities must also be checked on-chain where supported; otherwise the approved evidence freshness policy must fail closed against authority-rotation races.` },
  { id: 'registry', title: '10. Non-transferable on-chain registry', body: `Use registry accounts, not transferable NFTs.

Deterministic forward PDA: ["token_handle", normalized_symbol].

Deterministic reverse PDA: ["token_handle_mint", mint].

Create both atomically. The program enforces symbol uniqueness AND mint uniqueness independently of the database.

TokenHandle stores version, symbol, mint, claimant, verification policy/authority reference, method, status, evidence hash, approval expiry or revision, created/updated timestamps and bump. The reverse record binds the mint to the corresponding forward PDA.

Recommended instructions: register_token_handle, update_token_handle_authority, suspend_token_handle, restore_token_handle and retire_token_handle. No generic transfer_token_handle.

Validate canonical PDA derivation, valid mint program/layout, signer roles, account ownership and allowed status transitions. Suspension and retirement preserve historical bindings rather than closing accounts and silently freeing identifiers.` },
  { id: 'registration', title: '11. Atomic registration and verifier custody', body: `Registration requires the claimant plus the configured threshold verification authority. Reviewer decisions must be cryptographically bound to the exact registration; a lone backend hot key must not be able to bypass the two-reviewer policy.

Before signing, validate the full transaction: program, instruction data, writable accounts, fee payer, signer set, mint, symbol, recipient, expiry and any fee. Do not expose an arbitrary transaction-signing endpoint.

Use segregated verifier roles, protected signing infrastructure, least privilege, key rotation and revocation. Critical governance changes require multisig approval and a defined delay where appropriate. These controls are launch requirements, not protections already implemented.

Re-check forward and reverse PDAs, approval validity and authority state. Simulate, request explicit claimant transaction approval, submit and wait for finalization. Expired or pending transactions do not become VERIFIED. Recovery must find the original signature and accounts before retrying.

Upgrades and verifier-policy changes are part of the trust model. Publish who can approve, suspend, recover and upgrade the registry.` },
  { id: 'storage', title: '12. Indexing, evidence and audit trail', body: `The blockchain is authoritative; the database is an indexing and review layer.

TokenHandleRecord includes symbol, display handle, mint, token name, claimant, method, review and registration states, finalized registration signature, registry addresses, metadata and mint authorities at claim, metadata URI, evidence hash/references, chain slot, timestamps and last check.

A signed-message challenge does not produce a blockchain transaction: store its proof separately instead of inventing a verification transaction signature.

Audit actions include CLAIM_STARTED, AUTHORITY_VERIFIED, CLAIM_APPROVED, HANDLE_REGISTERED, AUTHORITY_CHANGED, METADATA_CHANGED, HANDLE_SUSPENDED and HANDLE_RECOVERED. Store previous/new state, authenticated actor, reasons, evidence references and timestamp.

Protect audit integrity with append-only access and independently retained hash/checkpoint evidence. A normal editable database log is not immutable. Keep sensitive proofs private; public profiles show only safe verification summaries.

Required storage semantics: enforce unique canonical symbol and mint, atomic nonce consumption, approval revisions and bounded claim locks. Confirm the chosen storage actually supports these guarantees before implementation; a preliminary lookup is not a unique constraint. On-chain uniqueness remains mandatory.` },
  { id: 'security', title: '13. Security and adversarial acceptance gates', body: `- Verify Mainnet genesis hash and finalized evidence; require agreement from independent RPC providers for critical reads. Disagreement blocks issuance.
- Re-fetch all security data server-side. Never trust frontend metadata, prices, addresses or authority results.
- Apply authenticated roles, isolated claims/evidence, least-privilege reads/writes, rate limits and anti-abuse controls.
- Protect challenge endpoints from replay, concurrency and cross-domain/network reuse.
- Block Unicode confusion, fake mint accounts, malicious metadata and mismatched pointers.
- Enforce atomic forward/reverse uniqueness and stale-approval rejection.
- Protect admin decisions against self-approval, privilege escalation, evidence edits and missing audit records.
- Test duplicate claims, simultaneous registration, revoked/rotated authorities, spoofed projects, expired transactions, recovery attempts and resolver suspension behavior.
- Require an independent security audit, remediated findings, Devnet acceptance and explicit Mainnet approval.

**Fail closed:** an RPC outage, missing metadata or unresolved identity dispute must never silently turn into approval. Verification does not certify token economics, extensions or transaction safety; wallets must still assess transfer restrictions and risk.` },
  { id: 'resolver', title: '14. Resolver, SDK and proposed API', body: `Proposed SDK: resolveToken("$HANDLE") → exact mint and active verified status; reverseResolveToken(mint) → canonical $handle. Later, a unified resolver may return namespace, identifier, address and verification state.

Verify finalized forward/reverse bindings and active status. Database or cache entries alone cannot establish canonical verification. Publish freshness policy; stale or unreachable state is unavailable, not silently verified. Suspended and retired records may expose historical information but cannot return active verified routing.

Proposed API contract:

- GET /api/token-handles/HANDLE
- GET /api/token-handles/by-mint/:mint
- GET /api/token-handles/check/HANDLE
- POST /api/token-handles/claim/start
- POST /api/token-handles/claim/challenge
- POST /api/token-handles/claim/verify
- GET /api/token-handles/claim/:claimId

These are planned contracts, not live endpoints. Production routing and authorization must be implemented and validated before SDK publication. Claim status and evidence endpoints require appropriate access.

Never resolve an arbitrary token by ticker search alone. Existing @ resolution and SDK behavior remain backward-compatible.` },
  { id: 'profiles', title: '15. Public profiles and admin review', body: `Planned public route: /token/HANDLE.

Show $HANDLE, token name, Verified Token Handle only after final registration, full mint with copy action, network, verification summary and explorer link. Project links and an associated @handle require independently verified association; do not infer them from a matching name.

No Transfer, List for Sale, Make Offer or Buy Now. Future Send and Swap actions must use the resolved mint and separately confirmed destination, with their own transaction-safety checks.

Admin queues: Pending, Authority Proven, Manual Review, Approved, Verified, Rejected and Suspended. Show evidence, authorities, protected-symbol checks, conflict findings and independent reviewer decisions. Approve, Reject, Suspend and recovery actions require authorized roles and audit records.

The public verified badge means registry identity verification, not endorsement, investment advice or an assurance that a token is safe.` },
  { id: 'recovery', title: '16. Rotation, recovery and rebranding', body: `No freely transferable token handles. A project transition requires fresh claimant authorization, new token/project authority proof and threshold SolHandle approval. Obtain old-authority approval where available; absent approval requires the stricter recovery process, not a shortcut.

Recovery compares current authorities, registered claimant, historical evidence and independently verified project identity. Apply double review, an explicit objection period and notice to the established project channel. A single authority change must not enable automatic takeover.

Periodically inspect name, symbol, relevant authorities and metadata URI. A changed symbol produces SYMBOL_MISMATCH and review, never automatic renaming or freeing of the old symbol.

Legitimate rebranding requires an atomic, reviewed transition preserving history, retiring the old symbol and maintaining one active primary handle per mint.

Revocation after successful verification does not automatically revoke the existing binding. Record the change and evaluate whether it affects the verified identity. Disputes may suspend resolution until reviewed.` },
  { id: 'fees', title: '17. Fees independent of identity', body: `Keep verificationFee and registrationFee configurable and separate from eligibility. Fees do not buy approval, ticker priority or ownership legitimacy.

Define recipients, caps, refund policy and when a fee is charged before enabling payments. Any registration payment must be explicit in the approved transaction. Possible future policies include free verified-project registration or a stated SOL fee; $HANDLE payments require separate review.

This plan sets no live fee and changes no existing payment or Partner Mint flow.` },
  { id: 'phases', title: '18. Delivery phases and definitions of done', body: `**Phase 1: Detection, no claims.** Enter a mint; validate SPL/Token-2022; display metadata, program, authorities and normalized candidate; report protected/registry availability without promising entitlement. Done when supported mints and invalid/missing metadata cases are handled reliably.

**Phase 2: Evidence and review.** Wallet challenges, signature verification, authority adapters, protection/conflict checks, private evidence and two-reviewer approval. Done when repeatable evidence-backed outcomes are AUTHORITY_PROVEN, MANUAL_REVIEW or REJECTED, with no registration enabled.

**Phase 3: Registry.** Anchor forward/reverse PDAs, threshold approval, registration, suspension, restoration, retirement and reviewed authority/recovery changes. Done when atomic bidirectional uniqueness and access controls pass adversarial tests on Devnet.

**Phase 4: Claim flow.** Detect → connect authorized wallet → sign readable challenge → review → explicit registration approval → finalized verified state. Include loading, rejection, expiration and pending-transaction recovery.

**Phase 5: Resolver and SDK.** Forward/reverse resolution with finalized status and freshness controls; integration documentation and compatibility checks.

**Phase 6: Public profiles.** /token/HANDLE with truthful status, mint, copy/explorer links and verified project associations.

**Phase 7: Launchpad adapters.** Add audited, version-aware adapters for Pump.fun, Raydium LaunchLab and others. Manual review remains the fallback; do not delay the core for every launchpad.

No Mainnet issuance before independent audit, remediation and explicit approval. Program builds and deployment require the Solana development environment; publishing this plan does not deploy the registry.` },
  { id: 'release', title: '19. Release boundaries and open decisions', body: `This page publishes the proposal only. It does not activate detection, wallet challenges, claims, verification badges, token APIs or registry transactions. Existing site styling, @ handles, marketplace and Partner Mint behavior remain unchanged.

Before implementation, finalize reviewer identities and independence, verifier threshold/custody, conflict and appeal criteria, review response targets, recovery objection period, protection provenance, storage atomicity, RPC agreement/freshness policy, monitoring cadence and fees.

Partner Mint and Token Handles require separate security acceptance. Do not bundle their deployment solely for convenience; each change needs isolated review, regressions and explicit release approval.

**A $handle is not issued because somebody typed the name first. It is issued only after SolHandle verifies the token, the claimant and the right to that identity.**` }
];