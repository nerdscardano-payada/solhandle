import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/lib/AuthContext';
import Header from '@/components/solhandle/Header';
import growthHubClient, { growthError } from '@/components/solhandle/quests/growthHubClient';
import GrowthAdminQuestEditor from '@/components/solhandle/quests/GrowthAdminQuestEditor';
import GrowthAdminSeasonEditor from '@/components/solhandle/quests/GrowthAdminSeasonEditor';
import GrowthAdminAudit from '@/components/solhandle/quests/GrowthAdminAudit';
import GrowthAdminReviews from '@/components/solhandle/quests/GrowthAdminReviews';
import GrowthAdminProfileHold from '@/components/solhandle/quests/GrowthAdminProfileHold';
export default function AdminGrowthHub() {
  const { user } = useAuth(), client = useQueryClient(), [busy, setBusy] = useState(false), [error, setError] = useState('');
  const query = useQuery({ queryKey: ['admin-growth-hub'], queryFn: () => growthHubClient({ scope: 'admin', action: 'overview' }), enabled: user?.role === 'admin' });
  const onAction = async payload => {
    setBusy(true); setError('');
    try { await growthHubClient({ scope: 'admin', ...payload }); await Promise.all([client.invalidateQueries({ queryKey: ['admin-growth-hub'] }), client.invalidateQueries({ queryKey: ['growth-hub-catalog'] }), client.invalidateQueries({ queryKey: ['growth-hub-explore'] }), client.invalidateQueries({ queryKey: ['growth-hub-leaderboard'] }), client.invalidateQueries({ queryKey: ['growth-hub-reviews'] })]); return true; }
    catch (e) { setError(growthError(e)); return false; } finally { setBusy(false); }
  };
  return <main className="dark min-h-screen bg-background font-body text-foreground"><div className="mx-auto max-w-7xl"><Header/><section className="px-5 py-8 lg:px-9 lg:py-12"><Link to="/admin" className="text-sm text-names-accent">← Protocolbeheer</Link><h1 className="mt-5">Growth Hub-beheer</h1>
    {user?.role !== 'admin' ? <p className="mt-5">Alleen beheerders hebben toegang.</p> : <><p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">Pilot: profiel-, quiz- en on-chain quests, XP-seizoenen en publicatiebeheer. Financiële allocaties en uitbetalingen zijn server-side uitgeschakeld.</p>{error && <p role="alert" className="mt-5 rounded-xl border border-destructive/40 p-4">{error}</p>}
      {query.isPending ? <p className="mt-6">Beheer laden…</p> : query.isError ? <div role="alert" className="mt-6"><p>{growthError(query.error)}</p><button onClick={() => query.refetch()} className="mt-3 text-names-accent">Opnieuw proberen</button></div> : <>
        <div className="my-7 grid gap-4 md:grid-cols-3">{[['Actieve deelnemers', query.data.participants], ['Unieke questcredits', query.data.completions], ['Tokenuitbetalingen', 'Uitgeschakeld']].map(([label, value]) => <div key={label} className="rounded-2xl border border-border bg-card p-5"><p className="text-sm text-muted-foreground">{label}</p><p className="mt-3 text-2xl font-semibold text-names-accent">{value}</p></div>)}</div>
        <h2 className="mb-4 text-xl font-semibold">Questbeheer</h2><div className="grid gap-5 min-[1100px]:grid-cols-2">{query.data.quests.map(q => <GrowthAdminQuestEditor key={`${q.id}:${q.version}:${q.status}`} quest={q} busy={busy} onAction={onAction}/>)}</div><h2 className="mb-4 mt-8 text-xl font-semibold">Seizoensbeheer</h2><div className="space-y-5">{query.data.seasons.map(s => <GrowthAdminSeasonEditor key={`${s.id}:${s.updated_date}`} season={s} busy={busy} onAction={onAction}/>)}</div><GrowthAdminReviews busy={busy} onAction={onAction}/><GrowthAdminProfileHold busy={busy} onAction={onAction}/><GrowthAdminAudit items={query.data.audits}/>
      </>}
    </>}
  </section></div></main>;
}