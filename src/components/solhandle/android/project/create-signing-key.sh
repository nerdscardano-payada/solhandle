#!/usr/bin/env bash
set -euo pipefail
umask 077
KEY_DIR="${SOLHANDLE_KEY_DIR:-$HOME/.solhandle-android}"
mkdir -p "$KEY_DIR"
KEYSTORE="$KEY_DIR/release.jks"
if [[ -e "$KEYSTORE" ]]; then echo "Key already exists: $KEYSTORE. Never overwrite it; reuse it for updates."; exit 1; fi
command -v keytool >/dev/null || { echo 'Install Java 17 (JDK), then try again.'; exit 1; }
echo 'Create a strong password. Keep the keystore and passwords outside this project.'
echo 'Use the same password for the keystore and key when prompted.'
keytool -genkeypair -keystore "$KEYSTORE" -storetype JKS -alias solhandle -keyalg RSA -keysize 4096 -validity 10000 -dname 'CN=SolHandle Android'
chmod 600 "$KEYSTORE"
echo "Created $KEYSTORE"
echo 'Back up this file AND its password offline in separate secure locations. Losing it prevents updates.'