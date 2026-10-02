# SolHandle Partner Mint: WSL-overdracht 2 oktober 2026

Dit pakket bevat de echte Rust-broncode en lokale controles voor het partnerregister. De atomische partner-mint, API, checkout en Earn-uitsluiting zijn nog NIET gebouwd. Er wordt niets naar devnet of mainnet gedeployed.

## 1. Download en uitpakken

Download solhandle-partner-foundation-20261002.tar.gz uit de chat en plaats het bestand in je WSL-homefolder. Open je bestaande project met native Linux Node/Rust, niet Windows Node.

Voer vanuit je bestaande SolHandle-projectroot uit:

```bash
tar -xzf "$HOME/solhandle-partner-foundation-20261002.tar.gz" -C "$HOME"
bash "$HOME/solhandle-partner-foundation-20261002/apply-foundation-wsl.sh"
```

De installer controleert controlesommen en bestaande bestanden voordat hij wijzigingen toepast. Hij maakt een backup van je oude lib.rs en voegt alleen de module-import en vier nieuwe instructies toe. Hij vervangt niet de volledige lib.rs en past geen sleutels, program-ID, Anchor.toml, Cargo.toml of Cargo.lock aan. Bij afwijkende lokale bestanden stopt hij: forceer dan niets.

## 2. Eerst compileren

Gebruik je bestaande compatibele Solana/Rust-toolchain. Deze code is hier nog niet gecompileerd: ga pas verder als deze controles slagen.

```bash
cargo test -p solhandle --lib --locked
cargo build-sbf --manifest-path programs/solhandle/Cargo.toml -- --locked
sha256sum target/deploy/solhandle.so
```

Gebruik de bestaande werkende build-invocation als jouw toolchain andere build-opties vereist. Geen cargo update, geen gewijzigde lockfile om fouten te omzeilen en geen anchor keys sync: je bestaande program-ID blijft staan.

## 3. Alleen lokaal controleren

```bash
bash src/components/solhandle/partner-mint/start-foundation-local.sh
```

De lokale runner verwacht de bestaande mainnet-bronidentiteit B7xiwfxGcR2Xz7tcUKrkB8Ly6NV8jU7LH1m6GJZRUuf, maar draait die uitsluitend op http://127.0.0.1:18899. Dat is GEEN mainnet-deployment. Als jouw bron een ander declare_id gebruikt, stop en stem eerst de lokale fixture-identiteit af. Verander niet blind je declare_id of sleutels.

De launcher start een eigen tijdelijke ledger met nieuw gegenereerde wallets; bestaande validators worden niet afgesloten. De externe RPC wordt uitsluitend gelezen om Metaplex Core als lokale fixture op te halen. Hiervoor kan internettoegang nodig zijn. Er gaan geen testtransacties naar een extern netwerk.

Verwachte laatste melding na alle geslaagde controles: FOUNDATION AND LEGACY PAYMENT TESTS PASSED. De werkelijke resultaten zijn nog niet bekend; de tests zijn voorbereid, niet uitgevoerd.

## 4. Wat daarna gebeurt

Pas na een geslaagde build en lokale controles bouwen we mint_handle_partner_sol: huidige prijsregels, korte ondertekende quotes, twee SOL-transfers en NFT naar de gebruiker in één atomische transactie. Daarna volgen verificatie/indexering met Earn-uitsluiting, devnet-checkout en devnet-validatie. SDK, widget en dashboard sluiten aan op die gecontroleerde API; mainnet vraagt aparte goedkeuring.

Voor nu: NIET deployen, geen productieconfig activeren en geen echte partners of wallets registreren. Het pakket bevat geen privésleutels of productiecredentials.