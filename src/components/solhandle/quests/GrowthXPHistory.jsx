import { useState } from 'react';
import { useGrowthHub } from '@/components/solhandle/quests/GrowthHubProvider';
export default function GrowthXPHistory() {
  const { me } = useGrowthHub(), [expanded, setExpanded] = useState(false);
  const rows = me?.history.items || [];
  return <section className="mt-8"><h2 className="text-xl font-semibold">XP-activiteit</h2><p className="mt-2 text-sm text-muted-foreground">De 50 recentste server-gecontroleerde boekingen. XP-totalen tellen elke completion slechts eenmaal; herhaalde verwerkingsboekingen tellen niet extra mee.</p>
    <ul className="mt-4 divide-y divide-border rounded-2xl border border-border bg-card px-5">{(expanded ? rows : rows.slice(0, 5)).map(row => <li key={row.id} className="flex flex-wrap items-center justify-between gap-3 py-4"><div><p className="text-sm font-semibold">{row.quest_title}</p><p className="mt-1 text-xs text-muted-foreground">Versie {row.quest_version} · {new Date(row.credited_at).toLocaleString('nl-NL')} · pilot</p>{row.chain_evidence?.signature && <a href={`https://explorer.solana.com/tx/${encodeURIComponent(row.chain_evidence.signature)}`} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-xs text-names-accent">Finalized Mainnet-bewijs bekijken →</a>}</div><span className="text-sm font-semibold text-names-accent">+{row.delta} XP</span></li>)}{!rows.length && <li className="py-5 text-sm text-muted-foreground">Nog geen XP verdiend. Voltooi je eerste quest.</li>}</ul>
    {rows.length > 5 && <button className="mt-3 text-sm text-names-accent" onClick={() => setExpanded(!expanded)}>{expanded ? 'Minder tonen' : 'Meer tonen'}</button>}
  </section>;
}