# SolHandle Devnet deployment

## Security boundary

Deploy from a native Linux or WSL2 terminal using a dedicated Devnet authority wallet. Never put a private key, seed phrase, or authority key in Base44, frontend code, or a public environment file.

## Prerequisites

- Rust 1.89.0
- Solana CLI configured for Devnet
- Anchor 0.32.1
- Node.js installed natively in Linux/WSL2

```bash
cd src
rustup toolchain install 1.89.0
avm install 0.32.1
avm use 0.32.1
solana config set --url https://api.devnet.solana.com
solana-keygen new --outfile ~/.config/solana/solhandle-devnet.json
solana config set --keypair ~/.config/solana/solhandle-devnet.json
solana address
solana airdrop 2
anchor build
anchor keys sync
anchor deploy --provider.cluster devnet
```

## After deployment

1. Copy the deployed Program ID from the Anchor output.
2. Create one official Metaplex Core Devnet Collection, with the protocol Config PDA as collection authority.
3. Choose separate Devnet treasury and integration-rewards-vault addresses.
4. Initialize the SolHandle Config PDA with collection, treasury and five length-tier prices.
5. Put only public addresses and RPC URLs into `.env.devnet`, using `.env.devnet.example` as the template.
6. Rebuild the app and run the first mint test for `@ansem`.

## Required acceptance checks

- `mint_handle("ansem", max_price)` transfers the full primary price to the treasury.
- A duplicate mint fails because the Handle PDA already exists.
- A price above `max_price` fails before payment completes.
- The Core Asset belongs to the official Devnet Collection and is owned directly by the signing wallet.
- Direct chain resolution returns the NFT's current owner after a transfer.

## Do not enable public claiming yet

Public claim activation waits for the remaining protocol work: reserved-handle PDAs, price-override PDAs, primary-handle ownership checks, deterministic Core Asset handling, collection royalty setup, and automated Devnet tests.