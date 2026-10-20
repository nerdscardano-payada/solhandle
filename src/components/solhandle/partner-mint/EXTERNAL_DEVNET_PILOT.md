# External Devnet pilot preparation

Status: design and activation checklist only. No external access, credentials, memberships, domains, on-chain changes or Mainnet changes are created by this preparation.

## Evidence and remaining gates

On 20 October 2026 the operator reported the reusable React flow returning FINALIZED for @solanatest, partner devnet-testpartner, with original owner HmxxAgrQdBqSyFNvjTnzJxVnuHPqzV8ufGGmfTR8kHyh and 'Finalized receipt verified.' No signature or asset address was provided in this message, so this is reported evidence, not an independently rechecked transaction. The earlier successful mints do not complete Phase 1 or Phase 2 acceptance.

Current boundary: pilotRequest requires authenticated role admin; getPilotIntent binds intent ID to admin_user_id and Devnet. Existing entity access remains admin-only. Do not remove these guards merely to expose a partner demo. Ordinary minting, payments, resolution and Earn rules remain unchanged.

## Information required before implementation/enrollment

- One canonical partner ID (1–32 lowercase ASCII letters, digits or hyphens), display name and exact HTTPS origin.
- An existing partner operator account identified by email for invitation/membership resolution; never assign admin simply to allow mint access.
- Public revenue wallet and intended integration mode (React on the partner website for the initial pilot).
- Authority approval and the existing joint-signature proof of revenue-wallet ownership. Login and domain ownership do not prove control of this wallet.
- Completed required Phase 1 acceptance evidence and independent review before external activation.

## Coherent first implementation increment

1. Add admin-controlled partner memberships and domain-verification records. Membership binds an immutable authenticated user ID to one partner and Devnet; regular users cannot self-assign memberships, approval, verified domains or revenue wallets. Configure record-level access with an admin branch and server-side membership enforcement, not UI filtering. Retain existing role values.
2. Verify domain ownership using an expiring, random, single-use DNS TXT challenge bound to partner and exact hostname. Normalize origins; no wildcard acceptance or arbitrary URL fetch. Server stores a challenge hash, verification state and audit trail. Verification remains distinct from protocol approval and can be revoked.
3. Build an authenticated bootstrap for approved pilot members. Issue short-lived opaque session tokens, store hashes only, bind to the partner, Devnet and minimum allowed actions; bind mint sessions to a wallet using a fresh, expiring, one-time signed challenge with explicit purpose, domain, cluster and partner. Wallet authentication is never permission to transfer SOL. Public claimants do not need email accounts; a public session bootstrap remains closed in this initial operator pilot.
4. Reuse existing SDK contracts and shared chain/pricing/prepare/submit/status logic. Separate admin registry authority from scoped mint authorization. Store explicit initiating principal/session ownership for new intents rather than overloading admin_user_id. Preserve historical admin intents and recovery; do not make old intents publicly readable. Every prepare, status, submit and recovery operation checks partner, cluster, scope, ownership and current revocation state. Never trust caller partner IDs as authorization.
5. Keep server-to-server credentials out of React props, localStorage and URLs. If an approved partner backend needs a credential, issue a scoped, expiring, hash-stored secret through a secure one-time delivery flow with rotation/revocation. Do not add credentials before the authorization path exists. No platform administrator token is shared.
6. Enforce bounded payloads, strict Origin/CORS policy for browser clients, and race-safe per-session/partner/IP rate limits with bounded retries and idempotency. Domain allowlisting is not authentication and cannot prevent authorized direct on-chain calls. Current best-effort admin counters are not sufficient for external traffic.
7. Expose one Devnet-only React reference integration after gates pass. Search, review, signing, status and receipt remain a single complete flow; no auto-signing, silent repricing or second signature after uncertain submission. Keep official program/collection/recipients, exact-lamport split, expiry and non-custodial behavior unchanged.

## Required rejection/recovery matrix before enablement

- Anonymous, unapproved, wrong-partner and wrong-cluster requests are denied.
- Partner A cannot read, submit or recover partner B's intents/receipts or access their dashboard.
- Missing/wrong Origin, expired sessions, forged wallet proof, reused challenges, revoked membership/domain/credential and suspended on-chain partner are handled safely.
- Treasury/collection/owner/metadata/price/split/quote edits and arbitrary instructions are rejected.
- Quote expiry, wallet switch, cancellation, insufficient test-SOL, concurrent name claim and duplicate submit never cause unintended mint settlement.
- Timeout and browser reload recover the same signed intent; finalized receipts/revenue are idempotent and never include Earn primary commission.
- Revoked sessions cannot initiate or relay a mint through the service. Because an already signed transaction may be broadcast outside it, check on-chain status before permitting replacement; authority-controlled on-chain suspension is the actual emergency enforcement control.
- Phantom/Backpack/Solflare acceptance and legacy mint/Pay/marketplace/resolution regressions have evidence. Component success alone does not certify all wallets.

## Operator runbook and explicit release gate

Before activation record partner ID, exact verified origin, approved account membership, revenue wallet/revision, deployed Devnet program version, test evidence, reviewer and approval. Maintain a revoke/suspend procedure and reconcile any in-flight signatures before retrying. Run one finalized end-to-end partner mint and reconcile the official asset plus exact transfers and receipt ledger.

Separate explicit activation approval is mandatory. Mainnet remains excluded until all three phases, independent review and separate Mainnet authorization are complete. The hosted widget, public self-service enrollment, native integrations and production credentials are not delivered by this preparation.