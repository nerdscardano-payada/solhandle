# SolHandle Network — intern fase 0-plan

**Werknaam:** SolHandle Network  
**Positionering:** Your @. Your identity. Your network.  
**Documentdatum:** 22 oktober 2026  
**Status:** CONCEPT — interne voorbereiding, niet vrijgegeven  
**Productverantwoordelijke:** nog aan te wijzen  
**Technisch verantwoordelijke:** nog aan te wijzen  
**Privacy/juridisch beoordelaar:** nog aan te wijzen  
**Securitybeoordelaar:** nog aan te wijzen

> Dit document is een interne checklist, geen publieke roadmapbelofte, juridisch advies of bewijs van compliance. Het aanmaken van dit document implementeert geen Network-functionaliteit en verleent geen goedkeuring voor ontwikkeling, alpha-toegang of publieke lancering. Werkpakketten zijn niet technisch afgetekend. WP-A heeft productbaseline v1.1 voor het walletgebonden profielmodel; WP-B heeft technisch ontwerp v0.2 met expliciete implementatieblokkers, waaronder de nog aan te tonen ondersteunde wallet-authenticatie-integratie. Uitvoering, beoordeling en acceptatie blijven open. Eerdere gesprekken buiten expliciet vastgestelde productregels gelden als voorstellen.

## 1. Doel en werkwijze

Fase 0 levert een goedgekeurd bouwdossier en, na afzonderlijke toestemming, een afgeschermde technische fundering op. Eerst identiteit, eigendom, privacy en moderatie; daarna pas de sociale feed in fase 1.

**Kernmodel:** vaste profiel-ID → bewezen beheerwallet(s) → eigen officiële handle uit een gekoppelde wallet → publieke @name. Registratie en terugkerende login zijn wallet-native, zonder verplichte email/wachtwoord/Google-login; alleen verbinden is onvoldoende. Een SolHandle is overdraagbaar bezit, maar profiel, privégegevens, volgers, historie en loginbevoegdheden worden niet met de NFT overgedragen. De ondersteunde authenticatie-/sessie-integratie moet nog worden aangetoond; geen eigen loginbackend als omweg.

**Afvinken:** zet een vakje uitsluitend op voltooid wanneer de genoemde oplevering beschikbaar is, de acceptatie aantoonbaar slaagt en de aangewezen verantwoordelijke heeft goedgekeurd. Een ontwerp, implementatie en geverifieerde werking zijn afzonderlijke resultaten. Geen deadline of gereedheidspercentage wordt uit het aantal vakjes afgeleid.

Voor ieder werkpakket vastleggen:
- verantwoordelijke en beoordelaar;
- status: OPEN / IN UITWERKING / GEBLOKKEERD / TER BEOORDELING / GOEDGEKEURD;
- koppeling naar bewijs of besluit;
- open bevindingen en afhankelijkheden;
- goedkeuringsdatum en documentversie.

## Language baseline

- English is the primary language for the design preview and the planned mainnet experience.
- The design preview uses English copy throughout, including navigation, examples, dialogs, validation and accessibility labels.
- Translating the final experience into every language offered by SolHandle remains a separate future task. English is the source and fallback language.
- This preview-only change does not alter the current production language settings or existing translations.

## 2. Scope en grenzen

### Binnen fase 0
- Account-/walletkoppeling en handlebindings.
- Rechtenmatrix, dreigingsmodel en beveiligingsontwerp.
- Privacydatakaart, export, verwijdering en bewaarbeleid.
- Meldingen, moderatie, bezwaar en beheercontrole.
- Basismisbruikbescherming en veilige linkafhandeling.
- Ontwerp van toekomstige functietoegang, zonder commerciële activering.
- Juridisch beoordelingsdossier en vrijgavecriteria.

### Niet toegestaan door dit document
- Een publieke feed, posts, replies, likes, follows of DMs activeren.
- Advertenties, trending, Pro-verkoop of tokenvoorwaarden lanceren.
- Een eigen wallet ontwikkelen of private keys/recovery phrases verwerken.
- Het on-chain protocol, de collectie of eigendomsrechten veranderen.
- Homepage, bestaande mobiele navigatie of publieke roadmap vervangen.
- Minting, resolution, Pay, contacten of bestaande accounts wijzigen zonder aparte scope en regressiebeoordeling.
- Share & Earn, de native handelsdienst of publieke Embed-diensten heractiveren.

**Ontwikkelomgeving:** eerst bepalen hoe werk werkelijk afgeschermd wordt. Alleen een verborgen link of client-side featureflag is geen toegangsbeveiliging.

## 3. WP-A — Productregels en accountlevenscyclus

**Voorgestelde eigenaar:** productverantwoordelijke.  
**Afhankelijkheden:** geen.  
**Productbaseline:** [Definitieve productregels v1.1](./PRODUCT_RULES.md), vastgesteld op verzoek van de producteigenaar op 22 oktober 2026.  
**Status:** productregels vastgelegd; technische acceptatie, formele beoordeling en vrijgave staan open.

- [x] Leg een vaste profiel-ID vast met walletgebonden beheer en wallet-native registratie/login; een andere wallet of @name verandert die ID niet (A-05 t/m A-09).
- [x] Definieer actieve deelname, publiek lezen en rechten zonder handle (A-17 t/m A-21).
- [x] Sluit stilzwijgende profielaanmaak door minting, Pay of walletverbinding uit (A-03, A-07).
- [x] Beslis één profiel en één actieve hoofdhandle per account in v1; extra handles geven geen extra accounts of rechten (A-08, A-12 t/m A-15).
- [x] Definieer walletkoppeling, conflict, walletverlies en herstel zonder automatische accountovername (A-10 t/m A-12, A-36 t/m A-39).
- [x] Leg verkoop, burn, terugkoop, onzekere eigendom en schorsing vast (A-21 t/m A-30).
- [x] Leg vast dat account, volgers, historie, privégegevens en projectrechten niet met de NFT meegaan (A-22 t/m A-28).
- [x] Definieer historische afzenders, mentions en veilige betaalcontext (A-31 t/m A-35).
- [x] Onderscheid ownership, unieke persoon, vertrouwen en badges (A-16, A-47).
- [x] Stel 18+ vast als productregel zonder standaard verzameling van identiteitsdocumenten (A-43, A-44).
- [ ] Laat passende leeftijdsmaatregelen en toepasselijke verplichtingen beoordelen vóór alpha-toelating (WP-H).
- [x] Bevestig basisgebruik zonder $HANDLE-balans en zonder betaalde verificatie of bereikvoordeel (A-45 t/m A-47).
- [x] Houd profielverwijdering los van bredere accountverwijdering en NFT-/Pay-functionaliteit (A-40 t/m A-42).
- [x] Specificeer scenario's en verwachte uitkomsten in productacceptatie P-A01 t/m P-A22.
- [ ] Wijs verantwoordelijken en beoordelaars formeel toe en leg hun review vast.

**Acceptatie, nog niet uitgevoerd**
- [ ] WP-B t/m WP-H bevestigen uitvoerbaarheid en leggen eventuele conflicten expliciet voor; geen stille afwijkingen van de baseline.
- [ ] P-A01 t/m P-A22 slagen tegen de relevante implementatie en hebben bewijsreferenties.
- [ ] Productverantwoordelijke en aangewezen beoordelaars tekenen de faseovergang expliciet af.

## 4. WP-B — Authenticatie, walletbewijs en handlebindings

**Voorgestelde eigenaar:** technisch verantwoordelijke, met securityreview.  
**Afhankelijkheden:** WP-A.  
**Technisch ontwerp:** [Walletgebonden profiel, walletbewijs en handlebindings v0.2](./ACCOUNT_OWNERSHIP_DESIGN.md), gebaseerd op productregels v1.1.  
**Status:** ontwerp uitgewerkt en bestaande bronnen geïnspecteerd; niet geïmplementeerd, getest of vrijgegeven.

### Uitgewerkt en vastgelegd
- [x] Inspecteer bestaande platformauth, login/registratie, routes en walletguard; leg hergebruik en beperkingen vast.
- [x] Leg wallet verbinden → gericht registratie-/loginbewijs → expliciete profielregistratie bij eerste gebruik → eigen hoofdhandle vast als gewenste v1-richting; geen verplichte traditionele login en geen zelfgebouwde loginbackend.
- [x] Maak onderscheid tussen login met een bestaande beheerwallet en een handletransfer die nooit het verkopersprofiel overdraagt.
- [x] Specificeer account-/doel-/domeingebonden proofs, vijf minuten challengegeldigheid, berichtcontext en eenmalig transactioneel verbruik.
- [x] Leg exclusiviteitsinvarianten voor profiel, wallet en hoofdhandle plus idempotentie en crashherstel vast.
- [x] Scheid veilige directe chainvalidatie van index-/cached-ownerhelpers; beschrijf officiële asset-/collectie-/PDA-controles.
- [x] Werk PENDING, ACTIVE, OWNERSHIP_UNCERTAIN en ENDED uit, met generaties, swaps en nieuwe periodes na terugkoop.
- [x] Specificeer confirmed/finalized-controles, contextslots, freshness en beperkingen van een niet-atomaire chain-/databasegrens.
- [x] Ontwerp Network-autorisatie-intrekking zonder te claimen dat alle platformtokens worden ingetrokken.
- [x] Definieer herstel zonder accountovername op basis van handlebezit en scheid historische afzender-/Pay-context van actuele lookups.
- [x] Stel operatiecontracten, bewijseisen en open acceptatiescenario's B-T01 t/m B-T23 op.
- [x] Werk de [sessiekoppeling met de bestaande walletverbinding](./WALLET_SESSION_BRIDGE.md) uit: geselecteerde adapter hergebruiken, serververtrouwde mapping, callback-/walletwissels en logout/intrekking scheiden; bewijs SB-01 t/m SB-09 blijft open, geen runtimebouw.

### Verplicht vóór implementatie of vrijgave
- [ ] B-BLOCK-01: keur een aantoonbaar transactioneel register goed. Entity-check/create en upsert bieden volgens geraadpleegde documentatie geen gegarandeerde exclusiviteit; geen entity-only noodoplossing.
- [ ] B-BLOCK-02: toon een ondersteunde wallet-native authenticatie-/sessie-integratie aan, inclusief eerste registratie, terugkerende login, verse wallet-herauthenticatie en intrekking per beheerwallet; geen verplichte emailfallback, fictieve accounts of eigen loginbackend.
- [ ] B-BLOCK-03: keur finaliteits-/timingbeleid en resterende chain-/database-race expliciet goed.
- [ ] B-BLOCK-04: bevestig deploymentafscherming, origins, toegang/leeftijd, bewaring en verantwoordelijken met WP-C/D/F/H.
- [ ] Geef afzonderlijke toestemming voor het afgeschermde concurrency- en ownershipprototype.

**Acceptatie, nog niet uitgevoerd**
- [ ] B-T01 t/m B-T23 hebben geslaagd bewijs, inclusief parallelle claims, nonce-replay, crashes, transfer, oude sessies en uitval.
- [ ] Nieuwe eigenaren krijgen nooit historische privégegevens of het oude account.
- [ ] Eigendomsverlies en lokale intrekking blokkeren verdere acties volgens het goedgekeurde actualiteits-/finaliteitsbeleid; geen absolute onmiddellijke chainclaim.
- [ ] Technisch verantwoordelijke en securitybeoordelaar tekenen bewijs en resterende risico's expliciet af.

## 5. WP-C — Gegevensmodel en toegangsrechten

**Voorgestelde eigenaar:** technisch verantwoordelijke, met privacyreview.  
**Afhankelijkheden:** WP-A en WP-B.  
**Oplevering:** gegevenswoordenboek en rechtenmatrix voor iedere bewerking.

- [ ] Ontwerp alleen noodzakelijke fase 0-records; bouw de volledige toekomstige sociale database niet vooruit.
- [ ] Gebruik een vaste Network-profiel-ID en koppel alleen via de goedgekeurde wallet-authenticatie-integratie aan een servergeverifieerde subjectidentiteit; maak geen concurrerende User-entiteit, zelfbedachte loginsessie of fictief emailaccount.
- [ ] Scheid publieke profielprojecties van accountinstellingen, walletbewijzen en interne koppelingen.
- [ ] Maak volledige wallet-/accountbindings niet publiek leesbaar; bepaal minimaal benodigde openbare eigendomsinformatie.
- [ ] Specificeer lees-, maak-, wijzig- en verwijderrechten per gegevensgroep.
- [ ] Neem recordtoegangsregels én server-side autorisatie op; clientfilters zijn geen beveiliging.
- [ ] Beperk melding-/bezwaargegevens tot betrokkenen en bevoegde afhandeling, met bescherming van melderidentiteit.
- [ ] Definieer beheertoegang en verantwoordelijkheid; volledige administratieve toegang is een expliciet risico in de datakaart.
- [ ] Laat gebruikers geen eigen verificatie, risicoscore, moderatiestatus, projectrol of entitlement bepalen.
- [ ] Bind schorsingen aan het account, niet alleen aan een verwisselbare handle.
- [ ] Houd walletadressen, challenges, sessies, IP's en andere privégegevens uit publieke responses, URL's en analytics-events.
- [ ] Documenteer dat logs, notificaties en realtimekanalen dezelfde privacygrenzen volgen.
- [ ] Schrijf geen sociale inhoud, persoonsgegevens of moderatiestatus naar de blockchain.

**Acceptatie**
- [ ] Anonieme bezoeker, account A, account B en beheer hebben aantoonbaar uitsluitend de bedoelde toegang.
- [ ] Iedere openbaar leesbare gegevensgroep bevat uitsluitend bewust gepubliceerde velden.

## 6. WP-D — Privacy, export, verwijdering en bewaring

**Voorgestelde eigenaar:** privacyverantwoordelijke met technische uitvoering en juridisch oordeel.  
**Afhankelijkheden:** WP-A t/m WP-C.  
**Oplevering:** datakaart, DPIA-concept, bewaarmatrix en uitvoerbare rechtenprocessen.

- [ ] Leg per verwerking doel, noodzaak, voorgestelde rechtsgrond, ontvangers en betrokkenen vast.
- [ ] Beoordeel bijzondere persoonsgegevens in vrijwillig geplaatste content en bijbehorende risico's.
- [ ] Inventariseer leveranciers, opslaglocaties, verwerkersafspraken, subverwerkers en internationale doorgiften.
- [ ] Stel een DPIA op; laat formele verplichting en resterende risico's beoordelen.
- [ ] Stel concrete bewaartermijnen en wisacties vast voor challenges, securitylogs, moderatie, privacyverzoeken, consent, media en back-ups.
- [ ] Documenteer noodzakelijkheid en belangenafweging waar gerechtvaardigd belang wordt voorgesteld.
- [ ] Definieer account- en inhoudsexport zonder gegevens van andere accounts mee te leveren.
- [ ] Definieer verwijdering van profiel, content, media, notificaties, zoekindexen en caches.
- [ ] Beschrijf back-upverval en voorkomen van herintroductie na herstel.
- [ ] Verberg bij geaccepteerde verwijdering het profiel en trek normale sessies in.
- [ ] Behoud een beperkte, passende manier om het verzoek te bevestigen en af te handelen; laat intrekking van login de rechtenafhandeling niet blokkeren.
- [ ] Bewaar uitzonderingen voor fraude/moderatie alleen met vastgelegd doel, grondslag, minimale inhoud en einddatum.
- [ ] Maak duidelijk dat verwijdering geen NFT of openbare blockchainhistorie verwijdert.
- [ ] Voorkom automatische verwijdering van het bredere SolHandle-account wanneer alleen het Network-profiel wordt verwijderd.
- [ ] Inventariseer cookies, lokale opslag, SDK-analytics en externe trackers; laat niet-noodzakelijke tracking pas na geldige toestemming starten.
- [ ] Ontwerp gelijkwaardige optionele acceptatie/weigering en eenvoudige intrekking, zonder gevolgen voor noodzakelijke accountfuncties.

**Acceptatie**
- [ ] Export en verwijdering werken ook zonder actieve handle.
- [ ] Bewaartermijnen zijn ingevuld, goedgekeurd en technisch uitvoerbaar; geen open einde zonder gemotiveerde uitzondering.
- [ ] Een verwijderverzoek laat bestaande NFT-eigendom, Pay en overige diensten ongemoeid volgens de gekozen accountscope.

## 7. WP-E — Moderatie, meldingen en bezwaar

**Voorgestelde eigenaar:** product-/safetyverantwoordelijke met juridische beoordeling.  
**Afhankelijkheden:** WP-A, WP-C en WP-D.  
**Oplevering:** Community Guidelines, moderatiehandboek en procedures die vanaf alpha uitvoerbaar zijn.

- [ ] Maak onderscheid tussen melding van illegale inhoud en overtreding van huisregels.
- [ ] Ontwerp een bruikbaar meldingskanaal voor illegale inhoud, ook voor bezoekers zonder handle/account.
- [ ] Definieer categorieën, noodzakelijke meldingsvelden, ontvangstbevestiging en opvolging.
- [ ] Leg een proces vast voor urgente dreigingen, phishing en verzoeken van bevoegde autoriteiten.
- [ ] Definieer NO_ACTION, WARNING, LABEL, LINK_BLOCK, VISIBILITY_LIMIT, POST_REMOVE, TEMP_SUSPEND en PERMANENT_SUSPEND.
- [ ] Registreer reden, wettelijke/beleidsbasis, bereik, duur, actor, tijdstip en automatisch/menselijk karakter per besluit.
- [ ] Ontwerp begrijpelijke motiveringen en veilige notificatie aan betrokkenen.
- [ ] Maak bezwaar mogelijk zonder actieve handle en wijs herbeoordelingsverantwoordelijkheid toe.
- [ ] Leg vast hoe onterechte beperkingen worden teruggedraaid en betrokkenen worden geïnformeerd.
- [ ] Neem block en mute op in de alpha-acceptatie; specificeer gevolgen voor interacties en zichtbaarheid.
- [ ] Bescherm meldersgegevens tegen de gemelde partij en publieke blootstelling.
- [ ] Definieer controleerbare beheerlogs met vastgestelde bewaring, geen onbeperkte opslagclaim.
- [ ] Bepaal publicatie van contactpunten, toepasselijke transparantierapportage en eventuele wettelijke uitzonderingen.

**Acceptatie**
- [ ] Een melding kan van ontvangst tot besluit, motivering, bezwaar en herstel worden doorlopen.
- [ ] Iedere maatregel is achteraf te verklaren; een losse deleted-vlag geldt niet als dossier.

## 8. WP-F — Dreigingsmodel en misbruikbescherming

**Voorgestelde eigenaar:** securityverantwoordelijke met technische uitvoering.  
**Afhankelijkheden:** WP-B t/m WP-E.  
**Oplevering:** dreigingsmodel, basismaatregelen, incidentprocedure en aantoonbare controles.

- [ ] Modelleer accountovername, signature-replay, overdrachtsraces, ongeoorloofde toegang, phishing en beheermisbruik.
- [ ] Beoordeel uitdagingen en herstel bij walletverlies; een nieuw eigenaarbewijs is nooit herstelbewijs voor het oude account.
- [ ] Definieer server-side rate limits en oplopende challenges voor onboarding, schrijven, volgen, melden en gevoelige wijzigingen.
- [ ] Behandel wallet-/accountleeftijd en gedeelde IP's als onzekere signalen, niet als schuld of bewezen sybilcluster.
- [ ] Vermijd permanente devicefingerprinting in v1; beoordeel ook de privacy van CAPTCHA- en dreigingsleveranciers.
- [ ] Leg challenge, tijdelijke beperking, menselijke review en herstel vast; geen automatische permanente ban op één risicosignaal.
- [ ] Normaliseer links voor controle zonder het oorspronkelijke doel misleidend te vervangen.
- [ ] Ontwerp blokkering van bekende phishing en waarschuwing voor onbekende/verdachte links; een trusted-label garandeert geen veiligheid.
- [ ] Voorkom dat toekomstige linkpreviews/scanners interne adressen of willekeurige serverbestemmingen kunnen benaderen.
- [ ] Toets ondersteunde browser-/hostingbeveiliging en scheid noodzakelijke configuratie van applicatielogica.
- [ ] Stel een incidentrunbook op voor accountovername, datalek, massaphishing en ownership-checkuitval.
- [ ] Bepaal hoe nieuwe Network-schrijfacties afzonderlijk uitgeschakeld kunnen worden zonder minting of Pay stil te leggen.
- [ ] Houd media uit de eerste tekstalpha; leg vóór latere media-activatie quarantaine, validatie, hercodering, metadatawissing, scanning en verwijdering vast.

**Acceptatie**
- [ ] Misbruik leidt tot begrensde, uitlegbare maatregelen met herstelpad.
- [ ] Kritieke bevindingen zijn opgelost; overige risico's hebben een expliciete beslissing van een bevoegde beoordelaar.

## 9. WP-G — Toekomstige $HANDLE-toegangsrechten

**Voorgestelde eigenaar:** productverantwoordelijke, met technische en juridische review.  
**Afhankelijkheden:** WP-A, WP-C en WP-D.  
**Oplevering:** ontwerp en juridische beslisvragen; geen live entitlement-engine of tokenverkoop.

- [ ] Houd basisprofiel en normaal sociaal gebruik los van een $HANDLE-balansvereiste.
- [ ] Definieer per eventuele extra functie vereiste, geldigheidsduur, hercontrole, intrekking en regelversie.
- [ ] Onderscheid betaalde toegang voor een termijn van toegang op basis van actueel bezit.
- [ ] Gebruik alleen het officiële mintadres en geverifieerde tokenconfiguratie; vertrouw geen clientclaims.
- [ ] Definieer gedrag bij RPC-uitval en verouderde verificatie zonder dat dit stilzwijgend onvoldoende bezit betekent.
- [ ] Bewaar bij voorkeur het minimale toegangsresultaat en controletijdstip, niet permanent het exacte saldo.
- [ ] Beoordeel of een openbare Pro-badge bezit of financiële informatie kan onthullen; publiceer die niet zonder bewuste keuze.
- [ ] Geef tokenbezit geen hogere ranking, verificatie, beveiliging, moderatieprioriteit of herstelrechten.
- [ ] Laat wijzigingen in tokenutility, voorwaarden, marketing en bestaande documentatie juridisch beoordelen vóór activering.

**Acceptatie**
- [ ] De alpha heeft geen verplichte tokenvoorwaarde of impliciete toekomstige Pro-belofte.
- [ ] Commerciële activering blijft een afzonderlijke expliciete releasebeslissing.

## 10. WP-H — Juridisch dossier en governance

**Voorgestelde eigenaar:** productverantwoordelijke met Belgische/EU-juridische expertise.  
**Afhankelijkheden:** alle voorgaande ontwerpen.  
**Oplevering:** beoordelingsdossier, bijgewerkte besluiten en toepasselijke beleidsdocumenten.

- [ ] Wijs exploitant, productverantwoordelijke, privacycontact en moderatieverantwoordelijke aan.
- [ ] Laat DSA-classificatie, hosting-/platformverplichtingen, uitzonderingen en contactpunten beoordelen.
- [ ] Laat Terms, Privacy Policy, Community Guidelines, meldings- en bezwaarprocedure beoordelen.
- [ ] Laat leeftijdsbeleid, DPIA, rechtsgronden, bewaring en internationale doorgiften beoordelen.
- [ ] Beoordeel MiCA op de feitelijke dienstverlening, inclusief de huidige Pay-voorbereiding en broadcasting; non-custodial is geen automatische vrijstelling.
- [ ] Laat tokenkwalificatie en communicatie afzonderlijk beoordelen; productutility bewijst geen wettelijke vrijstelling.
- [ ] Houd wettelijke minimumverplichtingen, vrijwillige extra waarborgen en toekomstige functies apart in het besluitregister.
- [ ] Leg vast welke documenten vóór alpha aan deelnemers beschikbaar moeten zijn.
- [ ] Wijs een onafhankelijke securitybeoordelaar toe en bepaal diens scope.
- [ ] Definieer wie een alpha mag autoriseren, wie risico's mag accepteren en wie bij een incident kan stoppen.

**Acceptatie**
- [ ] Alle juridische vragen hebben een vastgelegd oordeel of een concrete blokkade; geen impliciete goedkeuring op basis van dit document.

## 11. Uitvoeringsvolgorde

1. Benoem verantwoordelijken en keur WP-A goed.
2. Werk WP-B en de privacydatakaart uit; onderzoek technische randvoorwaarden vóór toezeggingen.
3. Rond rechtenmatrix en dreigingsmodel af.
4. Keur scope en afscherming van eventuele prototypes afzonderlijk goed.
5. Realiseer en controleer uitsluitend de goedgekeurde fundering.
6. Maak privacy-, moderatie- en incidentprocessen uitvoerbaar.
7. Laat security en juridische inrichting beoordelen.
8. Beoordeel de faseovergang; een afgesloten fase 0 is geen publieke lanceringsgoedkeuring.

## 12. Acceptatiematrix

Deze checklist beschrijft nog uit te voeren controles; er is met dit document niets getest.

| Gereed | Scenario | Verwacht resultaat | Bewijsreferentie |
|---|---|---|---|
| [ ] | Eerste walletregistratie | Alleen na gericht bewijs en expliciete onboarding één eigen profiel, zonder verplichte traditionele registratie | Nog vast te leggen |
| [ ] | Terugkerende walletlogin | Geldig SIGN_IN-bewijs bereikt uitsluitend het profiel van de nog bevoegde beheerwallet | Nog vast te leggen |
| [ ] | Handlekeuze of NFT-transfer als loginpoging | Geen toegang tot het oude profiel of andere accountidentiteit | Nog vast te leggen |
| [ ] | Walletintrekking / laatste beheerwallet | Betrokken toegang ingetrokken; geen onbedoelde lock-out | Nog vast te leggen |
| [ ] | Geldig, eenmalig walletbewijs | Alleen het bedoelde doel wordt toegestaan; login-, registratie- en bindingsproofs zijn niet uitwisselbaar | Nog vast te leggen |
| [ ] | Hergebruik/verval/verkeerd domein of doel | Bewijs wordt geweigerd | Nog vast te leggen |
| [ ] | Twee gelijktijdige claims van dezelfde asset | Maximaal één actieve binding | Nog vast te leggen |
| [ ] | Overdracht A naar B | B krijgt geen account of privégegevens van A | Nog vast te leggen |
| [ ] | Oude sessie of geplande actie na intrekking | Geen nieuwe actie namens verkochte handle | Nog vast te leggen |
| [ ] | Verkoop en latere terugkoop | Nieuwe binding, historische periodes blijven gescheiden | Nog vast te leggen |
| [ ] | RPC-storing of onzekere finaliteit | Tijdelijk geen nieuwe handleactie; geen definitieve onterechte onteigening | Nog vast te leggen |
| [ ] | Historische afzender en profielverwijzing | Oude content wordt niet aan nieuwe eigenaar toegeschreven | Nog vast te leggen |
| [ ] | Oude betaalverwijzing na transfer | Actuele bestemming en historische context zijn niet misleidend | Nog vast te leggen |
| [ ] | Publiek en account B vragen privégegevens van A op | Geen ongeoorloofde toegang | Nog vast te leggen |
| [ ] | Zelf toegewezen verificatie/Pro/moderatiestatus | Wijziging wordt geweigerd | Nog vast te leggen |
| [ ] | Account zonder handle | Eigen export, verwijdering en bezwaar blijven bereikbaar | Nog vast te leggen |
| [ ] | Network-profiel verwijderen | Gekozen scope wordt gewist; NFT en onafhankelijke diensten blijven intact | Nog vast te leggen |
| [ ] | Verwijdering gevolgd door back-upherstel | Gewiste gegevens worden niet opnieuw actief gepubliceerd | Nog vast te leggen |
| [ ] | Melding zonder account | Illegale inhoud kan passend worden gemeld | Nog vast te leggen |
| [ ] | Maatregel en gegrond bezwaar | Motivering, herbeoordeling en herstel zijn traceerbaar | Nog vast te leggen |
| [ ] | Bekende phishinglink en herhaald misbruik | Begrensde blokkering/challenge met behandelpad | Nog vast te leggen |
| [ ] | Optionele tracking geweigerd | Geen optionele trackers; noodzakelijke dienst blijft bruikbaar | Nog vast te leggen |
| [ ] | Network noodstop | Network-schrijfacties stoppen zonder minting/Pay te pauzeren | Nog vast te leggen |
| [ ] | Bestaande SolHandle-functionaliteit | Afgesproken regressiecontroles tonen geen onbedoelde wijziging | Nog vast te leggen |

## 13. Vrijgavepoort

### Poort A — toestemming om gesloten alpha te bouwen
- [ ] Productregels, accountarchitectuur en privacygrenzen goedgekeurd.
- [ ] Technische beperkingen en risico's onderzocht, niet alleen verondersteld.
- [ ] Rechtenmatrix, dreigingsmodel en benodigde fase 0-prototypes beoordeeld.
- [ ] Privacy-, safety- en juridische bevindingen hebben expliciete besluiten.
- [ ] Alpha-scope, verantwoordelijken en afscherming afzonderlijk goedgekeurd.

### Poort B — later: toestemming om deelnemers toe te laten
Deze poort hoort bij de alpha-release en wordt niet afgetekend op basis van alleen ontwerpen of prototypes.
- [ ] Relevante acceptatiescenario's slagen tegen de daadwerkelijke alpha-implementatie.
- [ ] Ownershipisolatie, export/verwijdering, melden, block/mute, moderatie, bezwaar en basislink-/misbruikbescherming zijn bruikbaar.
- [ ] Deelnemersdocumentatie, leeftijdsaanpak en toestemming voor optionele tracking zijn gereed.
- [ ] Security- en juridische releasebevindingen zijn afgehandeld.
- [ ] Er is een bemande beheer-, incident- en herstelprocedure.
- [ ] Afzonderlijke expliciete toestemming voor de beperkte deelnemersgroep is geregistreerd.

**Niet vrijgeven bij:** ontbrekende eigendomsisolatie, lek van privégegevens, onbeveiligde afscherming, niet-werkende rechtenprocessen, onbeheersbare moderatie of een onopgeloste releaseblokker.

## 14. Besluit- en bevindingenregister

| ID | Onderwerp | Status | Verantwoordelijke | Besluit / bewijs | Datum |
|---|---|---|---|---|---|
| D-01 | Walletgebonden profiel en aantal publieke identiteiten | PRODUCTREGELS V1.1 VASTGELEGD; acceptatie open | Producteigenaar; reviewers nog aan te wijzen | [Productregels v1.1](./PRODUCT_RULES.md), A-05 t/m A-15; vervangt verplichte traditionele registratie | 22 oktober 2026 |
| D-02 | Wallet-native registratie/login | COMPATIBILITEITSCRITERIA UITGEWERKT; geen geselecteerde provider, uitvoering geblokkeerd | Nog aan te wijzen | [WP-B v0.2](./ACCOUNT_OWNERSHIP_DESIGN.md), B-BLOCK-02; [Wallet-authonderzoek v0.2](./WALLET_AUTH_RESEARCH.md); [verdieping](./WALLET_AUTH_COMPATIBILITY.md), email-loze identiteit en externe-walletlogin eerst | 22 oktober 2026 |
| D-03 | Exclusiviteit, freshness en transferfinaliteit | ONTWERP TER REVIEW; opslagkeuze blokkeert implementatie | Nog aan te wijzen | [WP-B v0.2](./ACCOUNT_OWNERSHIP_DESIGN.md), B-BLOCK-01/03 | 22 oktober 2026 |
| D-04 | Leeftijd en rechtsgronden | OPEN | Nog aan te wijzen | Nog vast te leggen | — |
| D-05 | Bewaartermijnen, export en verwijderingsscope | OPEN | Nog aan te wijzen | Nog vast te leggen | — |
| D-06 | Meldingen, bezwaar en moderatieverantwoordelijkheid | OPEN | Nog aan te wijzen | Nog vast te leggen | — |
| D-07 | MiCA/Pay en toekomstige tokenvoorwaarden | OPEN | Nog aan te wijzen | Nog vast te leggen | — |
| D-08 | Omgevingsafscherming en alpha-goedkeuring | OPEN | Nog aan te wijzen | Nog vast te leggen | — |

Nieuwe bevindingen krijgen een eigen ID, ernst, eigenaar, beoogde oplossing, bewijs en beslisser. Gesloten bevindingen blijven traceerbaar volgens het bewaarbeleid.

## 15. Referenties voor beoordeling

Controleer de actuele versie en toepasselijkheid bij de formele review; deze lijst is geen juridische conclusie.

- DSA: https://eur-lex.europa.eu/eli/reg/2022/2065
- DSA-uitleg Europese Commissie: https://digital-strategy.ec.europa.eu/en/faqs/digital-services-act-questions-and-answers
- MiCA-definities: https://www.esma.europa.eu/publications-and-data/interactive-single-rulebook/mica/article-3-definitions
- MiCA-marketing: https://www.esma.europa.eu/publications-and-data/interactive-single-rulebook/mica/article-7-marketing-communications
- EDPB blockchainrichtsnoeren: https://www.edpb.europa.eu/documents/guideline/guidelines-022025-on-processing-of-personal-data-through-blockchain_en
- EDPB privacy by design: https://www.edpb.europa.eu/topics/ai-and-technology/privacy-by-design-and-by-default_en
- Belgische GBA cookies en andere traceringsmiddelen: https://www.gegevensbeschermingsautoriteit.be/burger/thema-s/internet/cookies

## 16. Wijzigingshistorie

| Versie | Datum | Wijziging | Goedkeuring |
|---|---|---|---|
| 0.1 | 22 oktober 2026 | Eerste interne checklist op basis van het besproken fase 0-plan; geen functionaliteit, toegang of lancering geactiveerd | Nog niet goedgekeurd |
| 0.2 | 22 oktober 2026 | WP-A gekoppeld aan definitieve productregels v1.0; alleen aantoonbaar gedocumenteerde productkeuzes afgevinkt, technische acceptatie en reviews open | Productbaseline op verzoek producteigenaar; geen releasegoedkeuring |
| 0.3 | 22 oktober 2026 | WP-B uitgewerkt met broninspectie, proof-/ownershipcontracten, transactie- en herauthenticatieblokkers en open acceptatie | Ontwerp ter review; geen implementatie of vrijgave |
| 0.4 | 22 oktober 2026 | Productbaseline v1.1 en WP-B v0.2: walletgebonden profiel, wallet-native registratie/login, eigen @name, beheerwallet-/transferonderscheid en bijgewerkte acceptatie/blokkers | Productwijziging op verzoek; geen runtimewijziging, migratie of releasegoedkeuring |