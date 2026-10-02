#!/usr/bin/env bash
set -euo pipefail
# New build verification only: no deploy, CLI configuration changes or wallet files.
for cmd in node solana-test-validator sha256sum curl; do command -v "$cmd" >/dev/null || { echo "STOP: missing $cmd"; exit 1; }; done
case "$(command -v node)" in /mnt/*|*.exe) echo 'STOP: use native Linux Node in WSL.'; exit 1;; esac
ROOT="$PWD"
RUNNER="$ROOT/src/components/solhandle/partner-mint/run-foundation-local.mjs"
test -f "$ROOT/target/deploy/solhandle.so" && test -f "$RUNNER" || { echo 'STOP: build or source bundle is missing.'; exit 1; }
# Record the exact new build tested; never bypass the older suite fingerprint guard.
sha256sum "$ROOT/target/deploy/solhandle.so"
for PORT in 18899 18900 18901; do
  if (echo >/dev/tcp/127.0.0.1/"$PORT") >/dev/null 2>&1; then echo "STOP: port $PORT in use; existing validators are left untouched."; exit 1; fi
done
RUN="$(mktemp -d /tmp/solhandle-partner-foundation.XXXXXX)"
PID=''
cleanup() { if [ -n "$PID" ] && kill -0 "$PID" 2>/dev/null; then kill "$PID"; wait "$PID" || true; fi; echo "Logs retained at $RUN/validator.log"; }
trap cleanup EXIT
# Remote reads ONLY: fetch Core executable; every test transaction goes to loopback.
solana-test-validator --ledger "$RUN/ledger" --bind-address 127.0.0.1 --rpc-port 18899 --faucet-port 18901 --url https://api.mainnet-beta.solana.com --clone-upgradeable-program CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d --bpf-program B7xiwfxGcR2Xz7tcUKrkB8Ly6NV8jU7LH1m6GJZRUuf "$ROOT/target/deploy/solhandle.so" >"$RUN/validator.log" 2>&1 &
PID=$!
READY=false
for attempt in $(seq 1 120); do
  if ! kill -0 "$PID" 2>/dev/null; then tail -n 40 "$RUN/validator.log"; exit 1; fi
  RESPONSE="$(curl --silent --max-time 2 -H 'Content-Type: application/json' --data '{"jsonrpc":"2.0","id":1,"method":"getHealth"}' http://127.0.0.1:18899 || true)"
  if echo "$RESPONSE" | grep -q '"result":"ok"'; then READY=true; break; fi
  sleep 1
done
if [ "$READY" != true ]; then tail -n 40 "$RUN/validator.log"; echo 'STOP: validator not ready.'; exit 1; fi
node "$RUNNER" | tee "$RUN/results.log"