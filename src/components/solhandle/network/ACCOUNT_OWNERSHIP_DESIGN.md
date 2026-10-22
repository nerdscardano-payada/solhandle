# SolHandle Network — WP-B: walletgebonden profiel, walletbewijs en handlebindings

**Versie:** 0.2  
**Datum:** 22 oktober 2026  
**Status:** uitgewerkt technisch ontwerp; geen implementatie of vrijgave  
**Productbaseline:** [Definitieve productregels v1.1](./PRODUCT_RULES.md)  
**Hoofdplan:** [Intern fase 0-plan](./PHASE_0_PLAN.md)  
**Verantwoordelijke / securitybeoordelaar:** nog formeel aan te wijzen

> Dit ontwerp concretiseert WP-B zonder de productregels te veranderen. Bestaande bronbestanden zijn gelezen; er zijn geen runtimeproeven uitgevoerd. Een gelezen helper is geen bewezen securitygarantie. Er worden geen nieuwe loginbackend, walletsessies, functies, entiteiten, RPC-taken of publieke routes geactiveerd. Onderstaande operatienamen en records zijn ontwerpcontracten, geen bestaande API's.

## 1. Architectuurbesluiten

| ID | Besluit | Productregels |
|---|---|---|
| B-01 | Vaste profiel-ID met bewezen beheerwallet(s); registratie en login moeten wallet-native zijn via een nog te bewijzen ondersteunde authenticatie-integratie. Geen eigen login-/JWT-/recoverybackend. | A-05 t/m A-09 |
| B-02 | Gewenste onboarding: wallet verbinden → gericht registratiebewijs → expliciete Network-aanmelding → eigen profiel → eigen @handle kiezen. Geen verplichte email, wachtwoord of Google-login. Terugkeer gebruikt een afzonderlijk SIGN_IN-bewijs. | A-06, A-07, A-10 |
| B-03 | Alleen specifiek loginbewijs van een actieve beheerwallet kan via de goedgekeurde integratie een sessie opleveren. Registratie-, bindings-, betaal- en herstelproofs zijn geen uitwisselbare logincredentials. NFT-bezit geeft nooit toegang tot een vorig profiel. | A-10, A-11, A-36 |
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
2. **Ondersteunde authenticatie-integratie (nog te bewijzen):** valideert wallet-native registratie/login en levert een serververifieerbare subjectidentiteit en beheerde sessie. Network-profiel-ID wordt server-side aan dat subject en actieve beheerwallets gekoppeld, nooit uit requestbody afgeleid. Bestaande platformauth wordt niet vervangen of omzeild; geen zelf uitgegeven tokens of eigen sessiebackend. B-BLOCK-02 blokkeert uitvoering zolang deze integratie niet is aangetoond.
3. **Network-autorisatie:** controleert expliciete deelname, toelating, leeftijdsstatus, maatregel, autorisatieversie, walletbinding en handlebinding. Dit is geen tweede loginbackend.
4. **Transactioneel register:** serialiseert de toepasselijke account-, wallet-, challenge- en assetmutaties.
5. **Solana RPC:** bewijst protocolidentiteit en eigendom binnen gedocumenteerde slot/finaliteitsgrenzen. Index en cache mogen dit niet vervangen.
6. **Projecties/UI:** tonen minimale informatie; een verouderde projectie geeft nooit schrijfrecht.

**Niet vertrouwen:** body.userId, client-accountstatus, connected-walletlabels, lokale tijd, client-badges, eigen tokenclaims of een verborgen route.

## 4. Logische records en invarianten

Ontwerpcontracten, geen schemas of nieuwe User-entiteit. Account-ID betekent hieronder de vaste Network-profiel-ID, niet een verplicht traditioneel platformaccount. WP-C werkt de subjectmapping pas na oplossing van B-BLOCK-02 uit.

| Logisch record | Minimale autorisatie-inhoud |
|---|---|
| NetworkAccount / profiel | Vaste profiel-ID, geverifieerde auth-subjectmapping, onboardingversie, leeftijd/toegang, maatregel, autorisatieversie |
| WalletLink | Profiel-ID, canonieke beheerwallet, generatie, ACTIVE/REVOKED, bewezen/opgezegd moment; loginbevoegdheid expliciet |
| WalletChallenge | ID, noncehash, exacte berichtcontext/hash, wallet, specifiek doel, operatie-/actiehash, audience, uitgifte/verval, status; bestaande profiel-ID/generatie alleen bij bevoegde bestaande context |
| HandleBinding | Profiel-ID, gekoppelde ownerwallet en generatie, netwerk/protocol/asset/handle/PDA, bindinggeneratie, begin/einde/status |
| OwnershipObservation | Binding/actie, asset, owner, confirmed/finalized slots, commitment, servermeetmoment en validatieresultaat |
| OperationReceipt | Eigen profiel of afgeschermde preregistratie-operatiecontext, inputhash, resultaatreferentie; geen sessiecredential |
| AuthorizationEvent / outbox | Mutatie-ID, profiel-/bindinggeneratie, reden en tijd volgens WP-D-bewaring |

Invarianten binnen de vereiste transactionele commitgrens:
- Eén actieve profielkoppeling per beheerwallet; meerdere beheerwallets kunnen hetzelfde profiel bedienen.
- Eén profiel per blijvende Network-identiteit, één actieve hoofdhandle per profiel en één actieve binding per officiële asset.
- De publieke @name wordt alleen afgeleid uit een officiële handle die actueel eigendom is van de expliciet gekoppelde wallet in de binding. Geen vrij invulbare username of naam uit alleen metadata.
- Eerste registratie is expliciet en idempotent; herhaalde login van dezelfde bevoegde wallet maakt geen extra profiel.
- REGISTER_PROFILE, SIGN_IN, ADD_WALLET, REMOVE_WALLET en SELECT_PRIMARY_HANDLE zijn niet uitwisselbaar; een nonce autoriseert hoogstens één bedoelde uitvoering.
- Wallet toevoegen vereist verse autorisatie van een bestaande beheerwallet én proof van de nieuwe wallet. Een wallet die een ander profiel beheert kan niet worden verhuisd door alleen de nieuwe profielsessie.
- Een swap beëindigt de oude binding en start de nieuwe atomisch; intrekking/verwijdering kan niet door een in-flight operatie worden overschreven.
- Intrekking beëindigt walletloginbevoegdheid, invalideert relevante generaties en wordt door het goedgekeurde sessiecontract afgedwongen.
- De laatste beheerwallet niet regulier verwijderen zonder veilige vervanging of expliciete profielverwijdering.
- Opnieuw koppelen maakt een nieuwe generatie; een verwijderde profielidentiteit wordt niet via een latere walletlogin hersteld.
- State-event en mutatie worden samen duurzaam opgeslagen; projecties zijn geen autorisatiebron.

**Opslagcontract:** unieke sleutels/conditionele transities, transacties, crashherstel en duurzaam idempotentieresultaat aantonen. Een frontendqueue, proceslokale lock of watcher is onvoldoende. Register onbereikbaar: geen nieuwe Network-mutatie. Geen eigen sessieopslag invoeren onder het mom van dit register.

## 5. Wallet-native registratie en terugkerende login

**Gewenste productflow; niet reeds ondersteund of geïmplementeerd verklaard.**

1. Bezoeker kiest expliciet registreren of inloggen en verbindt de gewenste wallet. Verbinden zelf geeft geen profiel of sessie.
2. De goedgekeurde authenticatie-integratie levert een eenmalige, doel-/domeingebonden challenge. Bij eerste registratie is er nog geen geauthenticeerd profiel; de proof is aan een servergegenereerde, afgeschermde preregistratiecontext gebonden, niet aan een clientgekozen account-ID.
3. Gebruiker tekent met de gekozen wallet. Geen transactie, gas, tokenapproval, private key of seed phrase opvragen.
4. De integratie verifieert de proof en levert de ondersteunde geauthenticeerde context. Hoe challenge, verifier, subjectmapping en beheerde sessie veilig aansluiten, is expliciet onderdeel van B-BLOCK-02; Network bouwt hiervoor geen eigen loginbackend.
5. Bij REGISTER_PROFILE: toon voorwaarden/privacy-informatie en voer de goedgekeurde leeftijds-/alphatoegangsflow uit; pas na expliciete bevestiging wordt exact één nieuw eigen profiel met beheerwallet vastgelegd. Geen profiel aanmaken door alleen een SIGN_IN-verzoek of walletverbinding.
6. Bij SIGN_IN: resolveer uitsluitend de actieve beheerwalletkoppeling en dezelfde blijvende profiel-ID. Geen willekeurige profiel-ID accepteren, geen automatische registratie als er geen geldige koppeling bestaat, en accountmaatregelen blijven gelden.
7. Gebruiker kiest een officiële eigen handle uit een gekoppelde wallet; server verifieert bezit rechtstreeks on-chain en commit exclusiviteit. Alleen dan verschijnt deze als publieke @name en kan toegestane sociale deelname beginnen.

Voorbeeld: een profiel met wallet W en eigen @name behoudt profiel-ID en volgers bij een andere eigen hoofdhandle. Na transfer van de handle naar wallet X kan het profiel van X de naam kiezen, niet het profiel van W overnemen. Overdracht/diefstal van de private key van W is daarentegen credentialcompromittering: wie een nog bevoegde beheerwallet kan gebruiken kan voor dat eigen gekoppelde profiel tekenen. Dit mag niet verward worden met een veilige NFT-transfergarantie.

Geen verplichte email/wachtwoord/Google als technische workaround. Bestaande platformaccounts, authpagina's, minting en Pay blijven ongewijzigd; geen automatische import of fusie.

## 6. Gescheiden walletbewijzen

### Bericht en parameters

- CSPRNG-nonce met minimaal 256 bits entropie; maximaal vijf minuten geldig volgens servertijd; niet verlengen of hergebruiken.
- Eén zichtbaar doel: REGISTER_PROFILE, SIGN_IN, ADD_WALLET, REMOVE_WALLET of SELECT_PRIMARY_HANDLE.
- Exacte UTF-8-bytes, canonieke Base58-publickey en Ed25519-signatuur van exact 64 bytes; begrensde requestgroottes.
- Bericht noemt SolHandle Network, ingestelde audience, wallet, doel, challenge-ID, nonce, operatie-ID, actiehash, netwerk, uitgifte/verval en versie. Profielreferentie/generatie hoort alleen in een bestaande geautoriseerde context; eerste registratie gebruikt een ondoorzichtige servergegenereerde registratiecontext, nooit een emailadres of door de client opgegeven profiel-ID.
- Een SIGN_IN-proof wordt door de ondersteunde authenticatie-integratie verwerkt. Een geslaagde handlecontrole of bindingproof mag niet worden omgezet in een zelfgemaakt platformtoken.
- Gevoelige wijzigingen vereisen verse, serververifieerbare step-up met een reeds bevoegde beheerwallet; bij toevoegen ook proof van de nieuwe wallet. Een gestolen browsercontext en een aanvallerswallet zijn onvoldoende.
- Eerste versie: ondersteunde Ed25519-walletsigning; multisig-/programwallets zonder passend bewijs vallen erbuiten. Geen betaalsignatuur of blockchaintransactie als ongevraagde fallback.

### Domein en replay

Audience en toegestane origins zijn vaste serverconfiguratie; geen blind vertrouwen in Host, doorgestuurde Origin of previewdomain. Preview/test scheiden van productie. Origin is aanvullend, geen identiteit. Domeinwijziging invalideert oude challenges.

Registratie/login gebruiken de aantoonbare replay- en sessiegaranties van de ondersteunde integratie. Voor applicatiemutaties worden challengeverbruik, autorisatieversies, exclusiviteit en receipt atomisch gecontroleerd. Bewijs de grens tussen identityverificatie en registratiecommit; een crash mag geen profielduplicaat of ongeautoriseerde binding opleveren. Een eigen loginverifier of eigen sessie-uitgifte is niet door dit ontwerp toegestaan.

Challenge: ISSUED → CONSUMED of EXPIRED/CANCELLED. Een retry van een reeds geslaagde applicatiemutatie kan uitsluitend een beperkte receipt aan dezelfde nog bevoegde context tonen, geen nieuwe sessiecredential of heruitvoering. Een verloren loginantwoord mag niet via hergebruik van een verbruikte signature opnieuw tokens opleveren; volg het ondersteunde integratiecontract of begin een nieuwe challenge.

Wallet-/adapter-/accountwisseling tijdens signing breekt af; geen fallbackwallet. Rate limits en tijdelijke bewijsbewaring worden vóór uitvoering met WP-D/F vastgesteld. Eerste registratie/login mogen niet afhankelijk zijn van een al bestaande normale sessie; dat zou het wallet-native model circulair maken.

## 7. Operatiecontracten en integratiegrens

Voorgestelde bounded operaties; geen bestaande endpoints of nieuwe authbackend. De goedgekeurde provider/platformintegratie is verantwoordelijk voor wallet-native authenticatie, herauthenticatie en beheerde sessies. Welke ondersteunde ingang dit mogelijk maakt blijft B-BLOCK-02. Zolang die niet bewezen is, geen zelfgemaakte login-endpoints implementeren.

| Operatie / flow | Vereiste context | Resultaat / grens |
|---|---|---|
| Walletregistratie / walletlogin | Gericht bewijs via ondersteunde authenticatie-integratie | Geverifieerd subject en beheerde sessie; nog geen stilzwijgende sociale profielaanmaak |
| readNetworkAccess | Servergeverifieerde eigen sessie/subject | Eigen profiel, toegang en binding; geen andermans walletlijst |
| enrollNetwork | Registratiecontext, walletbewijs, expliciete onboarding en eligibility | Exact één eigen profiel, vaste ID en eerste beheerwallet |
| requestWalletProof | Eigen sessie voor wijzigingen; doel en concrete bounded input | Actiespecifieke proofcontext, niet een algemene loginproxy |
| completeWalletLink | Verse bestaande-walletstep-up plus nieuwe-walletproof | Extra beheerwallet bij hetzelfde profiel of generiek conflict |
| selectPrimaryHandle | Eigen profiel, gekoppelde ownerwallet en gericht bewijs | Verse chaincontrole en atomische hoofdhandleswap |
| unlinkWallet | Verse bevoegde step-up, bewaakte laatste-walletregel | Intrekking loginbevoegdheid en relevante handlebinding/sessies volgens goedgekeurd contract |
| beginLostWalletRecovery | Beperkte herstelvraag via goedgekeurd pad | Geen gegarandeerde recovery of bypass op basis van handlebezit |
| evaluateHandleAction | Eigen geverifieerde actor, actuele versies en idempotentie | Verse ownershipcontrole, uitsluitend bedoelde actie |

Geen callerkeuze van profiel-ID, subject, verificatiestatus, loginrechten of authproviderconfiguratie. Geen algemene proxy voor arbitrary chaincalls/SQL/integraties. Mogelijke beperkte resultaatcodes: AUTH_REQUIRED, REAUTH_REQUIRED, REGISTRATION_REQUIRED, PROOF_EXPIRED, PROOF_INVALID, WALLET_LINK_CONFLICT, LAST_WALLET_PROTECTED, HANDLE_NOT_OWNED, OWNERSHIP_UNCERTAIN, ACCOUNT_RESTRICTED, ACCESS_NOT_GRANTED, OPERATION_CONFLICT en SERVICE_UNAVAILABLE. Conflicten tonen geen andere profielidentiteit of gekoppelde persoonsgegevens. De loginflow kan na geldige verificatie vanzelfsprekend het eigen gekoppelde profiel herkennen.

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

Bij swap van hoofdhandle worden account, oude binding en nieuwe asset-exclusiviteit samen gecontroleerd. Bij overdracht naar een nieuwe eigenaar kan de oude binding op basis van chainbewijs eindigen zonder toestemming van de verkoper; de koper moet met een eigen account en eigen walletproof beginnen. Een handle in een nieuwe ownerwallet geeft uitsluitend recht op een eigen handlebinding. Alleen een gericht SIGN_IN-bewijs van een reeds bevoegde beheerwallet kan het eigen bestaande profiel bereiken; een wallet toevoegen vanuit een ander profiel geeft bij een bestaande koppeling een conflict, geen verhuizing. Accountschorsing blijft een aparte accounttoestand, geen NFT-status.

**Historische publicatiereferentie:** immutable account-ID, binding-ID/generatie, asset, handle op publicatiemoment en besluitmoment. Wijziging van de actuele handle past bestaande posts/mentions niet aan. Nieuwe handlelookups en historische auteurverwijzingen zijn verschillende operaties.

## 10. Sessies, herauthenticatie en intrekking

### Ondersteunde integratie vereist — B-BLOCK-02

Wallet-native registratie en login zijn de producteis, niet een bewezen eigenschap van de huidige app. Bestaande traditionele login-, OTP- en resetpagina's blijven intact voor onafhankelijke bestaande diensten; ze zijn niet de verplichte Network-onboardingroute. Een Contacts-token of lokale connected-state geeft geen Network-login. Ook een geldige signature is zonder de ondersteunde sessie-integratie geen platformlogin.

Vóór implementatie aantonen: walletproof-verificatie via een ondersteunde authenticatieprovider/platformingang, serververifieerbaar subject, eerste registratie zonder verplicht emailaccount, veilige terugkerende sessie, logout/verval, intrekking, walletrotatie en account-/profielmapping. Geen fictieve emails, service-roletoegang in de browser, zelf uitgegeven JWT's of een zelfgemaakte cookie-/sessiebackend om een ontbrekende ingang te omzeilen. Ontbreekt de ondersteunde route, dan blijft Network geblokkeerd; geen stille terugkeer naar traditionele registratie.

### Verse herauthenticatie

Streefgrens vijf minuten voor gevoelige wijzigingen. Gebruik een nieuwe, actiegebonden proof van een al bevoegde beheerwallet via aantoonbaar ondersteunde step-up. Een browser-timestamp, alleen `auth.me()`, een nieuwe aanvallerswallet of een oude willekeurige signature is geen recentheidbewijs. Nieuwe beheerwallets ook afzonderlijk bewijzen. Bij ontbrekende veilige step-up blijft de mutatie geblokkeerd.

### Intrekking

Profielautorisatieversie en wallet-/bindinggeneraties worden transactioneel bijgewerkt. Iedere Network-mutatie controleert actuele serverstaat, niet browserclaims of een oude projectie. Een ingetrokken wallet kan niet opnieuw inloggen, ook niet wanneer een externe provider nog walletcontrole bevestigt. De ondersteunde sessie-integratie moet betrokken sessies kunnen blokkeren/intrekken; global logout of apparaatbeheer pas beloven na bewijs. Deze Network-intrekking wijzigt geen NFT en belooft geen logout bij onafhankelijke SolHandle-diensten.

Cookies, tokenopslag, rotatie, CSRF, browserheaders en disconnect-versus-logout volgen het werkelijk ondersteunde contract en moeten beoordeeld worden; wallet disconnect alleen is geen gegarandeerde sessie-intrekking.

## 11. Herstel, ontkoppelen en privacy

- Andere vooraf gekoppelde, nog bevoegde beheerwallet: vers inloggen/step-up voor hetzelfde profiel; gecontroleerde vervanging mogelijk zonder de verloren NFT te verplaatsen.
- Nog slechts een browsersessie maar geen beheersleutel: geen credentialwijziging alleen op basis van die sessie. Rechtenverzoeken blijven passend verifieerbaar.
- Alle beheersleutels verloren: geen gegarandeerd herstel, geen verplicht emailherstel en geen toegang op basis van gekochte/voormalige handle. Eventuele aanvullende recovery eerst afzonderlijk goedkeuren met WP-D/F/H.
- Normaal ontkoppelen vereist verse bevoegde step-up, bewaakt de laatste beheerwallet en beëindigt de toepasselijke hoofdhandle en loginrechten/sessies in het goedgekeurde intrekkingscontract.
- Een actieve beheerwallet in de SIGN_IN-flow betekent terugkeer naar het eigen gekoppelde profiel; dezelfde wallet toevoegen vanuit een ander profiel betekent een conflict, geen fusie.
- Diefstal of overdracht van de private key is compromittering van een logincredential, anders dan overdracht van alleen de NFT. Leg dit expliciet uit aan deelnemers; Network vraagt of bewaart nooit private keys.
- Privacy-/bezwaarverzoeken blijven bereikbaar zonder actieve handle of normale sessie; geen nieuw verkregen NFT als bewijs van oude accountidentiteit.
- Profielverwijdering beëindigt beheerwallet-/handlebindings en Network-autorisatie. Geen automatische verwijdering van een onafhankelijk platformaccount of andere SolHandle-diensten. Nieuwe registratie herstelt geen gewist profiel.

## 12. Bewijs- en prototypeplan

Geen controles uitgevoerd met dit document. Operationele flowtests later via de Testing Agent; concurrency-, crash- en transactietests vereisen daarnaast gerichte technische bewijsvoering in de goedgekeurde testomgeving.

### Voorwaarden vóór bouwen
- [x] Bestaande auth-, walletguard-, Contacts- en ownershipbron gelezen; grenzen beschreven.
- [x] Productregels v1.1 vertaald naar walletgebonden profielontwerp; wallet-native login is de gewenste richting, niet een reeds aangetoonde integratie of sessiegarantie.
- [x] Bestaande authroutes vastgesteld; geen duplicaat-login nodig.
- [x] Entity-exclusiviteitsbeperking en ontbrekende transactiegaranties geregistreerd.
- [ ] B-BLOCK-01: opslagkeuze met bewezen nonce-, uniekheids-, transactie- en herstelgaranties goedgekeurd.
- [ ] B-BLOCK-02: ondersteunde wallet-native registratie/login en servergeverifieerde subjectmapping bewezen, zonder verplichte traditionele registratie; step-up, sessiebeheer en walletintrekking aantoonbaar.
- [ ] B-BLOCK-03: chainfinaliteitsbeleid, publicatiemoment en resterende distributed race beoordeeld en geaccepteerd.
- [ ] B-BLOCK-04: originconfiguratie, alpha-afscherming, leeftijds-/toegangsbesluiten, privacybewaring en verantwoordelijken vastgelegd.

### Acceptatie met bewijsreferentie
- [ ] B-T01: eerste walletregistratie en terugkerende walletlogin werken via de ondersteunde integratie zonder verplichte email/wachtwoord/Google; geen profiel zonder expliciete Network-onboarding; bestaande authroutes en veilige redirects blijven intact.
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
- [ ] B-T19: REGISTER_PROFILE, SIGN_IN en bindingsproofs kunnen elkaars doel niet autoriseren; preregistratie vertrouwt geen clientgekozen profiel-ID.
- [ ] B-T20: geldige SIGN_IN van een bestaande beheerwallet bereikt hetzelfde profiel; ADD_WALLET vanuit een ander profiel fuseert of verplaatst niets.
- [ ] B-T21: ingetrokken beheerwallet kan niet opnieuw inloggen; bestaande betrokken sessies verliezen toegang; laatste-walletregel voorkomt onbedoelde lock-out.
- [ ] B-T22: dezelfde profiel-ID en followers blijven bij hoofdhandlewissel; publieke @name komt alleen van een actuele officiële handle in de gekoppelde ownerwallet.
- [ ] B-T23: een aanvallerswallet met alleen een gestolen browsercontext kan geen beheerwallet toevoegen; sleutelverlies zonder andere bevoegde wallet geeft geen automatische recovery.

Per test: omgeving, versie, tijdstip, uitvoerder, inputscenario, verwacht/waargenomen resultaat en bewijsreferentie vastleggen. Belastingsproeven uitsluitend in de afgesproken afgeschermde omgeving.

## 13. Implementatievolgorde na expliciete toestemming

1. Los B-BLOCK-01/02 op; geen entity-only noodoplossing of zelfgebouwde loginbackend.
2. Keur B-BLOCK-03/04 en de transactietoestandsmachine goed.
3. Bouw alleen registerinvarianten, receipts en concurrency-/crashproef.
4. Bouw de nauwe walletproof- en ownershipoperaties, met gedeelde logica in gedeelde servermodules.
5. Sluit uitsluitend de bewezen ondersteunde wallet-authenticatie-integratie en walletguard aan; bestaande onafhankelijke authflows blijven intact.
6. Verifieer intrekking, herstel en onafhankelijke rechtenprocessen.
7. Laat securityreview en acceptatie uitvoeren, daarna pas faseovergang beoordelen.

Geen feed, publieke navigatie, watcherworkflow, nieuwe tokenvoorwaarde of protocolwijziging in deze uitvoeringsscope. Alle toekomstige serverfuncties moeten vóór authoring de actuele backendfunctiehandleiding volgen; dit document is geen runtime-implementatiehandleiding.

## 14. Reviewregister

| ID | Onderwerp | Status | Eigenaar / bewijs |
|---|---|---|---|
| B-BLOCK-01 | Transactionele exclusiviteit en eenmalig nonceverbruik | BLOKKEERT IMPLEMENTATIE | Nog aan te wijzen; documentatie toont geen voldoende entity-only garanties |
| B-BLOCK-02 | Ondersteunde wallet-native registratie/login, subjectmapping, step-up en sessie-/walletintrekking | BLOKKEERT AUTH-IMPLEMENTATIE | Nog aan te wijzen; geen bewezen integratiecontract, geen eigen loginbackend of traditionele-loginfallback toegestaan |
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
| 0.2 | 22 oktober 2026 | Productbesluit v1.1 verwerkt: vaste profiel-ID, beheerwallet als logincredential, eigen @name, onderscheiden registratie/login/bindingsproofs en veilig herstel/intrekking. Vervangt platformregistratie als verplichte route. B-BLOCK-02 uitgebreid tot vereiste ondersteunde wallet-authintegratie. Alleen documentatie; geen runtimewijzigingen of geslaagde tests. |