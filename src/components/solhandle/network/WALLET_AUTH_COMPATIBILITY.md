# Walletlogin — compatibiliteitsvragen en besliscontract

**Versie:** 0.1  
**Datum:** 22 oktober 2026  
**Status:** verdiepend bronnenonderzoek; geen werkende login, leveranciersbevestiging of releasegoedkeuring  
**Relatie:** [Onderzoek v0.2](./WALLET_AUTH_RESEARCH.md), [account-/ownershipontwerp](./ACCOUNT_OWNERSHIP_DESIGN.md)

## 1. Besluit na verdiepend onderzoek

**Nog geen goedgekeurde provider voor bestaande-walletlogin.** De generieke OIDC-route blijft een mogelijke integratiegrens, maar is niet bewezen passend bij de email-loze baseline.

**Civic niet als implementatiekandidaat selecteren zolang de bronconflicten niet zijn opgelost.** De overzichtspagina noemt walletlogin/bestaande wallets, maar de specifiekere Solana-gids en FAQ zeggen expliciet dat bestaande self-custodial wallets nog niet aan Civic Auth kunnen worden gekoppeld. Die gids beschrijft embedded wallets na sociale login. Dat is niet de gevraagde login met de eigen bestaande Solana-wallet. Daarnaast documenteert Civic automatische emailgebaseerde accountlinking voor bepaalde loginmethodes, wat niet zonder meer past bij de Network-baseline.

Wel vooruitgang: de twijfel over Civic client-secretcompatibiliteit is op providerniveau weggenomen door documentatie én publieke discovery. PKCE + client secret bestaat. Dit lost de belangrijkere wallet-/email-/identiteitsvragen niet op.

### Bewijslabels

- **BEVESTIGD:** bron of publieke metadata zegt dit expliciet; geen end-to-endgarantie.
- **CONFLICT:** primaire bronnen spreken elkaar tegen; geen positief geschiktheidsbesluit.
- **OPEN:** benodigde garantie niet vastgesteld.
- **NO-GO VOOR SELECTIE:** niet implementeren onder de huidige productregels; niet gelijk aan een bewezen technische onmogelijkheid voor alle toekomstige configuraties.

## 2. Publieke Civic-discovery, daadwerkelijk uitgelezen

Read-only GET op `https://auth.civic.com/oauth/.well-known/openid-configuration`, HTTP 200, op 22 oktober 2026. Geen credentials, gebruiker, nonce of tokenuitwisseling gebruikt.

| Veld | Waargenomen waarde / relevante selectie |
|---|---|
| issuer | `https://auth.civic.com/oauth/` |
| response_types_supported | `code`, `none` |
| code_challenge_methods_supported | `S256` |
| token_endpoint_auth_methods_supported | `client_secret_basic`, `client_secret_jwt`, `client_secret_post`, `private_key_jwt`, `none` |
| id_token_signing_alg_values_supported | `PS256`, `RS256` |
| subject_types_supported | `public` |
| claims_supported | `sub`, `grantId`, `email`, `name`, `family_name`, `picture`, `walletType`, `walletAddress`, `sid`, `auth_time`, `iss` |
| scopes_supported | `openid`, `offline_access`, `email`, `profile`, `wallet`, `mcp:tools` |
| claims_parameter_supported | `false` |
| end_session_endpoint | `https://auth.civic.com/oauth/session/end` |
| userinfo_endpoint | `https://auth.civic.com/oauth/userinfo` |
| jwks_uri | `https://auth.civic.com/oauth/jwks` |

Dit is serverbrede capability-advertentie. Het bewijst niet dat een specifieke client deze claims ontvangt, dat `walletAddress` een externe wallet is, dat walletscope in de Base44-context wordt verwerkt, of dat `auth_time` een verse walletsignature betekent. Een endpointnaam is geen bewijs van succesvolle logout of sessie-intrekking. De metadata bevat geen `revocation_endpoint`; daaruit volgt niet dat Civic geen enkele vorm van intrekking heeft. Een geadverteerde tokenexchange geeft evenmin toestemming of een ingang voor Base44-tokenexchange.

## 3. R-01 — Email-loze registratie, identitymatching en herstel

**Status: OPEN / BLOKKEERT.** Base44 documenteert OIDC met emailscope en een fout als de benodigde emailclaim ontbreekt. Niet bewezen dat custom app-SSO met alleen issuer/subject werkt.

### Exact te beantwoorden

1. Kan een nieuw appaccount ontstaan bij custom OIDC wanneer `email` volledig ontbreekt, zonder emailformulier, verificatiemail of synthetisch adres?
2. Is de onveranderlijke externe sleutel werkelijk het paar issuer + subject? Wat gebeurt bij hetzelfde subject met gewijzigde email, een ander subject met dezelfde email, en twee issuers met dezelfde subjecttekst?
3. Wordt een bestaand email-/Google-account automatisch gekoppeld? Kan dat voor Network aantoonbaar uitgeschakeld worden?
4. Kan een email-loze identiteit onbedoeld via forgot-password, emailwijziging of sociale login worden overgenomen?
5. Blijft een verwijderde provideridentiteit verwijderd, of hergebruikt herregistratie een oude mapping/profiel-ID?

### Vereist bewijs om te sluiten

Ondersteund contract voor registratie en matching, plus later bewijs met: ontbrekende email; gewijzigde email bij hetzelfde subject; dubbele email bij verschillende subjects; andere issuer met dezelfde subjecttekst; geen emailrecovery naar het Network-profiel. Geen bestaande gebruikersgegevens gebruiken voor deze scenario's.

**No-go:** email vereist, onvermijdelijke ongewenste accountfusie of herstel buiten de bevoegde wallets. Niet oplossen met wallet-afgeleide emailadressen, custom authtokens of verborgen normale registratie.

## 4. R-02 — Bestaande externe Solana-wallet en OIDC-clientmodus

### R-02a — Walletlogin

**Status: CONFLICT / NO-GO VOOR CIVIC-SELECTIE.** De Civic Solana-gids zegt dat Phantom naast Civic via wallet-adapter verbonden kan zijn, maar dat die Phantom-wallet niet aan Civic Auth kan worden gekoppeld. Een wallet in de dApp is dus niet per definitie de identiteit waarmee is ingelogd.

### Exact te beantwoorden bij iedere provider

1. Authenticeert de gebruiker met een reeds bestaande externe Solana-wallet door een loginbericht te tekenen, zonder vooraf email/sociale login?
2. Is het externe walletadres na verificatie server-side aan het geauthenticeerde subject gebonden en zichtbaar via de ondersteunde downstreamintegratie?
3. Kan de client uitsluitend die methode toestaan, zonder embedded-walletcreatie, emailfallback of recovery die de walletvoorwaarde omzeilt?
4. Welke concrete wallets en platforms zijn ondersteund? Onderscheid desktopextensie, mobiele walletbrowser, Android WebView/native transport en hardwarewallet; algemene Solana-ondersteuning is geen bewijs voor al deze omgevingen.
5. Is er een alternatief voor wallets zonder veilige message-signing dat bij de baseline past? Geen transactie-/custodyfallback toevoegen zonder apart besluit.

### R-02b — Clientmodus

**Status: BEVESTIGD AAN PROVIDERZIJDE; COMBINATIE OPEN.** Civic documenteert client secret + PKCE. Discovery adverteert S256 en onder andere client_secret_basic/post. De eerdere twijfel dat Civic alleen public clients ondersteunt is daarmee opgehelderd.

Nog aantonen: welke tokenclient-authmethode Base44 werkelijk gebruikt, welke daarvan deze Civic-client accepteert, welke scopes vereist/toegestaan zijn, en of PS256 of RS256 correct wordt verwerkt bij signing-keyrotatie. Geen PKCE uitzetten om een fout te verbergen; geen secret via de browser of een zelfgemaakte proxy.

**Sluitcriterium:** een ondersteunde geregistreerde client met gedocumenteerde bestaande-walletlogin, passende serverauthenticatiemethode, expliciete callbackallowlist en geslaagde volledige flow in een afzonderlijk goedgekeurde proef.

## 5. R-03 — Platformidentiteit, walletclaims en vaste profiel-ID

**Status: OPEN / BLOKKEERT.** Civic adverteert `walletAddress` en `walletType`; Base44 bewijst niet dat originele providerclaims in de servercontext beschikbaar zijn. De geïnspecteerde SDK geeft `me()` als platform-User terug, geen gedocumenteerd willekeurig providerclaimscontract.

### Benodigd integratiecontract

| Gegeven | Eis | Niet accepteren |
|---|---|---|
| Platform-user-ID | Gevalideerd via platformauth | User-ID uit requestbody |
| Provider issuer/subject | Door platform/provider vertrouwde mapping naar deze user | Los browser-JWT of eigen decode zonder gevalideerde relatie tot appsessie |
| Loginwallet | Externe Solana-wallet die deze authenticatie uitvoerde, met herkomst/netwerk/type | Connected publicKey, embedded-walletadres of zelf bewerkbaar profielveld |
| Accountprofiel | Vaste servergebonden Network-profiel-ID | @handle als accountprimary key |
| Freshness | Gevalideerde authcontext/actieproof | Browserklok of lokaal lastSignedAt |
| Beheerwalletstatus | Actuele serverstaat en autorisatiegeneratie | Alleen oud token of cached frontendstatus |

De provider hoeft niet elk veld letterlijk als claim terug te geven, maar een ondersteunde, servergeverifieerde equivalent moet bestaan. Als Base44 alleen de platform-ID beschikbaar stelt, is een aanvullende ondersteunde servermapping nodig; dat is nog geen toestemming om een eigen loginbackend te bouwen.

### Meerdere beheerwallets

Een extra wallet koppelen mag alleen na verse autorisatie door een bestaande bevoegde wallet én afzonderlijk bewijs van de nieuwe wallet; beide moeten aan dezelfde profielcontext en actie zijn gebonden. Dubbele claims leveren een conflict, geen verhuizing/fusie. Bewijs hoe één stabiel profiel behouden blijft wanneer de provider per wallet een ander subject uitgeeft. Automatische email-linking is niet hetzelfde als veilige walletlinking.

### Civic-specifieke complicatie

De login-optionsgids documenteert automatische linking wanneer een geverifieerde OTP-email overeenkomt met bepaalde sociale accounts. Niet bewezen dat dit voor een wallet-only client geheel buiten werking blijft. Geen uitspraak dat die email-linking op zichzelf onveilig is; zij voldoet alleen niet automatisch aan onze expliciete wallet-only en geen-automatische-fusie-eisen.

## 6. R-04 — Verse autorisatie, logout en intrekking

**Status: OPEN / BLOKKEERT GEVOELIGE MUTATIES.** Discovery adverteert `auth_time`, `sid` en een end-sessionendpoint. Dat zijn relevante aanknopingspunten, geen bewijs van vereiste verse walletcontrole.

### Freshness exact afbakenen

- De ontwerpgrens is maximaal vijf minuten voor gevoelige wijzigingen; dit is een voorgestelde productveiligheidsgrens, geen aangetoonde providerinstelling.
- `prompt=login` kan herauthenticatie vragen, maar garandeert op zichzelf niet dat precies de bevoegde Solana-wallet een nieuw bericht tekent.
- `max_age` beperkt de leeftijd van authenticatie volgens OIDC; `auth_time` moet bij gebruik van `max_age` beschikbaar zijn. Toch moet de echte authenticatiemethode en de relatie met de wallet worden vastgesteld.
- Tokenuitgiftetijd `iat` en tokenrefresh zijn geen nieuw bewijs van walletcontrole.
- Civic adverteert `claims_parameter_supported: false`; niet aannemen dat een willekeurige claimsrequest toch wordt gehonoreerd. Dit veld bewijst niet dat `max_age` of `prompt` ontbreekt.
- De geïnstalleerde platform-SDK exposeert voor `loginWithProvider` alleen provider en terugkeer-URL, geen gedocumenteerde step-upopties. Parameters in `fromUrl` zetten configureert de terugkeerbestemming, niet de upstreamlogin.

### Intrekking per laag

| Laag | Te bewijzen gedrag | Op dit moment |
|---|---|---|
| Wallet disconnect | Wat blijft in browser/platform/provider actief? | Geen logoutgarantie |
| Platformlogout | Huidige appsessie/cookies beëindigen | SDK verwijdert lokale tokens en redirect naar serverlogout; globale/per-wallet-revocation niet bewezen |
| Providerlogout | Eindigt SSO-session; welk redirect-/hintcontract? | Endpoint geadverteerd; koppeling aan platformlogout open |
| Credential intrekken | Oude wallet geen nieuwe Network-toegang | Actuele serverstatus en aantoonbare credential-/sessieherkomst nodig |
| Actieve Network-toegang | Oude sessies na intrekking meteen weigeren | Contract voor sessieherkomst/generatie open |
| Refresh | Geen hernieuwde toegang via oud refreshtoken | Revocation/refreshrotatie en effect op appsessie open |
| Apparaat-/globale logout | Welke andere sessies worden geraakt? | Niet beloofd |

Een geldige platformsessie hoeft niet automatisch Network-rechten te geven. Network kan aanvullende actuele autorisatie eisen, zonder zelf nieuwe inlogsessies uit te geven. Maar selectieve walletintrekking kan niet veilig uit alleen een platform-user-ID worden afgeleid wanneer meerdere wallets dezelfde user delen en de gebruikte credential onbekend is. Dan is een ondersteunde credential/sessionkoppeling nodig, of een expliciet goedgekeurd conservatiever accountbreed blokkadebeleid; geen stilzwijgende productwijziging.

**Sluitcriterium:** aangetoonde verse bevoegde-walletproof en na credentialintrekking weigering van betrokken oude sessies én nieuwe login/refresh, zonder andere onafhankelijk bedoelde diensten te claimen uit te loggen.

## 7. R-05 / R-06 — Randvoorwaarden blijven apart

- **SSO-entitlement:** geen accountinstelling of planstatus opnieuw vastgesteld in deze verdieping; eerdere plangegevens zijn geen bewijs van huidige activatie. Planbeschikbaarheid en werkende authenticatie zijn afzonderlijke vragen.
- **Callback:** letterlijk de platform-SSO-callback uit de goedgekeurde configuratie registreren. De SSO-callback is niet een backend-functionwebhook of terugkeerpagina.
- **Omgeving:** app-SSO kan bestaande inlogstromen raken. Geen productieprovider wisselen of loginmethodes verwijderen voor dit onderzoek.
- **Atomiciteit:** providerlogin lost applicatie-exclusiviteit, challengeverbruik en races bij wallet-/handlebinding niet op. B-BLOCK-01 blijft afzonderlijk open.
- **Privacy:** een public subject en walletadres niet onnodig als openbare profiel-ID publiceren. Betaal-/Contactsgegevens en providersessies niet aan sociale accounts koppelen zonder doel-/toegangsbesluit.

## 8. Kort vragenpakket per verantwoordelijke

Dit zijn technische compatibiliteitsvragen, geen reeds verstuurde aanvraag of bevestigde toezegging.

### Platformintegratie

1. Ondersteunt custom app-OIDC een user zonder enige emailclaim of emailfallback?
2. Hoe zijn issuer/subject gematcht en hoe voorkomt deze configuratie automatische emailfusie en emailrecovery?
3. Welke originele, geverifieerde providerclaims of serverlookup zijn beschikbaar voor de platformuser, inclusief loginwallet/credential en auth_time?
4. Welke tokenclient-authmethodes en ID-tokensigningalgoritmes worden ondersteund en hoe werkt signing-keyrotatie?
5. Hoe worden verse wallet-step-up, per-credential-intrekking en actieve/refreshsessies ondersteund, zonder eigen authbackend?

### Wallet-identityprovider

1. Is bestaande externe Solana-walletlogin zonder eerdere email/sociale registratie werkelijk beschikbaar? Voor Civic: welke actuele contractversie lost de tegensprekende Solana-gids/FAQ op?
2. Welke claims bewijzen de oorspronkelijke externe loginwallet en haar authenticatiemethode; blijven issuer/subject stabiel bij walletlinking/rotatie?
3. Kan automatische email-/sociale linking en embedded-walletcreatie volledig buiten deze clientflow blijven?
4. Werken client secret + S256-PKCE, vereiste scopes en exact geregistreerde callbacks in de concrete clientconfiguratie?
5. Welke verse-walletproof, sessieherkomst, logout en credential-/refreshintrekking worden gegarandeerd?

## 9. Beslisvolgorde en oplevering

1. **P0:** email-loze platformidentiteit en echte bestaande-walletlogin aantonen; Civic tot oplossing bronconflict niet selecteren.
2. **P0:** vertrouwde platformuser → provideridentiteit → gebruikte wallet vastleggen; geen clientclaims of impliciete linking vertrouwen.
3. **P1:** step-up en intrekking over beide sessielagen aantonen.
4. **P1:** clientauth/scopes/signing/callbacks matchen; Civic providermodus is onderbouwd, platformcombinatie niet.
5. Pas daarna afzonderlijk toestemming voor een afgeschermd prototype; implementatie en acceptatietests zijn niet onderdeel van dit onderzoek.

**Opgeleverd:** aangescherpte vragen, publiek discoverybewijs, correctie op Civic-selectie, concrete go/no-gocriteria en een volgorde die onnodige integratiebouw voorkomt. **Niet opgeleverd:** werkende walletlogin, een geselecteerde provider, gesloten B-BLOCK-01/02 of goedgekeurde sociale alpha.

## 10. Bronnen en grenzen

Geraadpleegd op 22 oktober 2026:

1. Base44 custom app-SSO en emailclaim: https://docs.base44.com/Setting-up-your-app/Setting-up-SSO
2. Base44 authreferentie: https://docs.base44.com/developers/references/sdk/docs/interfaces/auth ; lokaal SDK 0.8.57 `auth.js`/`auth.types.d.ts` voor daadwerkelijke clientlogica.
3. Civic publieke discovery, HTTP 200: https://auth.civic.com/oauth/.well-known/openid-configuration
4. Civic authentication flows, client secret + PKCE: https://docs.civic.com/overview/authentication-flows
5. Civic specifieke Solana-gids, bestaande wallets niet ondersteund/gelinkt: https://docs.civic.com/web3/solana
6. Civic FAQ, externe wallets en client secret: https://docs.civic.com/overview/faqs
7. Civic login options, automatische email-accountlinking: https://docs.civic.com/overview/login-options
8. Civic generieke OAuth/OIDC: https://docs.civic.com/integration/other
9. Civic algemeen overzicht, conflicterende brede walletclaim: https://docs.civic.com/auth
10. OIDC Core, authrequest/freshness: https://openid.net/specs/openid-connect-core-1_0.html#AuthRequest

Discovery lezen is capability-onderzoek, geen appflowtest. Geen login-, token-, registratie-, logout- of mutationendpoint aangeroepen; geen secrets gelezen, accounts aangemaakt of appauthinstellingen veranderd. Conflicterende bronnen niet vervangen door aannames over platform- of providerinternals.