import { Link } from 'react-router-dom';
const steps = [
  ['1. Pilotpartner vastleggen', 'Kies één partner-ID, de exacte HTTPS-website, het bestaande account van de partnerbeheerder en de publieke inkomstenwallet. Deel nooit privésleutels of herstelwoorden. Dit is nog geen registratie of goedkeuring.'],
  ['2. Beveiligde toegang bouwen', 'Koppel goedgekeurde leden en geverifieerde domeinen aan precies één Devnet-partner. Laat iedere aanvraag en intent server-side controleren. De partner krijgt geen protocolbeheerdersrechten; browsercode bevat geen geheime API-sleutels.'],
  ['3. Acceptatievoorwaarden afronden', 'Leg ontbrekende wallet-, onderteken-, beveiligings-, gelijktijdigheids- en regressieresultaten vast. Controleer ook toegang tussen partners, verlopen of ingetrokken toegang, herstel zonder opnieuw tekenen en exact één definitief inkomstenbewijs.'],
  ['4. Pilot afzonderlijk activeren', 'Pas na geslaagde controles en expliciete goedkeuring krijgt één partner toegang. Test-SOL en Devnet blijven verplicht; publieke onboarding, Mainnet en algemene toegang blijven uit.'],
];
export default function PartnerMintPilotPreparation() {
  return <section className="mt-7 rounded-xl border border-names-secondary/30 bg-card p-5" aria-label="Voorbereiding externe Devnet-pilot">
    <p className="text-xs font-semibold uppercase tracking-wider text-names-secondary">Volgende stap · voorbereid, niet geactiveerd</p>
    <h2 className="mt-2 font-heading text-xl font-semibold">Eén externe Devnet-pilotpartner</h2>
    <p className="mt-3 text-sm text-muted-foreground">Je hebt een geverifieerd FINALIZED-ontvangstbewijs voor @solanatest gemeld bij devnet-testpartner. Dit is gebruikersbewijs; de volledige acceptatiematrix en onafhankelijke beoordeling zijn daarmee niet afgerond.</p>
    <ol className="mt-5 space-y-4">{steps.map(([title, description]) => <li key={title}><h3 className="text-sm font-semibold">{title}</h3><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p></li>)}</ol>
    <p className="mt-5 text-sm text-names-warning">Nu aanleveren: partner-ID, HTTPS-domein, account-e-mailadres en publieke inkomstenwallet. Een account-e-mailadres is alleen voor de besloten toegang, niet voor publieke mintgebruikers.</p>
    <Link className="mt-4 inline-block text-sm text-names-accent underline" to="/developers/partner-mint#external-pilot">Bekijk het voorbereidende beveiligings- en activatieplan</Link>
  </section>;
}