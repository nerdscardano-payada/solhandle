import { ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGrowthHub } from '@/components/solhandle/quests/GrowthHubProvider';
export default function GrowthHubGate({ children }) {
  const { wallet, verified, verifyWallet, busy, me, refresh } = useGrowthHub();
  if (verified && me?.profile.status === 'HELD') return <section className="rounded-2xl border border-border bg-card p-6" role="status"><h2 className="text-xl font-semibold">Je Growth Hub-profiel staat op hold</h2><p className="mt-3 text-sm leading-7 text-muted-foreground">Nieuwe quest-XP en ranglijstdeelname zijn gepauzeerd voor beheercontrole. Bestaande XP blijft bewaard; je wallet en bestaande mint- en Pay-functies blijven bruikbaar. Neem via Contact contact op voor bezwaar.</p><Button onClick={refresh} disabled={busy} className="mt-4">Vernieuw profielstatus</Button></section>;
  if (verified) return children;
  return <section className="rounded-2xl border border-border bg-card p-6 text-card-foreground">
    <ShieldCheck className="h-7 w-7 text-names-accent"/><h2 className="mt-4 text-xl font-semibold">Jouw wallet, jouw voortgang</h2>
    <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">{wallet ? 'Verifieer je wallet om je profiel en XP te bekijken. Je ondertekent alleen een bericht: geen betaling en geen toegang tot je saldo.' : 'Verbind je bestaande Solana-wallet via de knop bovenaan. Er is geen tweede wallet of e-mailaccount nodig.'}</p>
    {wallet && <Button onClick={verifyWallet} disabled={busy} className="mt-5">{busy ? 'Wallet verifiëren…' : 'Verifieer wallet & neem deel'}</Button>}
  </section>;
}