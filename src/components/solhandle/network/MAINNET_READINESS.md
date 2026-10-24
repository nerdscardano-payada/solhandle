# Network mainnet — implementatieregister

Datum: 24 oktober 2026. Status: publieke presentatie volgens DesignPreview aangesloten op de hoofdroute en Network; publieke sociale schrijfacties NIET vrijgegeven.

Dit register betreft de nieuwe sociale Network-laag. Het is geen uitspraak dat bestaande mint-, resolver-, Pay- of Contacts-diensten offline zijn. De hoofdroute gebruikt nu de goedgekeurde publieke presentatie met werkelijke handlezoek-, mint-, wallet-, Pay- en Contacts-routes. De ontwerpomgeving blijft beschikbaar als afzonderlijk prototype; fictieve profielen, bedragen en aantallen zijn niet naar de publieke presentatie gekopieerd.

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

## Correctie na ontwerpvergelijking

De eerste presentatiemigratie week nog af van de goedgekeurde preview: de homepage had andere ecosysteempanelen en lettergroottes; Network gebruikte nog de oude driedelige shell; profielen hadden een andere header en een aparte statistiekkolom. De homepage gebruikt nu rechtstreeks dezelfde PublicHero en HeroEcosystemVisual als DesignPreview, met live-inhoudslots in plaats van fictieve voorbeelden. De tijdlijn deelt NetworkHomeLayout met de preview, met dezelfde sidebar, topbar, cityscape, Identity/Pay-contextkolom en responsieve ontwerplagen. De profielheader gebruikt dezelfde sd-profielklassen en ProfileHeaderLayout, met behoud van eigendomsbewijzen, editor, delen, tabs en betalingsacties. Extra bestaande profielgereedschappen blijven beschikbaar onder More profile tools.

Mobiele presentatie volgt de previewgrens van 767px, niet de algemene app/tabletgrens van 1366px. De voorbeeldtelefoonrand, maximale voorbeeldhoogte en scroll-in-een-preview worden niet naar de echte website meegenomen. Ontbrekende echte berichten, social counts en walletgegevens worden niet vervangen door demo-inhoud. Sociale aanmeldings- en schrijfbeperkingen blijven ongewijzigd.

## Publieke presentatiemigratie — voor alle bezoekers

Op verzoek van de eigenaar is de oude mint-only hoofdroute vervangen door de publieke Social · Identity · Pay-opzet: dezelfde donkere cityscape, kop, handlezoekactie, ecosysteemvisual en driestappen-uitleg als de goedgekeurde DesignPreview. De zoekactie gebruikt de bestaande beschikbaarheidscheck en mintreview, met de werkelijk verbonden wallet in plaats van een bewaarde adresstring. De identityvisual toont alleen de bestaande on-chain Primary Handle-lookup, inclusief laad-, fout- en niet-verbonden toestand. Social verwijst naar de openbare tijdlijn en ontdekpagina, Pay en Contacts naar de bestaande werkende routes. De ontwikkelaars- en juridische links blijven bereikbaar. Het oude mobiele startmenu, de oude desktopfooter en de chat-overlay worden alleen op deze hoofdroute niet meer bovenop het nieuwe ontwerp getoond; andere bestaande routes blijven intact.

Network gebruikt de goedgekeurde cityscape achter zijn echte tijdlijn en panelen; de Identity-weergave staat naast Pay in de desktopcontextkolom. Individuele profielcomposities houden hun rustige achtergrond en light-modepanelen behouden donkere tekst op een solide lichte ondergrond. Er zijn geen demoposts, verzonnen volgers, voorbeeldontvangers of betalingsbedragen toegevoegd.

Dit geeft de publieke presentatie vrij, niet automatisch nieuwe sociale schrijfrechten. De bestaande serverautorisatie, eigendomscontrole, signatures en private contactopslag zijn niet versoepeld. Publiek sociaal registreren, plaatsen en volgen blijven afzonderlijk te leveren onderdelen: de huidige sessieprovider accepteert alleen ontwikkelaccounts van beheerders. Een bouwcontrole is geen handmatige walletacceptatie of integrale vrijgave.

## Poort 3 — Ontwerpmigratie: GESTART

Geleverd: compacte publieke profieldeelknoppen met correct gecodeerde profiel-URL, Discord-kopieerbevestiging en handmatig kopieerpad bij geweigerde klembordtoegang. Geen OAuth of automatische Discord-publicatie.

Tweede migratieslice geleverd: één gedeelde header met merk, zoeken, meldingen, weergave en bestaande walletknop; dezelfde navigatiebron voor desktop en mobiel; bestaande Pay-drawer, claimroute en informatieve tokenroute als desktopshortcuts. Publieke operatorprofielen en ontwikkelprofielen delen nu profielcompositie en tabs: 3:1-banner, vierkante profielfoto, displaynaam vóór handle, echte bio/status/aantallen en bestaande acties. Het eigen ontwikkelprofiel opent de bestaande editor via Edit profile, zonder dubbele uitklaplaag. Goedgekeurde private ontwikkelmedia behouden hun bestaande ondertekende weergave; de publieke profielprojectie krijgt geen private media of verzonnen mintdetails.

Derde migratieslice geleverd: Identity-tab voor profielweergaven en een walletidentiteitsweergave op het eigen profiel zonder actief sociaal account. Eén begrensde read-only lookup hergebruikt de on-chain resolver voor de officiële collectie, asset en eigenaar. NFT-afbeelding en metadata worden alleen van een overeenkomend DAS-asset getoond; ontbrekende metadata krijgt geen voorbeeldafbeelding. Ontwikkelprofielen vergelijken de verse eigenaar en asset met de bestaande geverifieerde binding; publieke operatorprofielen krijgen geen afgeleide walletbinding. Een verbonden wallet wordt alleen in de expliciete eigen-walletweergave gebruikt. Oorspronkelijke mintprijs, -datum en -transactie zijn niet in deze lookup beschikbaar.

Vierde migratieslice geleverd: Pay en My Contacts openen vanaf het eigen profiel binnen de Network-shell. De bestaande ContactsWorkspace blijft verantwoordelijk voor ontgrendelen, opslaan, bewerken, verwijderen, zoeken en synchroniseren. Send vanuit dit paneel geeft het contact plus de eigenaarwallet door aan dezelfde bestaande Pay-review, zonder querylink of afgeleide ontvanger. Walletwissels wissen de lokale selectie; bestaande Contacts-proof, vaste opgeslagen ontvanger en transactiecontrole blijven actief. Profielbetalingen naar andere ontwikkelaccounts behouden identityRecipient en de bestaande binding-/transfercontroles. Er zijn geen publieke contactgegevens, extra betaalmethoden of automatische transacties toegevoegd. Publieke walletlogin en deelname blijven uit; volledige visuele en gebruikersacceptatie is nog niet uitgevoerd. Geen previewcontext, fictieve aantallen of demo-posts als echte productiegegevens overzetten. Privé-ontwikkelprofielen krijgen geen publieke deelknoppen zolang er geen publieke projectie voor bestaat.

### Productieslice — scheiding van echte en fictieve inhoud

Live Home, Ontdekken en de operatorwerkruimte voegen geen hardcoded demo-berichten of demo-profielen meer toe. Lege resultaten blijven leeg en krijgen de bestaande laad-, fout- en pagineringsafhandeling; er wordt geen demo als fallback geladen. Design Preview en de afzonderlijke democomponenten blijven behouden voor ontwerpwerk. Zonder expliciet actieve wallet-/profielcontext kiest de operatorweergave niet meer stilzwijgend het eerste ontwikkelaccount. De openbare tijdlijn gebruikt dan uitsluitend de bestaande openbare leesprojectie.

Dit is inhoudsscheiding, geen vrijgave van publieke deelnemersaccounts. De opnieuw geraadpleegde documentatie bevestigt OIDC-SSO, maar niet de vereiste e-mailloze Solana-signature-naar-beheerde-appsessie. Walletlogin blijft een extern te bevestigen integratiecontract, geen zelfgebouwde authbackend. Transferbewaking, productie-identiteit, moderatie/privacy en eindgebruikersacceptatie blijven open.

### Walletgebonden profielwijzigingen

De bestaande profiel-editor vraagt nu per opslagactie een berichtsignature van precies de eerder geverifieerde beheerwallet. De server koppelt de challenge aan beheerder, profiel-ID, app-origin, doel DEVELOPMENT_SAVE_PROFILE en SHA-256 van de genormaliseerde profielvelden en media-ID’s. Een gewijzigde inhoud, andere wallet, verkeerd doel, verlopen challenge of hergebruik wordt geweigerd. De challenge wordt eenmalig voorwaardelijk geconsumeerd; eigendom wordt opnieuw on-chain gecontroleerd. Een mislukte opslag vereist een nieuwe signature. De gebruiker ziet dat dit een berichtsignature is, geen betaling.

De client maakt een nieuwe profielcontext bij wallet-, adapter-, connectie- of beheerderswissel. Een oude profielkeuze wordt na reconnect niet hergebruikt; de accountlookup heeft een contextspecifieke sleutel. Deelname vervalt ook lokaal zodra de bestaande eigendomscontrole verloopt of de gebonden wallet niet overeenkomt.

Dit is actieautorisatie binnen de bestaande afgeschermde beheerdersomgeving, geen nieuwe authenticatie- of sessiebackend en geen publieke walletlogin. NetworkWalletChallenge behoudt admin-only toegang op alle vier opslagoperaties. Andere sociale acties blijven onder hun bestaande ontwikkelautorisatie vallen.

### Eigen profielroute — previewontwerp gekoppeld

`/network/me` heeft een eigen walletgebonden profielpad en gebruikt rechtstreeks de contextspecifieke accountquery. URL-parameters voor andere profielen of feeds vervangen het eigen profiel niet meer. De profielcompositie deelt nu een presentatiecomponent met SocialProfile uit Design Preview: banner, vierkante avatar en actierij. Beide omgevingen behouden hun bestaande responsive stijlen en thema’s; de preview blijft expliciet fictief.

Het echte profiel toont uitsluitend opgeslagen profielvelden, echte serveraantallen, goedgekeurde private media en een nog geldige handlebinding. Verlopen verificatie wordt niet als actueel getoond. Edit profile opent op deze route een toegankelijk dialoogvenster met de bestaande editor en eenmalige walletautorisatie; succesvolle opslag ververst de profielquery en sluit de editor. Sluiten of wisselen van wallet tijdens signing maakt de clientpoging ongeldig. Een niet-gekoppelde wallet krijgt een instelstatus, nooit @ansem of een ander voorbeeldprofiel. De bestaande Account management & wallet-sectie behoudt creatie, selectie en verificatie. Geen publieke walletlogin of deelname geactiveerd; gebruikersacceptatie blijft open.

### Stap 4 — sociale acties in de afgeschermde shell

De eigen profielroute heeft onder Posts de bestaande echte composer. Plaatsen en reageren gebruiken de geselecteerde profielcontext; geslaagde acties verversen tijdlijnen, profielaantallen en meldingen. Zoeken blijft gekoppeld aan de bestaande serverfilters voor profielen en berichten, met lege resultaten zonder fictieve fallback en gesynchroniseerde zoektekst bij navigatie. Volgen/ontvolgen, block/mute en postacties gebruiken dezelfde bestaande serveracties met zichtbare actieve en wachtstatus.

Meldingen zijn bereikbaar vanuit desktop- en mobiele navigatie, worden iedere twintig seconden opgehaald en kunnen via de bestaande actie als gelezen worden gemarkeerd. De vaste meldingen- en bewaarroutes laten zich niet door andere view-, profiel- of postparameters vervangen. Messages staat niet in de live navigatie. Sociale lijstqueries en gesprekken hebben een walletcontextspecifieke cache; een contextwissel remount de werkruimte en wist lokale concepten. De client weigert nieuwe sociale schrijfacties zonder de actuele geverifieerde profielcontext en onderdrukt callbacks uit een verlaten context. Dit trekt reeds ontvangen serververzoeken niet in en vervangt geen serverautorisatie: de bestaande admin-only ontwikkelautorisatie en eigendomscontroles blijven leidend. Geen publieke walletlogin, publieke deelname of nieuwe gegevensrechten ingeschakeld. Eindgebruikersacceptatie blijft open.

### Stap 5 — hergebruik van Pay en Contacts

Profielacties, profielzijpanelen en de algemene Pay-knop gebruiken één NetworkPaymentDrawer met de bestaande Pay- en ContactsWorkspace-schermen. Contacts → Send geeft alleen het geselecteerde contact en diens eigenaarwallet rechtstreeks door; teruggaan opent opnieuw de bestaande private adreslijst. De panelen sluiten en wissen de lokale selectie bij wallet-, adapter-, connectie- of sociale contextwissels. Andere profielontvangers openen na de bestaande identityRecipient-controle dezelfde review binnen de Network-shell, zonder nieuwe betaalroute of vervangende resolver.

Embedded Pay erft geen request-, receipt-, handle- of amount-parameters en geen ontvangerstate van de omliggende Network-route. Een expliciete profielontvanger of contactselectie is de enige doorgegeven context; de zelfstandige Pay-route behoudt zijn bestaande link- en receiptgedrag. SOL en tokens gebruiken ongewijzigde servervoorbereiding, hercontrole, ontvangerbinding en walletsiging. Een verlaten paneel of gewijzigde walletcontext blokkeert vervolgstappen vóór indiening na signing; reeds ingediende transacties worden daarmee niet teruggedraaid. De bestaande tokenherstelgegevens blijven behouden. Profielcontactopslag controleert de actuele context opnieuw na de asynchrone ontvangerlookup. Geen custody, automatische betalingen, publieke contactgegevens, nieuwe betaalprovider of gewijzigde opslagrechten toegevoegd. Gebruikersacceptatie blijft open.

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