# SolHandle Network — onderzoek walletregistratie en login

**Versie:** 0.1  
**Datum:** 22 oktober 2026  
**Status:** documentatie- en SDK-onderzoek; geen integratie, runtimeproef of vrijgave  
**Baseline:** [Productregels v1.1](./PRODUCT_RULES.md) en [WP-B v0.2](./ACCOUNT_OWNERSHIP_DESIGN.md)

## 1. Conclusie

De meest kansrijke ondersteunde architectuur is **externe bestaande Solana-wallet → beheerde wallet-authenticatieprovider met OIDC → Base44 app-SSO → servergeverifieerd profiel → eigen actuele @handle**. Base44 blijft de appauthenticatie en appsessies beheren; Network maakt geen loginbackend.

Dit is een onderbouwde kandidaatroute, geen bewezen werkende combinatie. Base44 documenteert custom OIDC app-SSO en de geïnstalleerde SDK heeft de SSO-ingang. Civic documenteert zowel walletlogin als een OAuth/OIDC-ingang. Maar de Base44-documentatie noemt expliciet een benodigde emailclaim; volledige email-loze identiteit is niet aangetoond. Daarmee blijft **B-BLOCK-02 open**. Geen stille emailverplichting, synthetisch emailadres of eigen tokenbrug om dit te maskeren.

## 2. Wat daadwerkelijk is onderzocht

- Actuele Base44 app-SSO-documentatie en de Advanced / Manual-sectie, inclusief PKCE en de waarschuwing over ontbrekende emailclaims.
- Geïnstalleerde SDK `@base44/sdk` 0.8.57: `dist/modules/auth.js` en `auth.types.d.ts`. De expliciete `sso`-provider gebruikt de platform-SSO-route. De geïnspecteerde ingang documenteert geen Solana-provider of wallet-tokenexchange. Een willekeurige providerstring is geen bewijs dat een bijbehorende backend bestaat.
- Officiële Solana-documentatie over signed messages en SIWS; Phantom SIWS-specificatie als aanvullende bron.
- Civic Auth-overzicht en generieke OAuth/OIDC-integratie.
- Historische Auth0/SNS-aankondiging; Privy-documentatiezoekresultaten als beperkte oriëntatie, niet als bewezen downstream OIDC-integratie.

Geen provideraccount gemaakt, discovery-/tokenflow uitgevoerd, SSO aangezet, authenticatiemethode gewijzigd of geldige gebruikerssessie gegenereerd. Geen beveiligingstest of live walletlogin uitgevoerd.

## 3. Bewijsmatrix

| Onderwerp | Bevinding | Betekenis voor SolHandle |
|---|---|---|
| Base44 custom app-SSO | Officiële gids beschrijft OIDC via Advanced / Manual met clientcredentials en discovery of expliciete endpoints | Ondersteunde integratiegrens gevonden; niet zelf een authbackend bouwen |
| Start SSO | SDK 0.8.57 documenteert `loginWithProvider` met provider `sso` | Toekomstige login kan via bestaande authlaag starten; nog geen configuratie of implementatie |
| PKCE | Advanced / Manual heeft PKCE standaard aan | Behouden; Civic vereist PKCE. Geen werkend-end-to-endbewijs uit alleen twee documentatiepagina's |
| Emailclaim | Base44-gids noemt de benodigde `email`-claim en fout `Email not returned by OAuth provider` bij Okta | Belangrijke compatibiliteitsblokkade voor strikt email-loze registratie. Niet concluderen dat elke custom provider dezelfde eis heeft, maar geen sub-only ondersteuning aannemen |
| Civic walletlogin | Officiële overzichtspagina noemt inloggen met wallet, bestaande wallets en Solana | Eerste providerkandidaat; exacte externe Solana-walletflow, wallet-only configuratie en claims nog aantonen |
| Civic OIDC/OAuth | Officiële generieke integratie beschrijft authorization code + verplichte PKCE, discovery, userinfo en refresh | Provider biedt de relevante richting: als identityprovider voor een client, niet alleen als OIDC-consument |
| Civic client-auth | Generiek voorbeeld gebruikt public client met `token_endpoint_auth_method: none`; Base44 vraagt client ID en secret | Bevestigen of Civic een compatibele vertrouwelijke OIDC-client/configuratie levert. Niet zelf een secret of tussenproxy verzinnen |
| Civic volwassenheid | Overzicht markeert Civic Auth als beta | Operationele, privacy- en leveranciersreview vereist; geen productieaanbeveling zonder meer |
| SIWS | Serverchallenge, walletsignature, domain/nonce/tijd en serververificatie bewijzen walletcontrole zonder transactie | Bewijsvorm, niet op zichzelf een Base44-login of account-/sessie-integratie |
| Fresh login / intrekking | Geraadpleegde Base44-bronnen bewijzen geen end-to-end `max_age`, `auth_time`, per-wallet-intrekking of globale logout | Blijft afzonderlijke veiligheidsvoorwaarde |

## 4. Kandidaatarchitectuur

1. Een aparte Network-loginingang start de bestaande platform-SSO-flow. Onafhankelijke loginpagina's en bestaande SolHandle-diensten blijven intact.
2. De geconfigureerde identityprovider toont de toegestane bestaande-walletlogin. Geen embedded wallet genereren: dit project wil bestaande externe wallets, geen nieuwe wallet/custodyproduct.
3. Gebruiker tekent een duidelijk, vers, domein-/doelgebonden loginbericht. Provider controleert signature, eenmalige nonce, expiry en sessiecontext.
4. Provider retourneert via de geregistreerde platformcallback een authorization code; Base44 verwerkt OIDC met PKCE en beheert de appsessie. Geen access-/ID-token als platformtoken injecteren en geen zelfgebouwde tokenexchange.
5. Server leest de geauthenticeerde platformidentiteit. Pas na expliciete Network-voorwaarden/leeftijd/toegang ontstaat het profiel met vaste ID.
6. Een geverifieerde wallet wordt aan die identiteit gebonden. De server moet cryptografisch/providervertrouwd kunnen vaststellen dat de wallet bij deze logincontext hoort. Alleen een walletadres uit de browser of een aanpasbaar profielveld is onvoldoende.
7. De gebruiker kiest een officiële eigen SolHandle uit de gekoppelde wallet. Network verifieert die asset en actuele owner rechtstreeks op de chain; de gekozen handle wordt @name. Geen SNS-afhankelijkheid of nieuwe naamclaim.
8. Terugkerende bevoegde walletlogin resolveert hetzelfde profiel. Een verkochte handle wijzigt uitsluitend de handlebinding, niet het profiel of de loginidentiteit.

**Identiteitsmapping:** de stabiele provideridentiteit moet op issuer + subject berusten en veilig aan de platformuser/profiel-ID zijn gekoppeld, niet op @name, email of client-wallettekst. De huidige Base44-documentatie bewijst niet welke originele providerclaims server-side beschikbaar zijn of hoe accountmatching plaatsvindt. Dit moet vóór bouw worden opgelost. Geen mapping op email alleen, automatische accountfusie of clientgekozen subject.

**Meerdere beheerwallets:** een andere wallet mag niet automatisch een nieuw profiel opleveren als zij expliciet als extra credential aan hetzelfde profiel wordt toegevoegd. Daarvoor zijn bewezen provider-accountlinking/step-up en applicatie-exclusiviteit nodig. Niet aannemen dat twee walletadressen vanzelf hetzelfde OIDC-subject krijgen. Een ingetrokken wallet moet ook toegang via een nog bestaande provider- of appsessie verliezen volgens het goedgekeurde contract.

## 5. Waarom andere routes nog niet volstaan

| Route | Oordeel |
|---|---|
| Alleen wallet connect | Geeft een adres, geen bewezen accountcontrole of veilige appsessie |
| Zelf SIWS verifiëren en eigen Network-sessies uitgeven | Geen toegestane vervanging van platformauth; dit onderzoek autoriseert geen eigen loginbackend |
| Contactsessies hergebruiken | Bestaande Contacts-auth is geen platformlogin en wordt niet tot algemeen authsysteem gepromoveerd |
| Provider-JWT rechtstreeks in de Base44-client zetten | Geen gedocumenteerde ondersteunde tokenexchange gevonden; niet doen |
| Fictief emailadres uit walletadres genereren | Verhult de email-/identiteitsincompatibiliteit en brengt matching-/recoveryrisico's; niet doen |
| Verplichte gewone registratie en daarna wallet koppelen | Technisch een ander product dan de vastgestelde wallet-native baseline |
| Privy/Dynamic/Web3Auth kiezen omdat zij OIDC of JWT noemen | Eerst aantonen dat de dienst in deze configuratie zelf de geschikte OIDC-provider is; OIDC kunnen consumeren is de omgekeerde richting. Geen bewezen Base44-combinatie in dit onderzoek |
| Auth0 'Sign in with SNS' | Artikel uit 2023 gaat over SNS/.sol-houders; geen bewijs van huidige SolHandle-compatibiliteit of een vereiste-vrije externe-walletflow. Niet kiezen of SolHandle vervangen door SNS |
| Eigen Keycloak-/OIDC-walletbridge bouwen | Zou nieuw authentication engineering en beheer invoeren, niet de gevraagde bestaande ondersteunde route; niet als workaround uitvoeren |

## 6. Open beslispunten, op prioriteit

### R-01 — Email-loze OIDC op Base44

Bevestig of app-SSO werkelijk een subject zonder email kan registreren/inloggen, of welke ondersteunde niet-emailmapping bestaat. Bevestig ook dat email niet voor automatische fusie/herstel wordt gebruikt. De huidige documentatie bewijst dit niet en de Okta-waarschuwing maakt het een concrete blokkade.

**Go:** aantoonbare ondersteunde flow zonder verplichte email en zonder synthetische persoonsgegevens. **No-go:** email vereist en geen goedgekeurd alternatief. Dan geen implementatie starten en producteis niet stilzwijgend veranderen.

### R-02 — Civic in de juiste clientmodus

Bevestig bestaande externe Solana-walletlogin zonder emailverplichting/embedded-walletcreatie, ondersteunde wallets, OIDC discovery, signing/JWKS, authorization code + PKCE en een client-authenticatiemethode die Base44 accepteert. Beoordeel beta-status, SLA, kosten en verwerkers-/doorgiftevoorwaarden vóór keuze. Nog geen provider geselecteerd of aangesloten.

### R-03 — Geverifieerde subject-/walletmapping

Aantonen hoe een platformgeauthenticeerd verzoek betrouwbaar naar provider issuer/subject en de bewezen wallet verwijst. Claims mogen niet via clientinput of updatebare User-extra-velden worden opgehoogd. Bepaal gedrag bij nieuwe wallet, accountlinking, dubbele walletclaim, verwijdering en nieuwe registratie.

### R-04 — Freshness en intrekking over beide lagen

Bewijs verse wallet-step-up voor beheerwijzigingen, provider-/appsessieverval, per-wallet-intrekking, logout versus wallet-disconnect, refreshrotatie en gedrag bij nog actieve SSO-session. Alleen opnieuw redirecten naar SSO kan een bestaande IdP-session hergebruiken en bewijst geen nieuwe walletsignature.

### R-05 — SSO-toegang voor deze workspace

Live waargenomen: workspaceplan Elite 4. De SSO-gids noemt Business/Enterprise met een overgangsregel voor workspaces van vóór 1 oktober 2026 die hun eerdere Elite-eis behouden. Aanmaakdatum/werkelijk geactiveerde app-SSO-entitlement zijn niet vastgesteld, dus Elite 4 alleen bewijst noch toegang noch een verplichte upgrade. Controleer appinstellingen vóór configuratie; dit onderzoek wijzigt geen plan.

### R-06 — Blijvende opslagblokkade

De OIDC-route lost B-BLOCK-01 niet op. Eenmalig applicatiechallengeverbruik, registratie-exclusiviteit, beheerwallets en hoofdhandles moeten transactioneel veilig worden geborgd. Geen entity-check/create als onbewezen race-oplossing.

## 7. Veiligheidsvoorwaarden voor een later afzonderlijk goedgekeurd prototype

Alleen een afgescheiden testconfiguratie met eigen callbackallowlist en niet-productieve profielen; niet appbreed SSO afdwingen of huidige loginmethoden verwijderen. Callback-URLs letterlijk kopiëren uit de platformconfiguratie, geen functionwebhook of geraden custom-domain-URL registreren.

- [ ] R-01 email-loze flow formeel bevestigd; geen fictieve emails of verborgen traditionele registratie.
- [ ] R-02 OIDC clientmodus en externe-walletconfiguratie compatibel.
- [ ] R-03 wallet/subject server-side verifieerbaar en niet client-bewerkbaar.
- [ ] OIDC state, nonce waar van toepassing, issuer, audience, signatures/JWKS, PKCE, expiry en redirectallowlist onder de ondersteunde integratie aantoonbaar gecontroleerd.
- [ ] Providerlogin en expliciete sociale registratie onderscheiden; geen profiel door een losse walletconnect of stille achtergrondlogin.
- [ ] Replay, verkeerde domeincontext, verwisselde wallet/account, ontbrekende/verkeerde claims, callbackmanipulatie en provideruitval veilig afgewezen.
- [ ] Gevoelige wijzigingen eisen verse proof; een gestolen browsercontext kan geen nieuwe beheerwallet plaatsen.
- [ ] Extra beheerwallet keert naar hetzelfde profiel terug; ingetrokken wallet/sessie krijgt geen toegang meer.
- [ ] Handleverkoop geeft koper geen oud profiel; handleverlies blokkeert niet alle eigen rechten.
- [ ] Providersessie kan zonder verse signature geen vereiste step-up omzeilen; lokaal logout en providerlogout niet verwarren.
- [ ] Geen private keys, bearercredentials, volle loginproofs of callbackcodes in logs/analytics.
- [ ] Geen SSO-configuratie wijzigen voor bestaande productiegebruikers zonder aparte scope/regressiebeoordeling.

Operationele flowproeven later via de Testing Agent; technische OIDC-/claim-/concurrencygaranties vragen daarnaast passend technisch bewijs. De vakjes zijn nu allemaal open.

## 8. Aanbevolen vervolg

Eerst R-01 en R-02/R-03 bevestigen, vóór providerinstallatie, secrets of UI-bouw. Als email-loze identitymapping niet ondersteund blijkt, is de huidige combinatie geen goedgekeurde uitvoeringsroute. Kies dan niet automatisch voor verplicht email of eigen auth; leg de ontbrekende ondersteunde integratie terug als architectuurbesluit. B-BLOCK-02 pas sluiten na aantoonbare end-to-endcompatibiliteit, step-up en intrekking.

In de app is de documenteerde configuratieroute: **Dashboard → Settings → Authentication → Single sign-on (SSO) → Advanced / Manual Configuration**. Dit is een locatie voor een toekomstige goedgekeurde configuratie, niet een instructie om nu productie-SSO aan te zetten.

## 9. Bronnen

Geraadpleegd op 22 oktober 2026; primaire documentatie waar beschikbaar:

1. Base44 app-SSO, Advanced/Manual, PKCE, emailclaim en planovergang: https://docs.base44.com/Setting-up-your-app/Setting-up-SSO
2. Geïnstalleerde SDK 0.8.57: `node_modules/@base44/sdk/dist/modules/auth.js` en `auth.types.d.ts`, read-only broninspectie.
3. Solana message-authenticatie, SIWS en onderscheid bericht/transactie: https://solana.com/docs/frontend/messages-and-auth
4. Phantom SIWS-specificatie: https://github.com/phantom/sign-in-with-solana
5. Civic Auth-overzicht, walletlogin, Solana en beta-status: https://docs.civic.com/auth
6. Civic generieke OAuth/OIDC-integratie, verplichte PKCE en clientvoorbeeld: https://docs.civic.com/integration/other
7. Historisch SNS/Auth0-voorbeeld, niet als actuele SolHandle-integratie goedgekeurd: https://auth0.com/blog/sign-in-with-the-solana-name-service-powered-by-auth0/
8. Privy oriëntatie uit documentatiezoekresultaat: https://docs.privy.io/authentication/user-authentication/jwt-based-auth/overview — beschrijft eigen upstream authenticatie integreren, geen bewezen OIDC-providerroute naar Base44.

Dit onderzoek bewijst geen veilig werkende integratie, providercontract of goedgekeurde verwerking. Productbaseline ongewijzigd; runtime ongewijzigd.