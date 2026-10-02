# Partner Mint: Earn primary-mint exclusion

WSL source-only handoff, 2 October 2026. The earlier binary (SHA256 466b7c330d3be4c45bd85b09a0d75c757278ce390ab068258bfa14d14db42c0b) passed 6 Rust tests and 71 local validator checks according to the supplied WSL output. This work package does not change that binary.

## Install
From the existing project root, run the extracted package's src/components/solhandle/partner-mint/apply-earn-policy-wsl.sh. It verifies payload and original source checksums before any project writes, runs offline policy checks, and backs up both existing accounting files. Stop on any error. It does not deploy backend code or use live RPC, existing wallets or funds.

Then run `node base44/shared/partnerMintEarnChecks.mjs` from the project root and return the output.

## Policy
The shared production adapter derives the official asset and immutable receipt PDA. It reads a successful confirmed transaction and requests the receipt at a context slot at least equal to that transaction. A verified official receipt (owner, discriminator, exact layout, asset, original owner and integer 50/50 split) excludes primary-mint commission before processing claims or writes. RPC errors, stale context and malformed receipts fail closed, never silently permit commission.

The gate covers processConfirmedReferral, lockMintOrigin and recordOriginRevenue when its source is MINT. No OriginReferral history is deleted or overwritten. Secondary royalties and creator fees retain existing behavior. No client-supplied partner flag is accepted as attribution proof. Ordinary mints without a receipt remain eligible under the existing rules.

## Test boundaries
The 18 checks use deterministic mocked RPC responses, not actual network receipts. They validate the shared policy; they do not prove complete database integration, deployment or end-to-end API behavior. The Node-only check file is not imported by production functions. Production functions import the shared guard.

Not included: quote/prepare/submit/status API, dedicated cluster quote key setup, Partner Mint receipt indexer, checkout or devnet deployment. These remain subsequent work packages. Keep production Partner Mint disabled. No deploy commands included.