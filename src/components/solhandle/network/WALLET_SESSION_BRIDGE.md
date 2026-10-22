# Bestaande walletverbinding → beheerde Network-sessie

**Versie:** 0.1  
**Datum:** 22 oktober 2026  
**Status:** uitgewerkt integratiecontract, niet geïmplementeerd of getest  
**Relatie:** [WP-B](./ACCOUNT_OWNERSHIP_DESIGN.md), [compatibiliteit](./WALLET_AUTH_COMPATIBILITY.md), B-BLOCK-02

## 1. Keuze en ontbrekende schakel

Hergebruik de bestaande geselecteerde wallet, wallet-adaptercontext, `WalletSessionGuard` en `signConnectedMessage`. Geen tweede walletconnector, embedded wallet of nieuwe loginpagina. Het bestaande profielmodel en de productregels veranderen niet.

De ontbrekende schakel is een **ondersteunde authenticatie-integratie** die bewijs van precies deze externe wallet kan verwerken en via platformauth een serververifieerbare appsessie oplevert. Dit document ontwerpt de aansluiting, niet een eigen signature-verifier, tokenexchange, JWT-, cookie- of sessiebackend.

Er zijn twee afzonderlijke compatibiliteitsvragen: kan de identityprovider authenticeren met een bestaande Solana-wallet, en kan die flow werkelijk de al geselecteerde adapter/signature gebruiken? Een algemene walletloginclaim bewijst geen van beide. Als de provider alleen op zijn eigen origin kan tekenen, is hergebruik van de huidige adapter niet aangetoond. Geen signature naar een willekeurige providerendpoint posten of OIDC-login omzeilen.

## 2. Geïnspecteerde bestaande onderdelen

| Onderdeel | Geobserveerd | Gebruik en grens |
|---|---|---|
| `WalletSessionGuard.jsx` | Vergelijkt adapter en publicKey vóór/na signing | Clientbescherming behouden; geen serverauthenticatie |
| `signConnectedMessage.js` | Tekent met geselecteerde adapter; apart Phantom-pad | Exacte providerchallenge tekenen, indien die integratie dit ondersteund toestaat; niet herschrijven |
| `contacts/useContactsAccess.js` | Eigen Contacts-unlock en walletgebonden lokale status | Niet omzetten in Network-login |
| `contacts/contactClient.js` | Contacts-challenge, signature, service-eigen token in localStorage | Niet kopiëren of als platformtoken gebruiken; rememberDevice niet overnemen als Network-sessieduur |

Broninspectie bewijst geen werking op ieder apparaat of veiligheid van bestaande serverimplementaties. Contacts, Pay, minting en bestaande auth blijven ongewijzigd.

## 3. Verantwoordelijkheden

- **Bestaande walletlaag:** expliciete walletselectie en ondertekenen; private keys blijven in de wallet.
- **Goedgekeurde identityprovider:** challenge/context, cryptografische verificatie, replaybescherming en betrouwbare walletidentiteit volgens aantoonbaar contract.
- **Platformauth:** ondersteunde login/callback en beheerde appsessie; geen lokale setToken met een walletsignature of zelfgemaakt token.
- **Network-autorisatie:** koppelt de geverifieerde identiteit aan het vaste eigen profiel, controleert actieve beheerwallet/generatie en deelname. Geeft geen loginsessies uit.
- **Chaincontrole:** verifieert het actuele officiële handlebezit voor handlegebonden acties; maakt geen accountsessie.

## 4. Gewenste flow, nog geen uitvoerbare API

1. Bezoeker kiest expliciet Network registreren of inloggen. Bestaande walletverbinding hergebruiken; bij ontbreken de huidige walletkiezer gebruiken. Geen automatische signing bij paginalaad of reconnect.
2. Controleer message-signingondersteuning en leg voor deze poging adapter, canonieke publicKey en lokale pogingsgeneratie vast. De generatie voorkomt alleen verouderde UI-resultaten, niet server-side replay.
3. Start uitsluitend de ondersteunde provider/platformflow. De integratie bindt challenge, doel, audience en logintransactie. OIDC-state, nonce en PKCE blijven verantwoordelijkheid van die ondersteunde flow.
4. Toon dat het om login gaat, niet om betaling. Teken de exacte aangeleverde challenge met de bestaande bewaakte signMessage, alleen als de provider hiervoor een gedocumenteerde adapterintegratie heeft. Geen gas, transactie, approval of seed phrase.
5. Provider verifieert het bewijs. Platform verwerkt de ondersteunde callback en sessie. Callback komt uit de werkelijke SSO-configuratie; geen zelfbedachte functioncallback. Redirect kan React-state wissen: benodigde transactiecorrelatie moet door de ondersteunde integratie gedragen worden.
6. Na terugkeer initialiseert platformauth opnieuw. De server valideert de appsessie en verkrijgt via een vertrouwde mapping de gebruikte externe loginwallet. Connected publicKey of caller-userId geldt niet als die mapping.
7. Network controleert actieve walletbinding en autorisatieversies. Bestaande geldige SIGN_IN bereikt dezelfde vaste profiel-ID. Geen koppeling betekent registratie vereist, niet stilzwijgend een profiel aanmaken.
8. Eerste deelname vereist aparte expliciete Network-onboarding en de goedgekeurde leeftijds-/toegangsflow. Een eventueel platformaccount door SSO is niet automatisch een Network-profiel. Unieke profiel-/walletcommit vereist B-BLOCK-01.
9. Eigen handle kiezen en actueel on-chain verifiëren is een volgende afzonderlijke stap. Geen handle nodig om eigen privacy-/accountrechten te behouden.

Registratie- en loginbewijzen zijn niet uitwisselbaar. Als een provider slechts generieke walletauth biedt, moet het ondersteunde integratiecontract de aparte applicatie-intentie veilig binden; anders blijft dit een blokkade, geen aanname.

## 5. Vertrouwde mapping en autorisatiepoort

Onderstaande gegevens zijn een logisch servercontract, geen nieuw token, entityschema of bestaande SDK-response:

| Gegeven | Vereist bewijs |
|---|---|
| Platformidentiteit | Geldige platformauth, niet requestbody |
| Provideridentiteit | Vertrouwde issuer + subject of aantoonbaar gelijkwaardige servermapping |
| Logincredential | Precies de geauthenticeerde externe Solana-wallet; netwerk en methode bekend |
| Sessierelatie | Ondersteunde binding tussen huidige sessie en gebruikte credential; geen willekeurig recent bewijs van dezelfde user |
| Freshness | Geverifieerd authenticeermoment/actieproof; tokenrefresh is geen nieuwe signature |
| Network-profiel | Servermapping naar vaste profiel-ID; geen @handle als sleutel |
| Actuele bevoegdheid | Actieve walletlink/generatie, profielstatus en autorisatieversie uit transactionele autorisatiebron |

Iedere privéoperatie controleert de appsessie en eigen profielbevoegdheid. Iedere Network-mutatie hercontroleert bovendien actuele status/versies en relevante walletbinding. Handleacties vereisen ook verse ownershipcontrole. Geen generieke service-roleproxy of vertrouwen op uitsluitend UI-toegang. RLS en nauwe serverautorisatie moeten vóór implementatie als één rechtenontwerp worden beoordeeld.

Een platformsessie zonder bewezen credentialrelatie krijgt geen Network-toegang. Een al ingelogd traditioneel account plus connected wallet mag nooit automatisch worden gekoppeld. Meerdere provider-subjects mogen alleen via expliciete, dubbel bewezen walletkoppeling hetzelfde profiel beheren; geen emailfusie.

## 6. Toestanden en onderbrekingen

Deze toestanden beschrijven UI/orchestratie, geen zelfgebouwd sessieregister.

| Gebeurtenis | Vereist gedrag |
|---|---|
| Verbonden, niet geauthenticeerd | Wallet zichtbaar; geen privéprofiel of Network-schrijfrecht |
| Wachten op signature/callback | Eén actieve poging, submit geblokkeerd, annuleren mogelijk |
| Signature geweigerd of verlopen | Terug naar niet-ingelogd; herproberen met nieuwe challenge |
| Adapter/account wijzigt tijdens poging | Poging lokaal ongeldig; late resultaten niet toepassen; servercorrelatie blijft verplicht |
| Platformsessie geldig, mapping ontbreekt | Network-toegang blokkeren; geen Contacts-token of emailfallback |
| Actieve beheerwallet en profiel bewezen | Eigen profiel toegankelijk binnen actuele rechten |
| Actieve platformsessie maar wallet disconnected/anders | Network-client blokkeert acties en verbergt lokale privéweergave; zelfde beheerwallet opnieuw verbinden of expliciet opnieuw inloggen, nooit stilzwijgend omschakelen |
| Netwerkfout of onzekere mapping | Geen nieuwe privéactie; geen cached-authfallback |

Walletdisconnect vernietigt niet bewezen een platform-/providersessie. Clientblokkering is UX, geen serverintrekking; een server kan een lokale disconnect niet zelfstandig als cryptografisch feit waarnemen. Andere tabbladen/apparaten pas als uitgelogd tonen wanneer het ondersteunde contract dat bewijst. Na rehydratie, tabfocus of walletwissel sessiecontext opnieuw evalueren; geen privédata tussen walletcontexten hergebruiken.

## 7. Logout, intrekking en herauthenticatie

**Expliciet uitloggen:** stop lopende Network-pogingen, wis eigen Network-clientcache en gebruik platformlogout volgens ondersteund contract. Disconnect van de wallet is een afzonderlijke keuze; minting/Pay niet ongemerkt uitloggen of tokens van Contacts verwijderen. Providerlogout en logout op andere apparaten uitsluitend beloven wanneer aangetoond. De geraadpleegde SDK-docs beschrijven lokale tokenverwijdering, niet gegarandeerde globale revocation.

**Walletintrekking:** transactioneel bevoegdheid/generatie intrekken. Iedere betrokken Network-operatie met oude context moet daarna geweigerd worden, inclusief nieuwe toegang via een nog geldige providerlogin. Ondersteunde sessie-/credentialherkomst en refreshgedrag moeten worden bewezen; geen selectieve intrekking claimen op basis van alleen user-ID. Een accountbrede blokkade als alternatief vereist apart productbesluit.

**Gevoelige wijziging:** verse actiegebonden autorisatie met al bevoegde wallet, volgens WP-B maximaal vijf minuten oud; nieuwe wallet ook afzonderlijk bewijzen. Een recente browserklik, iat, auto-reconnect of alleen auth.me() is geen step-up. Geen eigen loginbackend bouwen als de provider dit niet ondersteunt.

## 8. Bewijs en go/no-go vóór runtimebouw

Alle onderstaande punten zijn **OPEN**, geen uitgevoerde tests:

| ID | Vereist sluitbewijs |
|---|---|
| SB-01 | Provider ondersteunt echte email-loze externe Solana-walletlogin én de bestaande geselecteerde adapter; geen tweede connector of embedded-walletvereiste |
| SB-02 | Platform ondersteunt die identiteit zonder fictieve email; issuer/subjectmatching, geen automatische fusie en recoverygedrag vastgelegd |
| SB-03 | Gevalideerde sessie → provideridentiteit → gebruikte wallet is server-side beschikbaar, ook na callback/refresh |
| SB-04 | Replay, verkeerde audience/doel, login-CSRF, callbackmix-up en late callback na walletwissel worden veilig afgehandeld |
| SB-05 | Expliciete onboarding en parallelle eerste registratie leveren exact één profiel; B-BLOCK-01 opgelost |
| SB-06 | Disconnect, expliciete logout, credentialintrekking, tokenrefresh en meerdere tabs/apparaten hebben aangetoonde afzonderlijke semantiek |
| SB-07 | Extra beheerwallet en rotatie behouden profiel-ID zonder subjectfusie; ingetrokken wallet en oude sessie krijgen geen nieuwe Network-rechten |
| SB-08 | Ondersteunde desktop-/mobiele paden afzonderlijk aangetoond; geen algemene claim voor Android/native of hardwarewallets |
| SB-09 | Serverautorisatie, RLS, privacybewaring en afgeschermde proefomgeving beoordeeld; bestaande diensten blijven onafhankelijk |

Volgorde: SB-01/02 eerst, daarna SB-03/04/06 en step-up, vervolgens transactie-/rechtenreview en apart goedgekeurd prototype. Geen nieuwe loginroutes of endpoints bouwen zolang de eerste poorten openstaan. Voor deze verdieping zijn geen login-, logout-, token- of mutationproeven uitgevoerd.

## 9. Documentatiebasis en oplevering

Op 22 oktober 2026 opnieuw geraadpleegde platformdocumentatie: https://docs.base44.com/Setting-up-your-app/Setting-up-SSO en https://docs.base44.com/developers/references/sdk/docs/interfaces/auth . OIDC-SSO is gedocumenteerd; signature-naar-appsessie, email-loze subject-only matching en per-wallet revocation zijn daarin niet vastgesteld. Dit is geen bewijs van onmogelijkheid, maar onvoldoende voor implementatiegoedkeuring.

Opgeleverd: concreet aansluitcontract met bestaande walletlaag, sessiemapping, toestanden, logout-/intrekkingsgrenzen en bewijsvolgorde. Niet opgeleverd: werkende sessiekoppeling, geselecteerde provider, gesloten B-BLOCK-02, nieuwe authbackend of gewijzigde productieauth.