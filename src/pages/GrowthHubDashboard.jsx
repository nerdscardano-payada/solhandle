import { useState } from 'react';
import GrowthHubGate from '@/components/solhandle/quests/GrowthHubGate';
import GrowthXPOverview from '@/components/solhandle/quests/GrowthXPOverview';
import GrowthXPHistory from '@/components/solhandle/quests/GrowthXPHistory';
import GrowthQuestCard from '@/components/solhandle/quests/GrowthQuestCard';
import { useGrowthHub } from '@/components/solhandle/quests/GrowthHubProvider';
import { growthError } from '@/components/solhandle/quests/growthHubClient';
export default function GrowthHubDashboard() {
  const { me, wallet, catalog, busy, refresh, act, setError } = useGrowthHub(), [saving, setSaving] = useState(false);
  const visibility = async event => { setSaving(true); setError(''); try { await act({ action: 'visibility', visible: event.target.checked }); } catch (e) { setError(growthError(e)); } finally { setSaving(false); } };
  return <><div className="mb-6 flex flex-wrap items-center justify-between gap-4"><div><h1>Jouw Growth Hub</h1><p className="mt-3 text-muted-foreground">Je identiteit, kennis en bijdragen. Geen tweede walletsysteem.</p></div>{me && <button onClick={refresh} disabled={busy} className="text-sm text-names-accent">{busy ? 'Vernieuwen…' : 'Voortgang vernieuwen'}</button>}</div>
    <GrowthHubGate>{me && <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border p-4"><p className="break-all font-mono text-xs text-muted-foreground">{wallet}</p><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={me.profile.show_on_leaderboard} disabled={saving} onChange={visibility}/>Toon mijn wallet op de ranglijst</label></div>
      <GrowthXPOverview/>
      <p className="mt-5 rounded-xl border border-names-secondary/30 bg-names-secondary/5 p-4 text-sm leading-7 text-muted-foreground">{me.season ? `${me.season.name}: ${me.season_xp} season XP.` : 'Er is nog geen actief seizoen. Lifetime XP blijft bewaard.'} Pilot-XP levert nog geen tokenallocatie op; tokenclaims en uitbetalingen zijn uitgeschakeld.</p>
      <h2 className="mt-8 text-xl font-semibold">Jouw quests</h2><div className="mt-4 grid gap-5 md:grid-cols-2">{catalog.data?.quests.items.map(q => <GrowthQuestCard key={q.id} quest={q}/>)}</div><GrowthXPHistory/>
    </>}</GrowthHubGate>
  </>;
}