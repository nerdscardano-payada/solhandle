import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import GrowthHubGate from '@/components/solhandle/quests/GrowthHubGate';
import GrowthQuiz from '@/components/solhandle/quests/GrowthQuiz';
import GrowthChainQuest from '@/components/solhandle/quests/GrowthChainQuest';
import GrowthQuestConditions from '@/components/solhandle/quests/GrowthQuestConditions';
import GrowthReferralQuest from '@/components/solhandle/quests/GrowthReferralQuest';
import GrowthReviewStatus from '@/components/solhandle/quests/GrowthReviewStatus';
import { useGrowthHub } from '@/components/solhandle/quests/GrowthHubProvider';
import { growthError } from '@/components/solhandle/quests/growthHubClient';
export default function GrowthHubQuest() {
  const { slug } = useParams(), { catalog, me, wallet, act, verified } = useGrowthHub();
  const quest = catalog.data?.quests.items.find(q => q.slug === slug);
  const [started, setStarted] = useState(null), [busy, setBusy] = useState(false), [message, setMessage] = useState(''), [error, setError] = useState(''), [pending, setPending] = useState(false);
  useEffect(() => { setStarted(null); setMessage(''); setError(''); setPending(false); }, [slug, wallet, verified]);
  const completed = me?.completed_keys.includes(`${wallet}:${slug}:LIFETIME`);
  const review = me?.reviews?.items.find(row => row.quest_slug === slug);
  const run = async (action, answers, transaction_signature) => {
    setBusy(true); setError(''); setMessage(''); setPending(false);
    try {
      const result = await act({ action, slug, version: started?.version || quest.version, answers, transaction_signature });
      if (result.pending) { setPending(true); setMessage(result.message); }
      else if (action === 'start') setStarted(result);
      else setMessage(result.completed ? (result.already_completed ? 'Deze quest is al beloond. Er is geen extra XP toegekend.' : `Quest voltooid! +${result.xp} pilot-XP.`) : result.score !== undefined ? `${result.score}/${result.total} correct. ${result.message}` : result.message);
    } catch (e) { setError(growthError(e)); } finally { setBusy(false); }
  };
  if (catalog.isPending) return <p>Quest laden…</p>;
  if (catalog.isError) return <div role="alert"><p>Quest laden is niet gelukt.</p><button onClick={() => catalog.refetch()} className="mt-3 text-names-accent">Opnieuw proberen</button></div>;
  if (!quest) return <><h1>Quest niet beschikbaar</h1><p className="mt-4 text-muted-foreground">Deze quest is niet gepubliceerd of is gepauzeerd.</p><Link to="/quests/explore" className="mt-5 inline-block text-names-accent">Terug naar quests →</Link></>;
  return <><Link to="/quests/explore" className="text-sm text-names-accent">← Alle quests</Link><h1 className="mt-5">{quest.title}</h1><p className="mt-5 max-w-3xl text-muted-foreground leading-8">{quest.description}</p>
    <div className="my-6 flex flex-wrap gap-3 text-sm"><span className="rounded-full bg-names-accent/10 px-3 py-1 text-names-accent">+{quest.xp} XP</span><span className="rounded-full border border-border px-3 py-1">1× lifetime</span><span className="rounded-full border border-border px-3 py-1">Versie {quest.version}</span><span className="rounded-full border border-border px-3 py-1">{completed ? 'COMPLETED' : review?.status || (pending ? 'PENDING' : busy || started ? 'IN_PROGRESS' : 'AVAILABLE')}</span></div>
    <GrowthQuestConditions quest={quest}/>
    <GrowthHubGate>{completed ? <div className="rounded-xl border border-names-success/40 p-5"><p className="font-semibold text-names-success">Quest voltooid</p><Link to="/quests/dashboard" className="mt-3 inline-block text-sm text-names-accent">Bekijk je XP →</Link></div> : review ? <GrowthReviewStatus review={review}/> : quest.handler === 'REFERRAL_MINT' ? <GrowthReferralQuest key={`${slug}:${wallet}`} busy={busy} onVerify={signature => run('verify', undefined, signature)}/> : quest.handler.startsWith('ON_CHAIN_') ? <GrowthChainQuest key={`${slug}:${wallet}`} quest={quest} onVerify={signature => run('verify', undefined, signature)} busy={busy} pending={pending}/> : started?.questions.length ? <GrowthQuiz questions={started.questions} onSubmit={answers => run('verify', answers)} busy={busy}/> : <Button disabled={busy} onClick={() => run(quest.handler === 'PROFILE' ? 'verify' : 'start')}>{busy ? 'Controleren…' : quest.handler === 'PROFILE' ? 'Verifieer profiel & ontvang XP' : 'Start de quiz'}</Button>}</GrowthHubGate>
    {message && <p role="status" className="mt-5 rounded-xl border border-border p-4 text-names-accent">{message}</p>}{error && <p role="alert" className="mt-5 rounded-xl border border-destructive/40 p-4">{error}</p>}
  </>;
}