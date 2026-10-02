# Partner Mint, Phase 1 work package 1

Status: source prepared, not compiled or deployed here. No production changes.

## Approved 2 October 2026

- Eligible SOL mint fee includes premium surcharge. Partner receives floor(fee / 2); treasury receives fee minus partner share.
- Account rent, network/priority fees and storage are separate costs.
- No Earn primary-mint commission on the same Partner Mint. Existing origin history, secondary/creator-fee rules and direct mints remain unchanged.

## What this work package implements

Separate PartnerMintSettings PDA [partner_mint], leaving Config unchanged. Authority alone manages the dedicated quote signer and enable flag; initialize with enabled=false. Configured token-payment signer reuse is rejected when that account exists.

Unique MintPartner PDA [partner, SHA256(canonical partner ID)]. IDs use 1-32 lowercase ASCII letters, digits or hyphens. Only Config authority creates a partner. Both authority and System Program revenue wallet sign the creation transaction. This is transaction-bound wallet ownership proof, not the future web onboarding challenge flow. Partners never send signing keys to SolHandle; external-wallet cosigning UI will be implemented later.

Authority can suspend/disable/reapprove partners. A wallet change requires authority AND new revenue-wallet signatures. Both actions require the expected current revision and increment it, for later stale-quote invalidation. No account-close/recreate path or self-mint exemption is added. Self-mint defaults to prohibited for the future mint instruction.

Standalone integer split helper covers even/odd fees, minimum fee and u64 limits. It is not yet connected to a mint instruction or a payment flow. Registry events are audit data, not revenue receipts.

Instructions added: configure_partner_mint(bool enabled, Pubkey quote_signer), create_mint_partner(String partner_id), set_mint_partner_status(String partner_id, u64 expected_revision, PartnerStatus status), change_mint_partner_wallet(String partner_id, u64 expected_revision).

## Safe WSL build verification

From the existing native Linux project root after syncing this work package:

    cargo test -p solhandle --lib --locked
    cargo build-sbf --manifest-path programs/solhandle/Cargo.toml -- --locked
    sha256sum target/deploy/solhandle.so
    bash src/components/solhandle/partner-mint/start-foundation-local.sh

Use your established compatible Solana/Rust toolchain. Do not update dependencies or Cargo.lock just to bypass a toolchain error. If the existing environment needs a different build invocation, keep its established invocation; nothing here changes Anchor.toml, declare_id or wallet files.

The launcher starts an isolated local validator, clones only Metaplex Core's executable from a remote RPC, and uses newly generated local wallets. It checks registry authority/signature/PDA/revision constraints and then runs the existing payment/security regression suite against this new binary. Existing validators are not stopped. These tests were authored, NOT executed here.

Do not run the older local start script against this new binary: it intentionally pins an earlier binary fingerprint.

## Next work package, not included

Implement mint_handle_partner_sol with current shared pricing/restrictions, signed cluster-bound short-lived quotes, two SOL transfers, direct user NFT ownership and durable receipt in one atomic transaction. Then add API/indexer accounting enforcement, administrator wallet cosigning, partner checkout and devnet deployment. Review both directions of quote-signer separation before deployment, including later token-signer reconfiguration.

Keep Partner Mint disabled and do not upgrade mainnet for this foundation alone. Existing devnet program identity differs from the mainnet/local fixture identity; choose and verify the intended devnet build identity before any deploy rather than blindly using anchor deploy. A mainnet release needs separate explicit approval.