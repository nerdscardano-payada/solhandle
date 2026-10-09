import { ArrowUpRight, CheckCircle2, BookOpen, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGrowthHub } from '@/components/solhandle/quests/GrowthHubProvider';
export default function GrowthQuestCard({ quest }) {
  const { me, wallet } = useGrowthHub(), completed = me?.completed_keys.includes(`${wallet}:${quest.slug}:LIFETIME`);
  const Icon = quest.handler.startsWith('ON_CHAIN_') ? Zap : quest.handler === 'PROFILE' ? ShieldCheck : BookOpen;
  return <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 text-card-foreground">
    <div className="flex items-center justify-between gap-3"><Icon className="h-6 w-6 text-names-accent"/><span className="rounded-full bg-names-accent/10 px-3 py-1 text-sm font-semibold text-names-accent">+{quest.xp} XP</span></div>
    <p className="mt-5 text-xs uppercase tracking-wider text-muted-foreground">{quest.handler.startsWith('ON_CHAIN_') ? 'On-chain · finalized' : quest.handler === 'PROFILE' ? 'Aan de slag' : 'Kennis'} · 1× lifetime</p>
    <h2 className="mt-2 text-xl font-semibold">{quest.title}</h2><p className="my-3 flex-1 text-sm leading-7 text-muted-foreground">{quest.description}</p>
    <Link to={`/quests/quest/${quest.slug}`} className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4 text-sm font-semibold text-names-accent">{completed ? <><span>Voltooid</span><CheckCircle2 className="h-4 w-4"/></> : <><span>Bekijk quest</span><ArrowUpRight className="h-4 w-4"/></>}</Link>
  </article>;
}