#!/usr/bin/env bash
# Run from the verified WSL checkout. This script never deploys or signs.
set -euo pipefail
ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"
EXPECTED="2f585518fe37149036b57f459c9476fd7b92a00d"
[[ "$(git rev-parse HEAD)" == "$EXPECTED" ]] || { echo "STOP: not the verified base commit." >&2; exit 1; }
MANIFEST="programs/solhandle/Cargo.toml"
SOURCE="programs/solhandle/src/lib.rs"
git diff --quiet HEAD -- "$MANIFEST" "$SOURCE" || { echo "STOP: program source or manifest already modified; review first." >&2; exit 1; }
command -v cargo >/dev/null || { echo "Linux Cargo is required." >&2; exit 1; }
grep -Fq 'anchor-lang = { version = "=0.31.1"' "$MANIFEST"
grep -Fq 'declare_id!("B7xiwfxGcR2Xz7tcUKrkB8Ly6NV8jU7LH1m6GJZRUuf");' "$SOURCE"
BACKUP="$(mktemp -d "${TMPDIR:-/tmp}/solhandle-security-backup-XXXXXX")"
cp "$MANIFEST" "$BACKUP/Cargo.toml"
cp "$SOURCE" "$BACKUP/lib.rs"
cp Cargo.lock "$BACKUP/Cargo.lock"
echo "Backup (including your current lockfile): $BACKUP"
# Adding a direct dependency does not change the existing Anchor pins.
awk '/^\[dependencies\]$/ { print; print "solana-security-txt = \"=1.1.3\""; next } { print }' "$MANIFEST" > "$BACKUP/manifest.new"
mv "$BACKUP/manifest.new" "$MANIFEST"
awk '{ print } /^declare_id!\("B7xiwfxGcR2Xz7tcUKrkB8Ly6NV8jU7LH1m6GJZRUuf"\);$/ {
 print ""
 print "#[cfg(not(feature = \"no-entrypoint\"))]"
 print "solana_security_txt::security_txt! {"
 print "    name: \"SolHandle\","
 print "    project_url: \"https://solhandle.io\","
 print "    contacts: \"link:https://solhandle.io/contact\","
 print "    policy: \"https://solhandle.io/contact#security\","
 print "    preferred_languages: \"en,nl\","
 print "    source_code: \"https://github.com/nerdscardano-payada/solhandle\""
 print "}"
}' "$SOURCE" > "$BACKUP/source.new"
mv "$BACKUP/source.new" "$SOURCE"
# Resolve the new direct dependency with the existing lockfile, not a blanket update.
cargo metadata --format-version 1 --manifest-path "$MANIFEST" > "$BACKUP/metadata.json"
echo "Review the security-only source change and dependency resolution:"
git --no-pager diff -- "$MANIFEST" "$SOURCE"
git --no-pager diff --stat -- Cargo.lock
echo "Next: reproducible build (does NOT deploy):"
echo 'solana-verify build --library-name solhandle --cargo-build-sbf-args="--tools-version v1.57"'
echo "STOP here after building. Review the new binary and publish the release commit before upgrading."
echo "No mainnet transaction was submitted."