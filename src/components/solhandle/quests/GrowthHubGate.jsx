import { ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGrowthHub } from '@/components/solhandle/quests/GrowthHubProvider';
export default function GrowthHubGate({ children }) {
  const { wallet, verified, verifyWallet, busy } = useGrowthHub();
  if (verified) return children;
  return <section className="rounded-2xl border border-border bg-card p-6 text-card-foreground">
    <ShieldCheck className="h-7 w-7 text-names-accent"/><h2 className="mt-4 text-xl font-semibold">Jouw wallet, jouw voortgang</h2>
    <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">{wallet ? 'Verifieer je wallet om je profiel en XP te bekijken. Je ondertekent alleen een bericht: geen betaling en geen toegang tot je saldo.' : 'Verbind je bestaande Solana-wallet via de knop bovenaan. Er is geen tweede wallet of e-mailaccount nodig.'}</p>
    {wallet && <Button onClick={verifyWallet} disabled={busy} className="mt-5">{busy ? 'Wallet verifiëren…' : 'Verifieer wallet & neem deel'}</Button>}
  </section>;
}