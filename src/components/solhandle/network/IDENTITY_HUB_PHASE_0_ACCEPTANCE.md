# Identity & Community Hub — bewijs- en acceptatiematrix

Datum: 25 oktober 2026. Onderdeel van IDENTITY_HUB_PHASE_0.md.
Alle runtimegevallen: NOT RUN. Broncode-inspectie is geen geslaagde functietest.
Geen mainnettransacties uitvoeren zonder expliciete toestemming voor handeling en kosten. Transfer-/aanvalsscenario's eerst met afgescheiden testidentiteiten en geschikt technisch testmilieu; geen productiegegevens gebruiken.

## Bewijsregistratie

Per uitvoering vastleggen: test-ID, datum, verantwoordelijke, omgeving/build, gebruikte testaccounts (geen credentials), verwachte en feitelijke uitkomst, PASS/FAIL/BLOCKED, bewijsreferentie en open issue. Geen walletproofs, tokens, private keys of persoonsgegevens opnemen. Een toekomstig scenario wordt pas PASS na feitelijk bewijs. Geen gereedheidspercentage uit deze checklist afleiden.

## Flowdoelen voor de Testing Agent

De Testing Agent is bereikbaar via het reageerbuisje in het zijpaneel. Start alleen doelen die in de gekozen omgeving beschikbaar zijn; ontbrekende ledenauth is BLOCKED, geen test-PASS. Broncode/technische garanties daarnaast door een passende securityreviewer laten beoordelen.

| ID | Doel / verwachte uitkomst | Status |
|---|---|---|
| F01 | Zoek een handle als anonieme bezoeker; claimen blijft apart van sociale accountregistratie. Geen automatisch Network-account door zoeken, verbinden of minten. Mintafhandeling alleen na toestemming. | NOT RUN |
| F02 | Open publiek profiel en projectdetail; uitsluitend goedgekeurde openbare informatie, geen privécontacten, sessiegegevens of misleidende badge. | NOT RUN |
| F03 | Open account-URL en handle-URL; juiste vaste accountidentiteit of duidelijke niet-beschikbaarstatus, ook na handletransfer. | NOT RUN |
| F04 | Log in als gewone niet-admin met bestaande wallet; alleen verbinden geeft geen accountrechten. Ontbrekende ondersteunde login = BLOCKED. | NOT RUN |
| F05 | Bewerk eigen profiel en publiceer expliciet; ververs de pagina en verifieer opslag, publieke weergave en later intrekken. | NOT RUN |
| F06 | Controleer Primary Handle en wijzig naar een eigen handle; na bevestiging correct weergegeven. Niet-eigen handle geweigerd. Walletactie alleen met toestemming. | NOT RUN |
| F07 | Ontgrendel Contacts, bewaar/zoek/open/verwijder een contact; herladen behoudt wijzigingen; lock vereist opnieuw ontgrendelen. | NOT RUN |
| F08 | Wissel Wallet A naar B; contacten van A en lopende profiel-/betaalacties mogen niet onder B bruikbaar blijven. | NOT RUN |
| F09 | Bereid betaling vanuit contact en profiel voor; controleer ontvangerwallet, asset, bedrag en expliciete walletbevestiging. Voorbereiden is geen betaling. | NOT RUN |
| F10 | Verander actuele handleowner tussen review en definitieve voorbereiding; nieuwe handleontvanger vereist review, geen onopgemerkte omleiding. Apart vastgepind contactgedrag volgens goedgekeurd productbesluit. | NOT RUN |
| F11 | Meld verdacht profiel/project en laat beheerder afhandelen; zichtbaar resultaat, geen onbedoelde officiële status of automatische publicatie. | NOT RUN |
| F12 | Doorloop de vier kernen op 360px mobiel en desktop; geen onvoltooide sociale functies als werkende publieke opties. | NOT RUN |
| F13 | Open standalone Pay en Contacts zonder Network-activatie; bestaande toegang en walletcontrole blijven onafhankelijk. | NOT RUN |
| F14 | Simuleer RPC-uitval in testmilieu; eigendom wordt onbekend/onzeker, geen oude cache als nieuwe verificatie en geen onterecht toegestane account-/betaalactie. | NOT RUN |

## Technische negatieve controles / reviewbewijs

Niet alleen via schermbediening aftekenen. Vereist directe autorisatie-/opslag-/sessiecontroles in een geschikt afgeschermd testmilieu. Deze audit heeft ze niet uitgevoerd.

| ID | Controle | Acceptatie | Status |
|---|---|---|---|
| S01 | Challenge replay, verlopen proof, verkeerde wallet, account, payload, doel of origin | Afwijzen zonder account-/profielwijziging of geldige nieuwe sessie | NOT RUN |
| S02 | Gelijktijdig verbruik van dezelfde nonce | Maximaal één succesvolle verbruikactie; bewijs van opslaggarantie | NOT RUN |
| S03 | Parallelle registratie/binding met dezelfde wallet/asset en crashherstart | Geen dubbele actieve beheermapping; herstel zonder eigendomsovername | NOT RUN |
| S04 | Gewone gebruiker/anonymous roept admin-, ontwikkel- of publicatieactie direct aan | Server weigert ongeacht verborgen UI of clientflags | NOT RUN |
| S05 | Account A gebruikt profiel-ID, contact-ID, media-ID of sessie van B | Geen lezen/wijzigen van B; geen privédata in fouten/response | NOT RUN |
| S06 | Wallet-/sessie-intrekking met bestaande browser- en providersessie | Geen vervolgactie via ingetrokken bevoegdheid; disconnect en logout apart bewezen | NOT RUN |
| S07 | NFT-transfer A→B | Oude binding ongeldig volgens actualiteitsbeleid; B verifieert zelfstandig; oud account, contacten en historie blijven bij A | NOT RUN |
| S08 | Terugkoop, vertraagde index, RPC-uitval en conflicterende lookup | Nieuwe bindingsperiode waar nodig; onzekerheid blokkeert vertrouwensverhoging; chain boven index/cache | NOT RUN |
| S09 | Contacts challenge en bearerlevenscyclus | Geldige signature nodig; misbruikgrenzen, expiry, lock en gelijktijdig verbruik aantoonbaar correct; originbeleid beoordeeld | NOT RUN |
| S10 | Gewijzigde gesigneerde betaalbytes, sender, bedrag, tokenmint, bestemming of extra instructie | Server weigert; geen onverwachte transactie verstuurd | NOT RUN |
| S11 | Submit-time transfer/recipientwijziging, timeout, expired blockhash, dubbele submit en recover | Geen omleiding of nieuwe betaling zonder nieuwe toestemming; onzekere submit niet als zeker mislukt presenteren | NOT RUN |
| S12 | Projectpublicatie/claimbewijs | Alleen beheerder publiceert; domein-/walletcontrole verleent niet automatisch vertegenwoordiging; links veilig; badge intrekbaar | NOT RUN |
| S13 | Publicatie-intrekking, accountverwijdering, export en sessie-/mediaretentie | Gedocumenteerd resultaat per gegevenscategorie; geen aanname van cascade door User.delete | NOT RUN |
| S14 | Protected names en alle actieve mintpaden | Restrictie ook server-/on-chain afgedwongen; indexfallback alleen informatief, geen autorisatiebypass | NOT RUN |

## Vrijgavebesluit

- Open bevindingen uit de inventaris blijven open tot bewijs is gekoppeld.
- Niet alle negatieve controles zijn uitvoerbaar vóór ledenauth bestaat: markeer BLOCKED met afhankelijkheid.
- Geen zelfstandig geslaagde beta-, walletlogin-, transfer- of betalingstest geclaimd in fase 0.
- Geen algemene publieke vrijgave zonder verantwoordelijke voor meldingen, incidenten, gegevensverzoeken en onderhoud.