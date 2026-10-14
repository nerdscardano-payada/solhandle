import { useState } from 'react';
import { ArrowRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const steps = [
  { title: 'Begin hier: wallet en test-SOL', target: 'partner-checkout', action: 'Ga naar wallet verbinden', todo: 'Zet je wallet op Solana Devnet, zorg voor test-SOL en klik hieronder op “Connect Devnet wallet”. Gebruik voor het minten een andere wallet dan de inkomstenwallet van de partner, tenzij hiervoor expliciet een uitzondering is goedgekeurd.', expected: 'De naam van je wallet en je publieke adres verschijnen. Verbinden op zichzelf vraagt geen betaling.', evidence: 'Noteer de gebruikte wallet (Phantom, Backpack of Solflare) en het publieke adres. Bewaar nooit privésleutels of herstelwoorden.' },
  { title: 'Controleer de testpartner', target: 'partner-registry', action: 'Open partnerbeheer', todo: 'Open het partnerbeheer en klik op “Refresh registry”. Controleer de bedoelde testpartner, de goedgekeurde status en de inkomstenwallet. Controleer ook of de Partner Mint-schakelaar aan staat. Wijzig alleen iets wanneer dat nodig is; wijzigingen vereisen de protocol-authority en waar nodig de inkomstenwallet als medeondertekenaar.', expected: 'De bedoelde partner is goedgekeurd en de ontvangers zijn correct. Een beheerder-login is geen bevoegdheid om namens de authority-wallet te tekenen.', evidence: 'Bewaar partner-ID, inkomstenwallet, revisie en eventuele Devnet-transacties van registratie of wijzigingen.' },
  { title: 'Zoek en bekijk de kosten', target: 'partner-checkout', action: 'Ga naar de mintflow', todo: 'Zoek een nieuwe testnaam met “Search”. Bij AVAILABLE kies je “Get live SOL quote”, daarna “Simulate and review total costs”. Bekijk de prijs, ontvangers, verdeling en afzonderlijke netwerk- en accountkosten vóór je tekent.', expected: 'Een actuele SOL-offerte met 50/50 verdeling van de mintvergoeding en apart vermelde bijkomende kosten. Zoeken en een offerte reserveren de naam niet.', evidence: 'Bewaar de testnaam, offerte, ontvangers en kostenweergave. Een simulatie bewijst nog geen geslaagde mint.' },
  { title: 'Mint en controleer het bewijs', target: 'partner-checkout', action: 'Ga naar ondertekenen en ontvangstbewijs', todo: 'Kies pas na je kostencontrole “Sign and mint on Devnet”. Keur de transactie in je wallet goed en controleer de status via het ontvangstbewijs. Bij onduidelijkheid controleer je eerst dezelfde transactie; start niet meteen een nieuwe mint.', expected: 'Een definitief ontvangstbewijs toont de officiële NFT voor de claimant en de juiste SOL-verdeling. Alleen een definitieve mint telt mee als resultaat.', evidence: 'Bewaar de transactiesignatuur, NFT-adres, eigenaar, partner-ID en exacte lamportbedragen. Bij een oneven bedrag gaat de resterende lamport naar het protocol.' },
  { title: 'Controleer rapportage en herstel', target: 'partner-report', action: 'Ga naar rapportage en herstel', todo: 'Klik op “Refresh report”. Controleer dat de definitieve mint één keer in de rapportage staat. Gebruik “Recover saved mints” wanneer een eerder verzonden mint nog niet verwerkt is. Herhaal dit voor de andere ondersteunde wallets.', expected: 'De rapportage sluit aan op definitieve transactiebewijzen, zonder dubbele inkomsten. Devnet-bedragen zijn testactiviteit, geen productieomzet.', evidence: 'Bewaar het rapport en bijbehorende signaturen per wallet. Herstel mag geen nieuwe betaling vereisen voor een al geslaagde transactie.' },
  { title: 'Wat blijft nodig voor afronding?', target: 'partner-acceptance', action: 'Bekijk de openstaande voorwaarden', todo: 'Laat daarna de volledige acceptatiematrix uitvoeren: gezamenlijk ondertekenen, walletwijziging, opschorten, annuleren, onvoldoende SOL, verlopen offertes, dubbele inzendingen, gelijktijdige claims, beveiligingscontroles en regressies van bestaande flows. Laat het programma onafhankelijk beoordelen.', expected: 'Alle verplichte gevallen hebben een vastgelegd resultaat; fouten zijn opgelost en de onafhankelijke beoordeling is afgerond. Eén geslaagde mint rondt fase 1 niet af.', evidence: 'Per geval: verwachte en werkelijke uitkomst, datum, gebruikte wallet en transactiebewijs waar van toepassing. Dit paneel voert geen tests uit en certificeert niets.' },
];

export default function PartnerMintGuide() {
  const [active, setActive] = useState(0);
  const step = steps[active];
  function goToTool() {
    const target = document.getElementById(step.target);
    const details = target?.querySelector('details');
    if (details) details.open = true;
    target?.scrollIntoView({ behavior: 'auto', block: 'start' });
    target?.focus({ preventScroll: true });
  }
  return <section aria-label="Fase 1 stappenplan" className="mt-7 rounded-2xl border border-names-accent/30 bg-card p-5 sm:p-6">
    <p className="text-xs font-semibold uppercase tracking-wider text-names-accent">Begin hier · uitsluitend Devnet</p>
    <h2 className="mt-2 font-heading text-2xl font-semibold">Fase 1, stap voor stap</h2>
    <p className="mt-3 text-sm text-muted-foreground">Volg deze route door de bestaande pilot. Je kiest zelf een stap; bekijken betekent niet dat een controle geslaagd is. Voer nooit herstelwoorden of privésleutels in.</p>
    <nav aria-label="Stappen" className="mt-5 grid gap-2 sm:grid-cols-2">{steps.map((item, index) => <button key={item.title} type="button" aria-current={active === index ? 'step' : undefined} onClick={() => setActive(index)} className={`min-h-11 rounded-lg border px-3 py-3 text-left text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-names-accent ${active === index ? 'border-names-accent bg-names-accent/10 text-names-accent' : 'border-border text-muted-foreground'}`}><span className="mr-2 font-semibold">{index + 1}.</span>{item.title}</button>)}</nav>
    <article aria-live="polite" aria-atomic="true" className="mt-5 border-t border-border pt-5">
      <p className="text-xs text-names-secondary">Stap {active + 1} van {steps.length} · instructie, geen teststatus</p>
      <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
      <dl className="mt-4 space-y-4 text-sm leading-relaxed">{[['Wat doe je?', step.todo], ['Wat hoort er te gebeuren?', step.expected], ['Welk bewijs bewaren?', step.evidence]].map(([label, text]) => <div key={label}><dt className="font-semibold">{label}</dt><dd className="mt-1 text-muted-foreground">{text}</dd></div>)}</dl>
      <Button type="button" className="mt-5 min-h-11 w-full whitespace-normal sm:w-auto" onClick={goToTool}>{step.action}<ArrowRight /></Button>
    </article>
    <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4"><Button type="button" variant="outline" disabled={active === 0} onClick={() => setActive(index => index - 1)}><ChevronLeft />Vorige</Button><Button type="button" variant="outline" disabled={active === steps.length - 1} onClick={() => setActive(index => index + 1)}>Volgende<ArrowRight /></Button></div>
    <p className="mt-4 text-xs text-names-warning">Geen automatische goedkeuring, geen opgeslagen testresultaten en geen Mainnet-activering. Het volledige acceptatieplan blijft leidend.</p>
  </section>;
}