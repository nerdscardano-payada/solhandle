#!/usr/bin/env bash
set -euo pipefail
umask 077
cd "$(dirname "$0")"
export SOLHANDLE_KEYSTORE="${SOLHANDLE_KEYSTORE:-$HOME/.solhandle-android/release.jks}"
[[ -f "$SOLHANDLE_KEYSTORE" ]] || { echo 'First run: bash create-signing-key.sh'; exit 1; }
export ANDROID_HOME="${ANDROID_HOME:-${ANDROID_SDK_ROOT:-$HOME/Android/Sdk}}"
[[ -d "$ANDROID_HOME" ]] || { echo 'Install Android Studio SDK 35 / Build Tools 35.0.0 and set ANDROID_HOME.'; exit 1; }
command -v java >/dev/null || { echo 'Java 17 is required.'; exit 1; }
read -r -s -p 'Keystore password: ' SOLHANDLE_STORE_PASSWORD; echo
read -r -s -p 'Key password (Enter = same): ' SOLHANDLE_KEY_PASSWORD; echo
export SOLHANDLE_STORE_PASSWORD SOLHANDLE_KEY_PASSWORD="${SOLHANDLE_KEY_PASSWORD:-$SOLHANDLE_STORE_PASSWORD}"
trap 'unset SOLHANDLE_STORE_PASSWORD SOLHANDLE_KEY_PASSWORD' EXIT
VERSION="${1:-1.0.0}"; CODE="${2:-1}"
[[ "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ && "$CODE" =~ ^[1-9][0-9]*$ ]] || { echo 'Use: bash build-release.sh 1.0.0 1'; exit 1; }
bash gradle-run.sh --no-daemon --no-configuration-cache :app:assembleRelease -PreleaseVersion="$VERSION" -PreleaseCode="$CODE"
SIGNER="$ANDROID_HOME/build-tools/35.0.0/apksigner"
[[ -x "$SIGNER" ]] || { echo 'Install Android SDK Build Tools 35.0.0'; exit 1; }
APK="app/build/outputs/apk/release/app-release.apk"
"$SIGNER" verify --verbose --print-certs "$APK" | tee /dev/stderr >/dev/null
mkdir -p releases
DEST="releases/solhandle-$VERSION.apk"
cp "$APK" "$DEST"
sha256sum "$DEST" | tee "$DEST.sha256"
echo "Version: $VERSION | versionCode: $CODE | Minimum Android: 8.0"
echo 'Certificate SHA-256 (copy to the release form):'
"$SIGNER" verify --print-certs "$DEST" | sed -n 's/^Signer #1 certificate SHA-256 digest: / /p'
echo 'Test on a real Android device before publishing. Upload only the APK to public HTTPS hosting.'
echo 'Publish its direct URL, checksum, certificate fingerprint and version at /android as an admin.'