# SolHandle Token Identity — Phase 0 technical assessment

Datum: 2026-11-05. Status: ontwerp en statische code-audit, NIET geïmplementeerd en NIET vrijgegeven.
Scope: het nieuwe ontwikkelvoorstel, na verwijdering van de eerdere Token Passport-pilot.
Deze oplevering voegt uitsluitend dit rapport toe. Geen routes, entiteiten, betaalacties, tracking, workflows of protocolwijzigingen.

## 1. Samenvatting en productbesluit

De infrastructuur is gedeeltelijk herbruikbaar. Een gratis Passport kan zonder nieuw Solana-programma worden gebouwd, maar is nog niet productierijp op basis van alleen de bestaande onderdelen.

De concrete bezoekerswaarde moet zijn: vanuit een herkenbaar SolHandle-profiel het exact door die wallet gepubliceerde tokenadres controleren, de specifieke bewijsrelatie bekijken en oude relaties van actuele onderscheiden. Een onbekende handle naast een onbekende token biedt geen zelfstandige betrouwbaarheidsgarantie. De eerste implementatie moet daarom Discover en bestaande profielen uitbreiden, niet nog een los pilotformulier introduceren.

Go voor een afzonderlijke, admin-afgeschermde testimplementatie na het sluiten van de ontwerpblokkades hieronder. Geen go voor openbare productiemutaties, betaalde Stamps of een nieuw Mainnet-contract.

### Belangrijkste blokkades

1. Walletverbinding is geen Base44-/Network-productiesessie. Bestaande gerichte bewijzen zijn geen algemene accountlogin.
2. De database ondersteunt geen unieke constraints of transacties over meerdere records. Een zoek-en-maak- of upsert-patroon is geen garantie tegen dubbele associaties of dubbele fulfillment.
3. Metadata-inname voor willekeurige fungibele tokens en veilige verwerking van externe metadata zijn nog te bouwen.
4. Een off-chain ownershipcheck kan niet atomair zijn met een Solana-overdracht. Toon een waarneming op een slot/tijdstip, geen doorlopende eigendomsgarantie.
5. De bestaande 50/50-betaling maakt specifiek een handle-NFT aan; zij is geen generieke betaal- of Stamp-instructie.

## 2. Onderzochte bestaande onderdelen en hergebruik

| Onderdeel | Aangetroffen module | Hergebruik / grens |
|---|---|---|
| Officieel NFT-eigendom | `base44/shared/solhandleResolver.ts`: `resolveOnChain`, `reverseOnChain` | Bestaande PDA-, programma-, Metaplex Core- en collectieverificatie hergebruiken. Geen tweede handle-register. Nu `confirmed`, met extra SOL-bestemmingscontrole die Passport-eigendom niet nodig heeft. |
| Publieke resolver-SDK | `src/lib/solhandle-sdk/index.js` | Clientvalidatie, Primary-resolutie en bestaande constanten. Deze SDK leest ook protocolconfiguratie en protocolversie; backendresolver doet dat niet op dezelfde wijze. Contracttests moeten deze verschillen afdekken; geen tweede Passport-specifieke decoder schrijven. |
| Handlekeuze | `base44/functions/getOwnerHandles/entry.ts`, `base44/shared/ownedHandles.ts` | Kandidaten en Primary-label zijn bruikbaar voor de keuzelijst, niet als mutatieautorisatie. Huidige implementatie scant de actieve index en gebruikt DAS-batches; `getAssetOwnersBatch` kan terugvallen op cached eigendom. Elke gekozen asset opnieuw direct verifiëren. |
| Walletsigning | `src/lib/signConnectedMessage.js` | Selectievaste adapter, Phantom-isolatie en controle op accountswitch hergebruiken. Desktop/mobile/native message-signing afzonderlijk testen. |
| Actiespecifieke bewijzen | `base44/shared/handleProfileProof.ts`, `base44/shared/networkWalletProof.ts` | Ed25519, payloadhash, origin, korte geldigheid en conditioneel eenmalig nonceverbruik zijn bruikbare patronen. Passport-challenge moet óók mint, handle-asset, revision en actie expliciet binden. Huidige functies niet ongewijzigd voor een andere scope aanroepen. |
| Walletgerichte privésessie | `base44/shared/contactSessions.ts` | Bestaand contactspecifiek patroon met gehashte sessietokens. Contacttoken geeft GEEN Passportrechten en wordt niet hergebruikt als universele sessie. |
| Network-identiteit | `base44/shared/networkFlags.ts`, `src/components/solhandle/network/NetworkSessionProvider.jsx` | `walletAuthentication: false`; sessiecontext bootstrap/ready is admin/operator- en developmentgericht. Dit is een bevinding over de huidige code, geen uitspraak dat het platform walletlogin principieel niet kan ondersteunen. |
| Bestaande profielkoppeling | `base44/functions/handleProfiles/entry.ts` | Publiek profiel wordt op wallet + asset + actueel eigendom geselecteerd; waargenomen voormalige-eigenaarpublicaties worden verborgen. Bruikbaar patroon, maar Passportgeschiedenis moet juist blijven bestaan. |
| Discover en projectbeheer | `src/pages/EcosystemDiscover.jsx`, `src/pages/NetworkProject.jsx`, `base44/functions/discoverDirectory/entry.ts`, `NetworkProject`, `DiscoverSubmission` | Directory, bestaande project-ID, adminreview en publicatiestappen uitbreiden. Tokenregistratie niet als bewezen integratie tellen. Discover-intake vraagt momenteel email en vaste afbeeldingen; dat formulier niet verplicht maken voor gratis walletassociaties. |
| Periodieke ownershipchecks | `base44/shared/discoverRankingChecks.ts`, `discoverRankingReview.ts` | Bestaand model ACTIVE/UNCERTAIN/INACTIVE en begrensde batches hergebruiken als patroon. De check-then-update met `updated_date` is niet zelf een atomaire CAS; Passport-revisies expliciet conditioneel schrijven. |
| Beschermde namen | `ProtectedName`, `base44/shared/solanaRpc.ts`: `getNameRestriction` | Bestaande naamrestricties en reviewcontext gebruiken. Een toegestane handle is geen bewijs van een officieel tokenproject. |
| Moderatie | `base44/shared/networkLabSafety.ts`, `NetworkReport`, `NetworkModerationAction` | Rapporteren, verbergen en auditredenen als UX-/procespatroon. Bestaande sociale rapporten zijn postgericht en TEST-scoped; geen generieke productie-Tokenmoderatie aannemen. |
| Domeinbewijs | `base44/functions/verifyOfficialClaimDomain/entry.ts`, `base44/shared/officialClaim.ts` | Concept van domeinchallenge bruikbaar voor later niveau 4. Bestaande fetch volgt redirects en heeft hier geen expliciete timeout; niet zonder hardening inzetten voor willekeurige Passportdomeinen of metadata. Geen exploitonderzoek uitgevoerd. |
| Delen en QR | `src/components/solhandle/profile/ProfileLinkActions.jsx`, bestaande profielkaart/downloadonderdelen | Kopiëren, delen, QR-rendering en visuele conventies aanpassen aan mint en Passport-URL; geen tweede kaartgenerator als bestaande helper kan worden uitgebreid. Externe artworkfetch is geen veilige server-metadatafetcher. |
| RPC | `base44/shared/solanaRpc.ts` | Bestaande transportfunctie met 4s fetchtimeout en beperkte 429-retry. Eén opgegeven URL, geen ingebouwde onafhankelijke providerfailover. Timeout dekt hier niet expliciet het volledige uitlezen van de body. |
| $HANDLE-identiteit/balans | `handlePaymentStatus.ts`, `handleTokenMintInfo.ts` | Canonieke mintconstante, tokenprogrammacontrole en BigInt-balanspatronen hergebruiken. `verifyHandleMint` is bewust strikt voor betaal-$HANDLE; niet toepassen op willekeurige Passporttokens met geldige authorities/extensies. |
| Betaalvoorbereiding | `quoteHandlePayment`, `tokenMintFlow.ts`, `handleTokenTransactions.ts` | Quote-expiry, integerbedragen, transactievalidatie en simulatiepatronen. Geen generieke Stampquote: huidige prijs hangt aan handle-minting en een SOL/Jupiter-referentie. |
| On-chain burn | `programs/solhandle/src/lib.rs`: `mint_handle_with_token` | Bron bevat transfer_checked + burn_checked, gevolgd door NFT-creatie, in dezelfde instructie. Bewijst de bestaande mintlogica in bron, niet dat nieuw Stampgedrag is gedeployed of onafhankelijk geaudit. |
| Betalingsbewijs | `handleTokenProof.ts`, `TokenMintPayment`, `BurnActivity` | Event-, exacte account- en balanscontroles en raw-stringbedragen zijn goede patronen. Decoder verwacht `TokenHandleMinted` plus handlecreatie en is dus geen Stampverifier. Huidige upsert op signature is geen harde concurrencygarantie. |
| Analytics | `base44/functions/getAnalyticsDashboard/entry.ts` | Bestaande adminomgeving hergebruiken, niet de huidige in-memory telling van maximaal 500 ingelezen events kopiëren. Nieuwe operationele totalen via server-count/aggregate; bezoekerstracking pas na consentontwerp. |

De verwijderde Passportmodules/entiteiten zijn niet als bestaande voorziening aangemerkt; er zijn alleen lege directorynamen aangetroffen. Niets uit de oude pilot is hersteld.

## 3. Authenticatie en rechten: vereist ontwerpbesluit vóór fase 1

De bestaande code kent twee verschillende grenzen:
- Base44-accountauthenticatie voor beheerders en afgeschermde schermen.
- Gerichte walletbewijzen voor profiel-/contactacties, zonder dat daarmee een Base44-login wordt uitgegeven.

Aanbevolen eerste testomgeving: bestaande adminauthenticatie plus verse walletchallenge, met vaste testdata en zonder publieke schrijfroutes. Voor publieke maker-toegang moet de ondersteunde sessie-/autorisatiegrens expliciet worden vastgesteld en beveiligingsgetest. Bestaande contactsessies niet uitbreiden naar andere rechten; geen synthetische emailadressen, zelfgemaakte platformtokens of stilzwijgende verplichte emailregistratie.

Een normale ingelogde gebruiker of een frontend-walletadres autoriseert nooit zomaar een Passportmutatie. Iedere gevoelige mutatie vereist verse walletcontrole, recordscope en on-chain eigendom. Adminmoderatie vereist server-side `auth.me()` en `role === admin`; zij mag geen walletsignature of creatorbewijs fabriceren.

Een wallet is in het MVP de immutable technische actor. `accountId` is alleen aanvullend wanneer een ondersteunde koppeling bewezen is, niet gelijkstellen aan het toevallige Base44-account of aan de overdraagbare handle.

## 4. Datamodel: alleen wat de gratis fase nodig heeft

Geen entiteiten aangemaakt. Gebruik automatisch aanwezige `id`, `created_date`, `updated_date`, `created_by_id` zonder die opnieuw te declareren.

| Voorgestelde entiteit | Functie en kernvelden | Toegang |
|---|---|---|
| `TokenProject` | network, mint_address, token_program, decimals, supply_raw, naam/symbool/metadata-URI, goedgekeurde image-referentie, authorities, metadata_source, fetched_at, slot, metadata_status. Mint + network zijn de technische sleutel, geen ticker. | Alleen server/admin schrijft. Publiek uitsluitend veilige technische velden; anders via publieke projectie. |
| `TokenPassport` | token_project_id, optioneel bestaand project_profile_id, immutable authorizing_wallet en handle_asset_id, handle_snapshot, optioneel account_id, revision, afzonderlijke lifecycle/moderation/ownershipstatus, reviewbare projecttekst/links, current_proof_id. | Privé basisrecord. Rechtstreekse CRUD admin-only; makeracties via vastgestelde serverautorisatie. Geen RLS op een zelf instelbaar walletveld. |
| `TokenAssociationChallenge` | action, wallet, mint, handle_asset, payload_hash, revision, origin, random nonce, expires_at, issued/used. | Privé, server-only via geauthenticeerde/verifieerbare acties. Niet een profielchallenge met nieuwe purposewaarden vervuilen. |
| `TokenAssociationProof` | immutable passport_id + revision, exact canonical signed message, signature, message_hash, wallet, network, asset, verificatieslot/tijd, ownershipsnapshot, expliciete rolbewijzen en bronverwijzingen. | Privé basisrecord; alleen expliciet openbaar gemaakte bewijsvelden in publieke projectie/API. Geen sessietokens of IP-adressen. |
| `TokenAssociationHistory` | immutable event_id, passport_id, revision, event_type, oorspronkelijke actor, proofref, vorige/nieuwe status, observed_slot en tijd. Ook moderatiebesluiten/audit. | Alleen server append; publieke API selecteert veilige provenance, geen interne notities of rapporteurs. |
| `TokenPassportReport` | passport_id, type zoals impersonation, toelichting, private rapporteur/verifieerbare receipt, status, reviewer, resolution. Ook correctie/dispuut. | Niet publiek. Intake anti-abuse; beheer admin-only; geen openbaar email-/IP-veld. |
| `TokenPassportPublic` | Afgeleide, gesaniteerde goedgekeurde revisie; mint, association-ID, oorspronkelijke wallet/asset, projectweergave, bewijslabels en tijdstippen. Geen drafts, interne account-ID, moderationnotes of sessiedata. | Publiek lezen; schrijven uitsluitend server/admin. Zichtbaarheid/revisie blijft onder controle van het private masterrecord. |

Dit zijn zeven beperkte tabellen, geen tweede identiteitssysteem. `NetworkProject` blijft het bestaande projectprofiel; koppel alleen op ID na bevoegde review, niet door een willekeurige URL/handle-string gelijk te stellen.

`TokenStamp`, `TokenServicePayment` en serviceprijsconfiguratie worden pas ontworpen/aangemaakt in de afzonderlijke betaalfase. `TokenMintPayment` niet vermengen met nieuwe diensten; dat zou NFT-mintomzet en Stampomzet verwarren.

### Uniciteit en crashherstel zijn releaseblokkerend

Base44-documentatie bevestigt: geen unieke constraints; concurrente upserts kunnen dupliceren; bulkacties zijn geen multi-recordtransacties. Voor een query met één exact `id` controleert `updateMany` voorwaarden opnieuw bij het schrijven.

Daarom niet volstaan met een `network:mint`-string of `find -> create`:
1. Ontwerp een vooraf ingerichte, server-only coördinatiegrens met exact-ID + version-CAS voor idempotencyreserveringen en begrensde concurrerende operaties. Het bestaande `networkIdentityRegistry.ts` demonstreert dit patroon, maar de DEVELOPMENT-registry en haar 200/500-limieten niet als Passportopslag gebruiken.
2. Maak revisies, actie-ID's en uitkomsten herstelbaar; reserveer geen onbegrensde lijst in één groot entiteitsveld.
3. Een lease die verloopt is geen fencinggarantie. Een oude uitvoerder mag na leaseverlies niet alsnog een nieuwe publieke revisie activeren. Test dit expliciet; een simpele TTL-lock is onvoldoende bewijs.
4. Publiceer pas een complete, goedgekeurde revisie. De API controleert masterstatus en revision; een achtergebleven public-projectierecord mag een geschorste registratie niet zichtbaar houden.
5. Als dit binnen de huidige opslag niet aantoonbaar kan worden gegarandeerd, blokkeer productie en onderzoek een transactional coordinator/storagegrens; niet claimen dat schemavalidatie een unique index vervangt.

Meerdere wallets mogen onafhankelijk een associatie met dezelfde mint voorstellen. Eén eerste indiener krijgt nooit het exclusieve recht op een token. Onderdruk alleen echte duplicaten van dezelfde autorisatie/revisie. Eén mintpagina moet meerdere huidige/historische associaties correct kunnen tonen, niet willekeurig het eerste record als officieel project selecteren.

## 5. Verificatie en overdrachten

Modelleer geen enkelvoudige `verified`-boolean of algemene badge. Scheid:
- tokenidentificatie;
- wallet-handtekening + handle-eigendom op verificatiemoment;
- concrete onafhankelijke rolbewijzen;
- moderatiestatus;
- huidige ownershipwaarneming;
- eventuele toekomstige officiële projectreview.

Niveau 3 is een verzameling rolbewijzen, niet één universeel creatorlabel. Een actuele mint authority, metadata update authority en geregistreerde launchcreator zijn verschillende feiten. Verifieerbare Metaplex-creatorvermelding is weer een afzonderlijke metadatarelatie; een ongeverifieerde creatorvermelding bewijst niets. Mint-/freeze-authority wordt niet automatisch als oorspronkelijke tokenmaker gepresenteerd.

Per bewijs bewaren: role_type, subject_wallet, source_account/program/transaction, decoder_version, slot, observed_at, conclusie en beperkingen. Onbeschikbare bron is unknown, geen afwijzing of bevestiging. Launchplatform en ontstaansdatum blijven onbekend zonder controleerbaar bronbewijs; oudste beschikbare RPC-transactie is niet automatisch de creatietransactie.

Mutationele sequence: valideer bounded input -> verse challenge voor domein + network + wallet + actie + mint + asset + payloadhash + revision -> server Ed25519 -> eenmalig nonceverbruik via exact-ID conditional update -> verse officiële ownershipcheck -> gecontroleerde revisie opslaan -> moderation pending. Bij publiceren hercontrole en approval van exact dezelfde content-/proofrevision. Een wijziging aan tekst/links vereist opnieuw review.

Bij eigenaarwissel: status reauthorization_required/historical; oorspronkelijke wallet en bewijs blijven immutable. Nieuwe eigenaar krijgt geen toegang tot oude records en maakt desgewenst een nieuwe associatie. Oude ondertekenaar mag historische verklaringen intrekken/een dispuut indienen op basis van walletbewijs; hij mag zonder actueel eigendom geen huidige koppeling wijzigen of herstellen.

Bij RPC-uitval: huidige koppeling unknown/unavailable; vorige snapshot blijft expliciet historisch. Expiry van bewijs blijft zichtbaar. Tijdelijke A->B->A-transfers kunnen door alleen periodieke snapshots worden gemist. Volledige transfergeschiedenis vraagt een aanvullende event/indexerbron en is geen MVP-garantie.

Directe chaincheck en databasecommit zijn niet atomair met een externe NFT-transfer. Version-CAS voorkomt app-races, niet Solana-races. Formuleer UI en API daarom als 'eigendom gecontroleerd op slot X / tijd Y', en check opnieuw vóór gevoelige acties. Een on-chain Stamp kan dit later in dezelfde transactie controleren.

## 6. Tokenmetadata en externe content

1. Controleer Mainnet-cluster, mintpubkey, account owner en geldige mintstructuur via de bestaande RPC-laag; SPL Token en Token-2022 apart identificeren. Raw u64-waarden blijven decimale strings/BigInt.
2. Voor klassieke fungibele tokens: decodeer de canonieke Metaplex Token Metadata-account, controleer metadata-programma en gekoppelde mint. Geen NFT-only aannames kopiëren.
3. Voor Token-2022: metadataPointer/tokenMetadata herkennen; extern metadata-account alleen met ondersteunde owner/interface en controle van de gekoppelde mint. Onbekende extensies expliciet noemen; tonen is niet hetzelfde als betaalondersteuning.
4. On-chain naam/symbool/URI en off-chain beschrijving/image scheiden, inclusief bron en retrievaltijd. Een URI of image kan veranderen. Geen ontbrekende naam, creator of launchplatform invullen met een gok.
5. MVP externe JSON alleen via vast ingestelde toegestane HTTPS-/IPFS-/Arweave-gateways. Willekeurige websites blijven klikbare gesaniteerde links, niet automatisch server-side opgehaald. Geblokkeerde metadata laat een bruikbaar Passport met ontbrekende velden over.
6. Voor latere bredere fetch: egressbescherming tegen private/link-local/loopback IPv4 en IPv6, credentials, afwijkende poorten, DNS-rebinding en redirects; iedere redirectbestemming opnieuw controleren of redirects weigeren. Een hostnaamregex of alleen HTTPS is geen SSRF-bescherming.
7. Voorstel grenzen: JSON maximaal 256 KiB streaming, maximaal 5 s inclusief body; images maximaal 2 MiB, dimensie-/MIMEcontrole, raster-reencode. Geen HTML, SVG-scriptcontent of arbitrary URL-proxy. Bestaande `discoverImages.ts` heeft nuttige allowlist-/headercontroles maar is een PNG-uploadvalidator, geen algemene metadatafetcher.
8. Alleen gecontroleerde rasterafbeeldingen via bestaande Image-component; onbekend logo krijgt een neutrale placeholder. Geen externe trackerafbeeldingen standaard rechtstreeks embedden. Off-chain descriptions renderen als plain text, geen `dangerouslySetInnerHTML`.

Primaire technische bronnen, geraadpleegd 2026-11-05:
- https://www.metaplex.com/docs/smart-contracts/token-metadata
- https://solana.com/docs/tokens/extensions/metadata

Deze documentatie bevestigt metadata-structuren, niet de creator van een willekeurige token. Nog geen launchplatformadapter geselecteerd of getest; geen partnerschapsclaim.

## 7. Routes, API en presentatie

Geen routes toegevoegd in deze fase.

Voorgesteld: `/discover/tokens` en `/discover/tokens/:mintAddress`, binnen bestaande ecosystemshell; Discover behoudt Projects/People en krijgt Tokens. Een mintpagina kan meerdere associaties tonen. Historische bewijzen krijgen eigen immutable association-ID's.

Beheer voorlopig ontwerpen in bestaande ecosysteemcontext, bijvoorbeeld `/token-passports/manage` en `/token-passports/create`, niet blind in de huidige developmentgerichte Network-context hangen. Definitieve beheerroute pas bij het authenticatiebesluit; bestaande `/network/:handle` en `/:handle` nooit als Passportbeheerroute misbruiken.

Voor frontend API hetzelfde SDK-invokepatroon als bestaande functies. Voorgestelde smalle operaties: lookup, publicRead, history, myAssociations, challenge, createRevision, withdraw, report, adminReview. Iedere mutatie scope + versie + signed payload controleren. Geen generieke Core-/databaseproxy.

De geïllustreerde REST-GET-paden zijn een extern API-contract, niet automatisch werkende routes. Staging moet aantonen hoe GET via bestaande hosting/functions wordt gerouteerd. Geen browser-call naar een verzonnen `/api`-endpoint. Publieke respons `schema_version: 1`, expliciete provenance en pagination; fouten 400/401/403/404/409/429/503 met vaste errorcode. Geen private sessievelden.

Cache: technische metadata kan een beperkte TTL hebben; autorisatiechallenges en mutaties `no-store`; ownershipclaims hebben checked_at/slot/expiry en verliezen hun actuele label bij onbeschikbaarheid/veroudering. Publicatie/suspensie invalideert projecties; API controleert de masterstatus ook bij cachegebruik.

UI hergebruikt ecosystemtokens en navigatie: donker navy/cyaan/blauw/paars, bestaande typografie en afgeronde kaarten. Network heeft ook light-theme-assets; daarom niet automatisch de hele bestaande Network-layout overnemen voor een dark-only feature. Exact mintadres prominent, rolbewijs in gewone taal, projecttekst als zelf opgegeven markeren. Geen Launch Stamp-knop zolang betaling/registratie niet beschikbaar is.

## 8. Operationeel budget — orde van grootte, geen prijsopgave

Geen live RPC-, verkeers- of providerkostenmeting gedaan. Aantallen hieronder zijn hypotheses voor het voorgestelde ontwerp, exclusief retries, polling, DAS-providerweging en optionele historische bewijsbronnen.

| Actie | Geschat aanvullend RPC-verbruik |
|---|---|
| Koude tokenlookup | 2–4 reads: mint, metadata, eventueel pointer/config; maximaal 1 begrensde externe JSON-fetch |
| Complete nieuwe associatie | circa 6–12 reads inclusief ownership bij challenge/commit, token/metadata en eventuele hercheck; optioneel brontransactieonderzoek extra |
| Koude detailweergave met actuele ownershipcontrole | circa 2–4 reads; metadata uit cache waar toegestaan |
| Directory | DB-pagina, geen onbeperkte ketenread per kaart; verse status via begrensde batchchecks |
| 1.000 actieve associaties, iedere 15 min, twee accounts per associatie, batches van 100 | 20 RPC-reads per ronde × 96 rondes = circa 1.920 reads/dag, exclusief retries/config. Dit is een ontwerpvoorbeeld, geen huidig gebruik. |

De huidige `resolveOnChain` doet normaal twee RPC-calls: accountpaar plus SOL-bestemmingsclassificatie. Bestaande walletkeuze scant de hele index en is daarom niet geschikt als herhaald autorisatiepad bij groei. Hergebruik kandidaten, verifieer alleen de geselecteerde handle en voeg batching toe zonder ownershipregels te dupliceren.

Databasebudget afzonderlijk begroten: challenge/replaycheck, master/proof/history, publieke projectie en reportcases. Service-role verkeer deelt één callerbudget; werkende buildertests zijn geen productie-loadtest. Gebruik count/aggregate voor dashboards, filter/cursor voor lijsten, geen telling op willekeurige eerste 500 resultaten. Stale-/latency-/429-monitoring toevoegen vóór publiek gebruik.

Eurokosten zijn zonder RPC-contract, methodweging, metadata-egress, verkeer en retentiebeleid niet betrouwbaar vast te stellen. Formule: reads per actie × acties + backgroundchecks + retries, gewogen volgens provider; plus opslag, imagecache, egress en monitoring. Geen AI/LLM nodig voor basisverificatie; geen extra AI-creditafhankelijkheid introduceren.

## 9. Launch Stamp en Pro: afzonderlijk vervolg

Bestaande canonieke $HANDLE-mint staat in `handlePaymentStatus.ts`; die bron hergebruiken, geen tickerlookup of tweede token. Werkelijke mintowner/decimals en runtimeconfig opnieuw aan chaindata toetsen. Broncode-inspectie is geen live deploymentcontrole.

Dedicated minimaprogramma onderzoeken met een record-PDA afgeleid van een unieke registration/quote-ID, network, mint, signer en handleasset. Een recordcommitment bindt proofversie/snapshot en exacte feevoorwaarden; geen grote profieltekst on-chain. De instructie controleert ownership en quote, voert juiste tokenprogram/burn/treasuryallocatie uit en maakt de record-PDA atomair. Bestaande SolHandle NFT-programma blijft ongewijzigd.

Quote bindt serviceType, immutable passport/revision, recordhash, canonical betaalmint, payer, treasury, tokenprogramma, raw-bedrag, configversie en expiry. Admin configureert prijs; geen voorbeeldbedrag als echte prijs. Burn = floor(raw/2), treasury = raw - burn; benoem de ene basiseenheid afronding bij oneven bedragen. Noem een memo hoogstens payment reference, nooit contract-afgedwongen registratie.

Finalized chainbewijs bepaalt fulfillment. Eén unieke on-chain record/quote voorkomt dubbel innen of hergebruik van een mintbetaling voor een Stamp. Herstel/reconciliation moet dezelfde betaalde service hervatten zonder opnieuw te laten betalen; status paid/pending, registration-finalized, unresolved onderscheiden. Een Finalized Solana-transactie kent geen halve on-chain uitvoering: gedeeltelijkheid slaat op client/database-fulfillment, niet een mislukte transactie die toch slechts de burn uitvoerde.

Geen bestaande refunds garanderen. Burn is niet vanzelf terug te draaien; een afzonderlijk compensatie-/refundbeleid vraagt product-, treasury- en juridische besluitvorming. Onafhankelijke contractreview, wrong-token/replay/race/recoverytests en expliciete Mainnet-go zijn verplicht.

Project Identity Pro: eerst één afgebakende optionele tool met aantoonbaar gebruik; eenmalig unlock of tijdgebonden dienst apart begroten. Geen lifetimebelofte of abonnement introduceren. Basisidentificatie, waarschuwingen en wallet-/ownershipbewijs blijven gratis. Betaling verleent geen officiële projectreview of creatorrelatie.

## 10. Moderatie, metrics en tests per oplevering

Moderatie: pending -> approved/published of rejected; suspended beïnvloedt zichtbaarheid, niet de historische chainfeiten. Review is content-/impersonatiereview, geen veiligheids- of investeringsgoedkeuring. Reports/disputes zijn privé. Zelfde project-ID of domeinclaim vergt afzonderlijk bevoegd bewijs; geen takeover op URLgelijkenis. Adminbesluiten append-only auditen. Databasehistorie is applicatiehistorie, niet blockchain-immutable; hashes/handtekeningen maken wijzigingen controleerbaar maar verhinderen beheerderdeletie niet technisch.

Metrics fase 1: unieke associaties, geldige walletbewijzen, gepubliceerde/afgewezen revisies, specifieke onafhankelijk vastgestelde rollen, unieke wallets, aantoonbare handleclaims via deze flow. Tel geen views of indieningen als integraties. Dedupliceer service-action-/proof-ID's en gebruik begrensde serveraggregaties. Herhaalbezoek, shares/referrals en projectanalytics vragen eerst consent- en privacyontwerp; geen walletfingerprinting toevoegen. Betaalmetrics pas na betaalfase uit finalized raw receipts, niet uit quotes of geraamde burns.

| Oplevering | Verplichte bewijsstukken | Huidige status |
|---|---|---|
| 0. Audit | Hergebruik, datamodel, grenzen, risico's en kostenmodel | Dit document; statische inspectie |
| 1. Test-MVP | Geïsoleerde staging; tokenlookup, dark responsive UI, verse challenges, private drafts, review, publieke v1-projectie, historical-safe mutaties | Niet gebouwd |
| 2. Securityrapport | Replay/expiry, wijziging na ondertekening, vreemde wallet, gelijktijdige starts, revisieconflict, partial-save recovery, ownershiptransfer A->B, A->B->A-beperking, RPC-uitval, hostile metadata, abuse en direct-entitytoegang | Niet uitgevoerd |
| 3. Gratis productie | Gesloten securitybevindingen, staging-acceptatie, monitoring, retentie/backfillbeleid, rollback en expliciete releasegoedkeuring | Geen productie-go |
| 4. Stampvoorstel | Dedicated program/fee-/receipt-/reconciliationontwerp + onafhankelijke security/juridische review | Alleen bovenstaande onderzoeksrichting |
| 5. Stamprelease | Verkeerde mint/program/payer/destination/amount, burnafronding, signer/quoteexpiry, replay, dubbelconfirm, disconnect, betaling-geslaagd/DB-fout, recovery en finalized receipts | Niet gebouwd; Mainnet geblokkeerd |

Functionele stagingacceptatie bevat originele Token Program- én Token-2022-fixtures, incomplete metadata, twee gelijke tickers met verschillende mints, meerdere wallets bij één mint, projectreport/suspensie, delen/QR, desktop/mobile/native signing en gescheiden publieke/private API-responses. Tests van aangepaste ownershiphelpers omvatten bestaande resolve/Primary/Pay-flows om regressies te voorkomen.

Functionele browseracceptatie later via de Testing Agent; protocol-/crypto-/contracttests en onafhankelijke review zijn aanvullende, afzonderlijke bewijsstukken. In deze fase zijn geen browsertests, walletsignatures, betalingen, runtime-ownershiptests of smart-contractdeployments uitgevoerd. Geen feature als getest of live presenteren op basis van deze audit.

## 11. Documentatiebewijs databasegrenzen

Geraadpleegd via Base44-documentatie op 2026-11-05:
- https://docs.base44.com/developers/backend/resources/entities/entity-schemas — geen unieke constraints, concurrente upserts kunnen dupliceren, bulkbewerkingen geen transacties.
- https://docs.base44.com/developers/references/sdk/docs/type-aliases/entities — conditionele write-time controle voor `updateMany` met één exact record-ID.

Deze garanties sturen de ontwerpgrens; een nieuwe Passport-entiteit krijgt daardoor niet automatisch veilige uniciteit of multi-recordatomiciteit.

## 12. Volgende beslissing

Eerst het publieke walletautorisatiecontract, de concurrency-/herstelstrategie en de beperkte metadata-sourcepolicy vastleggen. Daarna uitsluitend de gratis MVP in een afzonderlijke testomgeving bouwen. Succes betekent dat echte bezoekers de associaties gebruiken om concrete tokenadressen en specifieke walletrollen te controleren; betaling of tokenutility is niet op zichzelf het bewijs dat de gratis functie waarde heeft.