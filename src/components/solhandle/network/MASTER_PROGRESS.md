# Master development specification — voortgang

Leidend: MASTER_SPECIFICATION.md, ontvangen 22 oktober 2026. Dit is een eerlijke implementatiematrix, geen verklaring dat het volledige product klaar of integraal getest is.

## Update 23 oktober 2026 — Social webplan

Nieuwe code-audit en geprioriteerd plan: `SOCIAL_WEB_AUDIT.md`, inclusief bronverwijzingen en concrete verschillen tussen productie, publieke operatorpreview, adminlab en ontbrekende functies. Via **Audit & bouwplan** in de adminontwikkelsectie van Network te lezen/downloaden.

De eerste desktopshell hergebruikt bestaande Network-routes, officiële branding, profielzoekfunctie, Primary-resolver, privécontactkiezer en Contacts → bestaand Pay-overzicht met ontvanger-/walletcontext. Desktop krijgt vaste navigatie, zoeken boven de feed, duidelijke walletkaart en echte publieke profielontdekking. Minten blijft op de bestaande startpagina. Mobiele indeling en bestaande auth-/betalingsregels worden niet vervangen.

Niet geleverd of geactiveerd: publieke wallet-native Network-login, eigen ingelogde sociale profielkaart/statistieken, privéberichten, communities, onlinepresence, universeel handle/project/communityzoeken, nieuwe feeds of professionele verificatie. Messages/Communities zijn uitgeschakeld en gelabeld Planned, geen nieuwe mockpagina's. Pay en Contacts blijven zelfstandige bestaande pagina's; niet claimen dat zij al volledig onder de sociale shell vallen. Er is geen tweede identiteit, wallet, adresboek of betaalbackend gemaakt.

## Update 24 oktober 2026 — Deelknoppen in mainnet-implementatieplan

De subtiele profieldeelknoppen uit DesignPreview worden meegenomen in de bestaande vijfstappenmigratie. Status: ontwerpvoorbeeld aanwezig; productie-integratie en acceptatie nog open. Dit onderdeel activeert geen mainnet-functionaliteit.

- **Stap 1 — Design/structuur:** behoud de compacte LinkedIn-, X- en Discord-knoppen in het profieloverzicht, passend bij het huidige ontwerp en bruikbaar op desktop en mobiel.
- **Stap 2 — Identity:** bepaal de canonieke openbare deellink vanuit de echte profielidentiteit en actuele handlebinding, niet vanuit demo-@ansem of een previewroute. Onderscheid de stabiele sociale profiel-URL van de overdraagbare handle-URL; een gedeeld profiel mag na NFT-overdracht niet ongemerkt naar het account van de koper wijzen.
- **Stap 3 — Pay/Contacts:** geen nieuwe betaal- of contactlogica nodig; bestaande ontvangercontext en privacygrenzen blijven ongewijzigd.
- **Stap 4 — Social:** hergebruik de deelcomponent in het productieprofiel. LinkedIn en X openen hun deelvenster met correct gecodeerde openbare URL en passende tekst. Discord kopieert tekst en link met zichtbare bevestiging en handmatig kopieerpad bij geweigerde klembordtoegang; geen automatische Discord-post, OAuth of bot nodig. Deel uitsluitend openbare gegevens, nooit sessietokens of private walletinformatie.
- **Stap 5 — Release:** onderstaande acceptatie aantoonbaar afronden vóór vrijgave van de productieknoppen.

### Acceptatie deelknoppen — nog uit te voeren

- [ ] LinkedIn en X ontvangen de juiste canonieke link voor het bekeken profiel, niet steeds de eigen ingelogde handle.
- [ ] Discord kopieert de juiste tekst en link; bevestiging en handmatig kopiëren werken bij ontbrekende klembordtoegang.
- [ ] De gedeelde bestemming opent voor uitgelogde bezoekers en deelt geen preview-URL, privégegevens of ongepubliceerd profiel.
- [ ] Handleloos profiel, gewijzigde Primary Handle en NFT-transfer volgen het goedgekeurde profiel-/handle-URL-beleid zonder oude content aan een nieuwe eigenaar toe te schrijven.
- [ ] Knoppen blijven subtiel, leesbaar en met toetsenbord/touch bedienbaar in light/dark en op desktop/mobiel; bestaande profielacties blijven werken.

## Uitvoeringsregel

Sociale functionaliteit doorbouwen achter testtoegang. Productie-authenticatie beperkt alleen de vrijgave van de betreffende publiek beschrijfbare onderdelen, niet de ontwikkeling van profielen, feeds, interacties, notificaties, media of entitlements. Bestaande walletconnectie en `/profile` blijven zelfstandig; geen tweede wallet, synthetische emails of alternatieve deelnemerslogin toevoegen.

| Mastersectie | Huidige implementatie | Nog te voltooien |
|---|---|---|
| 1 Product | Eigen social routes en core message, sociale accounts los van walletdashboard | Volledige eigenaargebonden publieke @identiteit |
| 2 Scheiding | `/profile` ongewijzigd; eigen Network-modellen en rechten | Network settings en uiteindelijke handle-routes |
| 3 Wallet | Bestaande walletinfrastructuur niet gewijzigd of vervangen | Veilige hergebruikte wallet-sign-in verbinden aan ondersteunde sessies |
| 4 Login | Doelgebonden ontwikkel-walletproof met bestaande geselecteerde wallet, Ed25519-verificatie, 3-minuten nonce en eenmalige atomische consumptie; geen alternatieve emailflow | Dit is geen productielogin: ondersteunde wallet-native sessies, revocatie/rotatie en wallet/mobile-acceptatie blijven open |
| 5 Primary Handle | Na walletproof directe on-chain collectie-/asset-/ownercontrole; actuele Primary of geselecteerde kandidaat; 60 seconden statuscache en verse controle voor nieuwe sociale identiteitsacties | Productie-indexer/watchers en volledige transferacceptatie |
| 6 Scheiding identiteiten | Stabiele account-UUID; geverifieerde beheerwallet blijft aan account, afzonderlijke handleperioden; niets sociaal verhuist bij NFT-transfer | Productierecovery/meerdere-walletbeheer en projectrechten |
| 7 UUID | Expliciete testaccountaanmaak; alle ontwikkel-wallet-/handleclaims atomisch via één vooraf aangemaakte registryrecord met versie-CAS | Idempotente productieregistratie en schaalbare opslagmigratie |
| 8 Transfer | Bindingperioden met begin/einde; nieuwe posts bewaren handle + binding-ID + account-UUID; verse controle kan oude binding beëindigen en vorige account notificeren | Continue transferwatcher en bewezen Alice/koper-acceptatie |
| 9 Follow graph | Volgen verwijst naar account-UUID, niet NFT of wallet | Productieconcurrency en transferacceptatie |
| 10 Profiel | Avatar/banner, naam/bio/links, sociale aantallen, follow/share, Posts/Replies/Media/About; in lab actuele @ownership-/Primary-/Pay-status en bestaande Pay/Contacts-acties | Volledige productieprofielen, View Handle en productiesettings |
| 11 Badges | Lab ownership-/Primary-status uitsluitend uit geverifieerde proof en directe chaincontrole, met expliciete houdbaarheid; geen trust/KYC/saldo-inferentie | Productievrijgave en integratieverificatieprocedure |
| 12 Bewerken | Testnaam, bio, website, social links, type, avatar/banner opgeslagen op dezelfde account-ID | Deelnemersautorisatie, volledige profiel/privacysettings |
| 13 Sociale features | Tekst/afbeeldingen, bevestigde externe links, accountmentions, tijd, edit/delete/share, replies, likes/reposts/bookmarks/follows/block/mute | Transactioneel één actieve like, productie-idempotentie en volledige media-abusepijplijn |
| 14 Feeds | Latest/Following chronologisch, eenvoudige servergetelde Discover-score zonder saldo/tokengewicht | Unieke engagementtelling, recente velocity, duplicaat-/abusesignalen en productierankingacceptatie |
| 15 Composer | Toont geverifieerde @handle in lab; geconfigureerde maar onzekere/verloren ownership blokkeert nieuwe posts; server-side verse check; ongebonden testidentiteiten blijven beschikbaar voor ontwikkeling | Productiesessies en optionele project/betaalbijlagen |
| 16 Discover | Testprofiles/people en werkelijke postactiviteit, geen gefingeerde populariteit | Uitgebreide creator/project/business/integratiesecties |
| 17 Search | Testnaam/bio/posttekst met paginatie | Exacte @prioriteit, actuele handlelookup zonder fake profiel, projectzoeken |
| 18 Notifications | Follow/like/reply/repost/mention en concrete ownership-change-meldingen; schema ondersteunt project/integration/security | Overige concrete producenten, productiesessies, idempotentie en voorkeuren |
| 19 Pay | Labprofiel opent bestaande Pay met vast account/bindingcontext; SOL/USDC/USDT/HANDLE controleren server-side dezelfde binding én verse chainowner bij prepare/submit | Wallet-/transfer-end-to-endacceptatie en productiedeelnemers |
| 20 Contacts | Labprofiel hergebruikt bestaande wallet-beveiligde Contacts, expliciete unlock/save en In Contacts; geen tweede adresboek of automatische graphimport | Volledige UX-acceptatie en productiedeelnemers |

## Media in deze ontwikkelstap

- Testavatars, banners en postafbeeldingen worden privé opgeslagen. Databaserecords bevatten private file URI's, geen base64 of blijvende publieke downloadlinks.
- De browser decodeert en herencodeert rasterafbeeldingen, verwijdert bronmetadata en verkleint tot maximaal 2048 pixels. Alleen JPEG/PNG/WebP, input tot 10 MB en 40 megapixels.
- Nieuwe media zijn PENDING en verschijnen niet in profiel/feed tot een operator ze handmatig heeft goedgekeurd. Dit is uitsluitend een testreview, geen bewezen malware-/inhoudsscan.
- Mediareferenties worden server-side gecontroleerd op goedgekeurde status en eigendom van de actieve testaccount. Alle NetworkMedia-operaties zijn admin-only.
- Weergave gebruikt kortlevende ondertekende links; reeds uitgegeven links verlopen na maximaal vijf minuten. Opslagverwijdering, wettelijke bewaartermijnen en volledige productiemediaquarantaine zijn nog open.

## Bewijsstatus

Bouwcontrole en begrensde backendcontroles worden uitgevoerd bij implementatie. Geen volledige UX-/transfer-/securityacceptatie claimen zonder bewijs. Gebruik de Testing Agent voor de volledige gebruikersscenario's.

## Directe volgende productonderdelen

1. Bestaande ontwikkel-walletproof, handleperioden en Pay/Contacts end-to-end laten accepteren; dit vervangt geen productieauthenticatie.
2. Globale exacte handlezoekresultaten, projectkaarten en echte verbonden integraties.
3. Network settings/privacy, sociale concurrency/idempotentie, moderatieberoep en productie-abusecontrole.

## Volledige specificatie 1–70

Alle ontvangen secties 1–70 zijn opgenomen. De volgende onderdelen zijn niet stilzwijgend voltooid:
- 21–22: gedeelde testprofielen PERSON/CREATOR/PROJECT bestaan; BUSINESS-modules en Connected Integrations nog open. Geen fictieve partnerkaarten.
- 23–26: centrale optionele entitlement-testlaag bestaat; geen definitieve drempels, betalingen of premiumtools geactiveerd. Geen invloed op vertrouwen/ranking/rechten.
- 27–35: basisreport/block/mute en handmatige domeinpolicy bestaan; uitgebreid case-/appealmodel, adreslabels, spambots/challenges en automatiseringslabels blijven open.
- 36–41: sociale data en media blijven off-chain; private media, geen publiek saldo. Volledige privacyinstellingen, export, Network-verwijdering en consentbewuste analytics blijven open.
- 42–46: deelnemersauthenticatie niet vervangen door synthetische emailaccounts of zelf uitgegeven sessietokens; lab blijft admin-only, publieke registratie/schrijven uit.
- 47–48: bestaande NetworkAccount is de stabiele sociale accountbron. In het lab wonen walletclaims en handleperioden samen in één begrensde registry om exclusiviteit atomisch af te dwingen; geen tweede NetworkUser aangemaakt. Sociale interactie-uniciteit en productieopslagmigratie blijven open.
- 49–50: ownershipcontrole op selectie, profielstatus bij verlopen cache en elke nieuwe gevoelige labactie; on-demand transferafhandeling. Een continue ownershipwatcher is nog niet gebouwd.
- 51–58: Network-layout en basistools bestaan; volledige admin/settings/mobile-productafwerking, media-malwarescan, actielimieten en onveranderlijke auditarchitectuur blijven open.
- 59–65: wallet-, race-, transfer-, abuse- en UX-acceptatiematrices blijven open. Build en begrensde servercontroles zijn geen end-to-endbewijs.
- 66–70: gefaseerde levering blijft leidend; de eerste echte publieke beta volgens alle 24 acceptatiepunten is nog niet compleet. Verboden scope niet toegevoegd.

## Identiteits- en ontvangergrenzen van deze stap

- Alleen admins gebruiken NetworkIdentityRegistry, NetworkWalletChallenge en NetworkNotification. Niet-publieke wallets/proofs worden niet via publieke Network-readprojecties vrijgegeven.
- De registry wordt uitsluitend vooraf aangemaakt; runtime doet nooit find-then-create. Bij geen/meerdere registryrecords faalt de flow gesloten. Eén plain-ID + versie updateMany met `updated === 1` serialiseert wallet-/account-/assetclaims. Dit voorkomt de race van losse uniqueness-lookups; maximaal 200 wallets en 500 historische bindingen, daarna gesloten blokkade, geen gewiste historie.
- De walletproof is doelgebonden aan origin, operator, vaste account-ID, wallet, gekozen handle en vervaldatum. Geen JWT, login-token, productie-cookie of vervangen platform-authbackend.
- Uitgegeven ownershipstatus blijft maximaal 60 seconden bruikbaar voor weergave; nieuwe posts/likes/reposts/follows krijgen een verse chaincontrole. RPC-onzekerheid zet UNCERTAIN en blokkeert die acties; bestaande verwijder-/safetyrechten blijven beschikbaar.
- Een handletransfer beëindigt de oude binding, niet de sociale account of geverifieerde beheerwallet. Oude posts houden hun historische snapshot; profielklik blijft naar dezelfde UUID leiden.
- Pay behoudt de account/bindingcontext in bestaande prepare/submit voor alle vier bestaande assets. De chainowner moet nog steeds bij dezelfde binding passen; geen automatische betaling en geen stille redirect naar een nieuwe eigenaar. Normale Pay-zonder-Networkcontext blijft ongewijzigd.
- Contacts gebruikt de bestaande private walletsessie en bewaart expliciet de vaste geverifieerde ontvanger. Opslaan is een gebruikersactie, geen automatische import.

Entitlementarchitectuur bestaat al voor optionele accountcapabilities met expiratie/intrekking. Testgrants implementeren de premiumtools niet automatisch en geven nooit vertrouwen, verificatie, moderatieprioriteit of rankingvoordeel.