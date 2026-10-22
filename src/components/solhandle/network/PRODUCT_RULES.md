# SolHandle Network — definitieve productregels

**Versie:** 1.0  
**Datum:** 22 oktober 2026  
**Onderdeel:** fase 0, werkpakket A  
**Status:** productbaseline voor v1, vastgesteld op verzoek van de producteigenaar  
**Gerelateerd:** [Intern fase 0-plan](./PHASE_0_PLAN.md)

> Dit document legt vast wat het product moet doen. Het verklaart niet dat dit al gebouwd, getest, juridisch goedgekeurd of vrijgegeven is. Technische aantoonbaarheid, passende leeftijdsmaatregelen, privacy-/juridische beoordeling en alpha-autorisatie blijven afzonderlijke fase 0-voorwaarden. Bij onuitvoerbaarheid wordt de betreffende functie geblokkeerd totdat een expliciet productbesluit deze baseline wijzigt; geen stille afwijking.

## 1. Product en afbakening

**A-01 — Identiteit als toegang tot sociale deelname.** SolHandle Network is de sociale laag rond SolHandle-identiteit. De blockchain bepaalt handlebezit; sociale accounts en inhoud blijven off-chain.

**A-02 — Zelfstandige productscope.** Network voegt geen custody, eigen wallet, native handelsdienst, Earn-programma of Embed-dienst toe. Een sociale accountactie is nooit toestemming voor een betaling of transactie.

**A-03 — Bestaande diensten blijven zelfstandig.** Minting, resolution, Pay en contacten worden niet afhankelijk gemaakt van een Network-profiel. Geen automatische migratie van bestaande gebruikers, contacten of walletactiviteiten naar Network.

**A-04 — Geen publiekslancering door dit besluit.** De eerste mogelijke release is een apart geautoriseerde gesloten tekstalpha. Feed, posts, interacties en eventuele commerciële functies worden niet door fase 0 geactiveerd.

## 2. Account is niet de handle

**A-05 — Blijvend account.** Een Network-account heeft een stabiele, niet van walletadres of handle afgeleide accountidentiteit. Posts, volgers, voorkeuren, moderatie en rechten horen bij dit account.

**A-06 — Bestaande accountbasis.** Network gebruikt de bestaande platformaccountbasis. Een bestaand account hoeft niet opnieuw te worden aangemaakt; een sociaal profiel ontstaat wel pas na expliciete Network-aanmelding. Er komt geen zelfgebouwde parallelle login- of sessiebackend.

**A-07 — Expliciete deelname.** Wallet verbinden, een handle minten, een betaling doen of de site bezoeken maakt geen sociaal profiel. Voor onboarding zijn de geldende Network-voorwaarden, leeftijdsverklaring en privacy-informatie nodig. Optionele trackingtoestemming staat hier los van.

**A-08 — Eén profiel per account in v1.** Ieder account kan maximaal één Network-profiel hebben. Een nieuwe wallet of extra handle maakt geen extra profiel, volgerbasis of rechten. Dit is geen claim dat één mens technisch maar één account kan bezitten; meerdere accounts worden niet via verplichte persoonsidentificatie uitgesloten.

**A-09 — Geen automatische samenvoeging.** Accounts worden niet samengevoegd op basis van dezelfde naam, wallet, apparaat, IP-adres of handlehistorie. Profieloverdracht of accountfusie is geen v1-functie.

## 3. Walletbewijs en publieke identiteit

**A-10 — Walletcontrole bewijzen.** Alleen een geldige, eenmalige, doel- en domeingebonden challenge kan walletcontrole voor een account aantonen. Een walletadres invullen of een verbonden wallet tonen is onvoldoende.

**A-11 — Eén accountkoppeling per wallet.** Een wallet kan in v1 aan maximaal één Network-account tegelijk gekoppeld zijn. Het opnieuw bewijzen van die wallet geeft geen toegang tot het gekoppelde account. Een bestaande koppeling verplaatsen vereist geauthenticeerde afhandeling van het oorspronkelijke account of een afzonderlijk beoordeeld herstelproces; bij conflict geen automatische verplaatsing of dataoverdracht.

**A-12 — Meerdere wallets, één identiteit.** Een account mag meerdere bewezen wallets koppelen om een andere eigen handle te kiezen of walletwissels veilig af te handelen. Publieke deelname gebruikt altijd één actieve hoofdhandle.

**A-13 — Eén actieve handlebinding.** Eén account heeft maximaal één actieve publieke hoofdhandle. Eén officiële handle-asset heeft maximaal één actieve accountbinding. Alleen actueel bewezen bezit in de officiële SolHandle-collectie komt in aanmerking; geen handmatige naamclaim of alternatieve collectie.

**A-14 — Andere eigen handles.** Extra handles mogen als keuze voor een toekomstige hoofdhandle worden aangeboden, maar worden in v1 niet automatisch openbare aliassen, afzonderlijke profielen, extra stemrechten of extra accounts. Publieke wallet- en bezitslijsten zijn niet onderdeel van v1.

**A-15 — Hoofdhandle wijzigen.** Hetzelfde geauthenticeerde account kan een andere bewezen eigen handle kiezen. De oude actieve binding eindigt en een nieuwe begint. Account, volgers, instellingen en moderatiestatus blijven gelijk; oude publicaties worden niet herschreven. Frequentie- en herverificatiebeperkingen worden in WP-B/WP-F vastgelegd.

**A-16 — Eigendom is niet vertrouwen.** Een ownershipvermelding betekent uitsluitend dat de bijbehorende eigendomscontrole is geslaagd. Zij bewijst geen wettelijke identiteit, unieke persoon, officiële merkstatus, veiligheid of betrouwbaarheid. Geen betaalde of tokengebonden vertrouwensbadge.

## 4. Lezen, deelnemen en accountrechten

**A-17 — Publiek lezen.** Openbaar gemaakte profielen en toegestane publieke inhoud zijn zonder account of handle leesbaar. Privé-, verwijderde of beperkte gegevens zijn daarvan uitgesloten. De eerste alpha kan toegang tot de gehele omgeving beperken; dat is geen toekomstige betaalmuur voor publiek lezen.

**A-18 — Actieve deelname.** Nieuwe posts, replies, reposts, likes en nieuwe volgacties vereisen een toegelaten account, toegestane alpha-toegang waar van toepassing, een actieve hoofdhandle en voldoende actuele eigendomscontrole. Dit beschrijft voorwaarden voor latere functies, niet dat alle interacties in de eerste alpha worden gebouwd.

**A-19 — Geen handle, wel accountrechten.** Zonder actieve hoofdhandle blijven inloggen, eigen gegevens bekijken/exporteren, privacy-instellingen, sessies intrekken, herstel, bezwaar en profielverwijdering beschikbaar. Ook eigen content verwijderen, ontvolgen, meldingen, block en mute blijven mogelijk voor zover het account daar recht op heeft.

**A-20 — Veiligheids- en wettelijke kanalen blijven bereikbaar.** Illegale inhoud melden en privacy-/bezwaarverzoeken indienen worden niet afhankelijk gemaakt van het bezit van een handle, betaling, tokenbalans of een actieve reguliere sessie. Passende verificatie van de verzoeker blijft mogelijk.

**A-21 — Accountstatus en eigendom zijn afzonderlijk.** Bezit van een handle heft een beperking, schorsing of verwijdering niet op. Een andere wallet of hoofdhandle kiezen omzeilt geen accountmaatregel. Een beperking van een account verandert geen NFT-eigendom.

## 5. Verkoop, overdracht, burn en onzeker eigendom

**A-22 — Handel in de NFT is geen accountoverdracht.** Verkopen, schenken of anders overdragen van een handle verplaatst uitsluitend de on-chain asset en bijbehorende protocolrechten. Nooit het Network-account, profiel, posts, followers, privégegevens, walletkoppelingen, betaalgeschiedenis, projectrollen of accounttoegang.

**A-23 — Oude eigenaar.** Zodra eigendomsverlies voldoende is vastgesteld, eindigt de actieve binding. Zonder andere actieve eigen handle mag het account niet opnieuw namens die naam deelnemen. Het behoudt eigen gegevens en de in A-19 genoemde mogelijkheden. Een achtergrondcontrole alleen is geen beveiligingsgrens.

**A-24 — Nieuwe eigenaar.** De nieuwe eigenaar meldt zich met het eigen account aan en bewijst het eigen bezit. Voor een nieuwe binding is geen toestemming van de vorige eigenaar nodig. Een oude accountkoppeling mag bewezen nieuw bezit niet permanent gijzelen. Koppeling van de nieuwe handle is nooit koppeling van de oude wallet of het oude account.

**A-25 — Geen verplichte publieke profieloverdracht.** De koper hoeft geen eerdere bio, afbeelding, content of followers over te nemen. Het vorige profiel wordt niet automatisch het profiel van de koper.

**A-26 — Volgers blijven bij de persoon achter het account.** Verlies of wisseling van een handle verplaatst geen volgers naar de nieuwe eigenaar. Bestaande volgers kunnen zien dat een account tijdelijk geen actieve hoofdhandle heeft; zij volgen niet automatisch de huidige eigenaar van de voormalige naam.

**A-27 — Geen geërfde accountstraf.** Een maatregel tegen de vorige eigenaar wordt niet automatisch een maatregel tegen de koper of diens account. Een beperking die werkelijk de naam, content of een juridisch bevel betreft krijgt een aparte onderbouwing, motivering en bezwaarroute.

**A-28 — Terugkoop en burn.** Terugkoop creëert een nieuwe bindingsperiode, geen heropening van de oude. Burn of ander definitief verlies beëindigt de oude binding na bevestiging. Bestaande historische inhoud wordt niet aan een eventuele latere bezitter van dezelfde naam toegeschreven.

**A-29 — RPC- of ketenonzekerheid.** Bij onvoldoende betrouwbare eigendomsinformatie wordt de binding OWNERSHIP_UNCERTAIN: tijdelijk geen nieuwe identiteitsgebonden actie. Geen definitieve ontkoppeling uitsluitend door time-out. Accountrechten blijven beschikbaar; publiek wordt geen actuele verificatie gesuggereerd die niet kan worden onderbouwd.

**A-30 — Overdrachtsrace.** Eigendom wordt bij gevoelige schrijfacties opnieuw beoordeeld volgens het goedgekeurde freshness-/finaliteitsbeleid. Is de toeschrijving rond een overdracht niet betrouwbaar vast te stellen, dan wordt niet gepubliceerd totdat de onzekerheid is opgelost. Er wordt geen absolute realtimegarantie geclaimd.

## 6. Historische afzenders, verwijzingen en ontvangers

**A-31 — Historie hoort bij het oorspronkelijke account.** Toekomstige publicaties verwijzen blijvend naar het publicerende account en de binding/handle op dat moment. Een nieuwe eigenaar krijgt die publicaties niet als eigen profielgeschiedenis.

**A-32 — Niet stilzwijgend herschrijven.** Bij een handlewissel verandert de historische handlevermelding niet. Toon waar nodig dat deze niet meer de actuele hoofdhandle van de auteur is. Een neutrale, niet-claimbare accountreferentie blijft beschikbaar zonder een NFT-achtige naam te suggereren.

**A-33 — Oude mentions blijven oude verwijzingen.** Een opgeslagen mention of notificatie blijft verbonden met de bedoelde accountidentiteit op het moment van aanmaken. Zij wordt niet omgeleid naar de koper omdat die nu dezelfde naam bezit. Nieuwe expliciete handlelookups kunnen de actuele eigenaar vinden, met duidelijk andere betekenis.

**A-34 — Geen geërfde betaalbestemming.** Een historische Pay-knop of gedeelde betaalreferentie mag niet ongemerkt betalingen naar de nieuwe handle-eigenaar sturen terwijl de context de vorige auteur suggereert. Historische auteur-/ontvangercontext wordt opnieuw gecontroleerd. Bij mismatch is de actie onbeschikbaar of is een nieuwe, expliciete ontvangerkeuze nodig; bestaande Pay-review en ondertekening blijven leidend.

**A-35 — Geen financiële profileringsfunctie.** Network importeert geen walletbetalingen, contacten, saldi of transacties naar een openbaar profiel zonder aparte expliciete productscope en passende privacybeoordeling.

## 7. Walletverlies, herstel en privacy

**A-36 — Accounttoegang en bezit herstellen zijn verschillende zaken.** Platformaccount recovery herstelt geen blockchainbezit. Controle over een wallet of nieuw aangeschafte handle herstelt geen ander account.

**A-37 — Walletverlies.** Wie nog bij het eigen account kan, mag eigen rechten blijven uitoefenen en een andere bewezen eigen wallet/handle koppelen. Het product verklaart een verloren wallet of NFT niet administratief als eigendom van een andere wallet.

**A-38 — Verloren accounttoegang.** Gebruik het ondersteunde account-herstelpad. Een verzoek wordt bij twijfel beperkt en passend beoordeeld; er is geen garantie dat iedere claimant toegang terugkrijgt. Voormalig handlebezit alleen geeft nooit toegang tot persoonsgegevens of profielbeheer.

**A-39 — Ontkoppelen.** Een wallet ontkoppelen die de actieve hoofdhandle draagt beëindigt ook die actieve binding, tenzij in dezelfde gecontroleerde handeling een andere eigen hoofdhandle wordt gekozen. Historische auteurverwijzingen blijven bestaan volgens het bewaar-/verwijderbeleid.

**A-40 — Network-profiel verwijderen.** Profielverwijdering is een afzonderlijke keuze van het verwijderen van het bredere SolHandle-account. Zij verbergt het profiel, beëindigt bindings en deelname, en verwijdert Network-gegevens volgens het vastgestelde beleid. Zij verstuurt, verbrandt of verkoopt geen NFT en verwijdert geen blockchainhistorie.

**A-41 — Geen rechtenblokkade.** Schorsing, eigendomsverlies of verwijderde publieke zichtbaarheid mogen export, privacyverzoeken en bezwaar niet onmogelijk maken. Informatie van andere personen wordt daarbij beschermd. Eventuele noodzakelijke bewaring vraagt een vastgelegd doel, grondslag en einddatum.

**A-42 — Geen automatische heropleving.** Een nieuwe eigenaar of opnieuw aangemeld account krijgt geen oude verwijderde gegevens terug. Voortgezette beperkingen of bewaarde gegevens worden uitsluitend volgens het geldende moderatie-/bewaarbeleid verwerkt.

## 8. Leeftijd, toegang en badges

**A-43 — Alleen 18+.** Network-deelname is voor personen van 18 jaar of ouder. Het verzamelen van identiteitsdocumenten of volledige geboortedata is geen standaard onboardingvereiste. Welke proportionele leeftijdsmaatregelen voldoende zijn, moet vóór toelating van deelnemers worden beoordeeld; zolang die aanpak niet is goedgekeurd, geen alpha-toelating.

**A-44 — Bij signalen van minderjarigheid.** Nieuwe deelname kan tijdelijk worden beperkt voor passende beoordeling en bezwaar. Geef onzekere signalen niet als bewezen leeftijd weer. Bescherm rechtenverzoeken en voorkom onnodige extra leeftijdsgegevens.

**A-45 — Gratis kern, geen tokenvoorwaarde.** Basisprofiel en normaal sociaal gebruik vereisen geen $HANDLE-balans. Een apart gesloten-alpha-invite kan wel nodig zijn; die is geen vertrouwensbadge of betaalde verificatie.

**A-46 — Geen voorkeursbehandeling door vermogen.** $HANDLE-bezit, toekomstige Pro-toegang en betalingen geven geen betere beveiliging, herstel, moderatieprioriteit, bereik/ranking of bewijs van betrouwbaarheid. Eventuele toekomstige extra functies vereisen een afzonderlijk product- en juridisch besluit.

**A-47 — Expliciete badgebetekenis.** Ownership, projectverificatie en eventuele producttoegang zijn verschillende begrippen. Alleen ownership is in deze baseline toegestaan als resultaat van geldige controles. Projectverificatie en Pro-badges zijn geen v1-toezegging. Een badge toont geen exact saldo en onthult niet stilzwijgend bezit.

## 9. Accounttoestanden en mogelijkheden

Eigendom/binding, accountmaatregel, leeftijdsbeoordeling en alpha-toegang zijn afzonderlijke controles. De strengste toepasselijke beperking bepaalt de toegestane actie; onderstaande tabel is geen vervanging voor de rechtenmatrix.

| Situatie | Openbaar lezen | Nieuwe sociale deelname | Eigen gegevens/rechten | Volgers/historie | Herstelrichting |
|---|---|---|---|---|---|
| Bezoeker zonder account | Ja, zodra publieke omgeving beschikbaar is | Nee | Publieke meldings-/rechtenkanalen | Niet van toepassing | Expliciet aanmelden |
| Account zonder actieve handle | Ja | Nee | Ja, met passende verificatie | Blijven bij het account | Eigen handle koppelen |
| Toegelaten account met actieve handle | Ja | Ja, binnen release- en accountrechten | Ja | Blijven bij het account | Niet nodig |
| Eigendom tijdelijk onzeker | Ja | Tijdelijk nee namens handle | Ja | Niet overgedragen of definitief gewist | Nieuwe betrouwbare controle |
| Handle verkocht/gebrand | Ja | Niet namens oude handle | Ja | Blijven bij het oude account | Andere eigen handle koppelen |
| Nieuwe eigenaar | Ja | Pas na eigen aanmelding, binding en toegang | Alleen eigen accountgegevens | Geen overname oude historie/volgers | Eigen binding aanmaken |
| Account geschorst | Publieke toegang volgens inhoudsregels | Volgens maatregel, nooit door nieuwe handle omzeild | Privacy, herstel en bezwaar blijven bereikbaar | Niet naar een andere eigenaar verplaatst | Bezwaar/einde maatregel |
| Network-profiel verwijderd | Publieke toegang als bezoeker | Nee vanuit verwijderd profiel | Beperkte afhandeling lopende rechtenverzoeken | Geen overdracht; verwerking volgens wis-/bewaarbeleid | Eventuele nieuwe aanmelding zonder dataherstel |

## 10. Scenario's voor formele acceptatie

Alle controles hieronder staan open. Vastgestelde productregels zijn niet hetzelfde als geslaagde implementatietests.

- [ ] **P-A01 — Geen stilzwijgende onboarding:** bestaande walletverbinding, mint en Pay maken geen Network-profiel.
- [ ] **P-A02 — Stabiel account:** hoofdhandle wisselen behoudt hetzelfde account en dezelfde volgers, zonder historische posts te herschrijven.
- [ ] **P-A03 — Exclusiviteit:** twee accounts kunnen dezelfde handle niet tegelijk actief voeren.
- [ ] **P-A04 — Extra handles:** extra bezit creëert geen extra profiel, publieke alias of extra rechten.
- [ ] **P-A05 — Walletconflict:** walletbewijs geeft geen toegang tot een ander gekoppeld account en verplaatst diens koppeling niet automatisch.
- [ ] **P-A06 — Overdracht:** koper krijgt uitsluitend eigen binding, nooit het oude account, privégegevens, followers of projectrollen.
- [ ] **P-A07 — Oude sessie:** oude eigenaar kan geen nieuwe actie namens verkochte handle uitvoeren via bestaande of geplande sessieacties.
- [ ] **P-A08 — Onzekerheid:** RPC-uitval blokkeert relevante nieuwe acties zonder een definitieve onterechte ontkoppeling.
- [ ] **P-A09 — Historie:** oude content, mentions, shares en notificaties blijven naar de oorspronkelijke auteur verwijzen.
- [ ] **P-A10 — Pay:** historische context leidt niet ongemerkt tot een andere ontvanger; actuele ontvangerreview en walletsigning blijven vereist.
- [ ] **P-A11 — Geen handle:** export, verwijderen, veiligheidshandelingen en bezwaar blijven beschikbaar.
- [ ] **P-A12 — Recovery:** bezit van een voormalige/nieuw gekochte handle geeft geen toegang tot het vorige account.
- [ ] **P-A13 — Burn/terugkoop:** bindingsperiodes blijven gescheiden en krijgen geen oude accountbevoegdheden terug.
- [ ] **P-A14 — Schorsing:** een andere hoofdhandle omzeilt geen accountmaatregel; een koper erft niet automatisch de straf van een verkoper.
- [ ] **P-A15 — Leeftijd:** deelnemers kunnen niet worden toegelaten vóór goedgekeurde uitvoering van het 18+-beleid.
- [ ] **P-A16 — Geen tokenpoort:** normaal basisgebruik en wettelijke/veiligheidskanalen zijn niet afhankelijk van $HANDLE.
- [ ] **P-A17 — Profiel verwijderen:** Network-verwijdering wijzigt geen NFT-eigendom of onafhankelijke SolHandle-diensten.
- [ ] **P-A18 — Geen financiële import:** contacten, saldi en betaalhistorie worden niet automatisch publiek gemaakt.

## 11. Overdracht aan overige werkpakketten

| Werkpakket | Moet nu concretiseren | Geen impliciete productwijziging toegestaan |
|---|---|---|
| B — Account/ownership | Challenges, ondersteunde onboarding, koppelingconflicten, exclusiviteit, freshness, finaliteit, recovery | Geen walletbewijs als accountovername of enkel watcher-gebaseerde beveiliging |
| C — Data/rechten | Stabiele accountreferenties, gescheiden publieke projecties, bindinghistorie, action-rechtenmatrix | Geen open toegang om anonieme of wallet-only flows passend te maken |
| D — Privacy | Rechtsgronden, termijnmatrix, account-/profielscope, export, wissen en contactroute | Geen onbegrensde opslag of automatische publieke walletprofilering |
| E — Moderatie | Maatregelen, motivering, bezwaar, block/mute, nieuwe eigenaar versus oud account | Geen straf overdraagbaar via NFT zonder afzonderlijke grond |
| F — Security | Dreigingsmodel, rate limits, herverificatie, onboarding-/herstelmisbruik, noodstop | Geen risicosignaal als bewezen unieke persoon of schuld |
| G — Toegangsrechten | Alleen eventueel toekomstig functieontwerp | Geen verplichte tokenbalans, bereikvoordeel of betaalde verificatie |
| H — Juridisch/governance | Leeftijdsaanpak, toepasselijke verplichtingen, beleid en releasebesluit | Geen complianceverklaring op basis van dit productdocument |

**Nog niet ingevuld door dit productbesluit:** concrete bewaartermijnen, technische controle-intervallen, commitment-/finaliteitsdrempels, rate limits, juridische rechtsgronden, leeftijdscontrole-uitvoering en namen van verantwoordelijken. Deze moeten vóór de bijbehorende vrijgavepoort aantoonbaar zijn vastgesteld, niet stilzwijgend door een implementatie worden gekozen.

## 12. Wijzigingsbeheer

Deze productbaseline vervangt de voorlopige productkeuzes voor WP-A in het fase 0-plan. Afwijkingen vereisen een expliciet verzoek/besluit van de producteigenaar met regelnummer, reden, gevolgen voor bestaande gebruikers en beoordeling van security/privacy/juridische afhankelijkheden. Iedere goedgekeurde inhoudelijke wijziging krijgt een nieuwe versie.

| Versie | Datum | Besluit |
|---|---|---|
| 1.0 | 22 oktober 2026 | WP-A uitgewerkt tot productbaseline op verzoek van de producteigenaar; geen implementatie, geslaagde acceptatie of launchgoedkeuring geclaimd |