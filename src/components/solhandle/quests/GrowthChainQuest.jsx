import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
export default function GrowthChainQuest({ quest, onVerify, busy, pending }) {
  const [signature, setSignature] = useState(''), pay = quest.handler === 'ON_CHAIN_PAY';
  return <section className="rounded-2xl border border-border bg-card p-6">
    <h2 className="text-xl font-semibold">{pay ? 'Voltooi een echte betaling' : 'Bewijs je nieuwe mint'}</h2>
    <p className="mt-3 text-sm leading-7 text-muted-foreground">De server leest Mainnet-beta en wacht op finalized bewijs. Er wordt vanuit de Growth Hub geen transactie verstuurd en je hoeft hier niets te betalen.{quest.handler === 'ON_CHAIN_TOKEN_MINT' && ' Kies in de bestaande mintflow $HANDLE als betaalmethode.'}</p>
    {pay && <p className="mt-3 text-sm text-names-accent">Minimumbedrag: {(quest.min_amount_lamports / 1e9).toLocaleString('nl-NL', { maximumFractionDigits: 9 })} SOL · eenmalig per wallet</p>}
    <Link to={pay ? '/pay' : '/search'} className="mt-5 inline-flex rounded-xl border border-names-accent/40 bg-names-accent/10 px-5 py-3 text-sm font-semibold text-names-accent">{pay ? 'Open SolHandle Pay →' : 'Mint een handle →'}</Link>
    <form onSubmit={e => { e.preventDefault(); onVerify(signature.trim()); }} className="mt-6 border-t border-border pt-5">
      <label htmlFor="growth-chain-signature" className="text-sm font-semibold">Transactiehandtekening</label><input id="growth-chain-signature" required value={signature} onChange={e => setSignature(e.target.value)} maxLength={90} pattern="[1-9A-HJ-NP-Za-km-z]{64,90}" disabled={busy} placeholder="Plak de volledige Solana-handtekening" className="mt-2 w-full min-w-0 rounded-xl border border-input bg-background px-4 py-3 font-mono text-xs"/>
      <p className="mt-2 text-xs leading-6 text-muted-foreground">Kopieer de handtekening uit je mintbewijs of Pay-ontvangstbewijs; niet je walletadres. Een al geminte of overgedragen NFT is op zichzelf geen bewijs van een nieuwe mint.</p>
      <Button disabled={busy || !signature.trim()} className="mt-4">{busy ? 'On-chain controleren…' : pending ? 'Controleer finalisatie opnieuw' : 'Verifieer transactie & ontvang XP'}</Button>
    </form>
  </section>;
}