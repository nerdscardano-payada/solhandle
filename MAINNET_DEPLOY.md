# SolHandle Mainnet-beta deployment

## Security boundary

Run this only in native Linux or WSL2. Keep the authority and program keypairs local. Never upload a seed phrase or private key to Base44, a browser, source control or chat.

The deployment is initialized **paused**. Public minting remains unavailable until verification is complete and the pause is deliberately removed.

## 1. Prepare production values

You need:

- A dedicated Mainnet authority keypair with enough SOL for program deployment and initialization.
- A permanent Irys/Arweave URI for the official collection metadata.
- A Mainnet treasury wallet.
- A separate Mainnet Integration Rewards Vault wallet.
- A private, authenticated Mainnet RPC endpoint for the deployed app.

Do not reuse Devnet treasury, rewards or uploader wallets.

## 2. Set the deployment environment

From the repository root in WSL2:

```bash
export SOLHANDLE_AUTHORITY="$HOME/.config/solana/solhandle-mainnet.json"
export SOLHANDLE_COLLECTION_URI="https://gateway.irys.xyz/YOUR_COLLECTION_METADATA_ID"
export SOLHANDLE_TREASURY="YOUR_MAINNET_TREASURY"
export SOLHANDLE_REWARDS_VAULT="YOUR_MAINNET_REWARDS_VAULT"
export SOLANA_RPC_URL="https://YOUR_PRIVATE_MAINNET_RPC"
```

Confirm the authority and balance before deployment:

```bash
solana address -k "$SOLHANDLE_AUTHORITY"
solana balance "$(solana address -k "$SOLHANDLE_AUTHORITY")" --url "$SOLANA_RPC_URL"
```

## 3. Deploy paused

```bash
chmod +x scripts/redeploy-mainnet.sh
./scripts/redeploy-mainnet.sh
```

The script:

1. Refuses any RPC that is not Mainnet-beta.
2. Creates a new Mainnet program keypair without overwriting an existing key.
3. Updates the program ID in the on-chain program, browser client and backend.
4. Derives and updates the official Mainnet collection address.
5. Changes resolver, wallet, mint and metadata runtimes from Devnet to Mainnet-beta.
6. Builds and deploys the V2 program.
7. Initializes Config and the official Metaplex Core collection while paused.
8. Verifies the deployment and creates the protected-name restrictions.

## 4. Connect the app

After the script succeeds:

1. Save the printed Program and Collection addresses.
2. Update the Base44 `SOLANA_RPC_URL` secret to the same private Mainnet RPC endpoint.
3. Fund the Mainnet Irys uploader wallet.
4. Commit only the public source changes. Never commit `keys/` or wallet files.
5. Publish the updated app while the protocol remains paused.

## 5. Acceptance checks before launch

- The verifier reports the Mainnet genesis hash and `verified: true`.
- Config belongs to the new program and protocol version is V2.
- The official collection exists and matches every resolver runtime.
- Forward and reverse resolution read Mainnet-beta only.
- A fake collection asset is rejected.
- A controlled acceptance mint creates the HandleRecord and Core Asset atomically.
- A second mint of the same handle fails before payment.
- Ownership transfer changes forward resolution.
- Primary Handle reverse resolution becomes invalid when the NFT leaves the wallet.
- Treasury, rewards, metadata and protected-name configuration are correct.

Only after all checks pass should the authority remove the pause.