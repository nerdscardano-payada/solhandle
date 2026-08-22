# SolHandle Devnet redeploy

## What this redeploy fixes

The prior Devnet deployment was compiled from a stale program copy while the app sent instructions for the current program. The repository now has one canonical on-chain program at `programs/solhandle/src/lib.rs`. The redeploy script creates a fresh program ID, updates every public program reference, deploys that exact program, initializes a fresh configuration and verifies the new account layout.

## Security boundary

Run this only from native Linux or WSL2 with the Devnet authority wallet available locally. Never upload a private key or seed phrase to Base44, the browser, source control, or any public configuration file.

Existing Devnet treasury and rewards-vault addresses are reused:

- Treasury: `Ak7QZ2xQMAjUsvVB93pZit3e15SSJkiQQeeMiGRdzA8p`
- Rewards vault: `87mU9ddoxUd8Y9wahXWL9fWve2s2krGghjx2HRzmUpPC`

## One clean deployment

From the repository root in WSL2:

```bash
chmod +x scripts/redeploy-devnet.sh
./scripts/redeploy-devnet.sh
```

The script deliberately creates a new program keypair under `keys/` and stops if that file already exists. It does not overwrite the prior deployment. It will:

1. Check the existing Devnet authority and its balance.
2. Generate a fresh program ID.
3. Update the canonical program, Anchor configuration, browser mint client and backend indexer to that ID.
4. Build and deploy the canonical Anchor program to Devnet.
5. Create a fresh config PDA and official Metaplex Core collection with the existing Treasury and Rewards Vault.
6. Verify that the config account has the expected 186-byte current layout.

If the authority wallet has insufficient Devnet SOL, fund it before running the script:

```bash
solana airdrop 2 --url https://api.devnet.solana.com
```

## After a successful deployment

1. Commit the public program-ID reference changes. Never commit `keys/`.
2. Publish the updated app so mobile wallets receive the new program ID.
3. Remove stale Devnet-only rows from `HandleIndex` and `PrimaryHandleCache` using the app admin tools before the first new index run.
4. Retry `@travel` from the published site, not the Base44 preview. Phantom should show a normal simulation and confirmation screen—never use **Confirm (unsafe)**.
5. After the mint confirms, wait for the five-minute index sync or run it manually and confirm that `@travel` appears in the handle index.

## Acceptance checks

- The deployment script reports `verified: true` and `configBytes: 186`.
- Phantom simulates the `@travel` mint without an unsafe warning.
- The completed transaction creates both the handle record and the Core asset PDA.
- The full primary price goes to the configured Treasury and the NFT is owned by the connected wallet.
- A second mint for `@travel` fails before payment because its handle PDA already exists.