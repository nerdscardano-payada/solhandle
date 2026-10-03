#!/usr/bin/env bash
set -euo pipefail
ROOT="$PWD"
for cmd in node solana-test-validator curl sha256sum; do command -v "$cmd" >/dev/null || { echo "STOP: missing $cmd"; exit 1; }; done
case "$(command -v node)" in /mnt/*|*.exe) echo 'STOP: use native Linux Node in WSL.'; exit 1;; esac
test -f "$ROOT/target/deploy/solhandle.so" || { echo 'STOP: build target/deploy/solhandle.so first with your existing build procedure.'; exit 1; }
RUNNER="$ROOT/src/components/solhandle/bulk-local/initialize-local-bulk.mjs"
test -f "$RUNNER" || { echo 'STOP: local bulk source files are missing.'; exit 1; }
for PORT in 18899 18900 18901 18902; do
  if (echo >/dev/tcp/127.0.0.1/"$PORT") >/dev/null 2>&1; then echo "STOP: port $PORT is occupied. Existing processes are left untouched."; exit 1; fi
done
RUN="$(mktemp -d /tmp/solhandle-bulk-local.XXXXXX)"
PID=''; SERVER=''
cleanup() { for child in "$SERVER" "$PID"; do if [ -n "$child" ] && kill -0 "$child" 2>/dev/null; then kill "$child"; wait "$child" || true; fi; done; echo "Local logs and ledger retained at $RUN"; }
trap cleanup EXIT
sha256sum "$ROOT/target/deploy/solhandle.so" | tee "$RUN/build.sha256"
# Remote read only: clone Metaplex Core. All initialization and mint transactions use loopback.
solana-test-validator --ledger "$RUN/ledger" --bind-address 127.0.0.1 --rpc-port 18899 --faucet-port 18901 --url https://api.mainnet-beta.solana.com --clone-upgradeable-program CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d --bpf-program B7xiwfxGcR2Xz7tcUKrkB8Ly6NV8jU7LH1m6GJZRUuf "$ROOT/target/deploy/solhandle.so" >"$RUN/validator.log" 2>&1 &
PID=$!
READY=false
for attempt in $(seq 1 120); do
  if ! kill -0 "$PID" 2>/dev/null; then tail -n 40 "$RUN/validator.log"; exit 1; fi
  RESULT="$(curl --silent --max-time 2 -H 'Content-Type: application/json' --data '{"jsonrpc":"2.0","id":1,"method":"getHealth"}' http://127.0.0.1:18899 || true)"
  if echo "$RESULT" | grep -q '"result":"ok"'; then READY=true; break; fi
  sleep 1
done
if [ "$READY" != true ]; then tail -n 40 "$RUN/validator.log"; echo 'STOP: validator not ready.'; exit 1; fi
node "$RUNNER" | tee "$RUN/setup.log"
node "$ROOT/src/components/solhandle/bulk-local/local-metadata-server.mjs" >"$RUN/metadata.log" 2>&1 &
SERVER=$!
echo 'Ready. In another terminal run npm run dev -- --host 127.0.0.1 and open the local /search page.'
echo 'Use a disposable wallet with custom RPC http://127.0.0.1:18899. Fund it using the local faucet button.'
echo 'Ctrl+C stops only this launcher’s validator and metadata server.'
wait "$SERVER"