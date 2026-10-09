import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useGrowthHub } from '@/components/solhandle/quests/GrowthHubProvider';
import GrowthQuestCard from '@/components/solhandle/quests/GrowthQuestCard';
export default function GrowthHub() {
  const { catalog } = useGrowthHub(), data = catalog.data, season = data?.seasons[0];
  return <>
    <section className="grid gap-8 py-5 min-[1100px]:grid-cols-[1.4fr_1fr]">
      <div><p className="text-sm text-names-secondary">{season?.name || 'Growth Hub'} · gecontroleerde pilot</p><h1 className="mt-5">Build. Earn. Grow.</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">Help SolHandle groeien. Voltooi betekenisvolle quests, verdien XP en leer je on-chain identiteit écht gebruiken.</p>
        <Link to="/quests/dashboard" className="mt-7 inline-flex items-center gap-3 rounded-xl border border-names-accent/40 bg-names-accent/10 px-6 py-3 font-semibold text-names-accent">Start jouw reis<ArrowRight className="h-4 w-4"/></Link>
      </div>
      <aside className="rounded-2xl border border-border bg-card p-6"><p className="text-sm text-muted-foreground">Genesis Season · {season?.status === 'ACTIVE' ? 'XP-pilot actief' : 'nog niet gestart'}</p><h2 className="mt-4 text-2xl font-semibold">{season ? Number(season.proposed_budget_tokens).toLocaleString('nl-NL') : '—'} $HANDLE</h2><p className="mt-2 text-sm text-names-secondary">Voorgesteld budget, niet toegekend of claimbaar</p><div className="mt-6 grid grid-cols-2 gap-5 border-t border-border pt-5"><div><p className="text-xs text-muted-foreground">Geplande duur</p><p className="mt-2 font-semibold">{season?.duration_days || '—'} dagen</p></div><div><p className="text-xs text-muted-foreground">Deelnemers</p><p className="mt-2 font-semibold">{data?.participants ?? '—'}</p></div></div><p className="mt-5 text-xs leading-6 text-muted-foreground">Deze eerste fase kent alleen pilot-XP toe. XP heeft geen gegarandeerde token- of geldwaarde.</p></aside>
    </section>
    <div className="mt-10 flex items-center justify-between gap-4"><h2 className="text-2xl font-semibold">Begin met deze quests</h2><Link to="/quests/explore" className="text-sm text-names-accent">Alle quests →</Link></div>
    {catalog.isPending ? <p className="py-8 text-muted-foreground">Quests laden…</p> : catalog.isError ? <div role="alert" className="py-8"><p>Quests konden niet worden geladen.</p><button onClick={() => catalog.refetch()} className="mt-3 text-names-accent">Opnieuw proberen</button></div> : <div className="mt-5 grid gap-5 md:grid-cols-2">{data.quests.items.map(q => <GrowthQuestCard key={q.id} quest={q}/>)}{!data.quests.items.length && <p className="text-muted-foreground">Er zijn nog geen gepubliceerde quests.</p>}</div>}
    <section className="mt-10 rounded-2xl border border-border p-6"><h2 className="text-xl font-semibold">Adoptie boven punten</h2><p className="mt-3 text-sm leading-7 text-muted-foreground">Mint-, Pay-, Watchlist- en referralverificatie volgen in de volgende fase. Bestaande SolHandle-acties en Share & Earn blijven ongewijzigd.</p><div className="mt-4 flex flex-wrap gap-5 text-sm text-names-accent"><Link to="/search">Mint een handle →</Link><Link to="/pay">SolHandle Pay →</Link><Link to="/earn">Share & Earn →</Link></div></section>
  </>;
}