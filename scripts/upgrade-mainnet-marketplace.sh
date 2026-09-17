#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

AUTHORITY="${SOLHANDLE_AUTHORITY:?SOLHANDLE_AUTHORITY mainnet keypair is required}"
PROGRAM_KEYPAIR="${SOLHANDLE_PROGRAM_KEYPAIR:-$ROOT_DIR/keys/solhandle-v1-mainnet-program.json}"
RPC_URL="${SOLANA_RPC_URL:?SOLANA_RPC_URL private mainnet RPC is required}"
EXPECTED_PROGRAM_ID="B7xiwfxGcR2Xz7tcUKrkB8Ly6NV8jU7LH1m6GJZRUuf"
MAINNET_GENESIS="5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d"

for command in cargo solana; do
  command -v "$command" >/dev/null || { echo "Missing command: $command" >&2; exit 1; }
done
[[ -f "$AUTHORITY" ]] || { echo "Authority keypair not found: $AUTHORITY" >&2; exit 1; }
[[ -f "$PROGRAM_KEYPAIR" ]] || { echo "Program keypair not found: $PROGRAM_KEYPAIR" >&2; exit 1; }

GENESIS="$(solana genesis-hash --url "$RPC_URL")"
[[ "$GENESIS" == "$MAINNET_GENESIS" ]] || { echo "Refusing non-mainnet RPC: $GENESIS" >&2; exit 1; }
PROGRAM_ID="$(solana address -k "$PROGRAM_KEYPAIR")"
[[ "$PROGRAM_ID" == "$EXPECTED_PROGRAM_ID" ]] || { echo "Wrong program keypair: $PROGRAM_ID" >&2; exit 1; }
AUTHORITY_ADDRESS="$(solana address -k "$AUTHORITY")"
PROGRAM_INFO="$(solana program show "$PROGRAM_ID" --url "$RPC_URL")"
grep -q "Authority: $AUTHORITY_ADDRESS" <<<"$PROGRAM_INFO" || { echo "Wallet is not the program upgrade authority." >&2; exit 1; }

printf 'Program:   %s\nAuthority: %s\nNetwork:   mainnet-beta\n' "$PROGRAM_ID" "$AUTHORITY_ADDRESS"
read -r -p "Type UPGRADE MARKETPLACE to continue: " CONFIRMATION
[[ "$CONFIRMATION" == "UPGRADE MARKETPLACE" ]] || { echo "Cancelled."; exit 1; }

cargo build-sbf --tools-version v1.57 --manifest-path programs/solhandle/Cargo.toml
solana program deploy \
  --url "$RPC_URL" \
  --keypair "$AUTHORITY" \
  --upgrade-authority "$AUTHORITY" \
  --program-id "$PROGRAM_KEYPAIR" \
  target/deploy/solhandle.so

echo "Marketplace relisting upgrade deployed to Mainnet-beta."