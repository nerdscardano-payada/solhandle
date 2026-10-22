# SolHandle Network — intern fase 0-plan

**Werknaam:** SolHandle Network  
**Positionering:** Your @. Your identity. Your network.  
**Documentdatum:** 22 oktober 2026  
**Status:** CONCEPT — interne voorbereiding, niet vrijgegeven  
**Productverantwoordelijke:** nog aan te wijzen  
**Technisch verantwoordelijke:** nog aan te wijzen  
**Privacy/juridisch beoordelaar:** nog aan te wijzen  
**Securitybeoordelaar:** nog aan te wijzen

> Dit document is een interne checklist, geen publieke roadmapbelofte, juridisch advies of bewijs van compliance. Het aanmaken van dit document implementeert geen Network-functionaliteit en verleent geen goedkeuring voor ontwikkeling, alpha-toegang of publieke lancering. Alle werkpakketten staan open; eerdere gesprekken gelden als voorstellen, niet als afgetekende besluiten.

## 1. Doel en werkwijze

Fase 0 levert een goedgekeurd bouwdossier en, na afzonderlijke toestemming, een afgeschermde technische fundering op. Eerst identiteit, eigendom, privacy en moderatie; daarna pas de sociale feed in fase 1.

**Kernregel:** een SolHandle is overdraagbaar bezit. Het sociale account, privégegevens, volgers, historie en bevoegdheden worden niet automatisch mee overgedragen.

**Afvinken:** zet een vakje uitsluitend op voltooid wanneer de genoemde oplevering beschikbaar is, de acceptatie aantoonbaar slaagt en de aangewezen verantwoordelijke heeft goedgekeurd. Een ontwerp, implementatie en geverifieerde werking zijn afzonderlijke resultaten. Geen deadline of gereedheidspercentage wordt uit het aantal vakjes afgeleid.

Voor ieder werkpakket vastleggen:
- verantwoordelijke en beoordelaar;
- status: OPEN / IN UITWERKING / GEBLOKKEERD / TER BEOORDELING / GOEDGEKEURD;
- koppeling naar bewijs of besluit;
- open bevindingen en afhankelijkheden;
- goedkeuringsdatum en documentversie.

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
**Oplevering:** goedgekeurd besluitdocument met scenario's en expliciete uitzonderingen.

- [ ] Bevestig een blijvende accountidentiteit, onafhankelijk van walletadres en handle.
- [ ] Bevestig dat actuele handlebinding én toegestaan account nodig zijn voor actief deelnemen.
- [ ] Bevestig dat publiek lezen zonder handle mogelijk blijft.
- [ ] Bevestig dat minten geen stilzwijgende sociale account- of profielaanmaak veroorzaakt.
- [ ] Beslis voor v1: één actieve publieke hoofdidentiteit per account; meerdere handles creëren niet automatisch extra accounts of rechten.
- [ ] Definieer gedrag bij verkoop, burn, walletontkoppeling, walletverlies, schorsing en accountverwijdering.
- [ ] Behoud export, verwijdering, sessie-intrekking, bezwaar en koppeling van een nieuwe eigen handle voor accounts zonder actieve handle.
- [ ] Leg vast dat followers het account volgen, niet de NFT.
- [ ] Leg vast dat handlebezit geen bewijs van unieke persoon, betrouwbaarheid of projectverificatie is.
- [ ] Beoordeel het voorgestelde 18+-beleid en passende leeftijdsmaatregelen; een checkbox geldt niet automatisch als voldoende waarborg.
- [ ] Bevestig basisgebruik zonder verplichte $HANDLE-balans.
- [ ] Definieer badgebetekenissen zonder investerings-, veiligheids- of betrouwbaarheidsclaim.
- [ ] Leg vast dat Pay de bestaande ontvangerreview gebruikt; Network introduceert geen custody of signing namens gebruikers.

**Acceptatie**
- [ ] Alle bovengenoemde scenario's hebben een ondubbelzinnig verwacht resultaat en een verantwoordelijke heeft dit goedgekeurd.

## 4. WP-B — Authenticatie, walletbewijs en handlebindings

**Voorgestelde eigenaar:** technisch verantwoordelijke, met securityreview.  
**Afhankelijkheden:** WP-A.  
**Oplevering:** architectuurbesluit, toestandsmodel, autorisatiecontract en na toestemming een afgeschermd prototype.

### Account- en sessiebasis
- [ ] Inspecteer de bestaande account-, login- en sessievoorzieningen voordat hergebruik wordt besloten.
- [ ] Behoud platformauthenticatie als accountbasis; bouw geen parallelle eigen account-/sessiebackend.
- [ ] Behandel walletbewijs als aparte autorisatiecontrole, niet als toestemming voor transacties.
- [ ] Documenteer apart of en hoe wallet-first onboarding ondersteund kan worden; beloof geen wachtwoordloze accountflow zonder bewezen ondersteuning.
- [ ] Bepaal een ondersteunde aanpak voor sessiebeveiliging, rotatie, intrekking, CSRF en domeinbinding; toets noodzakelijke hostingvoorwaarden.
- [ ] Stel passkeys uit tenzij ondersteund en apart goedgekeurd; passkeys bewijzen nooit actueel handlebezit.

### Walletbewijs
- [ ] Gebruik een eenmalige serverchallenge met wallet, domein, doel, uitgifte- en vervaltijd.
- [ ] Verifieer handtekening en challenge-context server-side.
- [ ] Borg racebestendig eenmalig verbruik van challenges; een read-then-writecontrole alleen is onvoldoende.
- [ ] Weiger verlopen, hergebruikte, verkeerde-wallet-, verkeerde-domein- en verkeerde-doelbewijzen.
- [ ] Definieer herverificatie voor wallet toevoegen, ontkoppelen en gevoelige accountwijzigingen.
- [ ] Voeg accounts nooit automatisch samen op basis van een gekoppelde wallet.

### Handlebinding
- [ ] Verifieer officiële asset/collectie en actueel keteneigendom; een UI- of databaseclaim is geen bewijs.
- [ ] Definieer PENDING, ACTIVE, OWNERSHIP_UNCERTAIN en ENDED, inclusief toegestane overgangen.
- [ ] Leg account, asset, naam, wallet, begin/einde, laatste controle en beëindigingsreden vast.
- [ ] Ontwerp racebestendige exclusiviteit voor maximaal één actieve binding per handle-asset; verifieer de benodigde opslaggaranties vóór implementatie.
- [ ] Controleer eigendom server-side bij koppelen en identiteitsgevoelige schrijfacties; achtergrondwatchers zijn aanvullend.
- [ ] Leg freshness, commitmentniveau, finaliteit en resterende race-/RPC-risico's vast; claim geen absolute onmiddellijke detectie.
- [ ] Blokkeer bij onzekere eigendom nieuwe acties namens de handle, zonder een netwerkstoring als definitieve eigendomsoverdracht te behandelen.
- [ ] Laat bestaande sessies, geplande acties en toekomstige API-toegang de controle niet omzeilen.
- [ ] Maak na terugkoop een nieuwe binding; heractiveer geen oude periode.
- [ ] Trek alleen handlegebonden publicatierechten in; draag geen account, projectrollen of privégegevens over.

### Historische afzender
- [ ] Bewaar een stabiele accountverwijzing, binding en handlevermelding op het moment van publiceren.
- [ ] Ontwerp historische profielverwijzingen los van de huidige eigenaar van dezelfde naam.
- [ ] Specificeer gedrag van oude mentions, notificaties, shares en Pay-knoppen na overdracht.
- [ ] Voorkom dat oude posts of betaalverwijzingen impliciet als content of bestemming van de nieuwe eigenaar worden gepresenteerd.

**Acceptatie**
- [ ] Transfer, terugkoop, gelijktijdige claim, RPC-onzekerheid, walletwissel en challenge-replay hebben aantoonbare uitkomsten.
- [ ] De nieuwe handle-eigenaar kan geen oude accountgegevens lezen of aanpassen.
- [ ] De oude eigenaar kan na bevestigde intrekking niet via een oude sessie namens de verkochte handle handelen.

## 5. WP-C — Gegevensmodel en toegangsrechten

**Voorgestelde eigenaar:** technisch verantwoordelijke, met privacyreview.  
**Afhankelijkheden:** WP-A en WP-B.  
**Oplevering:** gegevenswoordenboek en rechtenmatrix voor iedere bewerking.

- [ ] Ontwerp alleen noodzakelijke fase 0-records; bouw de volledige toekomstige sociale database niet vooruit.
- [ ] Gebruik de ingebouwde accountidentiteit; maak geen concurrerende User-entiteit.
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
| [ ] | Geldig, eenmalig walletbewijs | Alleen bedoelde koppeling wordt toegestaan | Nog vast te leggen |
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
| D-01 | V1-account en aantal publieke identiteiten | OPEN | Nog aan te wijzen | Nog vast te leggen | — |
| D-02 | Ondersteunde account-/wallet-onboarding | OPEN | Nog aan te wijzen | Nog vast te leggen | — |
| D-03 | Exclusiviteit, freshness en transferfinaliteit | OPEN | Nog aan te wijzen | Nog vast te leggen | — |
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