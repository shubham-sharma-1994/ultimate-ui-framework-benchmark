#!/usr/bin/env bash
# Align + sign an APK with a shared debug keystore so it installs on any device.
# usage: sign-apk.sh <input.apk> <output.apk>
set -euo pipefail
IN="$1"; OUT="$2"
SDK="${ANDROID_HOME:-${ANDROID_SDK_ROOT:-/usr/local/lib/android/sdk}}"
BT="$(ls -d "$SDK"/build-tools/* | sort -V | tail -1)"
KS="${RUNNER_TEMP:-/tmp}/pulse-debug.keystore"
[ -f "$KS" ] || keytool -genkey -keystore "$KS" -storepass android -keypass android \
  -alias pulse -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Pulse Benchmark,O=Pulse,C=US"
mkdir -p "$(dirname "$OUT")"
"$BT/zipalign" -p -f 4 "$IN" "$OUT.aligned"
"$BT/apksigner" sign --ks "$KS" --ks-pass pass:android --key-pass pass:android --ks-key-alias pulse --out "$OUT" "$OUT.aligned"
rm -f "$OUT.aligned" "$OUT.idsig"
"$BT/apksigner" verify --verbose "$OUT" | head -5
