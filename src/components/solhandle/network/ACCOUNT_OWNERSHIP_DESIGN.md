# SolHandle Network — WP-B: account, walletbewijs en handlebindings

**Versie:** 0.1  
**Datum:** 22 oktober 2026  
**Status:** uitgewerkt technisch ontwerp; geen implementatie of vrijgave  
**Productbaseline:** [Definitieve productregels v1.0](./PRODUCT_RULES.md)  
**Hoofdplan:** [Intern fase 0-plan](./PHASE_0_PLAN.md)  
**Verantwoordelijke / securitybeoordelaar:** nog formeel aan te wijzen

> Dit ontwerp concretiseert WP-B zonder de productregels te veranderen. Bestaande bronbestanden zijn gelezen; er zijn geen runtimeproeven uitgevoerd. Een gelezen helper is geen bewezen securitygarantie. Er worden geen nieuwe loginbackend, walletsessies, functies, entiteiten, RPC-taken of publieke routes geactiveerd. Onderstaande operatienamen en records zijn ontwerpcontracten, geen bestaande API's.

## 1. Architectuurbesluiten

| ID | Besluit | Productregels |
|---|---|---|
| B-01 | Bestaande platformauthenticatie levert de accountidentiteit. Network maakt geen eigen credentials, JWT's of recoverybackend. | A-05 t/m A-09 |
| B-02 | Eerste ondersteunde onboardingrichting: bestaand account of bestaande registratie, daarna expliciete Network-aanmelding en walletbewijs. Wallet-only login en passkeys zijn geen v1-belofte. | A-06, A-07, A-10 |
| B-03 | Walletbewijs is accountgebonden autorisatie, geen login, betaalsignatuur of account recovery. | A-10, A-11, A-36 |
| B-04 | Eén transactioneel autorisatieregister moet nonceverbruik, wallet-exclusiviteit, profiel-exclusiviteit en bindingswissels afdwingen. Een gewone entity-check gevolgd door create voldoet niet. | A-08, A-11, A-13 |
| B-05 | Bestaande entities kunnen later afgeschermde projecties leveren, maar zijn niet zonder aangetoonde garanties het exclusiviteitsregister. | A-13, A-21 |
| B-06 | Officiële chainidentiteit en verse accountdata zijn autoritatief. Cached owner- en indexerresultaten geven nooit Network-schrijfrecht. | A-13, A-23, A-29 |
| B-07 | Actieve bindingen hebben generaties; beëindigde periodes herleven nooit. Alle gevoelige acties toetsen de actuele generatie. | A-15, A-28, A-31 |
| B-08 | Herstel en privacyrechten blijven bereikbaar zonder actieve handle. NFT-bezit verleent geen toegang tot een vroeger sociaal account. | A-19, A-36 t/m A-42 |

**Implementatieblokker B-BLOCK-01:** opslagkeuze en transactiegaranties moeten afzonderlijk worden bevestigd voordat een concurrency-prototype wordt gebouwd. Dit document selecteert of koppelt geen externe leverancier. Geen gedeeltelijk veilige entity-only variant als tijdelijke productieoplossing.

## 2. Bestaande voorzieningen en hergebruik

Broninspectie op 22 oktober 2026:

| Bron | Waargenomen | Hergebruik / grens |
|---|---|---|
| `src/lib/AuthContext.jsx` | Bestaande authstatus, `auth.me()`, loginredirect en SDK-logout | Behouden. React-state is geen server-side bewijs en laat geen gegarandeerde globale sessie-intrekking zien. |
| `src/api/base44Client.js` | Vooraf geïnitialiseerde SDK, publieke pagina's toegestaan | Behouden. Network-privéoperaties authenticeren apart server-side; maak de hele app niet loginplichtig. |
| `src/pages/Login.jsx`, `Register.jsx` | Email/password, Google-entrypoint, registratie met OTP en veilige returnTo-helper | Bestaande flows niet herschrijven. Aanwezigheid van knoppen is geen verificatie dat een provider in productie actief is. |
| `src/App.jsx` | Alle vier authroutes aanwezig | Geen extra of parallelle authpagina's. |
| `WalletSessionGuard.jsx`, `signConnectedMessage.js` | Bewaken adapter/walletwissels rond signing | Hergebruiken als clientveiligheid, nooit als vervanging voor server-side handtekeningcontrole. |
| `base44/shared/contactSessions.ts` | Eenmalige challenge-opzet, Ed25519, gefilterde update van issued naar used, aparte contacttoken | Alleen patroonreferentie. Contacttokens zijn géén Network-authenticatie; de bestaande conditional update is zonder gedocumenteerde atomische garantie geen bewijs van replaybestendigheid onder concurrency. Geen ongevraagde wijziging van Contacts. |
| `base44/shared/solhandleResolver.ts` | Afgeleide handle-/asset-PDA, protocolowner, Core-owner en collectiecontrole; confirmed-lezing | Validatieconcept hergebruiken via gedeelde modules na implementatiereview. Bestaande helper levert niet het hieronder vereiste volledige slot/finaliteitsbewijs en bevat ook Pay-bestemmingsclassificatie. Gebruik die laatste niet als vereiste voor sociale identiteit. |
| `base44/shared/solanaRpc.ts` | RPC-helper; sommige ownerhelpers vallen bij uitval terug op cached owner | RPC-transport na beoordeling hergebruiken; owner-fallbacks zijn verboden als Network-autorisatiebewijs. |
| `base44/shared/ownedHandles.ts` | Handlelijst op basis van indexrecords en batch-ownerhelper | Hoogstens keuze-/ontdekkingsbron. Geen toelatingsbewijs en geen volledige globale scan per schrijfverzoek. |
| `base44/shared/solhandleProtocol.ts` | Protocol-ID en PDA-seeds | Canonieke configuratie hergebruiken; geen protocolupgrade of nieuw naamnormalisatiesysteem. |

**Belangrijke documentatiebevinding:** Base44-entities ondersteunen volgens de geraadpleegde documentatie geen unique constraints. `upsert` kan bij gelijktijdige creatie dubbelen opleveren. De gevonden updateMany-documentatie bevestigt geen volledige CAS-/transactiegarantie. Daarom geen zelf verzonnen claim dat een deterministische sleutel, updateMany, een JavaScript-mutex of een entitylease alle B-04-invarianten borgt.

## 3. Vertrouwensgrenzen

1. **Browser/native wallet:** onbetrouwbare actie-input; bewaart private keys buiten Network. De server ontvangt alleen de benodigde openbare sleutel en berichtsignatuur.
2. **Platformauth:** authenticeert het bestaande account op ieder beschermd verzoek. Account-ID komt uitsluitend uit de geverifieerde servercontext.
3. **Network-autorisatie:** controleert expliciete deelname, toelating, leeftijdsstatus, maatregel, autorisatieversie, walletbinding en handlebinding. Dit is geen tweede loginbackend.
4. **Transactioneel register:** serialiseert de toepasselijke account-, wallet-, challenge- en assetmutaties.
5. **Solana RPC:** bewijst protocolidentiteit en eigendom binnen gedocumenteerde slot/finaliteitsgrenzen. Index en cache mogen dit niet vervangen.
6. **Projecties/UI:** tonen minimale informatie; een verouderde projectie geeft nooit schrijfrecht.

**Niet vertrouwen:** body.userId, client-accountstatus, connected-walletlabels, lokale tijd, client-badges, eigen tokenclaims of een verborgen route.

## 4. Logische records en invarianten

Geen schemas of nieuwe User-entiteit in deze documentatiefase. WP-C werkt opslag en afgeschermde leesprojecties uit.

| Logisch record | Minimale autorisatie-inhoud |
|---|---|
| NetworkAccount | Bestaande user-ID, onboardingversie, leeftijd-/toegangsbesluit, maatregelverwijzing, autorisatieversie, wijzigingstijd |
| WalletLink | Account-ID, canonieke wallet, generatie, ACTIVE/REVOKED, bewezen/opgezegd moment; eerdere periode blijft onderscheiden |
| WalletChallenge | ID, noncehash, exacte berichtbytes/hash, account, wallet, doel, actiehash, origin/audience, uitgifte/verval, status, autorisatieversie |
| HandleBinding | Binding-ID, account, walletlinkgeneratie, netwerk, protocol, asset, handle/PDA, bindingsgeneratie, status, begin/einde, reden |
| OwnershipObservation | Binding/actie, asset, waargenomen owner, confirmed/finalized slots, commitment, servermeetmoment, beperkte bronreferentie, validatieresultaat |
| OperationReceipt | Account, operatie-ID, doel/inputhash, resultaatreferentie, status; geen bearercredential |
| AuthorizationEvent / outbox | Mutatie-ID, account/bindinggeneratie, reden, tijd; minimaal en volgens WP-D-bewaring |

**Hard af te dwingen in één commitgrens waar relevant:**
- Maximaal één Network-profiel per bestaand account.
- Maximaal één actieve WalletLink per canonieke wallet over alle accounts.
- Maximaal één actieve hoofdhandle per account.
- Maximaal één actieve binding per officiële asset.
- Nonceverbruik kan niet twee verschillende mutaties autoriseren.
- Swap beëindigt oude binding en activeert nieuwe binding zonder tussentoestand waarin beide actief zijn.
- Verwijdering/schorsing/intrekking kan niet door een al eerder gestarte mutatie worden overschreven.
- Opnieuw koppelen gebruikt een nieuwe generatie en een nieuwe bewijscontext.
- State-event en mutatie gaan samen duurzaam door; een projectie-update is niet de bron van waarheid.

**Opslagcontract:** echte unieke sleutels/conditionele transitions, transacties over betrokken invarianten, crashherstel, duurzaam idempotentieresultaat en conflictgedrag moeten aantoonbaar zijn. Een frontendqueue, proceslokale lock of watcher biedt dat niet. Autorisatieregister onbereikbaar betekent geen Network-schrijfactie; nooit terugvallen op projecties.

## 5. Onboarding en accounttoegang

1. Bezoeker leest publieke informatie; een besloten alpha mag zijn hele omgeving server-side afschermen.
2. Voor deelname logt de gebruiker in via bestaande login of voltooit bestaande registratie inclusief OTP waar van toepassing.
3. Server leest actuele accountidentiteit. Geen account-ID uit returnTo of requestbody accepteren.
4. Gebruiker kiest expliciet Network-aanmelding en krijgt actuele voorwaarden/privacy-informatie en de goedgekeurde leeftijdsflow.
5. Pas na geldige alpha-toegang en benodigde besluiten wordt een NetworkAccount idempotent aangemaakt. Optionele trackingtoestemming is geen toegangseis.
6. Gebruiker koppelt de gekozen wallet via een gericht bewijs.
7. Gebruiker kiest een eigen officiële handle; Network verifieert die rechtstreeks op de chain.
8. De binding wordt pas actief na geslaagde exclusiviteitscommit. De bevestiging vertelt alleen de eigen toestand.

Login zonder Network-aanmelding creëert geen sociaal profiel. Koppelen en hoofdhandle kiezen mogen aparte stappen zijn; het product blijft zonder hoofdhandle in een niet-publicerende toestand. Bestaande minting en Pay worden niet naar deze flow omgeleid.

## 6. Contract voor walletbewijs

### Bericht en parameters

Ontwerpwaarden voor de eerste afgeschermde implementatie, te toetsen vóór vrijgave:
- CSPRNG-nonce met minimaal 256 bits entropie.
- Geldigheid: vijf minuten vanaf servertijd; geen verlenging van hetzelfde bericht.
- Eén doel per challenge: LINK_WALLET, UNLINK_WALLET of SELECT_PRIMARY_HANDLE.
- Voor wallet toevoegen/ontkoppelen is ook ondersteunde recente account-herauthenticatie vereist; een walletsignatuur is daarvan geen vervanging.
- Exacte UTF-8-berichtbytes worden server-side geconstrueerd en geverifieerd; geen door de client aangeleverde vervangende tekst.
- Base58-publickey canoniek valideren, berichtsignatuur exact 64 bytes en begrensde requestgrootte.
- V1 bewijst controle via ondersteunde Ed25519-walletsigning. Multisig-/programwallets die geen passend berichtbewijs leveren blijven buiten deze eerste implementatie; geen transactionele fallback introduceren.

Het bericht bevat zichtbaar: SolHandle Network, de ingestelde domeinaudience, canonieke wallet, ondoorzichtige accountreferentie, doel, challenge-ID, nonce, operatie-ID, hash van de concrete doelactie, uitgifte en verval, netwerk en berichtversie. Tekst maakt duidelijk dat het geen betaling, blockchaintransactie of accountoverdracht autoriseert. De ondoorzichtige accountreferentie is niet het emailadres.

### Domeinbinding

De canonieke audience en toegestane origins worden server-side als vaste deploymentconfiguratie vastgesteld. Geen request-Host, doorgegeven Origin of willekeurige previewdomain als vertrouwde audience overnemen. Controleer browser-origin en auth volgens het ondersteunde platformmodel; Origin is aanvullend en geen identiteit. Preview/test krijgt een andere audience en kan geen productieproofs verbruiken. Een domeinwijziging invalideert openstaande oude challenges; geen wildcardvertrouwen.

### Uitgifte en verificatie

1. Authenticeer account en beoordeel of deze operatie is toegestaan, inclusief herauthenticatie indien nodig.
2. Valideer doelinput en rate limit; sla immutable challengecontext op met accountautorisatieversie.
3. Sign uitsluitend met de gekozen wallet via de bestaande guard. Bij adapter-/adres-/accountwissel: afbreken, geen fallbackwallet kiezen.
4. Server valideert dezelfde geauthenticeerde accountcontext, versie, audience, doel, inputhash, expiry en signature.
5. Verbruik challenge en commit de bedoelde mutatie plus receipt atomisch met exclusiviteitscontrole. Geen losse 'used'-update gevolgd door een onbeveiligde create.
6. Bij reeds gecommitteerde identieke operatie: retourneer alleen dezelfde beperkte receipt aan hetzelfde nog bevoegde account. Dit is uitlezen van een eerder resultaat, geen opnieuw uitvoeren. Bij ander account of andere input weigeren.
7. Bij crash/verloren antwoord bepaalt de receipt de uitkomst; nooit blind een tweede binding aanmaken.

**Challenge-status:** ISSUED → CONSUMED; of ISSUED → EXPIRED/CANCELLED. Ongeldige signatures wijzigen geen eigendom. Pogingen worden begrensd volgens WP-F. Verlopen records worden niet voor eeuwig bewaard; WP-D bepaalt concrete bewaring vóór prototypegegevens met echte gebruikers.

## 7. Operatiecontracten

Voorgestelde nauwe operaties, nog geen gedeployde functies. Frontend gebruikt later de bestaande SDK-invocatiewijze, geen harde function-URLs.

| Operatie | Bounded input | Controle / resultaat |
|---|---|---|
| readNetworkAccess | Geen callergekozen account | Auth → eigen toegang, hoofdhandle, blokkadereden; geen andermans walletbindingen |
| enrollNetwork | Geldige documentversies en goedgekeurde onboardingbesluiten | Auth en eligibility → één eigen profiel, nooit clientgekozen leeftijdsgoedkeuring |
| requestWalletProof | Doel, wallet, operatie-ID, concrete doelinput | Account/herauth/rate limit → immutable challenge |
| completeWalletLink | Challenge-ID, signature, operatie-ID | Signature + exclusiviteit → eigen link of generiek conflict |
| selectPrimaryHandle | Challenge-ID, signature, canonieke handle/asset, operatie-ID | Officiële chaincontrole + atomische swap → nieuwe bindinggeneratie |
| unlinkWallet | Challenge-ID, signature, operatie-ID | Herautorisatie → walletlink intrekken en eventuele hoofdhandle beëindigen in één commit |
| beginLostWalletRecovery | Beperkte eigen herstelvraag | Bestaande account recovery/review; geen bypass van A-38 of automatische unlock |
| evaluateHandleAction | Interne actiecontext, actor en idempotentiesleutel | Actuele account-/bindingversie + chainbewijs → alleen de bedoelde mutatie |

Geen algemene proxy voor willekeurige chaincalls, integraties of SQL; geen publieke optie om eigendom, user-ID, autorisatieversie of verificatieresultaat te zetten. Resultaatcodes onderscheiden AUTH_REQUIRED, REAUTH_REQUIRED, PROOF_EXPIRED, PROOF_INVALID, WALLET_LINK_CONFLICT, HANDLE_NOT_OWNED, OWNERSHIP_UNCERTAIN, ACCOUNT_RESTRICTED, ACCESS_NOT_GRANTED, OPERATION_CONFLICT en SERVICE_UNAVAILABLE. Een conflict onthult geen email, profiel-ID of identiteit van de andere accounthouder.

## 8. Eigendomsbewijs en finaliteitsbeleid

### Officiële identiteit

Bij implementatie de bestaande canonieke configuratie controleren en versie vastzetten. Broninspectie toont:
- Programma: `B7xiwfxGcR2Xz7tcUKrkB8Ly6NV8jU7LH1m6GJZRUuf`.
- Officiële Core-collectie in de resolver: `7XZzcbeFBxQA63n9avz44vnbpv34hDGYyHfCDmTdPBJP`.
- Metaplex Core-programma: `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d`.
- Huidig resolvernaamformaat: 1–20 ASCII letters/cijfers, lowercase. International Handles blijft gepauzeerd; Network breidt normalisatie niet zelfstandig uit.

Controleer afgeleide handle-PDA en asset-PDA, programmaowners, correcte accountdiscriminators/layoutlengtes, de opgeslagen handle→assetrelatie en officiële collectie. De bestaande decoder moet specifiek op die volledigheid worden beoordeeld, niet blind als bewezen parser worden hergebruikt. Metadata, ticker, displaynaam en een DAS-owned flag zijn geen alternatief.

### Ontwerpbeleid voor de eerste implementatie

- Nieuwe binding of hoofdhandlewissel vereist dezelfde eigenaar in zowel finalized als actuele confirmed accountlezing.
- Iedere nieuwe identiteitsgebonden actie vereist een verse chaincontrole; geen positief eigendomscachebewijs tussen verzoeken.
- Lees handle-/assetrelatie binnen één context per commitmentniveau. Registreer beide contextslots en hun commitment. Accounts met verkeerde owner/layout/collectie geven nooit permissie.
- Het laatste gevalideerde confirmed-resultaat mag bij het begin van de autorisatiecommit maximaal vijf seconden oud zijn. Is het te oud door wachten op een lock of queue, dan opnieuw controleren.
- Gebruik waar ondersteund minContextSlot om terugval naar een ouder reeds geaccepteerd confirmed slot te weigeren. Bewijs de ondersteuning; niet aannemen dat finalisatie dezelfde slothoogte als confirmed heeft.
- Als finalized en confirmed van eigenaar verschillen: OWNERSHIP_UNCERTAIN, geen nieuwe actie namens die handle. Bij finalized nieuwe eigenaar en passende confirmed staat: oude binding beëindigen; nieuwe eigenaar kan eigen binding aanvragen.
- Een ontbrekend of tijdelijk niet-decodeerbaar account betekent eerst onzekerheid. Definitieve beëindiging wegens burn vereist aanvullend bevestigd bewijs of beoordeelde afhandeling; geen burn afleiden uit één null-response.
- Totale verificatietijdbudget: tien seconden, maximaal twee pogingen binnen dat budget. Bij overschrijding geen schrijfactie en geen cached-ownerfallback.
- Een monitor mag onzekere/verloren bindings proactief markeren. Startwaarde voor later prototype: controle iedere zestig seconden voor actieve bindings, met expliciet vastgesteld volumebudget en rate limits. Dit is geen detectie-SLA of toestemming om nu een workflow te starten.

Deze conservatieve alpha-instelling kan verse mints/transfers tijdelijk laten wachten op finalisatie. Dat is de bewuste keuze boven voortijdige publicatierechten.

### Resterend chain-/databaserisico

Solana en het sociale autorisatieregister delen geen atomaire transactie. Een transfer kan na de laatste chainlezing plaatsvinden. Een lokaal slot of lock elimineert dit niet. Garandeer dus geen absoluut gelijktijdige on-chain uitsluiting.

De autorisatiecommit hercontroleert lokaal accountstatus, generation en observatieleeftijd. Toekomstige publicatie krijgt eerst een niet-publieke intent met verwijzing naar het bewijs; vóór zichtbaarheid wordt opnieuw gecontroleerd. Bij conflict blijft de intent niet-publiek. Latere eigendomswijziging beëindigt verdere deelname, maar schrijft een eerder geldig toegeschreven historische publicatie niet om. De exacte tijdssemantiek en resterende race moeten vóór prototypevrijgave expliciet worden geaccepteerd of het publicatieontwerp blijft geblokkeerd. Een 'pending'-vlag alleen lost de gedistribueerde race niet op.

## 9. Toestandsmodel en overdracht

| Huidig | Gebeurtenis | Nieuw | Effect |
|---|---|---|---|
| Geen binding | Eigen aanvraag, proof en controles | PENDING | Geen publicatierecht |
| PENDING | Chainbewijs en exclusiviteitscommit slagen | ACTIVE | Nieuwe unieke periode/generatie |
| PENDING | Conflict of ongeldige proof | Geannuleerd verzoek | Geen actieve binding of overgenomen account |
| ACTIVE | RPC-uitval, slotterugval, tegenstrijdige eigenaren | OWNERSHIP_UNCERTAIN | Geen nieuwe identiteitsactie; accountrechten intact |
| OWNERSHIP_UNCERTAIN | Opnieuw voldoende bewijs van dezelfde owner/generatie | ACTIVE | Hervat alleen indien accountstatus dat toestaat |
| ACTIVE / OWNERSHIP_UNCERTAIN | Eigendomsverlies definitief vastgesteld | ENDED | Generatie invalideren, niet automatisch een ander account wijzigen |
| ACTIVE / OWNERSHIP_UNCERTAIN | Expliciete swap, ontkoppeling of profielverwijdering | ENDED | Met gerelateerde mutaties atomisch afhandelen |
| ENDED | Terugkoop of terugkoppeling | Nieuwe PENDING-periode | Nooit oude binding heractiveren |

Bij swap van hoofdhandle worden account, oude binding en nieuwe asset-exclusiviteit samen gecontroleerd. Bij overdracht naar een nieuwe eigenaar kan de oude binding op basis van chainbewijs eindigen zonder toestemming van de verkoper; de koper moet met een eigen account en eigen walletproof beginnen. Een wallet die nog bij een ander account gekoppeld is geeft een apart herstel/conflictpad, geen datatoegang. Accountschorsing blijft een aparte accounttoestand, geen NFT-status.

**Historische publicatiereferentie:** immutable account-ID, binding-ID/generatie, asset, handle op publicatiemoment en besluitmoment. Wijziging van de actuele handle past bestaande posts/mentions niet aan. Nieuwe handlelookups en historische auteurverwijzingen zijn verschillende operaties.

## 10. Sessies, herauthenticatie en intrekking

### Wat wordt behouden

Bestaande platformlogin, registratie/OTP, reset en SDK-logout blijven leidend. Authroutes zijn reeds aanwezig. Network-authenticatie vraagt server-side de platformidentiteit op; een Contacts-token, walletbewijs of lokale connected-state geldt niet als login.

### Network-autorisatie intrekken

Een autorisatieversie op het account wordt in het transactionele register verhoogd bij veiligheidsintrekking, relevante wallet-/bindingswijziging en profielverwijdering. Betrokken bindings krijgen eigen generaties. Open challenges en in-flight acties met oude versies worden geweigerd. Iedere latere Network-mutatie leest de actuele versie; versies uit de browser of cache zijn niet leidend. Dit blokkeert Network-rechten, maar trekt geen platformtoken in en belooft niet alle toegang tot andere SolHandle-diensten te beëindigen.

### Nog te bewijzen platformeigenschappen — blokker B-BLOCK-02

Voor gevoelige operaties: een ondersteunde, serververifieerbare recente account-herauthenticatie, streefgrens vijf minuten. Een loginredirect, lokaal timestampveld, nogmaals `auth.me()` of walletsignatuur bewijst die recentheid niet. Geen wachtwoord opnieuw laten insturen naar een zelfgebouwde verificatieproxy.

Bepaal daarnaast ondersteunde sessielijst, intrekking van een specifieke sessie, intrekking van alle sessies en reset-/providersemantiek. De gelezen code en gevonden documentatie bewijzen dat niet. Tot verificatie geen UI-beloftes zoals 'uitloggen op alle apparaten'. Als de benodigde herauthenticatie niet ondersteund of niet veilig aantoonbaar is, blijven gevoelige mutaties geblokkeerd en gaat een expliciete productbeslissing terug naar WP-A.

Cookies, tokenopslag, rotatie, CSRF en browserheaders volgen de werkelijk ondersteunde platforminrichting. Geen zelfbedachte HttpOnly-cookiebackend naast de bestaande SDK en geen claim dat headers al correct zijn ingesteld zonder verificatie.

## 11. Herstel, ontkoppelen en privacy

- Normale ontkoppeling: eigen account, passende recente herauthenticatie en gerichte walletproof. Dragende hoofdhandle eindigt in dezelfde transactionele mutatie.
- Wallet verloren maar account bereikbaar: normale accountrechten blijven bereikbaar. Een nieuwe bewezen eigen wallet/handle kan via veilige herauthenticatie gekozen worden. Geen overdracht van de verloren NFT en geen vereiste dat de verloren wallet nog tekent voor het indienen van een herstelverzoek.
- Verloren wallet ontkoppelen zonder handtekening: apart beoordeeld herstelpad, niet de normale proofendpoint omzeilen. Scope, bewijs, wachttijd/waarschuwing en bevoegde reviewer worden vóór implementatie met WP-D/WP-F/H vastgesteld; bij twijfel geen automatische verplaatsing.
- Account verloren: ondersteunde platformrecovery. Voormalige eigenaar, kopende partij of walletbezitter krijgt geen oud profiel of persoonsgegevens via een claim.
- Wallet aan ander account gekoppeld: generieke melding; herstel naar het oorspronkelijke account of beoordeelde ontkoppeling, nooit automatische accountfusie.
- Privacy-/bezwaarverzoek blijft bereikbaar zonder handle of actieve normale sessie; alleen passende verificatie van de aanvrager, geen verkregen handle als bewijs van oude accountidentiteit.
- Network-profielverwijdering beëindigt bindings en autorisatie. Geen automatische verwijdering van het platformaccount of aanroep van algemene accountverwijdering; WP-D bepaalt de exacte scope.

## 12. Bewijs- en prototypeplan

Geen controles uitgevoerd met dit document. Operationele flowtests later via de Testing Agent; concurrency-, crash- en transactietests vereisen daarnaast gerichte technische bewijsvoering in de goedgekeurde testomgeving.

### Voorwaarden vóór bouwen
- [x] Bestaande auth-, walletguard-, Contacts- en ownershipbron gelezen; grenzen beschreven.
- [x] Productregels naar ontwerpbesluiten vertaald zonder walletlogin of sessiegaranties te verzinnen.
- [x] Bestaande authroutes vastgesteld; geen duplicaat-login nodig.
- [x] Entity-exclusiviteitsbeperking en ontbrekende transactiegaranties geregistreerd.
- [ ] B-BLOCK-01: opslagkeuze met bewezen nonce-, uniekheids-, transactie- en herstelgaranties goedgekeurd.
- [ ] B-BLOCK-02: recente herauthenticatie en sessie-/intrekkingsmogelijkheden bewezen; resterende scopebeperkingen expliciet besloten.
- [ ] B-BLOCK-03: chainfinaliteitsbeleid, publicatiemoment en resterende distributed race beoordeeld en geaccepteerd.
- [ ] B-BLOCK-04: originconfiguratie, alpha-afscherming, leeftijds-/toegangsbesluiten, privacybewaring en verantwoordelijken vastgelegd.

### Acceptatie met bewijsreferentie
- [ ] B-T01: registratie inclusief OTP en login houden bestaande veilige returnTo-afhandeling intact; geen profiel zonder expliciete Network-onboarding.
- [ ] B-T02: dezelfde accountgegevens uit body of gewijzigd client-state geven geen toegang als een ander account.
- [ ] B-T03: honderd gelijktijdige verbruiken van één challenge leveren hoogstens één mutatie op; andere input/account wordt geweigerd.
- [ ] B-T04: honderd gelijktijdige claims van dezelfde wallet/asset en eerste profielcreaties leveren exact de toegestane cardinaliteit op.
- [ ] B-T05: geforceerde crash vóór/na commit, timeout, retry en herstart maken geen halve swaps of extra bindings.
- [ ] B-T06: verkeerd domein, audience, account, doel, actiehash, expiry, signature of generatie wordt geweigerd.
- [ ] B-T07: wallets/adapter wisselen tijdens signing breekt af; server weigert een signature van een andere key.
- [ ] B-T08: vervalst collectie-/programaccount, verkeerde PDA/layout, cached-ownerfallback en ouder contextslot geven geen schrijfrecht.
- [ ] B-T09: confirmed/finalized mismatch blokkeert; stabiele hercontrole herstelt alleen de juiste nog toegestane binding.
- [ ] B-T10: een transfer tussen observatie en commit/zichtbaarheid volgt het goedgekeurde racebeleid; geen verzonnen onmiddellijke garantie.
- [ ] B-T11: oude sessie, challenge en geplande actie worden na lokale intrekking/generatiewissel geweigerd.
- [ ] B-T12: koper krijgt nooit account, followers, privacygegevens of projectrollen; oude eigenaar behoudt eigen rechten.
- [ ] B-T13: terugkoop maakt een nieuwe periode; oude posts/mentions en historische Pay-context worden niet herschreven.
- [ ] B-T14: profielverwijdering tijdens een in-flight aanvraag kan niet tot heractivatie leiden.
- [ ] B-T15: accountschorsing blijft gelden na wallet-/handlewissel; een koper erft niet automatisch de oude accountmaatregel.
- [ ] B-T16: verlies van wallet/account wordt afgehandeld zonder accountovername op alleen een wallet- of handleclaim.
- [ ] B-T17: uitval van register of RPC faalt gesloten voor nieuwe Network-acties; bestaande onafhankelijke SolHandle-diensten blijven intact.
- [ ] B-T18: responses, logs en fouten lekken geen andere accountidentiteit, credentials, volle proofs of privéwalletkoppelingen.

Per test: omgeving, versie, tijdstip, uitvoerder, inputscenario, verwacht/waargenomen resultaat en bewijsreferentie vastleggen. Belastingsproeven uitsluitend in de afgesproken afgeschermde omgeving.

## 13. Implementatievolgorde na expliciete toestemming

1. Los B-BLOCK-01/02 op; geen entity-only noodoplossing of zelfgebouwde loginbackend.
2. Keur B-BLOCK-03/04 en de transactietoestandsmachine goed.
3. Bouw alleen registerinvarianten, receipts en concurrency-/crashproef.
4. Bouw de nauwe walletproof- en ownershipoperaties, met gedeelde logica in gedeelde servermodules.
5. Sluit bestaande auth en walletguard aan; behoud bestaande authflows.
6. Verifieer intrekking, herstel en onafhankelijke rechtenprocessen.
7. Laat securityreview en acceptatie uitvoeren, daarna pas faseovergang beoordelen.

Geen feed, publieke navigatie, watcherworkflow, nieuwe tokenvoorwaarde of protocolwijziging in deze uitvoeringsscope. Alle toekomstige serverfuncties moeten vóór authoring de actuele backendfunctiehandleiding volgen; dit document is geen runtime-implementatiehandleiding.

## 14. Reviewregister

| ID | Onderwerp | Status | Eigenaar / bewijs |
|---|---|---|---|
| B-BLOCK-01 | Transactionele exclusiviteit en eenmalig nonceverbruik | BLOKKEERT IMPLEMENTATIE | Nog aan te wijzen; documentatie toont geen voldoende entity-only garanties |
| B-BLOCK-02 | Serververifieerbare recente herauthenticatie en sessie-intrekking | OPEN / blokkeert gevoelige mutaties | Nog aan te wijzen; geen bewezen platformcontract |
| B-BLOCK-03 | Finaliteit, contextslots, actietiming en rest-race | ONTWERP TER REVIEW | Ontwerp in §8; geen gemeten garantie |
| B-BLOCK-04 | Deploymentafscherming, origins, privacybewaring en eligibility | OPEN | WP-C/D/F/H |

## 15. Documentatiebasis en versiebeheer

Geraadpleegde Base44-documentatie op 22 oktober 2026:
- https://docs.base44.com/developers/backend/resources/entities/entity-schemas
- https://docs.base44.com/api-reference/upsert-entity-records
- https://docs.base44.com/api-reference/update-entity-records-by-filter

De broninspectie en documentatiezoekactie bewijzen geen uitvoeringsgedrag, ongedocumenteerde transactie-eigenschappen, ingeschakelde OAuth-provider of sessiebeheerfunctie. Controleer actuele platformcontracten vóór implementatie.

| Versie | Datum | Wijziging |
|---|---|---|
| 0.1 | 22 oktober 2026 | Eerste concrete WP-B-uitwerking op productregels v1.0; broninspectie, auth-/proofcontract, eigendomsbeleid, invarianten, blockers en open acceptatie vastgelegd. Geen runtimewijzigingen. |