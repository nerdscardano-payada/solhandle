# SolHandle Social — code-audit & geprioriteerd webplan

Datum: 23 oktober 2026. Basis: de bestaande implementatie en het nieuwe desktopconcept. Dit is broncodeonderzoek, geen runtime-, penetratie- of releasecertificering. Aanwezig in code betekent niet bewezen productierijp.

## Conclusie: dezelfde richting, geen herbouw

Het voorbeeld brengt bestaande identity-, social-, Contacts- en Pay-onderdelen visueel samen. Het is geen opdracht voor een tweede wallet, handle-register of zelfstandig gebruikerssysteem. Het minten blijft de kern van SolHandle; Social moet extra redenen geven om een handle te claimen. De officiële branding en de bestaande startpagina blijven behouden.

De vorige stap leverde vooral profielstyling en kaarten. Het nieuwe voorbeeld vraagt een compactere, permanente desktopnavigatie, zoeken boven de feed, een centrale composer en contextuele zijpanelen. Dat is een andere indeling, niet uitsluitend andere kleuren. Messaging en communities krijgen uiteindelijk eigen ruime werkplekken, geen volwaardige apps in een smalle rechterkolom.

## Modulematrix met bewijs uit de code

| Module | Feitelijke implementatiestatus | Hergebruik en bewijs | Nog nodig |
|---|---|---|---|
| Primary Handle / NFT-eigendom | Bestaande directe mainnet-resolutie, inclusief officiële collectie, asset en huidige eigenaar. | Ja. `base44/shared/solhandleResolver.ts:35–58`, `reverseResolveSolHandle`, `useProfileIdentity.js:10–29`. | Productie-acceptatie bij transfers, walletwissel, ontbrekende Primary en RPC-onzekerheid. Geen nieuwe resolver bouwen. |
| Walletverbinding | Bestaande wallet-adapter en selectie, desktop/mobile-transport en message signing. | Ja. `WalletButton.jsx:16–68`, `signConnectedMessage.js`, `WalletSessionGuard.jsx`. | Verbinding is geen Network-login. Connector niet opnieuw bouwen. |
| Wallet-authenticatie | Werkelijke doelgebonden ontwikkelproof: nonce, drie minuten geldig, Ed25519 en eenmalige consumptie. Geen productiesessie. | Verifier en signing herbruikbaar. `base44/shared/networkWalletProof.ts:9–31`. `networkLab/entry.ts:15–22` vereist daarnaast al een ingelogde admin. | De ontbrekende schakel is signature → ondersteunde serververifieerbare sessie → vaste Network-account, met rotatie, intrekking en recovery. Niet aangetoond in de huidige code; niet automatisch een bewezen platformonmogelijkheid. Geen eigen authbackend, synthetische email of Contacts-token als vervanging. |
| Sociaal account en profiel | Stabiele UUID, afzonderlijk profiel, bio, website, links, avatar/banner en PERSON/CREATOR/PROJECT. Publiek alleen expliciete operatorpublicaties; volledige bewerking in lab. | Ja. `NetworkAccount`, `NetworkProfile`, `networkLabProfiles.ts:5–55`, `NetworkProfileHeader.jsx`, `LabProfileHero.jsx`. | Productie-onboarding, privacy, professionele velden, projectverificatie en eigen sociale profieltoegang. `/profile` blijft het walletdashboard. |
| Feed en posts | Persistent publiceren, reageren, bewerken, verwijderen, media, mentions, Latest/Following/Discover, paginatie en accountgebonden historische handle-snapshots in lab. | Ja. `networkLabPosts.ts:7–74`, `LabComposer.jsx`, `LabFeed.jsx`, `LabPostManage.jsx`. Openbare leesprojecties in `networkRead/entry.ts:14–65`. | Productieautorisatie, expliciete editmarkering, quote-posts, categorieën Solana/Builders/Communities en verder afgebakende ranking. Die categorieën nu niet als werkende filters tonen. |
| Volgen en interacties | FOLLOW/LIKE/REPOST/BOOKMARK/BLOCK/MUTE op vaste account-ID's; blokkeren verwijdert follows. Werkend pad in adminlab, geen publieke deelname. | Ja. `networkLabInteractions.ts:3–31`, `networkLabContext.ts:27–45`. | Atomische uniciteit/idempotentie: huidige lookup → create kan parallel dubbele interacties opleveren. Geen onbewezen claim van één unieke reactie onder gelijktijdige verzoeken. |
| Contacts | Afzonderlijk privé, wallet-beveiligd adresboek met bestaande unlock, serverzoeken, vaste opgeslagen ontvangerwallet en expliciete save. Labprofielen kunnen bestaande Contacts openen. | Ja. `WalletContact`, `contactRecords.ts:9–60`, `NetworkContactsAction.jsx`, `ContactPicker.jsx`, `ContactPickerPanel.jsx`. | Contacts heeft nog geen stabiele Network-accountverwijzing; `recipient_wallet` is niet dezelfde sleutel als een sociaal account. Later compatibel uitbreiden, niet het bestaande adresboek stil migreren. |
| Privéberichten | Geen Network-conversation/message-model, DM-endpoint of deelnemerrechten gevonden in de geïnspecteerde Network-modules. | Profiel-, block-, notificatie- en mediafundamenten gedeeltelijk herbruikbaar. `LabConversation.jsx` is een publieke post/replythread, geen privéchat. | Gesprekken en deelnemers op account-ID, berichtverzoeken, initiatieprivacy, berichtrechten, notificaties, opslag- en abusebeleid. Geen E2EE claim zonder echte ontworpen en geaudite implementatie. |
| Communities | Geen Network-communitylidmaatschap of kanaalautorisatie gevonden. Bestaande `LoungeChannel` / `LoungeMember` zijn afzonderlijke admin-only legacy-modellen met wallet/holderrollen. | Alleen na compatibiliteitsonderzoek. Geen bewijs dat Lounge voldoet aan accountgebaseerde private/public communities. | Community-ID, lidmaatschap, publieke/private toegang, kanalen, regels, aankondigingen en afgebakende beheer-/moderatierechten. NFT-toegang uitsluitend expliciet opt-in. |
| SolHandle Pay | Bestaande SOL- en tokenpaden, expliciete review/signature en ontvangercontroles. Labprofiel → Pay bevat account/bindingcontext. | Ja. `Pay.jsx:34–64,95–110`, `NetworkRecipientActions.jsx`, `preparePayTransaction/entry.ts:39`, `usdtPayFlow.ts:61`, `networkPaymentGuard.ts:5–15`. | Volledige acceptatie per asset (SOL/USDC/USDT/HANDLE), transfers en onderbroken transacties. Chats bestaan nog niet, dus chatbetaling nog niet geleverd. Geen custody of interne saldi. |
| Zoeken en discover | Pagina's zoeken gepagineerd op gepubliceerde namen/bio/posttekst; people en postranking in lab. | Ja. `NetworkSearch.jsx`, `networkRead/entry.ts:34–37,61`, `networkLabProfiles.ts:33–36`. | Exacte canonieke @lookup, bestaand on-chain handle zonder sociaal profiel correct tonen, projecten en communities. Bestaand zoeken niet als universeel zoeken adverteren. |
| Meldingen en moderatie | Lab follow/like/reply/repost/mention/ownershipmeldingen, read/unread, report/hide/restore/dismiss en domeinpolicy. | Ja. `networkLabSafety.ts:3–47`, `networkLabMentions.ts`, `networkDomainSafety`. | Productierechten, volledige cases/beroep, profielen rapporteren, DM/communitymeldingen en uitgebreider anti-spambeleid. Huidige ontwikkellimieten zijn geen complete productie-abusebescherming. |
| Responsive sociale UI | Werkelijke routes, publieke leesweergave en afgeschermde ontwikkelwerkplek; profielbanner en neonkaarten aanwezig. | Ja. `NetworkLayout.jsx`, `network.css`, `LabWorkspace.jsx`, publieke/lab profielcomponenten. | Volledige mobiele socialnavigatie en latere ruime messaging/communitywerkplekken. De desktopverbetering van vandaag is geen afgeronde volledige sociale applicatie. |
| Export en verwijdering | Algemene accountverwijdering bestaat, maar is geen volledige Network-data-export/verwijdering. | `deleteMyAccount/entry.ts` verwijdert de platform-User; geen aangetoonde afhandeling van Network-posts, relaties, media, bewaartermijnen of sessies. | Afzonderlijk volledig off-chain Network-export-/verwijderproces met herauthenticatie. NFT en on-chain historie nooit als sociale verwijdering behandelen. |

## Bestaande API's en opslag

- `networkRead`: expliciet publieke, gepagineerde projecties van gepubliceerde previewprofielen/posts. Geen private wallet- of sessiegegevens.
- `networkPreview`: operatorpublicaties, niet vermengen met labidentiteiten.
- `networkLab`: admin-only bootstrap, profielen, posts, interacties, media, identity proofs, safety, meldingen en test-entitlements. `testActor` controleert operator, vaste UUID, DEVELOPMENT en ACTIVE.
- Bestaand identity-/Pay-/Contacts-hergebruik: `resolveSolHandle`, `reverseResolveSolHandle`, `getOwnerHandles`, `preparePayTransaction`, `walletContacts`. Geen nieuwe variant van deze services nodig.
- Bestaande Network-entiteiten: Account, Profile, Post, Media, Interaction, Notification, WalletChallenge, IdentityRegistry, Report, ModerationAction, DomainDecision en Entitlement. De geïnspecteerde Network-entiteiten blijven admin-only; publieke leesrechten komen via begrensde projecties, niet door opslag open te zetten.
- `NetworkIdentityRegistry` registreert uitsluitend ontwikkel-walletbewijzen en sociale handlebindingsperioden met versiecontrole. Het mint of registreert geen handles en is geen autoriteit boven Solana. Capaciteitsgrenzen: 200 wallets / 500 bindingsperioden. Niet ongewijzigd opschalen tot productie-identiteitsregister.
- `networkFlags.ts:3`: publieke browse en ontwikkellab aan; walletAuthentication en contributions uit. Dat is concreet bewijs dat publieke deelname niet klaar/geactiveerd is.

## Architectuur- en veiligheidsgaten, op prioriteit

1. **P0 — echte Network-authenticatie.** Bewijs de ondersteunde sessieaansluiting op de bestaande wallet; koppel aan dezelfde vaste account. Bestaande adminlogin, walletconnectie en Contacts-unlock niet verwarren met Network-login. Sessieverval, herauthenticatie, intrekking en walletwissels aantonen vóór publiek schrijven.
2. **P0 — ownership en transfers.** De bestaande `networkIdentityRefresh.ts:5–31` doet on-demand hercontrole, een korte weergavecache en blokkeert gevoelige nieuwe acties bij onzekere/verloren ownership. Een continue ownership/Primary-watcher en productieclaims ontbreken. Verkoop van een handle mag nooit een account, DM's of rechten verhuizen. Een Primary-wijziging wordt gecontroleerd, maar activeert nu niet automatisch het nieuwe Primary op het sociale profiel.
3. **P0 — autorisatie en races.** Productierechten moeten server-side op de gevalideerde account rusten. Unieke follows/reactions/bookmarks en notificatie-idempotentie transactioneel oplossen; huidige admin-only toegang niet simpelweg verruimen.
4. **P1 — privacy en veiligheid.** Media-opslag is privé en handmatig goedgekeurd in lab, niet gelijk aan een bewezen malware-/inhoudsscan. Voeg ontbrekende datarechten, beleid, moderatieberoep en DM/communityrechten toe. Bestaande 18+-eis voor deelname blijft gelden.
5. **P1 — integratiecontracten.** Contacts-wallet is niet de sociale account. Handhaaf bestaande vaste ontvanger en transferwaarschuwingen; voeg later expliciete accountkoppelingen toe zonder automatische import of nieuwe eigenaar stil te vertrouwen.

## Nieuwe design- en productbaseline

Het aangeleverde SolHandle Social-concept van 23 oktober is de desktopreferentie. De eerdere 70 hoofdstukken blijven de architecturale basis; deze aanvulling verduidelijkt de interface en uitbreiding, zonder werkende mint-, wallet-, Contacts- of Pay-systemen te vervangen.

- Links: Home, Feed, Explore, Contacts, Communities, Messages, Payments en Profile; secundair meldingen/bookmarks en minttoegang. Eigen identiteit onderin, alleen echte gegevens. Walletverbinding en sociale sessie blijven zichtbaar verschillende zaken.
- Midden: zoeken bovenaan, compacte composer en tijdlijn; geen grote marketinghero boven de desktopfeed. Bestaande testcomposer blijft uitsluitend in het afgeschermde lab, publieke postactie legt de ontbrekende toegang uit.
- Rechts: echte openbare profielontdekking, bestaande privécontactkiezer naar het bestaande betaaloverzicht. DMs, joined communities, online-indicatoren en slimme suggesties pas tonen wanneer hun data en rechten bestaan. Geen voorbeeldpersonen, nepstatistieken, vertrouwensbadges of verzonnen transacties.
- Dark navy / near-black, cyan-paars-blauw, ingetogen gloed, afgeronde kaarten, officiële SolHandle-branding, duidelijke hiërarchie en minimale beweging. Tablet/mobiel blijven ondersteund; deze desktopstap verandert hun bestaande indeling niet bewust.
- Account ≠ wallet ≠ handle ≠ verificatie ≠ rechten. Handle altijd resolver-afgeleid, nooit vrij typbare gebruikersnaam. Geen professionele/projectverificatie afleiden uit NFT-bezit.
- Home in Social opent de sociale start/feed op `/network`; het officiële logo en aparte mintverwijzing openen `/`. Minten wordt dus niet verplaatst of vervangen.

## Geprioriteerde uitvoering en acceptatie

### Stap 0 — audit en functionele desktopshell (deze levering)

Geleverd: deze matrix en prioriteiten, desktopnavigatie rondom bestaande Network-routes, echte Primary-resolutie in een duidelijk als walletkaart gelabelde kaart, bestaande profielzoekfunctie in de topbalk, echte openbare profielontdekking, en bestaande Contacts → Pay-navigatie met vaste ontvangercontext. Onbeschikbare Messages/Communities expliciet gepland, geen lege routes of mockdiensten. Publieke profielactie blijft eerlijk bij de bestaande toegangspoort. Mintstart en bestaande zelfstandige Pay/Contacts-pagina's blijven behouden.

**Niet als voltooid tellen:** productie-sign-in, een ingelogde sociale eigen-profielkaart met followers/communities, een universele zoekmachine, DM's of communities. Pay en Contacts openen hun bestaande pagina; een blijvende sociale shell om die afzonderlijke producten is nog niet geleverd.

### Stap 1 — identiteit en publieke toegang (P0)

Hergebruik signing/verifier en resolver. Sluit ondersteunde auth aan, maak/retrieve idempotent dezelfde account en valideer Primary. Bouw sessiebeheer, privacy, export/verwijdering, transfer-/Primarywatcher en unieke claims. Sluit af met walletwissel, noncehergebruik/verval, ingetrokken sessie, accountrecovery en Alice → koper zonder toegangsoverdracht. Geen publieke writes voordat dit bewezen is.

### Stap 2 — bestaande social core productierijp maken (P0/P1)

Geen nieuwe feed bouwen: huidige profielen, composer, posts, replies, follows, media, block/report en meldingen doorzetten naar correcte accountautorisatie. Unieke interacties, veilige mediatrajecten en moderatie afronden. Editmarkering en quote-posts toevoegen; feedcategorieën alleen met concrete inhoudsregels. Chronologie en transparante ranking, geen tokensaldi als rangschikking.

### Stap 3 — Contacts en messaging (P1)

Contacts compatibel koppelen aan stabiele accounts; apart gesprek/deelnemer/berichtmodel, participant-only reads/writes, verzoeken, privacy-initiatie, blockregels en meldingen. Eigen volwaardige gesprekslayout, sidebar uitsluitend voor een samenvatting. Authenticeer deelnemers onafhankelijk van het huidige NFT-bezit. E2EE uitsluitend na aantoonbare implementatie en audit.

### Stap 4 — communities en professioneel netwerk (P1/P2)

Eigen community/lidmaatschap/kanaalmodel met publieke/private grenzen, moderatoracties, regels en berichten. Vrijwillige professionele velden en projectprofielen uitbreiden in het gedeelde profielmodel, geen onafhankelijk account. Officiële projectclaims vereisen een apart verificatieproces. Communities niet standaard NFT-gaten.

### Stap 5 — Pay uitbreiden, niet uitstellen (doorlopend)

Profiel-/contactbetalingen bestaan al en blijven bruikbaar waar geautoriseerd. Nieuwe gesprek/kaartcontexten pas aansluiten nadat hun accountrechten bestaan. Geen interne saldi, custody, automatische transfers of in de UI beloofde dollarkoers. Huidige eigenaar en oorspronkelijke bedoelde ontvanger opnieuw controleren; expliciete review, eigen walletsigneeractie en bevestigde transactiestatus behouden.

### Releasepoort

Alle vijftien acceptatiecriteria uit het nieuwe plan blijven open totdat aangetoond: wallet-login; Primary; veilige transfer; actuele profielen; publiceren/interacties; persistente follows; private gesprekken; communityrechten; canonieke handlezoekfunctie; veilige betalingen; block/report/anti-spam; responsive werking; mint/Pay-regressie; geen dubbele identiteit/walletinfrastructuur. Bouwsucces is geen bewijs voor deze gebruikersscenario's. De aparte Testing Agent kan de gebruikersflows uitvoeren; security-/concurrencyreview blijft daarnaast vereist.