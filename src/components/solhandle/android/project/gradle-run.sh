#!/usr/bin/env bash
set -euo pipefail
VERSION=8.11.1
CACHE="${XDG_CACHE_HOME:-$HOME/.cache}/solhandle-gradle"
mkdir -p "$CACHE"
if [[ ! -x "$CACHE/gradle-$VERSION/bin/gradle" ]]; then
  command -v curl >/dev/null; command -v unzip >/dev/null; command -v sha256sum >/dev/null
  TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
  BASE="https://services.gradle.org/distributions/gradle-$VERSION-bin.zip"
  curl --fail --location --proto '=https' --tlsv1.2 "$BASE" -o "$TMP/gradle.zip"
  EXPECTED="$(curl --fail --location --proto '=https' --tlsv1.2 "$BASE.sha256")"
  [[ "$EXPECTED" =~ ^[a-f0-9]{64}$ ]] || { echo 'Invalid Gradle checksum'; exit 1; }
  echo "$EXPECTED  $TMP/gradle.zip" | sha256sum -c -
  unzip -q "$TMP/gradle.zip" -d "$CACHE"
fi
exec "$CACHE/gradle-$VERSION/bin/gradle" "$@"