# SolHandle Identity & Community Hub — fase 0-inventaris

Datum: 25 oktober 2026 · Versie: 1.0
Status: broncode-inventaris gereed voor beoordeling; runtimebewijs en vrijgave OPEN.
Scope: Identity · Discover · Contacts · Pay. Geen productiegedrag gewijzigd.

## 1. Bewijsniveau en grenzen

Deze inventaris is gebaseerd op directe inspectie van de hieronder genoemde broncode en bestaande ontwerpen. BRON betekent dat een controle of flow in code is gevonden, niet dat deze in productie is geslaagd. HISTORISCH betekent eerdere documentatie, niet opnieuw bevestigd. OPEN betekent ontbrekend of nog te bewijzen binnen de onderzochte route.

Geen walletlogin uitgevoerd, transactie ondertekend of verzonden, records aangemaakt/gewijzigd, flags aangepast, provider gekoppeld of authconfiguratie gewijzigd. Geen live security-, concurrency- of end-to-endtests uitgevoerd. Geen volledige audit van het on-chain programma, alle mintvarianten of infrastructuur. Geen uitspraak over juridische compliance of huidige platform-SSO-compatibiliteit.

Bestaande PHASE_0_PLAN.md en SOCIAL_WEB_AUDIT.md blijven historische bronnen. Voor de nieuwe MVP-scope geldt dit document als aanvullende inventaris, niet als bewijs dat oudere werkpakketten zijn afgerond. De sociale code blijft behouden.

## 2. Samenvatting

- Sterke hergebruikbasis: chainresolver, Primary Handle-flow, walletadapter, Contacts en zelfstandige Pay.
- Network is nu geen gewone wallet-native ledenomgeving: serverflags zetten walletAuthentication en contributions op false; ontwikkelacties eisen adminrechten.
- Publieke Network-leesroutes bestaan al, inclusief posts. De kleinere roadmap schakelt die niet vanzelf uit. Afzonderlijk goedgekeurde MVP-aanpassing moet sociale navigatie en eventuele publieke leesroutes expliciet begrenzen.
- Contacts heeft een eigen walletsignature en toepassingsspecifieke sessie. Dit is niet hetzelfde als een Network-/platformlogin en mag daar niet stilzwijgend voor worden gebruikt.
- Beheerde projectdirectory, onafhankelijke Official Project-beoordeling en publieke profiel-/directorymeldingen zijn niet als complete MVP-flow aangetroffen.
- Bestaande privécontacten zijn walletgebonden en bewaren een vaste ontvanger. Na handletransfer blijft die wallet het contact; dit is bewust ander gedrag dan betalen naar de actuele handle-eigenaar.
- Geen onderdeel is op basis van deze broninspectie vrijgegeven voor een nieuwe publieke ledenlancering.

## 3. Technische inventaris

| Onderdeel | Aangetroffen bewijs | Hergebruik | Vereiste wijziging / ontbrekend bewijs |
|---|---|---|---|
| Walletverbinding versus login | NetworkSessionProvider.jsx:11–29; AuthContext.jsx; networkFlags.ts | Bestaande adapter, bestaande platformauth en contextwissels | Wallet connect is geen ledenlogin. Bootstrap en ready zijn admingebonden. Ondersteunde wallet-native ledenauth, stabiele identiteitsmapping, intrekking en serverautorisatie nog bewijzen. |
| Ontwikkel-walletproof | networkWalletProof.ts:9–33 | Nonce, Ed25519, 3-minutenverval, account/operator/doel/origin en payloadhash | Bewust DEVELOPMENT, geen productie-login. Voor MVP expliciet originbeleid, atomair eenmalig verbruik en sessie-integratie aantonen. |
| Officiële handle-eigendom | solhandleResolver.ts:35–46 | Directe chaincontrole van record-/asset-PDA, programma-eigenaren, officiële collectie en actuele assetowner | confirmed is geen finalized. Slot-/actualiteitsbeleid en resterende race tussen lezen en schrijven goedkeuren; RPC-uitval mag geen vertrouwensverhoging geven. |
| Primary Handle lezen | solhandleResolver.ts:49–58; getHandleIdentity/entry.ts:17–32 | Primary PDA plus opnieuw geverifieerde actuele owner; onbekend bij lookupuitval | UI moet onbekend onderscheiden van niet-primary. Runtimebewijs ontbreekt. |
| Primary Handle wijzigen | SetPrimaryButton.jsx:11–23; mintSolHandle.js:24–46 | Bestaande prepare_primary → walletsigneeractie → submit_primary | Geen tweede implementatie bouwen. Server-/on-chainpad en niet-eigenaar-afwijzing nog afzonderlijk nalopen en testen. |
| Owned handles | ownedHandles.ts; getOwnerHandles als bestaande ingang | Lijst op basis van indexkandidaten en actuele assetowners | Helper scant alle actieve indexrecords en kan cache schrijven. Niet gebruiken als exclusieve accountautorisatie; volledigheid bij indexachterstand en schaallimieten onderzoeken. |
| Beschermde namen / claim | getHandleAvailability/entry.ts:31–80; mintSolHandle.js:49–118 | Chainrestrictie, indexfallback als zodanig gelabeld, bestaande restricted-claim en mintinstructies | Geen nieuwe naamengine. Niet alle server-/mintvarianten of gedeployde contractcontroles afgetekend. Indexfallback is geen voldoende eigendomsbewijs. |
| Vaste account-ID | networkLabProfiles.ts:15–20; networkLabContext.ts:testActor | UUID public_id los van handle; actorcontrole op operator en DEVELOPMENT | Normale ledenrechten, expliciete registratie, lifecycle/recovery en multiwallet niet als productieflow aanwezig. |
| Publiek profiel | networkRead/entry.ts:published-query en profielprojectie; networkFlags.ts:publicProfile | Publicatie-filter en beperkte publieke projectie zonder private accountmetadata | Alleen preview=true, PUBLISHED. Geen gewone ledenpublicatie. Projectie toont handle=null / NOT_VERIFIED en laat website/media weg. Publicatietoestemming, intrekking en veilige mediaprojectie ontbreken als complete ledenflow. |
| Handle-URL naar account | App.jsx:/network/:handle; NetworkProfile.jsx:10–13 | Vaste account-URL /network/account/:publicId | Concrete mismatch: pagina leest alleen publicId; :handle wordt niet geresolved. Route bestaat, maar dat bewijst geen werkende handle-accountmapping. |
| Profielbewerking | networkLab/entry.ts:25–28; networkProfileWrite.ts:26–35; networkLabProfiles.ts:22–33 | Per-payload ondertekening en goedgekeurde mediareferenties | Admin DEVELOPMENT-only; vereist nu actuele handle-eigendom. Gedrag bij handleverlies voor eigen accountbeheer expliciet bepalen, niet automatisch overnemen. |
| Transferveiligheid | networkTestIdentity.ts:28–40; networkIdentityRefresh.ts:5–33 | Losse wallet/accountmapping; beëindigen oude binding; status UNCERTAIN bij RPC-uitval; aparte bindingsperiode | On-demand verversen, profielpolling en circa 60 seconden geldigheid, geen continu bewezen watcher. Productie-exclusiviteit en A→B-tests ontbreken. |
| Concurrentieregister | networkIdentityRegistry.ts:4–20 | Eén vooraf aangemaakt DEVELOPMENT-register met version-update en begrensde retry | Maximaal 200 wallets / 500 bindings. Geen productiedatabaseontwerp of bewijs voor alle atomische garanties. Bestaande B-BLOCK-01 blijft open. |
| Contacts toegang | walletContacts/entry.ts:8–16; contactSessions.ts:5–39 | Walletsignature; 5-minutenchallenge; hash van willekeurig token; 7/30 dagen; server-lock | Apart walletgebonden adresboek, niet platformlogin. Bericht noemt vast solhandle.io; request-origincontrole niet in deze helper aanwezig. Sessies/nonceconcurrency en misbruikgrenzen beoordelen. |
| Contacts privacy / CRUD | contactRecords.ts:9–60; WalletContact.jsonc; ContactsSession.jsonc | Server filtert owner_wallet uit sessie, zoekpaginering, save/delete, admin-only directe entitytoegang | Geen automatische followers. Cross-wallet-negatieve tests ontbreken. Eventuele accountbrede synchronisatie is een aparte productkeuze, geen stille migratie. |
| Contacts browseropslag | contactClient.js:3–31; useContactsAccess.js:8–25 | Walletgebonden opslag en cacheverwijdering bij lock | Bearertoken staat in localStorage, server bewaart hash. Risico bij scriptcompromis en intrekkingsgedrag expliciet beoordelen; niet als bevestigd lek aangemerkt. |
| SOL Pay | preparePayTransaction/entry.ts:47–90; Pay.jsx:112–114 | Review, verse voorbereiding, walletsigneeractie, signature-/sender-/bedrag-/recipientchecks; geen intern saldo | End-to-endbewijs en transfer tijdens review/submit ontbreken; niet claimen dat on-chain transfer en DB-/chaincontrole atomair zijn. |
| Token Pay | usdtPayFlow.ts:47–105; useUsdtPayment.js:34–67 | Ondersteunt bestaande USDC/USDT/HANDLE-route, mintcontrole, verse quotevergelijking en walletsigning | Signed-validator/confirmationmodules niet volledig afgetekend in deze ronde; regressies per ondersteunde asset vereist. |
| Betalen vanuit Contacts | contactPayment.ts:4–10; contactRecords.ts:48–56 | Sessiewallet=sender; vast opgeslagen recipient_wallet; handleChanged-signaal | Belangrijke semantiek: contactwallet blijft oud na NFT-transfer. Niet automatisch naar nieuwe eigenaar omleiden. Heldere keuze/warning en expliciete bevestiging als vrijgavepoort. |
| Network Pay-context | networkPaymentGuard.ts; networkTestIdentity.ts:10–19 | Account-/binding-/assetcontext bovenop resolver | Momenteel admin-ontwikkelcontext. Niet simpelweg admincheck verwijderen voor leden. Opnieuw ontwerpen boven ondersteunde auth. |
| Project discovery | NetworkDiscoverResults.jsx:10–20; IntegrationDirectory.jsx | Bestaande zoekpresentatie en integratiegidsen | Discovery zoekt profielen/posts; integratiegidsen zijn geen geverifieerde projectdirectory. Geen dedicated project-publicatie-/reviewflow aangetroffen. |
| Projectbewijs | verifyOfficialClaimDomain/entry.ts:8–35; verifyOfficialClaimWallet/entry.ts:10–20 | Domeinchallenge en handtekening van voorgedefinieerde wallet als bouwstenen | Dit is restricted-name-claimbewijs, geen algemene onafhankelijke autoriteitsbeoordeling. Geen automatische omzetting naar Official Project-badge. Fetch/redirect-/timeoutbeleid beoordelen vóór hergebruik. |
| Melden / modereren | networkLabSafety.ts:9–29; networkLab/entry.ts:17,35; NetworkReport-schema | Ontwikkel-postmeldingen, beheerdersacties en historie | Geen publieke profiel-/projectmelding: huidige flow verlangt postId en admin-ontwikkelactor. Triage, profiel-/listingacties, intrekking en terugkoppeling ontbreken als MVP-route. |
| Verwijdering | deleteMyAccount/entry.ts:7–12 | Expliciete DELETE-bevestiging en huidige gebruiker | Deze functie verwijdert alleen User; bewijst geen opschoning van NetworkAccount/Profile, wallets, sessies, media of Contacts. Afzonderlijk export-/bewaar-/verwijderbeleid nodig. |
| Shell / navigatie | NetworkShell.jsx; App.jsx:154–168,240–247 | Bestaande responsive shell; authroutes en aparte /pay en /contacts bestaan | Nog social-first routes/tabs. Alleen na goedkeuring ombouwen naar vier kernen; bestaande Pay/Contacts niet afhankelijk maken van Network-activatie. |

## 4. Blokkades en beslissingen

### B0-01 — Ondersteunde ledenauth: BLOKKEERT accountfuncties
De broncode levert geen wallet-native normale-ledenlogin. WALLET_AUTH_RESEARCH.md is eerder onderzoek en geen actuele provider-/platformbevestiging. Geen provider geselecteerd, geen tokens uitgeven als platformlogin, geen fictieve emails en geen Contacts-token promoveren naar algemene login. Apart compatibiliteitsbewijs nodig voordat implementatie start.

### B0-02 — Productie-exclusiviteit en intrekking: BLOKKEERT accountfuncties
Bewijs eenmalig challengeverbruik, gelijktijdige registratie/binding, stabiele accountmapping, herstel en per-wallet-/sessie-intrekking. Het begrensde developmentregister niet als schaalbare productieoplossing aftekenen. Technisch bewijs kan niet alleen uit UI-tests komen.

### B0-03 — Directory en publieke meldroute: BLOKKEERT nieuwe Discover-release
Definieer minimale projectrecord, admin-only publicatie, publieke veilige projectie, statuswijziging/intrekking en een profiel-/projectmelding met afhandeling. In eerste instantie hoeft geen publieke submissionflow te bestaan: beheerder voert records in. Officiële verificatie loshouden van vermelding, eigendom en X-link.

### B0-04 — Contacts versus actuele handle-eigenaar: BESLISSING vóór integratie
Bestaand adresboek beschermt de opgeslagen relatie door wallet vast te zetten. MVP-tekst over 'actuele ontvanger' mag dit niet stilzwijgend veranderen. Voorstel: vanuit Contacts de opgeslagen wallet behouden met duidelijke transferwaarschuwing; vanuit een actueel geverifieerd handleprofiel naar de actuele owner. Geen nieuwe betaalcode voordat dit expliciet is goedgekeurd.

### B0-05 — Publicatie, privacy en verwijdering: BLOKKEERT ledenpublicatie
Expliciete profielpublicatie en intrekking, beperkte openbare velden, sessielevenscyclus, media-/gegevensverwijdering en operationeel meldbeleid vastleggen. User.delete alleen is geen bewezen complete verwijderroute. Juridische beoordeling blijft extern en open.

### B0-06 — MVP-oppervlak en handlemapping: BLOKKEERT coherente MVP-vrijgave
Herstel :handle-resolutie pas in goedgekeurde implementatiefase. Verwijder niet de sociale code; bepaal welke sociale navigatie en lees-/schrijfingangen voor publiek gesloten moeten zijn. Een verborgen menu is geen autorisatie.

### B0-07 — Testbewijs: BLOKKEERT vrijgave
Geen PASS-resultaten van runtimeflows in deze inventaris. Alle scenario's uit IDENTITY_HUB_PHASE_0_ACCEPTANCE.md staan NOT RUN. Uitval-, replay-, concurrency- en cross-accounttests vereisen afzonderlijk technisch bewijs; flowtests via de Testing Agent.

## 5. Minimale implementatievolgorde na goedkeuring

1. Beoordeel deze inventaris, Contacts-betaalsemantiek en beperkte publieke scope.
2. Werk admin-beheerde projectvermelding en publieke profiel-/projectmeldingen uit; hergebruik veilige presentaties, niet de integratiecatalogus als verificatiebron.
3. Onderzoek ondersteunde walletlogin en sluit B0-01/B0-02 met bewijs; parallel aan beperkte publieke discovery mogelijk. Geen accountmutaties activeren zolang dit niet lukt.
4. Maak gewone ledenrechten, publicatie en bindings-/transfergedrag bruikbaar. Hergebruik resolver en ondertekende profielwijzigingen; geen globale RLS-versoepeling.
5. Integreer bestaande privécontacts zonder automatische follow-/accountmigratie.
6. Verbind bestaande Pay met profiel/contact/dashboard; behoud standalone routes en expliciete review.
7. Vereenvoudig shell/navigatie naar Identity, Discover, Contacts en Pay; minting blijft centraal.
8. Voer gecontroleerde bèta uit; verzamel bewijs en beslis per functie, niet één algemene 'gereed'-status.

Voor publieke directory geldt geen afhankelijkheid van algemene walletlogin zolang alleen beheerders publiceren. Voor normale ledenprofielen geldt die afhankelijkheid wel. Bestaande standalone diensten blijven ongemoeid.

## 6. Vrijgave en verantwoordelijkheden

| Poort | Vereist bewijs | Huidige stand |
|---|---|---|
| G0 Inventaris beoordeeld | Productbesluiten, eigenaren, prioriteit en scope akkoord | OPEN |
| G1 Publieke Identity/Discover | Veilige publicatieprojecties, geen reviewbypass, accurate claims, werkende meldafhandeling | OPEN |
| G2 Gewone leden | Ondersteunde walletauth, negatieve autorisatietests, sessie-intrekking en concurrencybewijs | GEBLOKKEERD |
| G3 Profiel/Contacts/transfer | A→B zonder account-/privédataoverdracht, contactprivacy, publicatie-intrekking | OPEN |
| G4 Pay-integratie | Correcte ontvanger per context, gewijzigde ontvanger opnieuw review, walletsigneeractie | OPEN |
| G5 Beperkte bèta | Desktop/mobiel, feitelijke resultaten, bekende issues en beheerverantwoordelijkheid | OPEN |

Product/scope: eigenaar nog te bevestigen. Technische uitvoering: ontwikkelaar; onafhankelijke securityreview nog te regelen. Meldingen/support: beheerder met bereikbaarheid en triagebeleid nog te bepalen. Privacy/juridische beoordeling: nog te regelen. Geen publieke vrijgave zonder duidelijk eigenaarschap van incidenten, meldingen en onderhoud.

## 7. Vervolg

Bij de oorspronkelijke inventaris is geen productiegedrag gewijzigd. De inventaris is beschikbaar; fase 0 als volledige bewijs- en goedkeuringsfase is nog niet afgesloten.

## 8. Eerste implementatie na verzoek eigenaar — 25 oktober 2026

De eigenaar vroeg de aanbevolen beslissingen toe te passen waar nodig. Dit is een beperkte veiligheids- en routeverbetering, geen volledige implementatie of publieke vrijgave van de Hub.

Toegepast:
- B0-04: bestaande vaste contactwallet behouden. Als de servervoorbereiding meldt dat de handleowner afwijkt, vraagt de betaalreview nu expliciet bevestiging dat de opgeslagen wallet bedoeld wordt. Dit geldt voor SOL en de bestaande tokenbetaalreviews; normale betalingen krijgen geen extra checkbox. De bevestiging geldt uitsluitend voor het getoonde reviewobject en vervalt bij een nieuwe review.
- SOL vergelijkt bij de verse voorbereiding nu ook savedContact en handleChanged met de gereviewde status. Een statuswijziging stopt vóór walletsigning en toont de bijgewerkte review, zelfs als de vastgepinde wallet gelijk blijft. De tokenflow had deze vergelijking al.
- B0-06 gedeeltelijk: /network/:handle opent nu een live geverifieerde handle-NFT-identiteit via de bestaande identitylookup, niet een profielquery met ontbrekend publicId. /network/account/:publicId blijft de vaste profielroute. Er wordt geen fictieve handle-accountmapping toegevoegd. Onzekerheid, fout en ongeldig formaat hebben expliciete weergaven. Dit maakt de handle-identiteitsroute bruikbaar maar realiseert nog geen productie-accountbinding.

Bewust niet gewijzigd:
- Geen loginprovider, algemene walletsessie, permissieversoepeling of productieledenactivatie.
- Geen automatische Official Project-badge op basis van NFT-, domein- of sociallinkbewijs.
- Geen sociale code/navigatie of publieke leesroutes verwijderd en geen data gemigreerd.
- Geen betaalbestemming of gesigneerde transactiestructuur aangepast; de nieuwe checkbox is een gebruikersbevestiging, geen serverauthenticatie of atomische garantie tegen on-chain races.

Volgende afzonderlijke werkpakketten: admin-beheerde projectdirectory met publieke meldafhandeling; ondersteunde ledenauth met concurrency-/intrekkingsbewijs; privacy-/verwijderbeleid en MVP-navigatie. B0-01/B0-02/B0-03/B0-05 en alle vrijgavepoorten blijven open. Transfer- en betaaldemonstraties moeten nog feitelijk worden uitgevoerd; geen transactie verstuurd door deze wijziging.