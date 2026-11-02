# SolHandle implementation plan

Date: 2026-11-02
Status: In progress. Only the first homepage slice below is implemented; this is not a production-readiness certificate.

## Non-negotiable constraints
- Preserve the official logo, dark theme and current homepage hero image.
- Preserve contract behavior, pricing, supported mint/payment assets and noncustodial ownership.
- Blockchain > indexer > database > cache > UI. Never treat a profile record as ownership proof.
- Reuse existing routes, wallet proof, contacts, payment and integration-intake services.
- No invented users, counts, integrations, SDK signatures or successful transaction results.
- No automatic profile publishing, Primary Handle changes or saved-wallet replacement.
- No new multichain, feeds, messaging, wallet or smart-contract features.
- Never declare runtime, wallet or regression tests passed based on a successful build.

## Initial source audit: confirmed versus still to review
Confirmed by reading existing source:
- Home renders an existing hero, product introduction, how-it-works, projects and developer section.
- Existing profile directory action lists published records in bounded batches of 12.
- The directory checks current on-chain wallet AND asset against each profile before returning its public projection. Drafts and former-owner profiles fail this check.
- Public projection currently includes handle, bio, social links and avatar; it has no display-name field. No display name is fabricated.
- Existing profile cards, avatar loading/fallbacks and public profile routes are reusable.
- Ecosystem already loads wallet identity and the primary public profile. Personalization is partial, not absent.
- Sidebar currently separates People from Discover and puts My Handles outside the main identity navigation.
- Developer homepage already links to SDK, documentation and guides; the separate live-integrations route exists.
Not yet audited in this implementation pass:
- Mint success and all mint entry paths, proof lifetime/replay, contacts-session duration, payment balance/recipient revalidation, SDK publication, public content consistency, SEO, mobile journeys and full ownership-transfer behavior.

## Sprint 1: audit and change map — partial
1. Map public and private routes, redirects, deep links and external SDK endpoints.
2. Trace wallet changes, primary identity resolution and each private data boundary.
3. Map every mint success entry point and all existing onboarding components.
4. Review contacts and Pay for fixed-recipient semantics, fresh resolution and session expiry.
5. Inventory current product claims, SDK exports, integration evidence and existing analytics/consent.
Exit: documented reuse decisions and exact outstanding gaps, not assumptions that proposed features are missing.

## Sprint 2: homepage — first slice implemented
Implemented:
- Added up to six real public profiles directly after the existing hero using the existing verified directory service.
- Reused profile cards and avatars. Handles lacking verified ownership are excluded by the server.
- Added loading, verification-failure/retry, empty and fewer-than-six states.
- Added Explore All Profiles linking to the existing public directory.
- Added Identity, Contacts, Payments and Integrations use-case cards linking to live routes.
- Added separate homepage entry points for Integration Guides and Verified Integrations; removed unfinished Partner Mint promotion from that section.
- Preserved hero image, mint search, existing routes and transaction logic.
Remaining:
- Review selection fairness across the entire directory. Current service is alphabetical and bounded; the homepage does not claim popularity, rotation or exhaustive coverage.
- Review integration evidence and the destination pages before certifying current integrations.
- Runtime and responsive acceptance testing remains pending.

## Sprint 3: personal dashboard and navigation — pending
1. Use verified wallet identity to distinguish disconnected, no handles, no primary, incomplete profile and activated states.
2. Show verified primary identity, wallet, avatar, public profile and manage-identity actions.
3. Offer existing primary selection rather than silently assigning one.
4. Make Contacts, Pay, People and Projects directly accessible.
5. Derive onboarding progress from actual ownership, primary setting, publication and authorized contacts state. Do not unlock private contacts just for a statistic.
6. Add secure persisted dismissal only after essential setup; no fake local-only completion.
7. Group Identity/My Handles and reduce token prominence while preserving routes.
8. Introduce People/Projects Discover tabs with compatible legacy paths.
Exit: all wallet states and wallet switching produce correct next actions without leaking previous-wallet state.

## Sprint 4: post-mint and profiles — pending
1. Add a skippable, resumable flow to every real successful-mint path, never a signature-request event.
2. Reuse on-chain Primary Handle action with explicit consent and signature handling.
3. Route to profile editing, Contacts and a non-transactional Pay introduction.
4. Preserve current bio limit of 100 characters. Add display name/website only through a coordinated model, proof-payload and public-projection change if needed.
5. Prioritize avatar, bio, links, Save Contact, Pay, Share and Copy Handle.
6. Move technical details into accessible Ownership Details disclosure.
7. Verify owner editing, transfer invalidation and safe empty profiles; do not inherit former-owner personal content.
Exit: mint-to-profile journey works, skips/resumes safely and resets on wallet change.

## Sprint 5: contacts and payments — pending
1. Audit existing controls before duplicating add/edit/remove/search capabilities.
2. Default remembered-device choice off; review actual server session scope, revocation and proof recency.
3. Preserve saved wallet addresses through handle transfers. Show explicit mismatch/unresolved warnings and review choices.
4. Show real available balance, fee estimate and safely sendable maximum only when calculable for the selected asset.
5. Revalidate live recipient before constructing a transaction; block confirmation on recipient changes.
6. Retain review of source type, recipient, asset, amount and fee, with truthful network-confirmed receipts.
Exit: saved contacts never silently retarget, wallet switches isolate private data, insufficient balance is identified before approval where possible.

## Sprint 6: public developer experience — pending
1. Make one public developer entry point with Start Integrating, SDK/API, Guides, Verified Integrations and Request Integration.
2. Explain wallet, explorer, payments, community, marketplace and infrastructure use cases before code.
3. Reuse existing integration intake with validation, spam controls and private review records.
4. Standardize guides: overview, use case, requirements, setup, minimal example, ownership, transfers, errors, mainnet checks and troubleshooting.
5. Compare installation commands and examples to actual published package/version and exports. No fabricated publication claim.
6. Require verifiable evidence for live integration labels; guides never confer partner status.
Exit: anonymous developer can understand, implement and request an integration without owning a handle.

## Sprint 7: content and route consistency — pending
1. Audit Docs, FAQ, roadmap, protocol paper, token content and linked pages.
2. Remove active-product claims for retired marketplace and Earn, retaining recovery access.
3. Remove prominent unfinished Partner Mint promotion, retain restricted development resources.
4. Describe Pay assets and product availability from deployed behavior.
5. Mark international handles, multichain and social features as upcoming where accurate.
6. Review indexed URLs, canonical settings, metadata, sitemap and deprecated redirects through supported platform controls; do not guess live search-index state.
Exit: no conflicting current product claims and no broken existing documented endpoints.

## Sprint 8: accessibility, security, performance and QA — pending
1. Check keyboard access, focus, labels, contrast, disclosures, touch targets and reduced motion.
2. Exercise desktop/tablet/mobile and wallet-browser journeys, including keyboard and safe-area layouts.
3. Verify protected ownership mutations, replay/expiry checks, authorization freshness and transfer invalidation.
4. Measure RPC volume, image loading and core journeys before optimizing. Never trade fresh recipient checks for cache speed.
5. Review existing consent before adding analytics. Track confirmed outcomes only, without wallet addresses or private contact data.
6. Use Testing Agent for executable browser goals; real wallet signatures, transfers and paid transactions require authorized manual completion.
7. Record each result as passed, failed or blocked with scope/environment. A build is not end-to-end QA.

## Required regression matrix
- Wallet: connect/disconnect/switch, zero/one/multiple handles, no primary, rejected signature, transfer and revoked former-owner access.
- Mint: available/unavailable, all supported methods, premium/protected rules, insufficient funds, cancellation/failure, confirmed success and onboarding.
- Profiles: create/edit/publish, anonymous view, private field boundaries, transfer and missing avatar.
- Contacts: wallet/handle add, edit/delete/search, stale/unresolved handle, unchanged saved wallet.
- Pay: SOL and every deployed supported token, fee/balance/recipient review, refusal/failure, recipient change and truthful confirmation.
- Developers: public access, actual SDK examples, endpoint behavior, request submission and evidence-backed labels.
- Responsive: entire search/wallet/profile/contact/payment journeys, not screenshots alone.

## Delivery and release gate
Deliver a change summary, route map, reused/new components, model/API changes, security findings, scoped test results, mobile results and exact external blockers.
Keep a rollback point per sprint and avoid unnecessary migrations. Do not automatically publish.
Production-ready status remains BLOCKED until relevant security, wallet, regression, mobile and content acceptance checks pass.