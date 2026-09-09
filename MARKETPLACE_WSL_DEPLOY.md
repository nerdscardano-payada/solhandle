# SolHandle native marketplace upgrade (WSL2)

Run from the repository root in Ubuntu/WSL2. Never paste or upload private keys.

```bash
export SOLHANDLE_AUTHORITY="$HOME/.config/solana/solhandle-mainnet-authority.json"
export SOLHANDLE_PROGRAM_KEYPAIR="$PWD/keys/solhandle-v1-mainnet-program.json"
export SOLANA_RPC_URL="https://YOUR_PRIVATE_MAINNET_RPC"
solana config set --url "$SOLANA_RPC_URL" --keypair "$SOLHANDLE_AUTHORITY"
solana address -k "$SOLHANDLE_AUTHORITY"
solana balance
```

Build and verify the unchanged program address:

```bash
anchor --version   # 0.32.1
solana --version
anchor build
solana-keygen pubkey target/deploy/solhandle-keypair.json
# Must print: B7xiwfxGcR2Xz7tcUKrkB8Ly6NV8jU7LH1m6GJZRUuf
```

Upgrade Mainnet (do not redeploy a fresh program):

```bash
solana program show B7xiwfxGcR2Xz7tcUKrkB8Ly6NV8jU7LH1m6GJZRUuf --url "$SOLANA_RPC_URL"
solana program deploy target/deploy/solhandle.so \
  --program-id "$SOLHANDLE_PROGRAM_KEYPAIR" \
  --upgrade-authority "$SOLHANDLE_AUTHORITY" \
  --url "$SOLANA_RPC_URL"
```

After deployment, publish the Base44 app and perform controlled low-value tests in this order: list, delist, bid, cancel bid, list + buy, bid + accept. Confirm the asset owner, seller proceeds, 5% rewards-vault receipt, closed PDA, index status and FinancialTransaction after every sale.