#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"
AUTHORITY="${SOLHANDLE_AUTHORITY:-$HOME/.config/solana/solhandle-devnet.json}"
PROGRAM_KEYPAIR="${SOLHANDLE_PROGRAM_KEYPAIR:-$ROOT_DIR/keys/solhandle-v1-devnet-program.json}"
RPC_URL="https://api.devnet.solana.com"

for command in solana solana-keygen anchor node perl; do
  command -v "$command" >/dev/null || { echo "Missing required command: $command" >&2; exit 1; }
done
[[ -f "$AUTHORITY" ]] || { echo "Devnet authority not found: $AUTHORITY" >&2; exit 1; }
[[ ! -e "$PROGRAM_KEYPAIR" ]] || { echo "Refusing to overwrite an existing program keypair: $PROGRAM_KEYPAIR" >&2; exit 1; }
mkdir -p "$(dirname "$PROGRAM_KEYPAIR")"

solana config set --url "$RPC_URL" --keypair "$AUTHORITY" >/dev/null
AUTHORITY_ADDRESS="$(solana address -k "$AUTHORITY")"
echo "Authority: $AUTHORITY_ADDRESS"
echo "Balance: $(solana balance "$AUTHORITY_ADDRESS" --url "$RPC_URL")"
solana-keygen new --no-bip39-passphrase --silent --outfile "$PROGRAM_KEYPAIR"
PROGRAM_ID="$(solana address -k "$PROGRAM_KEYPAIR")"
echo "Deploying SolHandle V1: $PROGRAM_ID"

PROGRAM_ID="$PROGRAM_ID" perl -0pi -e 's/(declare_id!\(")[^"]+/$1 . $ENV{PROGRAM_ID}/e; s/(solhandle = ")[^"]+/$1 . $ENV{PROGRAM_ID}/eg' Anchor.toml programs/solhandle/src/lib.rs
PROGRAM_ID="$PROGRAM_ID" perl -0pi -e 's/(PROGRAM_ID = new PublicKey\(")[^"]+/$1 . $ENV{PROGRAM_ID}/e' src/lib/solhandleProtocol.js
PROGRAM_ID="$PROGRAM_ID" perl -0pi -e 's/(PROGRAM_ID = ")[^"]+/$1 . $ENV{PROGRAM_ID}/e' base44/shared/solhandleProtocol.ts

anchor build
solana program deploy --url "$RPC_URL" --program-id "$PROGRAM_KEYPAIR" target/deploy/solhandle.so
export SOLHANDLE_PROGRAM_ID="$PROGRAM_ID"
export SOLHANDLE_AUTHORITY="$AUTHORITY"
node scripts/initialize-devnet.mjs
node scripts/verify-devnet.mjs

echo "V1 is deployed and verified. Commit the public program-ID changes, publish the app, then run the CLI and website acceptance mints."