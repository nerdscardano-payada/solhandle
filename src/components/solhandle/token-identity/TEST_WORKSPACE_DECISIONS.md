# Token Identity: decisions and bounded test workspace

Status: administrator-only test implementation. No public launch, payments, Stamp, new NFT or smart-contract change.

## Decisions resolved for this test, not for public maker access

1. Access: existing Base44 administrator authentication AND a fresh scoped wallet signature for association creation. Neither a connected wallet nor a contacts token is a login. No new authentication backend, email workaround or general wallet session.
2. Concurrency: exactly one builder-provisioned `TokenPassportTestRegistry` record. Every mutation uses a version-conditioned update with its exact immutable record ID. Challenge consumption, association insertion and history insertion commit in the SAME record update; there is no lease or multi-record partial publication. Duplicate wallet + official handle asset + mint associations are rejected inside that conditional mutation. Three CAS attempts maximum, then a visible conflict. This is explicitly a small pilot, not a production uniqueness system.
3. Metadata: only Mainnet on-chain mint accounts, checked Metaplex metadata and supported self-pointing Token-2022 metadata. No off-chain JSON fetch, remote images, server URL proxy, guessed creator or launchplatform. Unknown fields remain unavailable. Network genesis is checked before chain operations. Original raw supply is preserved as a string.

## Reachability and environment

Route: `/admin/token-passports`, nested under existing ProtectedRoute and AdminRoute, with a link in existing administrator operations navigation. Every backend operation independently authenticates the user and checks the built-in admin role. No anonymous or normal-member endpoint. The test is access-restricted inside this app, NOT a separate deployment, separate database or Devnet environment. Solana Mainnet reads are used; signatures do not submit transactions.

## Implemented flow

- Look up an exact mint and inspect its on-chain fields and authorities.
- Connect through existing wallet infrastructure, choose an existing indexed handle candidate.
- Issue an expiring challenge binding operator, wallet, mint, official handle asset, note payload hash, origin, purpose and nonce.
- Verify Ed25519 and re-read current official ownership before conditional commit. An index candidate is never accepted as ownership proof.
- Save a private, immutable original association with pending review, signature, signed message and history.
- Server-filtered and sorted paginated test table, five live status totals, selected rows and genuine CSV evidence download. These exports are association evidence snapshots, not generic entity dumps, payment receipts or on-chain registration proofs; spreadsheet-leading formula characters are neutralized.
- Open an administrator-only deep-linked detail; live-check ownership. Unavailable chain data blocks a current verification claim; changed ownership is labeled historical without rewriting the authorizing wallet.
- Review the exact revision with a recorded reason; approval rechecks ownership and unlocks only an approved PRIVATE preview. Rejection and suspension preserve evidence and history.
- Reviewable immutable actor/asset/mint fields never transfer to a new owner. Admin review privileges remain trusted administrative privileges, not claimed token-creator authority.

## Explicit pilot bounds

20 associations, 20 unexpired challenges, 100 history events, and a 48 KiB serialized state cap. The whole test register is intentionally bounded, with no silent truncation or deletion of history. Per-wallet challenge allowance is five per minute. Expired challenges may be removed on a new challenge. Full capacity fails closed. The singleton is provisioned once by the builder, never from a request. Missing/duplicate singleton fails closed.

Table counts, filtering and sorting execute in the server over that deliberately bounded canonical state. A future record-per-association production model must use native filtered pages and aggregate/count calls, with a separately proven coordinator strategy.

## Not implemented / no implied release

- Public maker authentication, public directory, public sharing or QR links.
- Arbitrary external metadata/pointer interfaces and independent creator/launchplatform proof.
- Scheduled transfer monitoring or complete transfer history. Detail checks are point-in-time, not continuous guarantees. Token metadata is a creation-time snapshot.
- Payments, Launch Stamps, Pro, automatic burn, fees or token privileges.
- Self-service draft editing/withdrawal, public reports/disputes and production analytics.
- Separate staging deployment or a production-scalable multi-record registry.

These remain the next phases, rather than shipping incomplete or publicly exposed stubs.

## Acceptance still required

Backend deployment checks and frontend compilation are engineering checks, NOT end-to-end or security acceptance. No real wallet is signed or transaction submitted by the builder. Browser/wallet acceptance must cover valid signature, tampered payload, expired/reused proof, wallet switch mid-sign, simultaneous duplicate submits, review-version conflict, transfer, chain outage, non-admin denial, metadata absence and table/export operations. Use the Testing Agent for functional browser acceptance; independent crypto/security review remains separate. No public release until those checks and the public-access design are complete.