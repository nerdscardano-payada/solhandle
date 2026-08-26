#!/usr/bin/env bash
# SolHandle V2 — MAINNET-BETA deployment + initialization (paused by default).
#
# Required environment:
#   SOLHANDLE_AUTHORITY         mainnet authority keypair (pays deploy + init rent)
#   SOLHANDLE_COLLECTION_URI   Irys mainnet collection metadata URI (upload before running)
#   SOLHANDLE_TREASURY          mainnet treasury wallet address
#   SOLHANDLE_REWARDS_VAULT     mainnet rewards vault address
#
# Optional:
#   SOLHANDLE_PROGRAM_KEYPAIR   defaults to keys/solhandle-v1-mainnet-program.json
#   SOLANA_RPC_URL              defaults to https://api.mainnet-beta.solana.com
#   RESERVED_NAMES              comma-separated handle|organization entries for verified Solana organizations
#   PROTECTED_NAMES             comma-separated handle|reason entries for protected brands
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"
AUTHORITY="${SOLHANDLE_AUTHORITY:?SOLHANDLE_AUTHORITY (mainnet keypair) is required}"
PROGRAM_KEYPAIR="${SOLHANDLE_PROGRAM_KEYPAIR:-$ROOT_DIR/keys/solhandle-v1-mainnet-program.json}"
RPC_URL="${SOLANA_RPC_URL:-https://api.mainnet-beta.solana.com}"

for command in cargo solana solana-keygen node perl awk; do
  command -v "$command" >/dev/null || { echo "Missing required command: $command" >&2; exit 1; }
done
[[ -f "$AUTHORITY" ]] || { echo "Mainnet authority keypair not found: $AUTHORITY" >&2; exit 1; }
mkdir -p "$(dirname "$PROGRAM_KEYPAIR")"

echo "=> Pre-flight checks"
GENESIS_HASH="$(solana genesis-hash --url "$RPC_URL" 2>/dev/null)" || { echo "ERROR: RPC validation failed; URL remains hidden." >&2; exit 1; }
[[ "$GENESIS_HASH" == "5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d" ]] || { echo "ERROR: RPC is not Solana Mainnet-beta (genesis $GENESIS_HASH)." >&2; exit 1; }
AUTHORITY_ADDRESS="$(solana address -k "$AUTHORITY")"
echo "Authority: $AUTHORITY_ADDRESS"
BALANCE_SOL="$(solana balance "$AUTHORITY_ADDRESS" --url "$RPC_URL" | awk '{print $1}')"
echo "Balance: $BALANCE_SOL SOL"
awk -v balance="$BALANCE_SOL" 'BEGIN { if (balance < 9) exit 1 }' || { echo "ERROR: authority requires at least 9 SOL before deployment." >&2; exit 1; }
[[ -n "${SOLHANDLE_COLLECTION_URI:-}" ]] || { echo "ERROR: set SOLHANDLE_COLLECTION_URI (Irys mainnet collection metadata URI)" >&2; exit 1; }
[[ -n "${SOLHANDLE_TREASURY:-}" ]] || { echo "ERROR: set SOLHANDLE_TREASURY (mainnet treasury wallet address)" >&2; exit 1; }
[[ -n "${SOLHANDLE_REWARDS_VAULT:-}" ]] || { echo "ERROR: set SOLHANDLE_REWARDS_VAULT (mainnet rewards wallet address)" >&2; exit 1; }

AUTHORITY_ADDRESS="$AUTHORITY_ADDRESS" node --input-type=module <<'NODE'
import { PublicKey } from "@solana/web3.js";
const authority = new PublicKey(process.env.AUTHORITY_ADDRESS);
const treasury = new PublicKey(process.env.SOLHANDLE_TREASURY);
const rewards = new PublicKey(process.env.SOLHANDLE_REWARDS_VAULT);
if (new Set([authority.toBase58(), treasury.toBase58(), rewards.toBase58()]).size !== 3) {
  throw new Error("Authority, treasury, and rewards vault must be three distinct wallets.");
}
const uri = new URL(process.env.SOLHANDLE_COLLECTION_URI);
if (uri.protocol !== "https:") throw new Error("Collection URI must use HTTPS.");
const response = await fetch(uri);
if (!response.ok) throw new Error(`Collection metadata is unavailable (${response.status}).`);
const metadata = await response.json();
if (metadata.name !== "SolHandle" || metadata.symbol !== "SOLHANDLE" || !metadata.image) {
  throw new Error("Collection metadata does not match SolHandle or has no image.");
}
console.log("Collection metadata: verified");
NODE

if [[ -f "$PROGRAM_KEYPAIR" ]]; then
  echo "=> Reusing existing mainnet program keypair"
else
  echo "=> Generating mainnet program keypair"
  solana-keygen new --no-bip39-passphrase --silent --outfile "$PROGRAM_KEYPAIR"
fi
PROGRAM_ID="$(solana address -k "$PROGRAM_KEYPAIR")"
COLLECTION_ID="$(PROGRAM_ID="$PROGRAM_ID" node --input-type=module -e 'import { PublicKey } from "@solana/web3.js"; console.log(PublicKey.findProgramAddressSync([Buffer.from("collection")], new PublicKey(process.env.PROGRAM_ID))[0].toBase58())')"
if solana program show "$PROGRAM_ID" --url "$RPC_URL" >/dev/null 2>&1; then
  echo "ERROR: program $PROGRAM_ID is already deployed; refusing to redeploy." >&2
  exit 1
fi

echo ""
echo "FINAL MAINNET DEPLOYMENT SUMMARY"
echo "Authority:  $AUTHORITY_ADDRESS"
echo "Program:    $PROGRAM_ID"
echo "Collection: $COLLECTION_ID"
echo "Treasury:   $SOLHANDLE_TREASURY"
echo "Rewards:    $SOLHANDLE_REWARDS_VAULT"
echo "Metadata:   $SOLHANDLE_COLLECTION_URI"
echo "Budget gate: authority has $BALANCE_SOL SOL (minimum 9 SOL)"
read -r -p "Type DEPLOY MAINNET to continue: " CONFIRMATION
[[ "$CONFIRMATION" == "DEPLOY MAINNET" ]] || { echo "Deployment cancelled without spending SOL."; exit 1; }

echo "Deploying SolHandle V2 to MAINNET-BETA: $PROGRAM_ID"

echo "=> Writing Mainnet program and collection IDs into every runtime"
PROGRAM_ID="$PROGRAM_ID" perl -0pi -e 's/(declare_id!\(")[^"]+/$1 . $ENV{PROGRAM_ID}/e' programs/solhandle/src/lib.rs
PROGRAM_ID="$PROGRAM_ID" perl -0pi -e 's/(PROGRAM_ID = new PublicKey\(")[^"]+/$1 . $ENV{PROGRAM_ID}/eg' src/lib/solhandleProtocol.js src/lib/solhandleSdk.js
PROGRAM_ID="$PROGRAM_ID" perl -0pi -e 's/(PROGRAM_ID = ")[^"]+/$1 . $ENV{PROGRAM_ID}/e' base44/shared/solhandleProtocol.ts
COLLECTION_ID="$COLLECTION_ID" perl -0pi -e 's/(COLLECTION_ID = new PublicKey\(")[^"]+/$1 . $ENV{COLLECTION_ID}/e' src/lib/solhandleSdk.js
COLLECTION_ID="$COLLECTION_ID" perl -0pi -e 's/(COLLECTION_ID = ")[^"]+/$1 . $ENV{COLLECTION_ID}/e' base44/shared/solhandleResolver.ts
PROGRAM_ID="$PROGRAM_ID" awk -v pid="$PROGRAM_ID" '
  /^\[programs\.mainnet\]/ { print; in_mainnet=1; next }
  in_mainnet && /^solhandle = / { print "solhandle = \"" pid "\""; in_mainnet=0; next }
  { print }
' Anchor.toml > Anchor.toml.tmp && mv Anchor.toml.tmp Anchor.toml

perl -0pi -e 's#https://api\.devnet\.solana\.com#https://api.mainnet-beta.solana.com#g; s/DEVNET_RPC/MAINNET_RPC/g; s/network: "devnet"/network: "mainnet-beta"/g; s/Solana Devnet/Solana Mainnet-beta/g; s/solana:devnet/solana:mainnet/g' src/lib/solhandleSdk.js src/lib/mintSolHandle.js src/components/solhandle/SolanaWalletProvider.jsx src/lib/registerMobileWallet.js base44/shared/solhandleResolver.ts base44/functions/uploadProtocolMetadata/entry.ts

echo "=> Building audited V2 program"
cargo build-sbf --tools-version v1.57 --manifest-path programs/solhandle/Cargo.toml

echo "=> Deploying to mainnet"
solana program deploy --url "$RPC_URL" --program-id "$PROGRAM_KEYPAIR" target/deploy/solhandle.so

export SOLHANDLE_PROGRAM_ID="$PROGRAM_ID"
export SOLHANDLE_AUTHORITY="$AUTHORITY"
export SOLANA_RPC_URL="$RPC_URL"

echo "=> Initializing mainnet config (deploys PAUSED)"
node scripts/initialize-mainnet.mjs

echo "=> Verifying mainnet config"
node scripts/verify-mainnet.mjs

echo "=> Creating RESERVED and PROTECTED name restrictions on mainnet"
node scripts/reserve-names-mainnet.mjs

echo ""
echo "MAINNET-BETA V2 deployed + initialized (PAUSED)."
echo "Program: $PROGRAM_ID"
echo "Collection: $COLLECTION_ID"
echo "Next steps:"
echo "  1. Commit the program-ID changes (Anchor.toml, lib.rs, solhandleProtocol.{js,ts})."
echo "  2. Update the Base44 SOLANA_RPC_URL secret to a mainnet endpoint (if not already)."
echo "  3. Update the Base44 ProtocolStatus record with the mainnet collection/treasury/rewards/prices."
echo "  4. Fund the IRYS_UPLOADER_PRIVATE_KEY wallet on mainnet for Irys metadata uploads."
echo "  5. Publish the app, then run set_paused(false) via Admin/CLI to go live."