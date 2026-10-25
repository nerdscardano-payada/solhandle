# SolHandle Ecosystem — geïsoleerd ontwerp v1.0

25 oktober 2026. Bron: goedgekeurde dashboardreferentie en het volledige UI/UX-plan van de eigenaar. Dit is een klikbaar ontwerp, geen productie-integratie of releasegoedkeuring.

## Review-ingang

`/ecosystem-preview`, buiten de bestaande product-shell. De bestaande `/`, `/design-preview`, `/network`, `/profile`, `/contacts`, `/my-handles`, `/pay` en `/receive` blijven intact. Geen redirects naar het nieuwe ontwerp, geen nieuwe hoofdnavigatie in productie.

De nieuwe kleuren zijn uitsluitend nieuwe `eco-*` design tokens in de bestaande centrale stylesheet. Geen bestaande tokenwaarde gewijzigd. De nieuwe stylesheet gebruikt alleen geïsoleerde `.eco-preview`-regels. Bestaande account-, wallet-, betaal-, entiteits- en backendlogica is niet aangepast.

## Eerste oplevering: tien gevraagde weergaven

1. Desktop Ecosystem Dashboard: compacte Network / Identity / Pay-rij, grote identiteitskaart, projecten, privécontacten, Quick Actions en lege persoonlijke activiteit.
2. Publieke homepage: bestaande goedgekeurde stad, claimzoekvoorbeeld, Identity/Discover/Pay-preview en vier inhoudssecties.
3. Identity Profile: banner, neutrale avatar, bio, zelfgekozen categorie, voorbeeldwallet en handlebeheer.
4. Discover Projects: directory plus projectdetail en expliciete verificatieverschillen; daarnaast gegroepeerde voorbeeldzoekresultaten voor People en Handles.
5. Contacts: privélijst, zoeken, toevoegen, contactdetail, verwijderen en betaling voorbereiden.
6. SolHandle Pay: Send/Receive, bedrag/asset, review, voorbeeldwijziging ontvanger en lokale simulatiebevestiging.
7. Mobiele Home: welkom, compacte identiteit, drie Quick Actions, projecten, contacten, vijf vaste hoofdbestemmingen.
8. Mobiele Identity: responsive profiel met banner en volledige walletdetails.
9. Mobiele Discover: leesbare kaarten en gegroepeerd zoeken.
10. Mobiele Contacts en Pay: één kolom, volledige ontvanger-/veiligheidsinformatie en herbruikbare lokale flow.

Toolbar schakelt tussen Responsive, Desktop (1440-breed ontwerp dat zo nodig als reviewcanvas schaalt) en Mobile (tot 390 breed, smaller bij kleinere beschikbare viewport). De interface zelf gebruikt containerbreakpoints rond 768/1100/1320/1530; geen wijzigingen aan de afwijkende bestaande Tailwind-breakpoints van de productiesite. 360-brede bezoekers krijgen standaard de mobiele weergave, geen verkleind desktopdashboard.

## Klikbare hoofdflows

- Dashboard → Manage Handles → Primary Handle in demo wijzigen.
- Claim Handle → voorbeeldnaam → resultaatpreview → simulatie zonder mint.
- Header Search → Discover → gegroepeerde Projects / People / Handles.
- Projectkaart → detail → lokale report-demonstratie; geen rapport verzonden.
- People → Save contact → Contacts → detail / verwijderen.
- Contact → Pay → Review → overdrachtswaarschuwing indien gekozen → verplichte bevestiging → simulatie voltooid.
- Pay → Receive: illustratief ontvangscherm zonder bruikbare QR of betaalverzoek.
- Accountmenu → verschil verbonden wallet en aangemeld account.
- Readiness → bestaande modules, gedeeltelijke implementaties, demo, beveiligingswerk en later.

Iedere mutatie is uitsluitend in React-geheugen. Herladen wist alle wijzigingen. Geen walletadapter, RPC, backendfunctie, entity SDK of betaalmodule wordt vanuit het prototype aangeroepen. Voorbeeldwallets beginnen met DEMO en zijn geen on-chain adressen. Er wordt niets ondertekend, verzonden, gemint of opgeslagen.

## Visueel en inhoudelijk

- Officieel bestaand SolHandle-logo: `c9341a9b4_logo.png`.
- Goedgekeurde bestaande stadsachtergrond: `2d63a5eb6_image.png`, alleen als decor of binnen kaarten; geen permanent bewegende dashboardachtergrond.
- Inter voor alle nieuwe prototype-elementen; geen globale fontrol gewijzigd.
- Geen nieuw AI-gegenereerd logo of vervanging van de merkidentiteit.
- Neutrale avatar in plaats van niet-beschikbare goedgekeurde profielfoto.
- Projecten Solana/Jupiter/Tensor/Drift zijn expliciet demo-directoryvoorbeelden; monogrammen zijn illustraties, geen nagebouwde officiële projectlogo's. Geen partnerships, badges of gelinkte handles geclaimd. Live projectselectie volgt pas na beoordeling van werkelijke records.
- Referentie staat als aparte reviewlink in de toolbar.
- Social feed, likes, reposts, followercijfers, posts, chats en sociale notificaties ontbreken; bestaande ontwikkelcode is behouden.

## Scenario's

Signed-in example, geen wallet, verbonden maar niet aangemeld, geen handles, geen Primary Handle, onzekere eigendom, overgedragen handle, lege projecten/contacten, laden en fout. Het zijn expliciet voorbeeldstaten, geen authenticatie of securitybewijs.

Onzekere of ongeldige accountbinding blokkeert gevoelige demo-Primarywijzigingen en de normale demo-betaalreview. Voor de afzonderlijke saved-contact-overdracht blijft de demo-ontvanger vastgepind met expliciete checkbox; dit volgt de eerdere B0-04-keuze en verandert de bestaande betaalbestemming niet. Bij overdracht wordt de oude accountbinding ongeldig getoond; privédata gaat niet mee naar de nieuwe eigenaar.

## Broninventaris en technische grenzen

Bekeken: bestaande router, DesignPreview/DesignContext, Brand/assets, centrale tokens/Tailwind, ContactsWorkspace, PaymentSendButton, useProfileIdentity, projectmanagement-status en fase-0-/walletauthdocumentatie. Deze inspectie hergebruikt bekende modulegrenzen; zij is geen nieuwe volledige securityaudit.

Het Readiness-paneel maakt bewust geen claim dat een bestaande module productiegereed of getest is. De projectdirectory is deels aanwezig; publieke meldafhandeling, onafhankelijke officiële verificatie, ledenauth en lifecycle/transferbewijs blijven apart. De algemene zoekfunctie in dit prototype filtert alleen vaste voorbeeldarrays, niet blockchain- of gebruikersdata.

## Open voor goedkeuring / technische controle

- Visuele goedkeuring desktop en mobiel door eigenaar.
- Functionele review via Testing Agent: alle zes schermen, dialogen, zoek-/contact-/Primary-/Pay-flow, toestandsselector en toetsenbordbediening.
- Contrast-, zoom-, schermlezer- en echte-devicecontrole; focusranden en semantische labels zijn opgenomen maar nog niet als toegankelijkheidstest geslaagd aangemerkt.
- Review van echte logo-/avatarbestanden en werkelijk gepubliceerde projecten.
- Daarna pas productietokens/modules integreren, autorisatie-/transferrisico's aantoonbaar sluiten, echte regressietests en beperkte bèta.

Geen screenshotvergelijking, runtimeflow, walletlogin, transactie of cross-account-securitytest als PASS aangemerkt. Geen productierecords aangemaakt. Geen bèta of publieke ledenlancering vrijgegeven.