#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$HOME/solhandle-repo"
cd "$ROOT_DIR"

PROGRAM_ID="ATJutPfzXiYpf7NXaGPEBek69jHaU8Cy85ekUH8drMGT"
RPC_URL="https://api.devnet.solana.com"
AUTHORITY="${SOLHANDLE_AUTHORITY:-$HOME/.config/solana/solhandle-devnet.json}"
PROGRAM_KEYPAIR="${SOLHANDLE_PROGRAM_KEYPAIR:-}"

for command in cargo solana solana-keygen node; do
  command -v "$command" >/dev/null || { echo "Missing required command: $command" >&2; exit 1; }
done
[[ -f "$AUTHORITY" ]] || { echo "Missing authority: $AUTHORITY" >&2; exit 1; }

if [[ -z "$PROGRAM_KEYPAIR" ]]; then
  for candidate in "$ROOT_DIR"/keys/*.json "$ROOT_DIR"/target/deploy/*-keypair.json "$HOME"/.config/solana/*.json; do
    [[ -f "$candidate" ]] || continue
    if [[ "$(solana-keygen pubkey "$candidate" 2>/dev/null || true)" == "$PROGRAM_ID" ]]; then
      PROGRAM_KEYPAIR="$candidate"
      break
    fi
  done
fi

[[ -n "$PROGRAM_KEYPAIR" && -f "$PROGRAM_KEYPAIR" ]] || {
  echo "No local program keypair found for $PROGRAM_ID." >&2
  echo "The existing Devnet program cannot be upgraded without its original program keypair." >&2
  exit 1
}
echo "Program keypair: $PROGRAM_KEYPAIR"

grep -q "declare_id!(\"$PROGRAM_ID\")" programs/solhandle/src/lib.rs || {
  echo "Rust program ID does not match $PROGRAM_ID" >&2
  exit 1
}
grep -q 'authority(Some(&config.to_account_info()))' programs/solhandle/src/lib.rs || {
  echo "Metaplex Config-PDA authority fix is missing; update the repository first." >&2
  exit 1
}

solana config set --url "$RPC_URL" --keypair "$AUTHORITY" >/dev/null
cargo build-sbf --tools-version v1.57 --manifest-path programs/solhandle/Cargo.toml
solana program deploy --url "$RPC_URL" --program-id "$PROGRAM_KEYPAIR" --upgrade-authority "$AUTHORITY" target/deploy/solhandle.so

export SOLHANDLE_PROGRAM_ID="$PROGRAM_ID"
node scripts/verify-devnet.mjs

echo "SolHandle V2 mint-authority upgrade deployed and verified."