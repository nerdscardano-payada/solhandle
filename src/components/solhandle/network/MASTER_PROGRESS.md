# Master development specification — voortgang

Leidend: MASTER_SPECIFICATION.md, ontvangen 22 oktober 2026. Dit is een eerlijke implementatiematrix, geen verklaring dat het volledige product klaar of integraal getest is.

## Uitvoeringsregel

Sociale functionaliteit doorbouwen achter testtoegang. Productie-authenticatie beperkt alleen de vrijgave van de betreffende publiek beschrijfbare onderdelen, niet de ontwikkeling van profielen, feeds, interacties, notificaties, media of entitlements. Bestaande walletconnectie en `/profile` blijven zelfstandig; geen tweede wallet, synthetische emails of alternatieve deelnemerslogin toevoegen.

| Mastersectie | Huidige implementatie | Nog te voltooien |
|---|---|---|
| 1 Product | Eigen social routes en core message, sociale accounts los van walletdashboard | Volledige eigenaargebonden publieke @identiteit |
| 2 Scheiding | `/profile` ongewijzigd; eigen Network-modellen en rechten | Network settings en uiteindelijke handle-routes |
| 3 Wallet | Bestaande walletinfrastructuur niet gewijzigd of vervangen | Veilige hergebruikte wallet-sign-in verbinden aan ondersteunde sessies |
| 4 Login | Geen vervangende email/embedded-walletflow geïntroduceerd | SIWS/offchain/signMessage, nonceconsumptie, verificatie en beheerde sessies |
| 5 Primary Handle | Geen vrij bewerkbare @naam of namaakownership | Actueel on-chain bezit, Primary Handle en selectie/revalidatie |
| 6 Scheiding identiteiten | Account-UUID als sociale auteur/relatie/ontvanger; testrechten apart | Bewezen wallet- en handlebindings, projectrechten |
| 7 UUID | UUID bij expliciete aanmaak testaccount, stabiel bij profielbewerking | Idempotente productieregistratie en unieke beheerwallet |
| 8 Transfer | Nieuwe testposts bewaren accountreferentie en serversnapshot van displaynaam; geen geclaimde handle | Echte handlebindingshistorie, transferdetectie, revocatie en acceptatiescenario Alice/koper |
| 9 Follow graph | Volgen verwijst naar account-UUID, niet NFT of wallet | Productieconcurrency en transferacceptatie |
| 10 Profiel | Testbanner/avatar, naam, bio, website, joindatum, echte sociale aantallen, follow/share, Posts/Replies/Media/About | Echte @identiteit, actieve ownership-/primary-/Pay-status, View Handle en productiesettings |
| 11 Badges | Geen vals ownership, verificatie of tokengekochte badges | Statussen laten volgen uit echte actuele controle; integratieverificatieprocedure |
| 12 Bewerken | Testnaam, bio, website, social links, type, avatar/banner opgeslagen op dezelfde account-ID | Deelnemersautorisatie, volledige profiel/privacysettings |
| 13 Sociale features | Tekst/afbeeldingen, bevestigde externe links, accountmentions, tijd, edit/delete/share, replies, likes/reposts/bookmarks/follows/block/mute | Transactioneel één actieve like, productie-idempotentie en volledige media-abusepijplijn |
| 14 Feeds | Latest/Following chronologisch, eenvoudige servergetelde Discover-score zonder saldo/tokengewicht | Unieke engagementtelling, recente velocity, duplicaat-/abusesignalen en productierankingacceptatie |
| 15 Composer | Zichtbare actieve testaccount, tekst/afbeelding/link/mentions, Post-knop, afzonderlijke mediareview | Posting as echte @handle, ownership-refreshgate, optionele project/betaalbijlagen |
| 16 Discover | Testprofiles/people en werkelijke postactiviteit, geen gefingeerde populariteit | Uitgebreide creator/project/business/integratiesecties |
| 17 Search | Testnaam/bio/posttekst met paginatie | Exacte @prioriteit, actuele handlelookup zonder fake profiel, projectzoeken |
| 18 Notifications | Testfollow/like/reply/repost én mention, accountgebonden ontvanger, gelezenstatus | Productiesessies, idempotentie en volledige notificatievoorkeuren |

## Media in deze ontwikkelstap

- Testavatars, banners en postafbeeldingen worden privé opgeslagen. Databaserecords bevatten private file URI's, geen base64 of blijvende publieke downloadlinks.
- De browser decodeert en herencodeert rasterafbeeldingen, verwijdert bronmetadata en verkleint tot maximaal 2048 pixels. Alleen JPEG/PNG/WebP, input tot 10 MB en 40 megapixels.
- Nieuwe media zijn PENDING en verschijnen niet in profiel/feed tot een operator ze handmatig heeft goedgekeurd. Dit is uitsluitend een testreview, geen bewezen malware-/inhoudsscan.
- Mediareferenties worden server-side gecontroleerd op goedgekeurde status en eigendom van de actieve testaccount. Alle NetworkMedia-operaties zijn admin-only.
- Weergave gebruikt kortlevende ondertekende links; reeds uitgegeven links verlopen na maximaal vijf minuten. Opslagverwijdering, wettelijke bewaartermijnen en volledige productiemediaquarantaine zijn nog open.

## Bewijsstatus

Bouwcontrole en begrensde backendcontroles worden uitgevoerd bij implementatie. Geen volledige UX-/transfer-/securityacceptatie claimen zonder bewijs. Gebruik de Testing Agent voor de volledige gebruikersscenario's.

## Directe volgende productonderdelen

1. Handle-/Primary-identiteit en veilig geverifieerde Pay-ontvangercontext, zonder zelf een authenticatiebackend te bouwen of bestaande wallets te vervangen.
2. Globale exacte handlezoekresultaten, projectkaarten en echte verbonden integraties.
3. Network settings/privacy, concurrency/idempotentie, moderatieberoep en productie-abusecontrole.

Entitlementarchitectuur bestaat al voor optionele accountcapabilities met expiratie/intrekking. Testgrants implementeren de premiumtools niet automatisch en geven nooit vertrouwen, verificatie, moderatieprioriteit of rankingvoordeel.