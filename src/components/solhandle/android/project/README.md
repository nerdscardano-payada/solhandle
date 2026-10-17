# SolHandle Android, zonder Google Play

Dit is het afzonderlijke Android-project voor https://solhandle.io. Er wordt GEEN APK of signing key meegeleverd. De website moet gepubliceerd zijn met de Android-walletbridge voordat de APK kan werken. Java/Android SDK ontbreken in de webpreview; bouw lokaal.

## 1. Voorbereiden op Linux / WSL2
Installeer Android Studio en selecteer Android SDK Platform 35, Build Tools 35.0.0 en Platform Tools in SDK Manager. Installeer Java/JDK 17, curl, unzip en sha256sum. Gebruik Linux Java binnen WSL, nooit Windows Java/Gradle vanuit een WSL-map. Voor een toestel is Android Studio op je gewone desktop het eenvoudigst. Google Play en een Play Console-account zijn niet nodig.

Pak de project-ZIP uit in een eigen map. Open deze map in Android Studio, of gebruik een Linux/WSL-terminal:

```bash
cd ~/SolHandleAndroid
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH="$JAVA_HOME/bin:$PATH"
export ANDROID_HOME="$HOME/Android/Sdk"
bash create-signing-key.sh
bash build-release.sh 1.0.0 1
```

Gradle 8.11.1 wordt automatisch van de officiele HTTPS-distributie opgehaald en de checksum gecontroleerd. Accepteer SDK-licenties via Android Studio/SDK Manager. Stel JAVA_HOME/ANDROID_HOME in op jouw werkelijke Linux-installaties. Android Studio kan ook direct de Gradle-bestanden synchroniseren; voor de ondertekende release gebruik je bovenstaande script.

## 2. Sleutel veilig bewaren
De nieuwe RSA signing key staat standaard in ~/.solhandle-android/release.jks, buiten het project. Wachtwoorden worden verborgen gevraagd en alleen tijdens de build via de omgeving doorgegeven. Bewaar een versleutelde offline back-up van de sleutel en het wachtwoord apart. Deel beide nooit in chat, de repository of openbare hosting. Iedere update moet met DEZELFDE sleutel en hetzelfde applicationId worden ondertekend. Verhoog altijd versionCode. Een nieuwe sleutel is geen update voor bestaande installaties.

## 3. Wallets en veiligheid
De WebView laadt uitsluitend https://solhandle.io. Externe HTTPS/mail/tel-links gaan naar een externe app. Willekeurige intent://, file://, content:// en javascript:-navigaties worden niet uitgevoerd. De native walletbridge gebruikt AndroidX WebMessageListener met een exacte originregel EN main-framecontrole; geen onbeperkte addJavascriptInterface. Andere origins en frames krijgen geen toegang. Nieuwe browservensters en onveilige remote HTTP-inhoud zijn niet toegestaan.

De native Mobile Wallet Adapter gebruikt een Android activity-result om een MWA-compatibele wallet te openen en keert terug naar dezelfde WebView zonder herladen. Walletaccounts en authToken blijven alleen in geheugen. De app bewaart geen sleutels of seed phrases en verzendt zelf geen transacties: de bestaande SolHandle-flow controleert en verstuurt de getekende transactie. Iedere ondertekening gaat naar de wallet voor toestemming; berichten ondertekenen verleent nooit automatische betaaltoestemming. Geen automatische retries. Het netwerk is expliciet Solana Mainnet. Bij een andere geautoriseerde account wordt ondertekenen geweigerd.

Gebruik een actuele MWA-compatibele Android-wallet, bijvoorbeeld Solflare. Niet iedere wallet (of versie) ondersteunt MWA/signTransaction; compatibiliteit met Phantom/Backpack is NIET gegarandeerd. Test alleen de walletversies die je publiek wilt ondersteunen. Er wordt geen injectie van Phantom of Backpack nagebootst. Andere browsers/walletflows op de website blijven ongewijzigd. Google OAuth kan embedded WebViews weigeren; de publieke walletflows vereisen geen e-mailaccount.

De Android-terugknop roept window.solhandleAndroidBack() aan: eerst dialoog sluiten, dan mobiele route-/tabgeschiedenis; bij root kan de app sluiten. Geen dubbel pop-event. Gebruik solhandle://open?path=%2Fpay voor expliciet terugkeren vanuit een externe app; alleen relatieve paden binnen de vaste HTTPS-origin worden geladen. Dit is geen geverifieerde Android App Link en verwerkt geen signing-resultaten; die komen uitsluitend via MWA.

## 4. Controle op een echt Android-toestel (nog uit te voeren)
Installeer de APK bijvoorbeeld via adb:

```bash
"$ANDROID_HOME/platform-tools/adb" install -r releases/solhandle-1.0.0.apk
```

Controleer: eerste start, offline/herstel, schermrotatie, systeemterugknop (dialoog, child-route, tab, root), wallet verbinden en weigeren, account wisselen, bericht ondertekenen, SOL-betaalreview/tekenen/receipt, handlemint-review/tekenen/receipt, weigering zonder dubbel versturen, app hervatten na wallet, app herstart (opnieuw verbinden), externe links, geen bridge vanuit ander domein/iframe. Mainnet-handelingen kosten echte SOL: gebruik een apart testwallet met een klein saldo en review elke transactie. Test ook een update met hogere versionCode en dezelfde signing key. Deze stappen zijn niet automatisch op een echt toestel gevalideerd.

## 5. Openbaar publiceren
De build maakt releases/solhandle-1.0.0.apk en een SHA-256-bestand, en toont de signing-certificate SHA-256. apksigner verify moet slagen. Host uitsluitend de APK via een openbare HTTPS-direct-downloadlocatie (bijvoorbeeld een release attachment of eigen bestandshosting); niet de keystore, wachtwoorden of hele projectmap. Gebruik Content-Type application/vnd.android.package-archive en bij voorkeur Content-Disposition attachment. De link mag geen login of tijdelijk toegangstoken vereisen. Wijzig de APK nooit nadat de hash is berekend.

Open /android op de gepubliceerde SolHandle-site en log in als bestaande beheerder. Vul onder Release publiceren de directe APK-link, versie, versionCode, Android 8.0, bestandshash en certificaatvingerafdruk in. Bevestig de uitgevoerde toestelcontroles en publiceer. Iedereen kan de release zien; alleen admins kunnen releases aanmaken/wijzigen/verwijderen. Zonder gepubliceerde release toont de pagina eerlijk dat nog geen APK beschikbaar is.

## 6. Installatie en updates voor gebruikers
Download uitsluitend via de officiele /android-pagina. Android vraagt eventueel om 'Onbekende apps installeren' voor de gebruikte browser; schakel dit na installatie weer uit. Vergelijk SHA-256 met de publicatie, bijvoorbeeld met sha256sum op Linux. Omzeil geen waarschuwing voor een ongeldige handtekening of afwijkende hash. Updates installeer je handmatig over de vorige APK. Geen automatische updater of Google Play-distributie.

Bronnen: https://docs.solanamobile.com/android-native/using_mobile_wallet_adapter en https://developer.android.com/reference/androidx/webkit/WebViewCompat#addWebMessageListener