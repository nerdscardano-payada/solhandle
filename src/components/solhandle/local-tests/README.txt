SOLHANDLE — LOCAL PAYMENT TESTS (30 September 2026)

Purpose: prepare contract integration tests, without modifying the Rust source,
Anchor configuration, CLI network settings, production wallet files or website.

Use the downloadable WSL handoff from the assistant in your existing project root.
It downloads this bundle, verifies SHA-256 fingerprints and refuses to overwrite
an existing .solhandle-local-tests directory. The start script verifies the
previously reported solhandle.so fingerprint and starts its OWN local validator
on 127.0.0.1:18899 in a fresh temporary ledger. It never stops another validator.

Dependencies: native Linux Node 18+ and the existing project's @solana/web3.js,
Solana CLI with solana-test-validator, curl, sha256sum. No Anchor JS, ts-node,
Mocha, SPL JS package, IDL build or new npm installation is required.

Metaplex Core is cloned from the public mainnet RPC as an executable fixture only.
A rate limit or download failure stops startup; no tests are counted as passed.
All transactions go to localhost. Newly generated in-memory test wallets and
an artificial SPL token are used, never the real $HANDLE mint or quote signer.
No deployment or configuration transaction is sent to any external network.

Assertions cover: NFT/record ownership, exact buyer debit, exact supply reduction,
50/50 split and odd-unit rounding; duplicate handle; insufficient balance after
partial transfer; forced failure AFTER mint/burn with full transaction rollback;
SOL mint regression; expired/future/tampered/wrong-wallet/wrong-handle/wrong-signer
quotes; missing signature; too-small payment; wrong mint; wrong token owner;
disabled payments; protected handle. Failed transactions are submitted locally,
not merely simulated. Their logs must match the expected failure reason.
Rollback checks token balances, supply, config, collection, asset and handle.
Transaction fees still apply locally on failures and are not asserted as refunded.

Prepared, NOT executed here. This does not replace an independent security audit,
frontend/backend end-to-end tests, Token-2022 extension tests or marketplace tests.
Keep mainnet payment enablement OFF until those remaining checks are completed.