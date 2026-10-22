# SolHandle Network — uitvoering en resterende scope

Datum: 22 oktober 2026. Dit is een opleveringsregister, geen compliance- of releaseverklaring.

## Opdracht en productlijn

De producteigenaar heeft gevraagd het volledige Network te bouwen volgens de aangeleverde richting. Uitvoering gebeurt in samenhangende werkende modules, niet als een onbeveiligde alles-in-één release. De aanvraag is geen bewijs dat technische of juridische acceptatie al is geslaagd.

Blijvende identiteit en historische auteurverwijzingen blijven los van de overdraagbare handle. Wallet-native login blijft vereist; geen emailfallback of eigen authenticatiebackend. Minten maakt niet automatisch een sociaal profiel: de expliciete deelnamevoorwaarde A-07 blijft gelden. Gratis kernfuncties, 18+, off-chain sociale data, geen betaalde veiligheid en geen DMs/advertenties in de eerste alpha blijven uitgangspunt. Non-custodial alleen is geen juridische vrijstelling.

## Nu geïmplementeerd

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
2. Stabiele Network-profielen, geverifieerde beheerwallets en historisch gescheiden handlebindings; transferisolatie en verse autorisatie op iedere schrijfactie.
3. Privacy Center, export, verwijderpijplijn, bewaartermijnen, consent en sessiebeheer voor Network.
4. Meldingen, block/mute, moderatiemaatregelen, motiveringen, bezwaar en inhoudelijke beheerprocessen.
5. Server-side rate limits, CAPTCHA-escalatie, linkinterceptie, phishingbronnen, botrisico en incident/noodstopmechanismen.
6. Tekstalpha met profiel, chronologische feed, posts, reacties, likes, follows, zoeken en veilige bestaande Pay-koppeling.
7. Beta met reposts, notificaties, mediaquarantaine, discovery en juridisch beoordeelde Pro-entitlements.
8. Business, scheduling, API en latere optionele automatisering/DMs.

## Vrijgave

Geen deelnemers toegelaten en geen homepage/mobiele navigatie vervangen. Juridische documenten, DPIA, leeftijdsaanpak, bewaartermijnen en tokenutility vereisen inhoudelijke beoordeling; dit bestand tekent ze niet af. De eerdere fase-0-acceptaties blijven open tot aantoonbare beoordeling.