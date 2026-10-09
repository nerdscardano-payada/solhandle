import { useGrowthHub } from '@/components/solhandle/quests/GrowthHubProvider';
export default function GrowthXPOverview() {
  const { me } = useGrowthHub();
  if (!me) return null;
  const { level, lifetime_xp } = me, maximum = level.next?.xp || lifetime_xp, progress = level.next ? Math.min(100, (lifetime_xp - level.xp) / (maximum - level.xp) * 100) : 100;
  return <>
    <div className="grid gap-4 md:grid-cols-3">{[['Lifetime XP', lifetime_xp], ['Season XP', me.season_xp], ['Reward-eligible XP', me.reward_eligible_xp]].map(([label, value]) => <article key={label} className="rounded-2xl border border-border bg-card p-5"><p className="text-sm text-muted-foreground">{label}</p><p className="mt-3 text-3xl font-semibold text-names-accent">{value.toLocaleString('nl-NL')}</p></article>)}</div>
    <article className="mt-5 rounded-2xl border border-border bg-card p-6"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-semibold">Level {level.number} · {level.title}</h2><p className="text-sm text-muted-foreground">{level.next ? `${maximum - lifetime_xp} XP tot ${level.next.title}` : 'Hoogste level bereikt'}</p></div><div role="progressbar" aria-label="Levelvoortgang" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)} className="mt-5 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-names-accent" style={{ width: `${progress}%` }}/></div></article>
  </>;
}