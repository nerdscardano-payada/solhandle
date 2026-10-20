# International Handles V1 — paused plan

Status: PAUSED / BACKLOG
Decision date: 2026-10-20
Reason: builder explicitly requested stopping international-name work and retaining it as a plan for later.

## Current scope

Do not continue international-name implementation, policy-engine development, collision-export work, devnet preparations, key setup or deployment until the builder explicitly asks to resume. This pause applies to project work, not a new runtime pause control.

No international-name feature was activated by the planning work. Existing production functionality remains unchanged. Do not disable existing search, minting, payments, ownership or marketplace functionality as part of this pause.

## Preserved materials

- COMPATIBILITY_REPORT.md: preliminary source review and historical read-only mainnet inventory.
- ARCHITECTURE_DECISIONS.md: proposed architecture, not accepted deployment instructions.
- REGISTRATION_CONTRACT.md: proposed account and authorization contract, not implemented or validated.
- UNICODE_DATA_MANIFEST.json: candidate dataset integrity manifest, not an installed runtime engine.

All unresolved approvals, audits, conformance checks and security limitations remain unresolved. Pausing or later resuming does not imply approval of the mint-builder cutover or validator trust model.

## Only on an explicit later request to resume

Reconfirm scope, revisit the proposed choices and refresh chain/source/dependency evidence before using historical snapshots. Do not treat previous inventory, pricing, hashes or deployment state as current without checking. Mainnet modification and deployment still require separate explicit authorization.