# SolHandle — wederzijdse connecties en besloten updates

Datum: 25 oktober 2026 · Versie: 0.1 · Status: ONTWERP, NIET GEACTIVEERD

## 1. Opdracht en grens

Uitwerking op verzoek van de eigenaar: twee profielen kunnen een wederzijdse connectie aangaan; pas na aanvaarding ontstaat toegang tot expliciet met connecties gedeelde updates. Dit document geeft geen toestemming voor productieactivatie.

Alleen documentatie geleverd. Geen nieuwe routes, knoppen, entities, backendfuncties, workflows, notificaties, flags of rechten geactiveerd. Het Ecosystem-prototype blijft ongewijzigd. Geen bestaande relaties, privécontacten of berichten gemigreerd. Geen tests als geslaagd aangemerkt.

Dit is een aanvullend ontwerp op de Identity/Discover/Contacts/Pay-MVP, niet de herintroductie van een openbaar sociaal netwerk. Historische masterdocumenten bevatten Follow en publieke feeds. Die code en afspraken worden niet stilzwijgend vervangen: voor deze nieuwe relatie zijn wederzijdse toestemming en besloten bereik de voorgestelde regels. Uitvoering vraagt afzonderlijke goedkeuring.

## 2. Productmodel: drie begrippen, geen verwarring

| Begrip | Betekenis | Toestemming ander nodig? | Gevolg |
|---|---|---|---|
| Private contact | Eigen opgeslagen betaalontvanger in het bestaande walletgebonden adresboek | Nee | Alleen zelf zichtbaar; geen sociale toegang |
| Connection | Wederzijds aanvaarde relatie tussen twee vaste Network-account-ID's | Ja | Beiden zien de relatie onder Connections; later beperkt recht op besloten updates |
| Connections-only update | Bericht dat expliciet voor het toegestane connectiepubliek is gepubliceerd | Auteur kiest dit bij publiceren | Alleen auteur en op dat moment bevoegde connecties; nooit publiek via een gewone link |

Acceptatie maakt de ander automatisch zichtbaar onder **Connections**, niet automatisch als **WalletContact**. In een toekomstige gezamenlijke Contacts-werkruimte kunnen twee tabs staan: **Connections** en **Private contacts**. Zo verschijnt de persoon in het sociale overzicht zonder ongewenst een wallet, betaalbestemming of notitie aan te maken.

**Save to private contacts** blijft een aparte expliciete actie met de bestaande walletontgrendeling en ontvangerreview. Geen tweede sociaal adresboek, geen automatische import van huidige privécontacten en geen accountbrede synchronisatie van walletadresboeken.

Follow, wederzijds Follow en een handmatig opgeslagen contact zijn geen vervanging voor een Connection. Geen automatische omzetting, ook niet als beide accounts elkaar al volgen.

## 3. Gebruikersflow en labels

1. A opent het profiel van B en kiest **Connect**.
2. Bevestiging maakt helder: verzoek aan dit vaste profiel, geen betaling, wallettoegang, berichtentoegang of officiële verificatie. De actuele naam is een label, niet de identiteitssleutel.
3. A ziet **Request sent** en **Cancel request**. B ziet een verzoek onder **Requests received**, met **Accept** en **Decline**.
4. Na acceptatie zien beiden **Connected**. De relatie verschijnt voor beiden onder **Connections**. Alleen hiervoor krijgt A een minimale in-appmelding; geen email, mobiele push of extern kanaal in de eerste versie.
5. Later kunnen beiden een update delen met **Connections only**. Het publiek wordt vóór publiceren zichtbaar uitgelegd.
6. Beide deelnemers kunnen onafhankelijk **Remove connection**, **Mute updates**, **Block** of **Report** gebruiken waar van toepassing.

Alle nieuwe zichtbare interfacecopy blijft Engels, ook op mobiel. Documentatie en productbesluiten kunnen Nederlands blijven.

Voorgestelde Connections-werkruimte: **Connections**, **Requests received**, **Requests sent**, met zoeken binnen de eigen toegestane resultaten. Private contacts blijft een afzonderlijke tab/bestemming. Geen publiek connectieoverzicht, mutual-connectionslijst, populariteitsranglijst of publiek connectieaantal in v1.

## 4. Toestanden en overgangen

NONE is de afwezigheid van een actuele relatie, geen verplicht databaserecord. Namen hieronder zijn logische ontwerpstaten, geen bestaande API of nieuw schema.

| Huidige staat | Actie | Bevoegde actor | Nieuwe staat / gevolg |
|---|---|---|---|
| NONE | Send request | A naar B | PENDING, met A als afzender en B als ontvanger |
| PENDING | Accept | Alleen B | ACCEPTED, nieuwe unieke connectieperiode |
| PENDING | Decline | Alleen B | DECLINED, geen toegang |
| PENDING | Cancel | Alleen A | CANCELLED, geen toegang |
| PENDING | Verloopt | Servertijd, na 30 dagen | EXPIRED, geen toegang |
| ACCEPTED | Remove connection | A of B | ENDED, toegang wederzijds ingetrokken |
| Iedere staat | Block | A of B | Verzoek/relatie atomair beëindigen; aparte gerichte blockregel |
| Geen actieve relatie | Unblock | Alleen maker van die blockregel | Geen nieuw verzoek of herstel; eventuele block van ander blijft gelden |
| Iedere staat | Account verwijderen | Eigen bevoegde verwijderflow | Relaties beëindigen, verzoeken sluiten, data volgens wis-/bewaarbeleid verwerken |

Geen verzoek aan jezelf. Eén actuele relatie per ongeordend accountpaar. Dubbele requests en herhaalde acceptaties maken geen dubbele connecties of meldingen.

Bij gekruiste requests blijft het eerste geldige verzoek leidend: de tweede afzender ziet **Accept request**, niet een automatische acceptatie door de server. Hiervoor is een nieuwe, expliciete bevestiging nodig.

Een oud Accept-scherm kan een geannuleerd, verlopen of geblokkeerd verzoek niet herstellen. Na beëindiging moet opnieuw een verzoek worden aanvaard; die acceptatie krijgt een nieuwe periode-ID.

## 5. Voorgesteld besloten-feedbeleid

Deze regels gelden voor een latere fase, niet voor bestaande openbare posts.

- Alleen **Connections only** in de eerste besloten versie; geen publiek/privé-toggle die bestaande content met één klik openzet.
- Chronologische updates, zonder algoritmische aanbevelingen, followerranking, likes/reposts of berichtenchat als scope-uitbreiding.
- Alleen updates die tijdens de **huidige aaneengesloten connectieperiode** zijn gepubliceerd worden gedeeld. Een nieuwe connectie krijgt dus geen oude besloten historie.
- Verwijderen of blokkeren trekt toegang tot alle onder die relatie gedeelde updates in. Opnieuw verbinden opent een nieuwe periode en maakt oude besloten updates niet weer zichtbaar.
- De auteur behoudt eigen content en eigen verwijder-/exportrechten; beëindigen van een relatie wist niet automatisch de berichten van de ander.
- De server bepaalt publicatievolgorde en periodegrenzen; clienttimestamps mogen geen toegang verruimen. Acceptatie/publicatie/removal-races vereisen een aantoonbare commitvolgorde.
- Mute verbergt updates alleen voor de gebruiker die mute instelt. Het beëindigt de relatie of toegang van de ander niet en verstuurt geen melding.
- Geen besloten inhoud in openbare zoekresultaten, Discover, trending, sitemap, linkpreview, openbare profielaantallen of oningelogde pagina's.
- Een directe link naar een update vereist dezelfde actuele autorisatie als de feed. Bezit van een URL is geen toegangsbewijs.
- V1 begint met tekst. Media, replies en reacties pas als die exact dezelfde doelgroep- en intrekkingsregels kunnen volgen. Een reply mag nooit het publiek van de oorspronkelijke post verruimen.
- Geen openbaar repostpad of automatisch delen naar externe diensten. Kopiëren en screenshots door toegelaten lezers zijn technisch niet volledig te voorkomen; de interface belooft geen absolute vertrouwelijkheid.

Publieke profielvelden blijven afzonderlijk, expliciet gepubliceerd en minimaal. Een connectie geeft geen toegang tot privénotities, wallets buiten de publieke keuze, betaalgeschiedenis, saldo, beheerinstellingen of andere relaties.

## 6. Rechtenmatrix

| Gegeven / actie | Bezoeker | Uitstaand verzoek | Actieve connectie | Auteur/eigenaar | Na verwijderen/block |
|---|---|---|---|---|---|
| Expliciet openbaar profiel | Volgens bestaande publicatieregels | Idem | Idem | Eigen profielbeheer | Block beperkt ingelogde interactie; openbaar is niet geheim voor uitgelogde bezoekers |
| Verzoekgegevens | Nee | Alleen betrokken A/B | Alleen eigen noodzakelijke relatiecontext | Eigen ontvangen/verzonden verzoeken | Geen inhoud of reden aan buitenstaanders |
| Connections-lijst | Nee | Nee | Geen inzage in andermans lijst | Alleen eigen lijst | Eigen afgesloten context voor zover gerechtvaardigd |
| Besloten update | Nee | Nee | Alleen juiste huidige connectieperiode en geldige accountstatus | Eigen inhoud | Geen toegang als voormalige connectie |
| Private contacts / notities | Nee | Nee | Nee | Alleen bevoegde bestaande adresboekeigenaar | Niet automatisch verwijderd of gedeeld |
| Accept | Nee | Alleen bedoelde ontvanger | Niet opnieuw | Niet door afzender namens ontvanger | Oude acceptatie kan niet heractiveren |
| Remove / block / report | Publieke meldroute waar relevant | Eigen veiligheidsacties | Eigen veiligheidsacties | Altijd passende eigen rechten | Ook zonder actieve handle bereikbaar |
| Pay | Bestaande zelfstandige voorwaarden | Geen nieuwe rechten | Geen nieuwe rechten | Eigen walletreview en signing | Geen automatische bestemming-/toestemmingswijziging |

Beheerderstoegang tot gemelde inhoud is een aparte, gemotiveerde moderatiehandeling, niet een gebruikersconnectie. Geen claim dat infrastructuurbeheerders technisch nooit data kunnen zien. Ontwerp voor minimale inhoud per case, beperkte bevoegdheid en audit; juridische grondslag, bewaartermijnen en beheerprocedure vóór vrijgave vaststellen.

## 7. Identiteit, transfer en walletveiligheid

De sleutel is **vaste account-ID A ↔ vaste account-ID B**. Niet de @tekst, NFT-ID of wallet als relatie-identiteit.

- Andere eigen Primary Handle: hetzelfde account en dezelfde relaties; een begrijpelijke identiteitswijziging tonen zonder verborgen oude walletinfo te publiceren.
- Handle verkocht: de oude accountbinding eindigt; het oorspronkelijke account behoudt eigen connecties. De koper krijgt geen verzoeken, relaties of besloten content van de vorige eigenaar.
- Verzoek vóór transfer: gericht aan het oorspronkelijke account. Acceptatie toont de actuele profielidentiteit opnieuw; een oude handlelabel mag niet suggereren dat het verzoek nu voor de koper is. Koper ontmoeten betekent een nieuw verzoek naar diens eigen profiel.
- Geen handle of onzekere eigendom: geen nieuwe connectieverzoeken, acceptaties of updates namens die handle. Het oorspronkelijke account mag bij geldige accountauth bestaande besloten updates blijven lezen, eigen data beheren, verzoeken afwijzen/annuleren en verwijderen/blokkeren/melden. Handlebezit is geen voorwaarde voor die eigen veiligheidsrechten.
- Geschorste accounts krijgen geen besloten-feedtoegang of nieuwe sociale acties zolang de maatregel dat beperkt; rechten op eigen gegevens, bezwaar en safety blijven passend bereikbaar. Een maatregel wist relaties niet stilzwijgend en is geen NFT-overdracht.
- Wallet verbinden alleen is geen aanmelding; het Contacts-token is geen Network-sessie. Geen nieuwe authbackend, synthetische emails of zelf uitgegeven logincredentials.
- Een verbonden account is geen goedgekeurde ontvanger. Pay blijft een afzonderlijke actie. De huidige vastgepinde contactwallet en transferbevestiging blijven behouden; oude sociale context mag niet naar een nieuwe handle-eigenaar worden omgeleid.

## 8. Logische data en servercontracten

Geen schemas aangemaakt. Hergebruik van de bestaande NetworkAccount-identiteit is verplicht; geen tweede User of alternatief adresboek.

| Logisch gegeven | Minimale inhoud / invariant |
|---|---|
| ConnectionPair | Canoniek ongeordend accountpaar, actuele staat, verzoek-ID, afzender/ontvanger, servermomenten, verval en versie; maximaal één actuele relatie |
| ConnectionEpisode | Unieke periode-ID, accountpaar, start en eventueel eindmoment/-volgorde; beëindigde periode herleeft nooit |
| AccountBlock | Gerichte blocker→blocked-relatie; beide richtingen controleren; geen publieke blocklijst |
| Update audience | Auteuraccount, expliciet CONNECTIONS_ONLY, serverpublicatiemoment/-volgorde; controles tegen huidige passende episode, geen handmatig ingevulde ontvangers omzeiling |
| Preferences | Eigen mute-/in-appvoorkeuren, zonder publiek effect op relatie |
| OperationReceipt / outbox | Actor, unieke operatie en inputhash, duurzaam resultaat en minimale melding; retries maken geen dubbele acties |

De server leidt de actor uitsluitend af uit de vertrouwde actuele sessie. Een client mag geen sender-ID, relatie-status, acceptatiemoment, blockstatus of publiek afdwingen. Een target-ID is enkel een verzoekdoel en wordt opnieuw gevalideerd.

Voorgestelde nauwe operaties: send request, accept, decline, cancel, list own requests, list own connections, end connection, block/unblock en later publish/list/get connection updates. Dit zijn geen geactiveerde endpoints.

Implementatie-eisen vóór uitvoering:

1. Aantoonbare unieke paaridentiteit, conditionele transities en commitgrens voor pair/episode/block/receipt. Geen find-then-create of browserlock als concurrencygarantie.
2. Acceptatie controleert in dezelfde autorisatiegrens verzoek-ID/versie, actor, accountstatus, verval en blocks. Block en removal krijgen voorrang op verouderde acceptaties en feedautorisatie.
3. Actuele permissies op iedere lijst/detail/zoek-/export-/mediacall, niet alleen de knoppen verbergen. Publieke en besloten projecties scheiden; serverpaginering, filtering en veilige tellingen vóór resultaatopbouw.
4. Bij onbereikbare autorisatiebron geen besloten inhoud of sociale mutatie. Oud cache- of cursorbewijs geeft geen toegang. Cachekeys scheiden per account en relatieversie; annuleren/verwijderen wist lokale weergaven als aanvullende UX, niet als beveiligingsgrens.
5. Notificaties na duurzame commit, idempotent en vóór aflevering opnieuw gecontroleerd waar intrekking relevant is. Geen postinhoud in notificatiepreview, logs, analytics of mail.
6. Toekomstige private media krijgen dezelfde ontvangercontrole vóór URL-uitgifte; geen publieke opslag. Voorgestelde bovengrens voor downloadlinks: 60 seconden. Reeds uitgegeven links/gedownloade bestanden kunnen een intrekking kort overleven; dit als restrisico beoordelen, niet als onmiddellijk ingetrokken claimen.
7. Relatieregels moeten opslag- en serverautorisatie afdwingen; geen open entityrechten of algemene privileged proxy. De actuele platformcontracten pas bij implementatie opnieuw laden en verifiëren. Dit document claimt geen nieuwe database-/transactiegarantie.

## 9. Misbruik, verwijderen en bewaring

Voorgestelde startwaarden, nog geen actieve limieten: maximaal 20 nieuwe verzoeken per account per 24 uur, 100 uitstaande verzonden verzoeken, verzoekverval na 30 dagen en zeven dagen afkoeling voor een nieuw verzoek aan hetzelfde account na een afgesloten verzoek of verwijderde connectie. Block blijft altijd beslissend. Limieten en tijd worden server-side afgedwongen; bescherming moet ook meerdere accounts en herhaalde retries beoordelen.

Geen vrije verzoektekst, bijlage, link, betaalverzoek of bulkuitnodiging in v1. Alleen verzoeken tussen toegelaten bestaande profielen; geen willekeurige externe uitnodigingen. Een private ontvangerinstelling **Do not accept requests** kan alle nieuwe verzoeken sluiten zonder bestaande relaties te wissen.

Decline/block veroorzaakt geen redenmelding aan de andere partij; generieke feedback voorkomt onnodige onthulling van block- of accountmaatregelen. Geen openbare activiteit die verraadt wie met wie verbonden is.

Remove connection toont dat besloten toegang eindigt maar apart opgeslagen privécontacten blijven bestaan. Block beëindigt sociale toegang en verzoeken, maar verwijdert niet andermans privénotities en voorkomt niet dat iemand het openbare blockchainadres buiten de app gebruikt.

Bij accountverwijdering: verzoeken sluiten, episodes beëindigen, toegang intrekken, notificaties minimaliseren en content verwerken volgens het vastgestelde verwijderbeleid. Geen automatisch herstel bij herregistratie of terugkoop. Export bevat eigen relaties en zelfgemaakte data, niet automatisch besloten content van anderen. Rapportagebewijs en minimale misbruik-/cooldownregistratie krijgen een gemotiveerde eindtermijn; precieze bewaartermijnen en grondslagen zijn open vrijgavevoorwaarden, geen onbeperkte historie.

## 10. Fases zonder scope-explosie

| Fase | Levering | Niet impliciet inbegrepen |
|---|---|---|
| Nu | Dit ontwerp en open acceptatiecriteria | Geen UI-, data- of runtimewijziging |
| Optionele volgende ontwerpstap | Expliciet goedgekeurde lokale simulatie in EcosystemPreview: verzoek→acceptatie→Connected, remove/block en gescheiden contacten | Geen echte accounts, backend, feed of notificatieverzending |
| Afgeschermde implementatie | Veilige accountmapping, verzoeken, episodes, remove/block/report, eigen lijsten en in-appmeldingen | Geen openbare ledenvrijgave, geen besloten feed |
| Besloten updates | Chronologische tekstupdates met bewezen doelgroep-, direct-link- en intrekkingscontrole | Geen chat, openbare feed, reposts, communities of mediaplatform |
| Beperkte bèta | Alleen na aantoonbare auth/security/privacy/moderatieacceptatie en expliciet eigenaarbesluit | Geen automatische lancering door een prototype of geslaagde build |

De bestaande open ledenauth-/intrekkings-/concurrencyvragen blijven vrijgaveafhankelijkheden. Ontwikkeling in een later expliciet goedgekeurde afgeschermde omgeving blijft mogelijk; dit document lost of bewijst die vragen niet.

## 11. Acceptatieplan — alle punten NOT RUN

- C01: verzoek toont vaste bedoelde account; alleen de ontvanger kan aanvaarden, alleen afzender annuleren.
- C02: PENDING/NONE, een follow en een saved contact geven geen besloten leesrecht.
- C03: acceptatie toont voor beiden precies één connectie en maakt nul WalletContact-records aan.
- C04: dubbele/gekruiste verzoeken en retries maken geen duplicaten of stilzwijgende acceptatie.
- C05: acceptatie tegelijk met cancel/expiry/block/delete laat geen ongewenste actieve relatie achter.
- C06: derde account, gewijzigde actor/target-ID, gestolen cursor of directe record-/update-ID geeft geen inhoud of relatiegegevens.
- C07: nieuwe connectie ziet alleen vanaf de actuele periode gepubliceerde updates; remove blokkeert ook oude direct links en paginacursors.
- C08: opnieuw verbinden opent geen content uit een eerdere episode; publicatie op periodegrenzen volgt bewezen servervolgorde.
- C09: block in beide richtingen verhindert verzoeken, acceptatie en lezen; unblock herstelt niets; mute is geen revoke.
- C10: private updates ontbreken uit publieke feeds, zoekresultaten, previews, aantallen, meldingen en analytics.
- C11: handlewissel, transfer, burn, terugkoop en profielverwijdering verplaatsen nooit relaties of content naar de koper; oude verzoeklabels zijn niet misleidend.
- C12: onzeker eigendom blokkeert nieuwe identiteitsacties zonder eigen veiligheids- en privacyrechten te verliezen.
- C13: verlopen/ingetrokken accountauth en wallet-/accountswitch geven geen cross-accountdata; autorisatiestoring faalt gesloten.
- C14: geen betaaltransactie door Connect/Accept; afzonderlijke Pay behoudt opgeslagen wallet, review, transferwaarschuwing en ondertekening.
- C15: throttling, cooldown, accountmaatregelen en generieke foutfeedback voorkomen requestspam en onnodige statuslekken.
- C16: verwijderen/export en reportafhandeling volgen vastgesteld beleid zonder onterecht content van anderen te exporteren of bewaring onbeperkt te maken.
- C17: later toegevoegde media/replies voldoen afzonderlijk aan dezelfde toegang, intrekking en gemelde restrisico's.
- C18: desktop en 360-breed mobiel, toetsenbord, focus, laadtoestand, fout/leegte en dubbele submit blijven bruikbaar.

Flowacceptatie later via de Testing Agent. Concurrency-, storage-, intrekkings- en securitybewijs vereisen daarnaast gerichte technische controles. Geen van deze tests is door het schrijven van dit document uitgevoerd.

## 12. Bronbasis en eerstvolgend besluit

Bekeken: ACCOUNT_OWNERSHIP_DESIGN.md, PRODUCT_RULES.md, MASTER_PROGRESS.md, relevante passages MASTER_SPECIFICATION.md, IDENTITY_HUB_PHASE_0.md, NetworkConnections.jsx, NetworkConnectionsContent.jsx en WalletContact.jsonc.

Concrete afwijking: het huidige Connections-tabblad toont volgens de gelezen bron **followers**, niet wederzijds aanvaarde relaties. Daarom mag dat huidige label nooit als reeds geleverde implementatie van dit ontwerp worden voorgesteld. De bestaande contacts-tab hergebruikt ContactsWorkspace; die grens blijft intact.

Eerstvolgend besluit van de eigenaar: deze v0.1 beoordelen, vooral scheiding Connections/Private contacts, uitsluitend content vanaf aanvaarding, toegangseinde bij removal en fasering. Pas op expliciet verzoek een lokale visuele simulatie bouwen; live activatie blijft een apart besluit.