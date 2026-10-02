#!/usr/bin/env bash
set -euo pipefail
BUNDLE="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
for cmd in git cmp cp sha256sum; do command -v "$cmd" >/dev/null || { echo "STOP: missing $cmd"; exit 1; }; done
test -f programs/solhandle/src/partner_registry.rs && test -f Cargo.toml || { echo 'STOP: run from your existing project with the foundation installed.'; exit 1; }
(cd "$BUNDLE/payload" && sha256sum --check "$BUNDLE/SHA256SUMS")
sha256sum --check "$BUNDLE/BASELINE_SHA256SUMS"
MODE=''
if git apply --check "$BUNDLE/atomic-sol.patch" 2>/dev/null; then MODE='apply';
elif git apply --reverse --check "$BUNDLE/atomic-sol.patch" 2>/dev/null; then MODE='present';
else echo 'STOP: existing source differs from expected insertion points. Nothing changed; do not force or replace lib.rs.'; exit 1; fi
while IFS= read -r -d '' SOURCE; do
  RELATIVE="${SOURCE#"$BUNDLE/payload/"}"
  if [ -e "$RELATIVE" ] && ! cmp --silent "$SOURCE" "$RELATIVE"; then echo "STOP: local file differs: $RELATIVE. Nothing changed."; exit 1; fi
done < <(find "$BUNDLE/payload" -type f -print0)
if [ "$MODE" = 'apply' ]; then
  BACKUP="$(mktemp -d "$HOME/solhandle-atomic-sol-backup.XXXXXX")"
  cp programs/solhandle/src/lib.rs "$BACKUP/lib.rs"
  cp src/components/solhandle/partner-mint/run-foundation-local.mjs "$BACKUP/run-foundation-local.mjs"
  git apply "$BUNDLE/atomic-sol.patch"
  echo "Original source backup: $BACKUP"
fi
while IFS= read -r -d '' SOURCE; do
  RELATIVE="${SOURCE#"$BUNDLE/payload/"}"
  mkdir -p "$(dirname -- "$RELATIVE")"
  if [ ! -e "$RELATIVE" ]; then cp -- "$SOURCE" "$RELATIVE"; fi
done < <(find "$BUNDLE/payload" -type f -print0)
echo 'Atomic Partner SOL source installed. No build, deployment, keys, CLI or dependency changes.'
echo 'Next: follow README-ATOMIC-SOL.md. Mainnet remains unchanged.'