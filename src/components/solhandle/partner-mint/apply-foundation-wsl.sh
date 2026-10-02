#!/usr/bin/env bash
set -euo pipefail
# Run from YOUR existing project root; this script never builds or deploys.
BUNDLE="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
for cmd in git cmp cp sha256sum; do command -v "$cmd" >/dev/null || { echo "STOP: missing $cmd"; exit 1; }; done
test -f programs/solhandle/src/lib.rs && test -f Cargo.toml || { echo 'STOP: run from the existing SolHandle project root.'; exit 1; }
(cd "$BUNDLE/payload" && sha256sum --check "$BUNDLE/SHA256SUMS")
MODE=''
if git apply --check "$BUNDLE/partner-foundation.patch" 2>/dev/null; then MODE='apply';
elif git apply --reverse --check "$BUNDLE/partner-foundation.patch" 2>/dev/null; then MODE='present';
else echo 'STOP: lib.rs differs from the expected insertion points. Nothing changed; do not replace your entire lib.rs.'; exit 1; fi
# Detect local changes BEFORE changing any file. Existing matching files are kept.
while IFS= read -r -d '' SOURCE; do
  RELATIVE="${SOURCE#"$BUNDLE/payload/"}"
  if [ -e "$RELATIVE" ] && ! cmp --silent "$SOURCE" "$RELATIVE"; then
    echo "STOP: local file differs: $RELATIVE. Nothing changed; reconcile this file first."
    exit 1
  fi
done < <(find "$BUNDLE/payload" -type f -print0)
if [ "$MODE" = 'apply' ]; then
  BACKUP="$(mktemp -d "$HOME/solhandle-foundation-backup.XXXXXX")"
  cp programs/solhandle/src/lib.rs "$BACKUP/lib.rs"
  git apply "$BUNDLE/partner-foundation.patch"
  echo "Original lib.rs backup: $BACKUP/lib.rs"
fi
while IFS= read -r -d '' SOURCE; do
  RELATIVE="${SOURCE#"$BUNDLE/payload/"}"
  mkdir -p "$(dirname -- "$RELATIVE")"
  if [ ! -e "$RELATIVE" ]; then cp -- "$SOURCE" "$RELATIVE"; fi
done < <(find "$BUNDLE/payload" -type f -print0)
echo 'Partner foundation source installed. No keys, program IDs, CLI configuration or network deployments changed.'
echo 'Next: follow README-WSL.md to build and run LOCAL checks. No mainnet upgrade.'