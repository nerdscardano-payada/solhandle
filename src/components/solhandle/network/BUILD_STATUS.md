# SolHandle Network — uitvoering en resterende scope

Datum: 22 oktober 2026. Dit is een opleveringsregister, geen compliance- of releaseverklaring.

## Opdracht en productlijn

De producteigenaar heeft gevraagd het volledige Network te bouwen volgens de aangeleverde richting. Uitvoering gebeurt in samenhangende werkende modules, niet als een onbeveiligde alles-in-één release. De aanvraag is geen bewijs dat technische of juridische acceptatie al is geslaagd.

Blijvende identiteit en historische auteurverwijzingen blijven los van de overdraagbare handle. Wallet-native login blijft vereist; geen emailfallback of eigen authenticatiebackend. Minten maakt niet automatisch een sociaal profiel: de expliciete deelnamevoorwaarde A-07 blijft gelden. Gratis kernfuncties, 18+, off-chain sociale data, geen betaalde veiligheid en geen DMs/advertenties in de eerste alpha blijven uitgangspunt. Non-custodial alleen is geen juridische vrijstelling.

## Nu geïmplementeerd

### Publiek leesbare productlaag, 22 oktober 2026

- Eigen Network-routes: `/network`, `/network/discover`, `/network/search`, `/network/account/:publicId`, `/network/post/:postId`, `/network/notifications`, `/network/bookmarks`, `/network/access`.
- `/profile`, mint, bestaande wallets, Pay en Contacts blijven afzonderlijk en ongewijzigd. Network is vindbaar via desktopmenu, mobiele Meer en footer.
- Sociaal-first profielen met bio, profieltype (persoon/creator/project), social links, Posts/Replies/Media/About, deelbare profiel- en gesprekslinks, echte servergetelde publicaties en replies.
- Chronologische Latest-feed, gesprekken, replies, directory en server-side zoeken met cursorpaginatie. Geen fictieve gebruikers, volgers of posts ingezaaid.
- Following, likes, follows, reposts, bookmarks, meldingen en registratie tonen expliciet de ontbrekende Network-sessievereiste; zij slaan geen schijnacties op.
- Afzonderlijke admin-publicatieflow op `/admin/network-preview`: expliciet eigen operatorpreviewprofiel als draft/public/hidden, openbare tekstposts en replies, eigen posts verwijderen. Operatorpreview is géén wallet-native deelnemersaccount, kan geen handle claimen en krijgt geen ownershipbadge of Pay-bestemming.
- NetworkAccount, NetworkProfile en NetworkPost zijn admin-only opgeslagen met expliciete RLS op alle operaties. Een begrensde publieke leesfunctie geeft alleen een allowlist van bedoelde gepubliceerde velden terug, niet platformemails, interne account-ID's, maker-/sessiemetadata of walletkoppelingen.
- Server-side flags scheiden publiek lezen en operatorpreview van walletauth, bijdragen, moderatie en entitlements. Die laatste vier blijven uit. Browser/requestdata kan ze niet aanzetten.
- Tekst wordt als tekst weergegeven, niet als HTML; tekstlinks worden niet automatisch klikbaar. HTTPS-profielexterne links vereisen een waarschuwing voordat ze worden geopend; geen netwerkfetch van gebruikers-URL's.
- Geen nieuwe sessies, nonce-authbackend, synthetische emails of automatische accounts door walletconnectie. Account/wallet/handle/permissions blijven onderscheiden; transactionele exclusiviteit wordt niet door de preview geclaimd.

### Afgeschermde social productontwikkeling, 22 oktober 2026

- Nieuwe `/network/lab`-workspace achter platformbeheerderstoegang én serverflag `developmentSocial`. Dit is expliciete testtoegang, geen alternatieve Network-login of publieke deelname.
- Eén operator kan maximaal twaalf eigen testidentiteiten aanmaken/schakelen; vaste account-ID's, aparte developmentmodus. Geen wallet-/handleclaim, synthetische email, providerwijziging of automatisch lidmaatschap.
- Testprofielbewerking (naam, bio, persoon/creator/project, HTTPS-links), posts bewerken/verwijderen, replies en gesprekken, like/unlike, repost/undo, bookmark/undo, follow/unfollow, followers/following-lijsten.
- Latest, Following, Discover, eigen bookmarks/reposts en tekst-/profielzoeken met paginatie. Following toont originele posts van gevolgde accounts plus eigen posts; reposts hebben daarnaast een eigen overzicht. Discover gebruikt serveropgeslagen score = likes + 2×reposts + 3×zichtbare replies, zonder tokenweging.
- In-app testnotificaties bij follow/like/repost/reply, ongelezen teller en eigen notificaties markeren als gelezen. Geen emails of native push toegevoegd.
- Block/mute beïnvloeden server-side feed/conversaties; block verhindert nieuwe like/repost/follow/reply-interacties en verbreekt follows in beide richtingen. Profielen blijven vindbaar om eigen block/mute terug te draaien.
- Testpostrapportage met reden, admin-moderatiequeue, hide/dismiss/restore met verplichte motivering en leesbare beslissingengeschiedenis. Alleen testposts worden gemodereerd; er is nog geen bezwaarflow of productiemoderatie.
- Accountgebonden optionele entitlementarchitectuur met 24-uurs testgrants en intrekking. Geen tokenbalans als autoriteit, geen ownership-/trust-/moderatie-/rankingentitlements. Het verlenen van een capability implementeert nog niet de bijbehorende premiumtool.
- Alle nieuwe interacties, notificaties, meldingen, moderatieacties en entitlements zijn admin-only met expliciete RLS op lezen/aanmaken/wijzigen/verwijderen. De functie controleert elke gekozen testactor op de ingelogde operator. Admins behouden platformbreed beheerrecht.
- Testcontent heeft `preview:false`; bestaande publieke API's selecteren uitsluitend `preview:true`. Publieke productiepublicaties worden niet met testinteracties of testcontent vermengd.
- Geen testcontent automatisch ingezaaid. Testidentiteiten worden uitsluitend op expliciete knopdruk gemaakt.
- Grenzen: testmodellen bewijzen geen transactionele exclusiviteit, atomische interactiededuplicatie of productieconcurrency. Relatieverzamelingen zijn expliciet begrensd tot 200 en geven bij overschrijding een fout in plaats van stil onvolledig door te gaan. Alleen testposts hebben nu een serverlimiet (8/minuut); volledige bot/CAPTCHA-bescherming volgt.

### Bestaand ondersteunend Safety Center

- Intern Safety Center op `/admin/network-safety`, bereikbaar vanuit het bestaande developer dashboard.
- Nieuwe domeinbesluiten opslaan met canonieke hostname, classificatie, motivering, beheerder en tijdstip.
- Besluithistorie met serverfilters en cursorpaginatie. Wijzigen via deze UI schrijft een nieuw besluit; geen overschrijving van vorige besluiten.
- Exacte-hostnamebeleid opvragen: BLOCK bij BLOCKED, WARN bij onbekend/verdacht/HTTP/IDN, anders ALLOW volgens opgeslagen beleid. UNKNOWN is geen geconstateerde phishing. TRUSTED is geen veiligheidsgarantie.
- Domeinen worden met de URL-parser naar punycode genormaliseerd; IDN en ongecodeerde HTTP leiden ook bij een trusted-besluit tot waarschuwing.
- Geen externe URL-fetches: geen scanner, redirectresolver of SSRF-aanvalsoppervlak in deze module.
- Functie en route vereisen een bestaande platformbeheerder. Dit is interne operatorauthenticatie, geen alternatieve login voor Network-deelnemers.
- NetworkDomainDecision is uitsluitend door admins lees-/schrijfbaar. De app-UI voegt besluiten toe; dit is geen extern onveranderbaar auditlog. Platformadmins behouden volledige rechten.

## Grenzen

Domeinbeleid wordt nog niet buiten het interne controlepaneel afgedwongen. Subdomeinen erven geen vertrouwde status. Het laatste opgeslagen besluit voor een exacte hostname wordt gebruikt; dit is geen transactionele accountbinding of bewezen concurrencyoplossing. Geen fictieve meldingen, volgers, posts of accounts aangemaakt.

## Niet gebouwd door deze oplevering

1. Ondersteunde wallet-native platformauthenticatie, sessie-/credentialintrekking en transactionele exclusiviteit. B-BLOCK-01/02 blijven open; de geraadpleegde platformdocumentatie bewijst geen signature-naar-platformsessie of email-loze matching.
2. Geverifieerde deelnemersaccounts met beheerwallets en historisch gescheiden handlebindings; transactionele transferisolatie en verse autorisatie op iedere deelnemerschrijfactie. De nieuwe operatorpreview-account-ID's claimen deze garanties niet.
3. Privacy Center, export, verwijderpijplijn, bewaartermijnen, consent en sessiebeheer voor Network.
4. Productierapportage, -block/mute en -moderatie plus bezwaar/inhoudelijke beheerprocessen. De afgeschermde testvariant van rapportage, block/mute en gemotiveerde moderatie is nu gebouwd.
5. Server-side rate limits, CAPTCHA-escalatie, linkinterceptie, phishingbronnen, botrisico en incident/noodstopmechanismen.
6. Schrijven en interacties door echte wallet-native deelnemers: profielbewerking, posts/replies, likes, follows en actuele geverifieerde handle/Pay-binding. Publiek lezen en eigen operatorpublicaties zijn nu afzonderlijk werkend.
7. Productieactivering van reposts/notificaties/bookmarks, profielafbeeldingen/banners, mediaquarantaine, Pay-handlebinding, projectkaarten en verbonden integraties. De labvariant van reposts/notificaties/bookmarks, transparante engagementranking en accountgebonden entitlementgrants is gebouwd; echte $HANDLE-providerregels en premiumtools nog niet.
8. Business, scheduling, API en latere optionele automatisering/DMs.

## Vrijgave

Publiek lezen is beschikbaar; er zijn geen sociale deelnemers toegelaten. Navigatie bevat nu een aanvullende Network-link, bestaande producten zijn niet vervangen. Productontwikkeling loopt door naast safety/privacy; de eerdere documenten blokkeren niet de onafhankelijke publieke productlaag. Alleen functies die een nog onbewezen sessie-/walletbinding nodig hebben blijven afgeschermd. Juridische documenten, DPIA, leeftijdsaanpak, bewaartermijnen en tokenutility zijn hiermee niet juridisch afgetekend.