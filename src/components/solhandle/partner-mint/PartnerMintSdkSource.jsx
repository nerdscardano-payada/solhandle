import ResolveCodeBlock from '@/components/solhandle/resolve/ResolveCodeBlock';
import exampleSource from '@/lib/solhandle-sdk/examples/partner-mint-devnet.js?raw';
export default function PartnerMintSdkSource() {
  return <details className="mt-7 rounded-xl border border-border bg-card p-5">
    <summary className="cursor-pointer font-semibold text-names-accent">Integratievoorbeeld en gebruiksvoorwaarden</summary>
    <p className="mt-4 text-sm text-muted-foreground">Dit is de bron van het voorbeeld hierboven. De SDK-bronversie 1.1.0 is nog niet als nieuwe npm-versie gepubliceerd. Bestaande handle-resolutie blijft ongewijzigd.</p>
    <p className="mt-3 text-sm text-muted-foreground">De huidige diensten vereisen een aangemelde protocolbeheerder. Externe partnerauthenticatie, domeinverificatie en publieke toegang volgen later; zet nooit beheerderssleutels of privésleutels in een partnerwebsite.</p>
    <ResolveCodeBlock code={exampleSource} language="JavaScript · uitvoerbare Devnet-integratie"/>
    <p className="mt-4 text-sm text-muted-foreground">Geef een goedgekeurde partner-ID en een geauthenticeerde verbinding mee die de bestaande mintdiensten aanroept. Bewaar het ondertekende resultaat voordat verzending begint. Bevestigd is nog niet definitief: controleer tot FINALIZED.</p>
  </details>;
}