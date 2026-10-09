import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
export default function GrowthReferralQuest({ busy, onVerify }) {
  const [signature, setSignature] = useState('');
  return <section className="rounded-2xl border border-border bg-card p-6">
    <h2 className="text-xl font-semibold">Breng een echte referral aan</h2>
    <p className="mt-3 text-sm leading-7 text-muted-foreground">Gebruik je bestaande Share & Earn-link. Alleen de eerste vastgelegde referral-mint van een andere wallet na je Growth Hub-aanmelding en questpublicatie telt. Klikken, zelfreferrals en NFT-overdrachten geven geen XP.</p>
    <Link to="/earn" className="mt-4 inline-block text-sm font-semibold text-names-accent">Bekijk je referral-link en conversies →</Link>
    <form onSubmit={e => { e.preventDefault(); onVerify(signature.trim()); }} className="mt-6 space-y-3">
      <label htmlFor="growth-referral-signature" className="block text-sm font-semibold">Handtekening van de referral-mint</label>
      <input id="growth-referral-signature" required maxLength={90} pattern="[1-9A-HJ-NP-Za-km-z]{64,90}" value={signature} disabled={busy} onChange={e => setSignature(e.target.value)} placeholder="Plak de volledige Solana-transactiehandtekening" className="w-full rounded-xl border border-input bg-background px-4 py-3 font-mono text-xs"/>
      <p className="text-xs leading-6 text-muted-foreground">De server controleert jouw referralregistratie én de finalized mint van de koper. Iedere geldige referral-inzending gaat vervolgens naar beheer voor fraudereview; tot goedkeuring blijft de XP nul.</p>
      <Button disabled={busy || !signature.trim()}>{busy ? 'Referral controleren…' : 'Verifieer referral & dien in voor review'}</Button>
    </form>
  </section>;
}