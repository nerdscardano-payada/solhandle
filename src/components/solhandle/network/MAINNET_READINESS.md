# Network mainnet — implementatieregister

Datum: 24 oktober 2026. Status: eerste migratiestap uitgevoerd, publieke deelnemersrelease NIET vrijgegeven.

Dit register betreft de nieuwe sociale Network-laag. Het is geen uitspraak dat bestaande mint-, resolver-, Pay- of Contacts-diensten offline zijn. De ontwerpomgeving blijft apart en wordt niet als mainnet-implementatie gebruikt.

## Vastgestelde situatie

- `networkFlags.ts`: publiek lezen, operatorpreview en afgeschermde sociale ontwikkeling staan aan. Walletauthenticatie, publieke bijdragen, productiemoderatie en entitlements staan uit. De uitgelezen serverinstellingen in dit paneel zijn de actuele bron; dit document schakelt niets aan.
- Publieke profielen komen uitsluitend uit gepubliceerde operatorpreviewrecords via `networkRead`. Ontwikkelaccounts met `preview:false` zijn geen publieke deelnemersprofielen.
- `NetworkSessionProvider` gebruikt platformbeheerderstoegang en een ontwikkelaccount. Het is geen wallet-native productiesessie. Walletcontext is nu onderdeel van de profielcache; een eerder geverifieerde weergave wordt niet hergebruikt voor een andere wallet of operator.
- De ontwikkel-walletproof gebruikt een doelgebonden, drie minuten geldige challenge en eenmalige serverconsumptie. De client bewaakt nu ook accountwissels, adapterwissels, disconnect/reconnect, dubbele starts en verlaten schermen tijdens de poging. Dit is clientbescherming, geen productieauthenticatie of serverintrekking.
- LinkedIn-, X- en Discord-deelacties uit het goedgekeurde ontwerp zijn aangesloten op de bestaande publieke profielpagina. De link verwijst naar de stabiele account-UUID, niet naar een verkoopbare handle, demo-identiteit of private ontwikkelroute. Bestaande algemene postdeelacties blijven behouden.

## Poort 1 — Walletlogin: GEBLOKKEERD

Opnieuw geraadpleegde Base44-documentatie op 24 oktober: https://docs.base44.com/Setting-up-your-app/Setting-up-SSO . Gedocumenteerd: OIDC, scopes openid/email/profile en een fout bij ontbrekende emailclaim. Niet vastgesteld: e-mailloze externe Solana-walletauthenticatie naar een beheerde appsessie, serververifieerbare gebruikte walletcredential en per-wallet intrekking.

Dit bewijst geen onmogelijkheid, maar is onvoldoende om de bestaande producteis veilig te activeren. Er is geen provider geselecteerd, geen productie-SSO gewijzigd en geen eigen token-, cookie- of loginbackend gebouwd. Voor het ontbrekende ondersteunde contract is bevestiging via Base44-support nodig. De bestaande criteria SB-01 t/m SB-09 in WALLET_SESSION_BRIDGE.md blijven open.

Sluitbewijs: ondersteunde e-mailloze login met bestaande geselecteerde wallet, betrouwbare appsessie-naar-loginwalletmapping, geen automatische emailfusie, verse autorisatie, replaybescherming en beschreven intrekking/refresh. Walletconnectie is geen login. Ontwikkelproof is geen vervanging.

## Poort 2 — Productie-identiteit: OPEN

- Idempotente registratie met precies één stabiele account-ID bij parallelle aanvragen.
- Schaalbare transactionele exclusiviteit voor beheerwallets en assets; de begrensde ontwikkelregistry is geen productiemigratie.
- Verse chaincontrole voor identiteitsacties en Pay; RPC-onzekerheid blokkeert nieuwe risicovolle acties.
- Continue transferverwerking, behoud van historische auteur-ID en geen overdracht van account, posts, volgers of contacten met een NFT.
- Bewezen autorisatie en privacyrechten voor echte deelnemers, zonder de bestaande admin-only opslag open te zetten.

## Poort 3 — Ontwerpmigratie: GESTART

Geleverd: compacte publieke profieldeelknoppen met correct gecodeerde profiel-URL, Discord-kopieerbevestiging en handmatig kopieerpad bij geweigerde klembordtoegang. Geen OAuth of automatische Discord-publicatie.

Tweede migratieslice geleverd: één gedeelde header met merk, zoeken, meldingen, weergave en bestaande walletknop; dezelfde navigatiebron voor desktop en mobiel; bestaande Pay-drawer, claimroute en informatieve tokenroute als desktopshortcuts. Publieke operatorprofielen en ontwikkelprofielen delen nu profielcompositie en tabs: 3:1-banner, vierkante profielfoto, displaynaam vóór handle, echte bio/status/aantallen en bestaande acties. Het eigen ontwikkelprofiel opent de bestaande editor via Edit profile, zonder dubbele uitklaplaag. Goedgekeurde private ontwikkelmedia behouden hun bestaande ondertekende weergave; de publieke profielprojectie krijgt geen private media of verzonnen mintdetails.

Volgende afgebakende modules: Identity-weergave met echte mintgegevens; verdere integratie van bestaande Pay/Contacts-interacties. Publieke walletlogin en deelname blijven uit; volledige visuele en gebruikersacceptatie is nog niet uitgevoerd. Geen previewcontext, fictieve aantallen of demo-posts als echte productiegegevens overzetten. Privé-ontwikkelprofielen krijgen geen publieke deelknoppen zolang er geen publieke projectie voor bestaat.

## Poort 4 — Publieke sociale deelname: OPEN

Productieconcurrency/idempotentie, misbruiklimieten, mediaquarantaine, rapportage/moderatie/bezwaar, privacy/export/verwijdering, leeftijds- en deelnamevoorwaarden vereisen afzonderlijke implementatie en acceptatie. Geen DMs of betaalde privileges als impliciet onderdeel van deze migratie.

## Poort 5 — Acceptatie en vrijgave: OPEN

Nog niet uitgevoerd: end-to-end gebruikersacceptatie of integrale securityacceptatie. Een geslaagde bouwcontrole bewijst die niet.

Acceptatiescenario's voor de Testing Agent:

1. Open een gepubliceerd profiel uitgelogd; LinkedIn en X verwijzen naar precies dat account, ook na bezoek aan een ander profiel. Discord heeft bevestiging en een handmatig kopieerpad.
2. Start ontwikkel-walletverificatie en wissel vóór/na signing van wallet, adapter of account; verouderde resultaten mogen geen nieuwe identiteitscontext activeren. Ook disconnect/reconnect en verlaten scherm afdekken.
3. Bewijs dat niet-admins geen ontwikkelhandelingen kunnen uitvoeren en publieke mutaties uit blijven.
4. Na beschikbaarheid van ondersteunde productieauth: registratieconcurrency, step-up, revocatie, refresh en desktop/mobiele wallets afzonderlijk accepteren.
5. Transfer Alice → koper: historie en volgers blijven bij Alice, oude betaalcontext wordt geweigerd, nieuwe eigenaar krijgt geen oude sociale gegevens.

Volgorde: eerst het ondersteunde walletauthcontract sluiten; onafhankelijke ontwerpmigratie kan parallel doorgaan. Elke module krijgt eigen implementatie en bewijs vóór activering. Publiceren van deze wijzigingen zet de uitgeschakelde serverpoorten niet aan.