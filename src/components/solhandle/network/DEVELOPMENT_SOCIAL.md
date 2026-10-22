# Network Social Lab

## Toegang en scheiding

Route: `/network/lab`, via de Network-zijbalk zichtbaar voor admins.
Platformlogin is alleen operatorauthenticatie. Het is geen emailfallback voor Network-deelnemers.
Backend `networkLab` controleert platformadmin + serverflag en bij iedere actoractie het eigendom van die DEVELOPMENT-account.
Publieke deelname blijft uit; `/profile`, minten, walletconnectie, Pay en Contacts zijn niet veranderd.
`NetworkAccount.mode=DEVELOPMENT`; profielen en posts hebben `preview=false`, dus publieke readers (`preview=true`) sluiten ze uit.
Interactie-/notificatie-/moderatie-/entitlementrecords dragen `environment=TEST` en zijn op alle operaties admin-only beveiligd.

## Werkende productonderdelen

- Expliciete aanmaak en wissel van maximaal twaalf testidentiteiten per operator.
- Sociale profielbewerking, persoon/creator/project-type, opgeslagen HTTPS-links.
- Tekstposts, replies, gesprekken, edit/delete, likes, reposts, bookmarks en ongedaan maken.
- Follow/unfollow, followers/following-lijsten, chronologische Latest/Following.
- Discover met transparante score: likes + 2×reposts + 3×gepubliceerde replies.
- Profielnaam- en posttekstzoeken, gepagineerde resultaten.
- Testnotificaties en gelezenstatus per ontvangende testaccount.
- Block/mute, postrapportage, moderatie en gemotiveerde geschiedenis.
- Accountgebonden optionele capabilitygrants met expiratie/intrekking; geen trust-, verificatie- of moderatievoordeel.

## Handmatige acceptatiescenario's voor Testing Agent

1. Maak twee duidelijk benoemde testidentiteiten; wijzig bio en type zonder account-ID te veranderen.
2. Publiceer onder A; schakel naar B; like, repost, bookmark, volg A en antwoord op de post.
3. Controleer B's Following/bookmarks/reposts en A's notificaties; markeer een notificatie gelezen en laad opnieuw.
4. Undo like/repost/bookmark/follow; controleer lijsten en aantallen na verversen.
5. Mute A als B; controleer feedonderdrukking; undo mute via People → profiel.
6. Block A als B; controleer wederzijdse followbeëindiging en geblokkeerde interacties.
7. Rapporteer een testpost, pas een gemotiveerde hide/restore toe en lees de geschiedenis.
8. Verleen en trek een optionele testcapability in; controleer dat dit geen verificatie/ranking/moderatierechten verandert.
9. Controleer anoniem en als niet-admin dat labtoegang wordt geweigerd en publieke Network-resultaten nooit testrecords tonen.

## Nog apart te bouwen

Veilige wallet-native registratie, managementwallets, exclusieve handlebindings en transfergedrag; echte Pay-profielkoppeling, projectkaarten/verbonden integraties, afbeeldingen/media, bezwaar, volledige privacy/export/delete en productie-abusecontrole.
De capability-evaluator is een architectuurgrens, geen bewijs dat alle premiumtools al bestaan.
Geen productieconcurrencyclaim: interactie-upserts zijn nog niet transactioneel uniek; server-side relatieset heeft een expliciete developmentlimiet.
Backendfunctie-start en ongeldige-actorafwijzing zijn gecontroleerd tijdens bouw; bovenstaande volledige UI-scenario's zijn niet als geslaagd afgetekend.