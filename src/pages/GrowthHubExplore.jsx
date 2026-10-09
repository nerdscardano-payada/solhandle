import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import growthHubClient from '@/components/solhandle/quests/growthHubClient';
import GrowthQuestCard from '@/components/solhandle/quests/GrowthQuestCard';
export default function GrowthHubExplore() {
  const [category, setCategory] = useState(''), [input, setInput] = useState(''), [search, setSearch] = useState('');
  const query = useQuery({ queryKey: ['growth-hub-explore', category, search], queryFn: () => growthHubClient({ action: 'catalog', category, search }) });
  return <><h1>Quest Explorer</h1><p className="mt-4 text-muted-foreground">Begin met je profiel en productkennis. Alleen ondersteunde verificaties zijn gepubliceerd.</p>
    <form className="my-7 flex flex-wrap gap-3" onSubmit={e => { e.preventDefault(); setSearch(input.trim()); }}><input value={input} onChange={e => setInput(e.target.value)} maxLength={80} placeholder="Zoek een quest" aria-label="Zoek een quest" className="min-w-0 flex-1 rounded-xl border border-input bg-card px-4 py-3"/><select value={category} onChange={e => setCategory(e.target.value)} aria-label="Questcategorie" className="rounded-xl border border-input bg-card px-4 py-3"><option value="">Alle categorieën</option><option value="GETTING_STARTED">Aan de slag</option><option value="KNOWLEDGE">Kennis</option></select><button className="rounded-xl border border-names-accent/40 px-5 py-3 text-names-accent">Zoeken</button></form>
    {query.isPending ? <p className="text-muted-foreground">Quests laden…</p> : query.isError ? <div role="alert"><p>Quests laden is niet gelukt.</p><button onClick={() => query.refetch()} className="mt-3 text-names-accent">Opnieuw proberen</button></div> : <div className="grid gap-5 md:grid-cols-2">{query.data.quests.items.map(q => <GrowthQuestCard key={q.id} quest={q}/>)}{!query.data.quests.items.length && <p className="text-muted-foreground">Geen quests gevonden voor deze filters.</p>}</div>}
  </>;
}