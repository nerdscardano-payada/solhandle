# Projectbeheer — eerste werkpakket

Datum: 25 oktober 2026. Scope: admin-beheerde projectvermelding in Discover.

## Geïmplementeerd

- Beheer via /admin/projects, bereikbaar vanuit het bestaande admin-dashboard en voor beheerders ook vanuit Discover.
- Alleen admins krijgen de beheerpagina en mogen NetworkProject aanmaken, wijzigen of verwijderen. De entiteitsregels handhaven dit onafhankelijk van de UI.
- Gewone gebruikers en anonieme bezoekers mogen uitsluitend status=PUBLISHED lezen. Admins behouden toegang tot concepten. Projectdetail vraagt ook voor admins expliciet alleen gepubliceerde records op.
- Nieuw project begint als concept. Velden: naam, samenvatting, optionele volledige beschrijving, categorie en HTTPS-website.
- Toevoegen, bewerken, expliciet publiceren en intrekken door Draft te kiezen en op te slaan. Intrekken behoudt de beheerversie; geen permanente verwijderknop toegevoegd.
- Na opslaan worden beheer-, directory- en detailqueries ongeldig gemaakt. Open publieke pagina's verversen ook iedere 30 seconden en bij terugkeer naar de pagina; reeds getoonde informatie op een ander apparaat verdwijnt dus niet instantaan.
- Servergestuurde naam-/samenvattingszoekopdracht, categorie-/statusfilter en cursorpaginering. Geen volledige dataset naar de browser voor filtering of tellingen.
- Publieke projectkaarten in Discover en detail via /network/projects/:projectId, inclusief de volledige beschrijving en externe-linkwaarschuwing.
- Geen Official Project-badge, NFT-/accountbinding, claims over partnerschappen, automatische publicatie, kopie van de integratiecatalogus of voorbeeldprojecten toegevoegd.
- Alleen gegevens voor publieke publicatie opnemen; deze entiteit heeft geen interne notities of privécontactgegevens.

## Niet gewijzigd / apart vervolg

- Geen publieke projectaanmeldingen of profiel-/projectmeldafhandeling. Dit blijft een afzonderlijk werkpakket.
- Geen gewone-leden-walletauth, verificatieprocedure, sociale navigatie of betaalgedrag gewijzigd.
- Eerdere fase-0-broninventaris is historisch; de projectdirectory is met dit werkpakket toegevoegd. B0-03 is deels ingevuld, niet volledig gesloten omdat publieke meldafhandeling nog ontbreekt.
- Overige veiligheids-/privacyblokkades en publieke vrijgave blijven open.

## Bewijsstand

Broncode en entiteitsregels toegevoegd. Geen runtimeflow, echte projectpublicatie of cross-role-test als geslaagd aangemerkt. Geen productierecords aangemaakt.

Vereiste acceptatiedoelen via Testing Agent:
1. Maak als admin een concept, herlaad en bewerk alle velden; concept blijft onzichtbaar voor bezoekers.
2. Publiceer het project; zoek het in Discover op naam/samenvatting en categorie; detail toont de volledige beschrijving.
3. Open de website via de waarschuwing; ongeldige of niet-HTTPS-invoer wordt in het beheerformulier geweigerd.
4. Zet Published terug naar Draft en sla op; publieke lijst/detail tonen het project niet meer na verversing.
5. Controleer directe draft-read en create/update/delete met een gewone gebruiker en zonder login; geen toegang.
6. Controleer paginering met meer dan twintig echte testrecords, filters en laden-/fout-/leegtoestanden.
7. Controleer beheer en Discover op mobiel en desktop; bestaande profiel-/postzoekresultaten blijven werken.

Geen nieuwe gebruikersrol nodig. Alleen bestaande admins beheren projecten; admins hebben daarnaast brede toegang tot appgegevens en gebruikersbeheer.