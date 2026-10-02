#!/usr/bin/env bash
set -euo pipefail
PACKAGE="$(cd "$(dirname "$0")/../../../.." && pwd)"
ROOT="$PWD"
command -v sha256sum >/dev/null
command -v node >/dev/null
case "$(command -v node)" in /mnt/*|*.exe) echo 'STOP: native Linux Node required.'; exit 1;; esac
(cd "$PACKAGE" && sha256sum --check src/components/solhandle/partner-mint/EARN-PAYLOAD-SHA256SUMS)
printf '%s\n' \
 '2275c5aacb5e51a6c09738770047cbc0f7c7be31a0695430d3b19ff774f8f8b3  base44/shared/earnNetwork.ts' \
 'c85d4e6eaa48f019dc344bb0112e51cc8d575585a945f2defbe24290697f3228  base44/shared/referralEngine.ts' \
 '7b536c99290718e292796d604d52c83f65e87548c8f415a72141dc955d924caf  base44/shared/solanaRpc.ts' \
 '151554664d39136db33f22d5f908736377a39993f82419d14505bdd0fd94a9e4  base44/shared/solhandleProtocol.ts' | sha256sum --check
for FILE in partnerMintEarnPolicy.mjs partnerMintEarnGuard.ts partnerMintEarnChecks.mjs; do
 test ! -e "$ROOT/base44/shared/$FILE" || { echo "STOP: $FILE already exists; nothing overwritten."; exit 1; }
done
node "$PACKAGE/base44/shared/partnerMintEarnChecks.mjs"
BACKUP="$(mktemp -d "$HOME/solhandle-earn-policy-backup.XXXXXX")"
cp -p "$ROOT/base44/shared/earnNetwork.ts" "$ROOT/base44/shared/referralEngine.ts" "$BACKUP/"
for FILE in earnNetwork.ts referralEngine.ts partnerMintEarnPolicy.mjs partnerMintEarnGuard.ts partnerMintEarnChecks.mjs; do
 cp "$PACKAGE/base44/shared/$FILE" "$ROOT/base44/shared/$FILE"
done
printf 'Source backup: %s\n' "$BACKUP"
echo 'Earn primary-mint policy source installed. No Rust, wallet, dependency, network configuration or deployment changes.'
echo 'Next: node base44/shared/partnerMintEarnChecks.mjs'