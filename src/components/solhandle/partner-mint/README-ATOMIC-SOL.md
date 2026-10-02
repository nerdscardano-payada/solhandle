# Atomische SOL Partner Mint, fase 1 vervolg

Broncode toegevoegd, nog niet met Rust/SBF gecompileerd of op een lokale validator uitgevoerd in Base44: die tools zijn hier niet beschikbaar. Niets gedeployed. De eerder geslaagde 44 controles betreffen de vorige build, niet deze nieuwe instructie.

## Installatie in je bestaande WSL-project

Download het nieuwe pakket solhandle-partner-atomic-sol-20261002.tar.gz uit de chat naar Windows Downloads. De download kan een prefix hebben en als 20261002tar.gz worden opgeslagen. Voer dit vanuit WSL uit:

```bash
pakket="$(find /mnt/c/Users/bruno/Downloads -maxdepth 1 -type f -iname '*solhandle*atomic-sol*.gz' -print -quit 2>/dev/null)"
test -n "$pakket" &&
cp -- "$pakket" "$HOME/solhandle-partner-atomic-sol-20261002.tar.gz" &&
tar -xzf "$HOME/solhandle-partner-atomic-sol-20261002.tar.gz" -C "$HOME" &&
cd "$HOME/solhandle-repo" &&
bash "$HOME/solhandle-partner-atomic-sol-20261002/apply-atomic-sol-wsl.sh"
```

De installer controleert de eerdere foundation, stopt bij afwijkingen en maakt backups. Alleen twee kleine toevoegingen in lib.rs, de lokale runner en drie nieuwe bestanden worden toegepast. Geen Cargo.lock, Cargo.toml, wallet, program-ID of netwerkconfiguratie wordt aangepast. Bij een STOP niet forceren.

## Bouw en lokale controles

Gebruik de eerder werkende native Linux-toolchain en expliciet SBF v1.57:

```bash
cd "$HOME/solhandle-repo" &&
cargo test -p solhandle --lib --locked &&
cargo build-sbf --tools-version v1.57 --manifest-path programs/solhandle/Cargo.toml -- --locked &&
bash src/components/solhandle/partner-mint/start-foundation-local.sh
```

De launcher gebruikt een nieuwe tijdelijke lokale ledger op 127.0.0.1:18899 en alleen nieuwe testwallets. De externe RPC is uitsluitend voor het lezen van Metaplex Core. Alle testtransacties gaan naar loopback, nooit devnet/mainnet. Het oude binary-fingerprintbeleid blijft intact. Verwacht na succes: PARTNER SOL MINT, FOUNDATION AND LEGACY TESTS PASSED. Deel de werkelijke uitvoer; deze melding is nog geen verkregen resultaat.

## Wat de instructie doet

mint_handle_partner_sol hergebruikt bestaande naam-, restrictie-, prijs-, premium-, Rush- en Core-helpers. De claimant tekent en betaalt het live tarief. Partner ontvangt floor(fee/2), treasury de rest. Rent voor de HandleRecord, Core NFT en receipt plus netwerkfees zijn afzonderlijke kosten, nooit onderdeel van de verdeling. Beide transfers, NFT en permanente receipt gebeuren atomisch; iedere fout draait de on-chain wijzigingen terug. Solana kan bij een mislukte transactie wel netwerkfees rekenen.

De NFT gebruikt dezelfde officiële collection en deterministische asset/handle-PDA, met de claimant als directe eigenaar. Bestaande Config/HandleRecord/token-payment layouts en oude mintinstructies zijn ongewijzigd. De nieuwe receipt-PDA is [partner_receipt, asset]. Er bestaat geen instructie om receipts achteraf te wijzigen of te verwijderen.

Alleen een goedgekeurde partner met de geregistreerde System-wallet kan minten. De afzonderlijke Partner Mint-schakelaar en quote key zijn vereist. Partner- en settingsrevision, live prijs, metadatahash, collectie, treasury, ontvanger, claimant, handle en program zijn gebonden aan een Ed25519-geverifieerde SHA256 quote met maximaal 60 seconden geldigheid. De verifier controleert exacte bytes van de direct voorafgaande Ed25519-instructie. SHA256 houdt de volledige transactie compact; de hash is geen vervanging voor een handtekening.

## Veiligheidsgrens en nog te bouwen

Verschillende clusters MOETEN verschillende dedicated partner quote keys gebruiken. De runtime biedt geen genesis-hash aan het programma; dezelfde key/config op twee clusters gebruiken kan cross-cluster replay mogelijk maken. Een productie-API moet het cluster vastzetten, nooit door de client laten kiezen, en uitsluitend de key voor dat cluster gebruiken. Hier zijn geen productiekeys aangemaakt of toegevoegd.

De lokale suite voegt settlement, odd-lamport afronding, directe ownership, rent/fees, unieke receipt, concurrency, rollback, prijs/metadata/signature tampering, verlopen quotes, self-mint, verkeerde recipients, protected names, revisions en suspension toe aan de 44 eerdere checks. Het zijn voorbereide controles, geen claim van geslaagde uitvoering.

Dit pakket bouwt uitsluitend de on-chain mint en lokale overdracht. Nog NIET gebouwd: productie quote/API/submit/status, partnerindexering, de harde Earn primary-mint uitsluiting in de bestaande boekhouding en checkout. Alleen PartnerHandleMinted wordt uitgezonden, niet het oude HandleMinted-event; een event alleen is echter niet voldoende om Earn via alle bestaande indexeringspaden uit te sluiten. Activeer daarom geen productie Partner Mint totdat die accounting-gate expliciet is ingevoerd en gecontroleerd.

Geen deploy-opdrachten in dit pakket. Mainnet-upgrade en praktijkproef blijven afzonderlijke, expliciet goed te keuren stappen.