#!/usr/bin/env bash
set -euo pipefail
# Run from the existing native Linux/WSL project root. Never changes Solana CLI config.
for cmd in node solana-test-validator sha256sum curl; do command -v "$cmd" >/dev/null || { echo "STOP: missing $cmd"; exit 1; }; done
case "$(command -v node)" in /mnt/*|*.exe) echo 'STOP: use Linux Node in WSL, not Windows Node.'; exit 1;; esac
ROOT="$PWD"
test -f target/deploy/solhandle.so || { echo 'STOP: built solhandle.so is missing.'; exit 1; }
test -f "$ROOT/.solhandle-local-tests/run.mjs" || { echo 'STOP: test bundle is missing.'; exit 1; }
printf '%s  %s\n' 'f80aa41369d37aa1c1072e68e8566da190945b83a9a272c56d96d5b7cf2b68e0' 'target/deploy/solhandle.so' | sha256sum --check - || { echo 'STOP: binary differs from the previously reported build. Do not deploy it; confirm which build to test.'; exit 1; }
for PORT in 18899 18900 18901; do
  if (echo >/dev/tcp/127.0.0.1/"$PORT") >/dev/null 2>&1; then echo "STOP: port $PORT in use. No existing validator will be stopped."; exit 1; fi
done
RUN="$(mktemp -d /tmp/solhandle-local-tests.XXXXXX)"
PID=''
cleanup() { if [ -n "$PID" ] && kill -0 "$PID" 2>/dev/null; then kill "$PID"; wait "$PID" || true; fi; echo "Local validator logs retained at $RUN/validator.log"; }
trap cleanup EXIT
# Remote RPC is used ONLY to fetch Metaplex Core's executable fixture.
# All test transactions use the fixed loopback RPC; all wallets are newly generated in memory.
solana-test-validator --ledger "$RUN/ledger" --bind-address 127.0.0.1 --rpc-port 18899 --faucet-port 18901 --url https://api.mainnet-beta.solana.com --clone-upgradeable-program CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d --bpf-program B7xiwfxGcR2Xz7tcUKrkB8Ly6NV8jU7LH1m6GJZRUuf "$ROOT/target/deploy/solhandle.so" >"$RUN/validator.log" 2>&1 &
PID=$!
READY=false
for attempt in $(seq 1 120); do
  if ! kill -0 "$PID" 2>/dev/null; then tail -n 40 "$RUN/validator.log"; echo 'STOP: local validator failed to start.'; exit 1; fi
  RESPONSE="$(curl --silent --max-time 2 -H 'Content-Type: application/json' --data '{"jsonrpc":"2.0","id":1,"method":"getHealth"}' http://127.0.0.1:18899 || true)"
  if echo "$RESPONSE" | grep -q '"result":"ok"'; then READY=true; break; fi
  sleep 1
done
if [ "$READY" != true ]; then tail -n 40 "$RUN/validator.log"; echo 'STOP: validator not ready.'; exit 1; fi
node "$ROOT/.solhandle-local-tests/run.mjs"