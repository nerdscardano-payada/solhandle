#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

AUTHORITY="${SOLHANDLE_AUTHORITY:-$HOME/.config/solana/solhandle-devnet.json}"
PROGRAM_KEYPAIR="${SOLHANDLE_PROGRAM_KEYPAIR:-$ROOT_DIR/keys/solhandle-devnet-program.json}"
RPC_URL="https://api.devnet.solana.com"
OLD_PROGRAM_ID="FQ5yTNhKMbdTYbAcAD4YjcdwRhsFroYN4UpvXbAFuCK5"

for command in solana anchor node perl; do
  command -v "$command" >/dev/null || { echo "Missing required command: $command" >&2; exit 1; }
done

[[ -f "$AUTHORITY" ]] || { echo "Devnet authority not found: $AUTHORITY" >&2; exit 1; }
mkdir -p "$(dirname "$PROGRAM_KEYPAIR")"
[[ ! -e "$PROGRAM_KEYPAIR" ]] || { echo "Refusing to overwrite existing program keypair: $PROGRAM_KEYPAIR" >&2; exit 1; }

solana config set --url "$RPC_URL" --keypair "$AUTHORITY" >/dev/null
AUTHORITY_ADDRESS="$(solana address -k "$AUTHORITY")"
BALANCE="$(solana balance "$AUTHORITY_ADDRESS" --url "$RPC_URL")"
echo "Authority: $AUTHORITY_ADDRESS"
echo "Devnet balance: $BALANCE"
echo "Existing program (informational):"
solana program show "$OLD_PROGRAM_ID" --url "$RPC_URL" || true

solana-keygen new --no-bip39-passphrase --silent --outfile "$PROGRAM_KEYPAIR"
PROGRAM_ID="$(solana address -k "$PROGRAM_KEYPAIR")"
echo "New SolHandle program ID: $PROGRAM_ID"

perl -0pi -e "s/$OLD_PROGRAM_ID/$PROGRAM_ID/g" \
  Anchor.toml \
  programs/solhandle/src/lib.rs \
  src/lib/mintSolHandle.js \
  base44/shared/solanaRpc.ts

anchor build
solana program deploy --url "$RPC_URL" --program-id "$PROGRAM_KEYPAIR" target/deploy/solhandle.so

export SOLHANDLE_PROGRAM_ID="$PROGRAM_ID"
export SOLHANDLE_AUTHORITY="$AUTHORITY"
node --loader ts-node/esm scripts/initialize-devnet.ts
node --loader ts-node/esm scripts/verify-devnet.ts

echo "Redeploy complete. Publish the updated app before retrying @travel."