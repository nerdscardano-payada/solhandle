# SolHandle Ecosystem — productiemigratie van het ontwerp

Datum: 25 oktober 2026
Status: publieke homepage en operationele kern aangesloten; geen volledige leden-/sociale vrijgave.

## Geleverde samenhangende kern

- `/`: publieke Ecosystem-homepage, met dezelfde stadsillustratie, hero, indeling en project-/contact-/betaalsecties als het ontwerp. Geen demonstratieaccount, gefingeerde aantallen of demo-projecten.
- `/ecosystem`: operationeel walletdashboard met actuele Primary-identiteit via de bestaande resolver, identiteitsfouten/leegte, echte gepubliceerde projecten en werkende navigatie naar bestaande diensten.
- `/discover`: publicatiegefilterde projectdirectory, serverzoekvraag, categorieën, paginering en laad-/fout-/leegtestaten.
- `/discover/projects/:projectId`: bestaande gepubliceerde projectdetailflow met volledige samenvatting, beschrijving en bestaande externe-linkbevestiging.
- `/profile`: Ecosystem-identiteitsweergave op basis van de bestaande wallet-/Primary-resolver. Geen nieuw sociaal profiel of vrij invulbare ownershipclaim.
- `/search`, `/my-handles`, `/contacts`, `/pay`, `/receive`: dezelfde Ecosystem-header, zijbalk, mobiele navigatie en kleurcontext rond de bestaande functionele flows. Bestaande mint-, contact-, ontvanger-, transfer-, signing- en herstelregels blijven leidend.
- Homepage- en headerzoekvelden openen `/search?q=...`; de zoekpagina voert de bestaande beschikbaarheidscontrole uit. Zoekactie ondertekent niet automatisch een transactie.
- Bestaande homepage-links met `claim` of `official_claim` gaan met hun parameters naar de bestaande zoek-/claimflow; mintrecovery en referralattributie blijven aanwezig.

Alleen bestaande mainnetoperaties hergebruikt. Geen nieuwe backend, permissieversoepeling, loginprovider, recordmigratie of betalingsintegratie. De geselecteerde wallet komt op Search rechtstreeks uit de bestaande walletprovider, niet uit een verouderde lokale adreskopie.

## Grenzen

De publieke homepage is niet een ingelogde sociale accountomgeving. Walletverbinding toont uitsluitend de aangesloten wallet en de indien controleerbaar gekoppelde on-chain identiteit. Geen walletconnectie voorstellen als algemene ledenlogin.

Het connectiemodel blijft uitsluitend het afzonderlijke ontwerp in `../network/CONNECTION_MODEL_DESIGN.md`. Geen echte verzoeken, acceptaties, besloten feeds, automatische privécontacten of sociale notificaties aangezet.

Het aparte `/ecosystem-preview` blijft een herkenbaar demonstratie-/reviewoppervlak en wordt niet gebruikt als gegevensbron voor het operationele platform. Nieuwe productiecomponenten importeren geen demo-provider of demo-records.

Bestaande Network-, informatie-, beheer-, ontwikkelaars- en oudere aanvullende pagina's blijven beschikbaar. Hun volledige inhoudelijke/herontwerpmigratie is nog geen afgerond onderdeel van deze kernlevering. Er is geen oude sociale publieke leesroute gesloten door uitsluitend een nieuwe homepage toe te voegen.

## Bewijs en vervolg

- Productiebouwopdracht uitgevoerd na aansluiting van de kern.
- Geen gebruikersflow-, wallet-, transactie-, transfer- of securityacceptatie als geslaagd verklaard; er is geen transactie ondertekend/verzonden voor deze migratie.
- Vervolg: overige informatie-/beheer-/Network-oppervlakken doelgericht migreren en afzonderlijk beoordelen welke sociale leesroutes in de beperkte Hub-scope zichtbaar blijven.
- Ondersteunde wallet-native ledenauthenticatie, accountintrekking en nieuwe sociale bevoegdheden blijven afzonderlijke implementatie-/vrijgavevraagstukken.