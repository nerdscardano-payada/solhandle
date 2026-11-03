# SolHandle AI Integration Advisor: implementation handover

## Release status
Internal first implementation, NOT acceptance of the complete production specification. The full platform must not be marketed as delivered or production-certified. No claims of end-to-end, security, Mainnet, external-repository or regression certification are made.

## Working scope
Public `/integrate/ai`, linked from Developers, integration intake, developer menus and Ecosystem resource navigation. Anonymous submissions use existing Turnstile. A durable entity-triggered workflow invokes an authenticated administrator-only research function. A single built-in AI web-research call generates a bounded structured report. The server validates its shape, safe citation URLs, reference indices and scoring; weighted ranks are deterministic. Findings distinguish source-supported claims, inference and unknowns. Sources are AI-reported, not independently certified crawl evidence. Original SDK examples are separately curated; they are not project-tested generated implementations. Reports include the full findings, evidence, architecture, steps, security considerations and unexecuted test scenarios. PDF/Markdown downloads and copy controls work locally.

## Data and security
AIAnalysisRequest: anonymous create only, read/update/delete admin-only. AIIntegrationAnalysis: all operations admin-only. Anonymous start uses the normal user-scoped client, never service-role writes. Only an admin-authenticated workflow may spend AI credits. CAPTCHA is checked inside the worker, so creating requests directly does not bypass the cost gate. Token+request-id authorized lookup is the only anonymous read of selected status/report fields; tokens are generated with two cryptographic UUIDs, stored only as SHA-256 hashes, carried in URL fragments and not sent to external links. Private recovery links are bearer credentials: anyone with the link can read the report. Reports are not publicly listed. Administrators have operational access. No private code, contact details, wallet keys or repository credentials are collected. Public submission storage remains a possible spam surface; production admission infrastructure is still needed for stronger guarantees.

The app does not perform direct HTTP fetches of submitted websites. It delegates public internet research to the built-in hosted web-search integration. Direct outbound fetch in the worker is limited to Cloudflare's fixed verification endpoint. This is not a separately controlled SSRF-safe crawler, nor a guarantee about provider-side crawling/redirect policies. No browser automation or untrusted code execution is enabled.

## Backend and workflows
- aiAdvisor: config, anonymous start, capability-token status/report lookup.
- aiAdvisorResearch: admin-only CAPTCHA validation, daily controls, single research call, report validation and persistence. No automatic billed retries.
- aiAdvisorRetention: admin-only removal of expired reports and requests.
- AI Advisor Project Research: request-created trigger.
- AI Advisor Report Retention: daily 03:00 Europe/Brussels cleanup. Access expires after 30 days; physical cleanup occurs on the next daily run.

Current admission controls: at most 20 previous analysis records per rolling 24 hours, 2 for the same normalized website. These are best-effort count-before-create checks, NOT atomic concurrency reservations or a monetary spending guarantee. There is no accurate token/cost ledger or admin-adjustable budget UI yet. Human CAPTCHA tokens are consumed before the AI call and removed from stored requests. Error messages returned publicly exclude internal logs.

## Knowledge basis
`base44/shared/aiAdvisorKnowledge.ts`: review version solhandle-mainnet-v2-review-2026-11-03. Reviewed local SDK source 1.1.0, published 1.0.1 JavaScript source via unpkg, and public developer/docs/integration/protocol pages. Npm registry metadata confirms published 1.0.1. No local Partner Mint preview is promoted. Runtime knowledge is a curated versioned snapshot, NOT automatic source ingestion. Update and review knowledge and examples together when the SDK changes; never silently advertise local preview versions as published. Example guidance is JavaScript; an unknown or different framework is a requirement to clarify, not a detected stack.

## Required configuration
Uses existing TURNSTILE_SITE_KEY and TURNSTILE_SECRET_KEY. No new AI provider key is needed for the built-in integration. Uses automatic model selection with web context and structured JSON. This is not an OpenAI Responses integration. AI calls consume the app's integration credits; no exact monetary usage claim is available. No new Solana program, ownership registry or wallet behavior is introduced.

## Explicitly outstanding scope
Authenticated verified project workspaces and team authorization; domain/GitHub ownership checks; GitHub App setup, selected-repository authorization, inspection, commit-bound patches and approved draft PRs; model-generated repository-aware code; isolated static/build/unit/Mainnet tests; persistent contextual assistant; report regeneration/version comparison/sharing/deletion UI; separate admin project/usage/settings/verification center; prospects/outreach; transactional notifications; precise usage accounting and atomic spend/concurrency limits; independent crawl evidence verification; automated knowledge ingestion; infrastructure monitoring; complete acceptance/security/regression testing.

No unfinished GitHub/test/chat buttons are shown. Official review uses the existing intake, not a new AI verification badge. External authorizations must be obtained before those workflows are implemented; the builder's GitHub connection must never be used as every project developer's identity.

## Checks performed
Frontend build command completed. Backend validation calls rejected a loopback HTTPS submission and missing research request id. Actual public CAPTCHA submission, provider research output, persistent recovery, exports in browsers, cleanup scheduler execution and full end-to-end completion still need acceptance testing. No live payment, NFT transfer, repository script or Mainnet transaction was executed.

## Operations and rollback
Keep the research workflow running under an authorized app admin. Inspect workflow runs for errors; consuming an expired or invalid CAPTCHA fails the request without a billed AI call. Start a new CAPTCHA-backed request after a failed analysis rather than retrying consumed tokens. Background jobs exceeding ten minutes show a failure message on lookup; original work is not automatically restarted. Retention must be kept active. To stop new AI work, deactivate AI Advisor Project Research; remove Advisor entry points and the /integrate/ai route for a full UI rollback. Preserve private data permissions and retention until saved records expire or are explicitly removed. Do not roll back by making reports publicly readable. Existing minting, pay, identity resolution and prior intake logic were not changed.