import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import GrowthHubGate from '@/components/solhandle/quests/GrowthHubGate';
import GrowthQuiz from '@/components/solhandle/quests/GrowthQuiz';
import { useGrowthHub } from '@/components/solhandle/quests/GrowthHubProvider';
import { growthError } from '@/components/solhandle/quests/growthHubClient';
export default function GrowthHubQuest() {
  const { slug } = useParams(), { catalog, me, wallet, act, verified } = useGrowthHub();
  const quest = catalog.data?.quests.items.find(q => q.slug === slug);
  const [started, setStarted] = useState(null), [busy, setBusy] = useState(false), [message, setMessage] = useState(''), [error, setError] = useState('');
  useEffect(() => { setStarted(null); setMessage(''); setError(''); }, [slug, wallet, verified]);
  const completed = me?.completed_keys.includes(`${wallet}:${slug}:LIFETIME`);
  const run = async (action, answers) => {
    setBusy(true); setError(''); setMessage('');
    try {
      const result = await act({ action, slug, version: started?.version || quest.version, answers });
      if (action === 'start') setStarted(result);
      else setMessage(result.completed ? (result.already_completed ? 'Deze quest is al beloond. Er is geen extra XP toegekend.' : `Quest voltooid! +${result.xp} pilot-XP.`) : `${result.score}/${result.total} correct. ${result.message}`);
    } catch (e) { setError(growthError(e)); } finally { setBusy(false); }
  };
  if (catalog.isPending) return <p>Quest laden…</p>;
  if (catalog.isError) return <div role="alert"><p>Quest laden is niet gelukt.</p><button onClick={() => catalog.refetch()} className="mt-3 text-names-accent">Opnieuw proberen</button></div>;
  if (!quest) return <><h1>Quest niet beschikbaar</h1><p className="mt-4 text-muted-foreground">Deze quest is niet gepubliceerd of is gepauzeerd.</p><Link to="/quests/explore" className="mt-5 inline-block text-names-accent">Terug naar quests →</Link></>;
  return <><Link to="/quests/explore" className="text-sm text-names-accent">← Alle quests</Link><h1 className="mt-5">{quest.title}</h1><p className="mt-5 max-w-3xl text-muted-foreground leading-8">{quest.description}</p>
    <div className="my-6 flex flex-wrap gap-3 text-sm"><span className="rounded-full bg-names-accent/10 px-3 py-1 text-names-accent">+{quest.xp} XP</span><span className="rounded-full border border-border px-3 py-1">1× lifetime</span><span className="rounded-full border border-border px-3 py-1">Versie {quest.version}</span><span className="rounded-full border border-border px-3 py-1">{completed ? 'COMPLETED' : started ? 'IN_PROGRESS' : 'AVAILABLE'}</span></div>
    <p className="mb-6 text-sm leading-7 text-muted-foreground">Voorwaarden: geverifieerde wallet, actief profiel en succesvolle servercontrole. {quest.handler === 'KNOWLEDGE_QUIZ' ? 'Alle vijf antwoorden moeten correct zijn; minimaal 30 seconden tussen inzendingen.' : 'Een alleen verbonden wallet is onvoldoende; je walletsignature en geregistreerde profiel worden gecontroleerd.'} {quest.starts_at ? `Start: ${new Date(quest.starts_at).toLocaleString('nl-NL')}.` : 'Start: vanaf publicatie.'} {quest.ends_at ? `Einde: ${new Date(quest.ends_at).toLocaleString('nl-NL')}.` : 'Geen ingestelde einddatum.'} Geen retroactieve product-XP.</p>
    <GrowthHubGate>{completed ? <div className="rounded-xl border border-names-success/40 p-5"><p className="font-semibold text-names-success">Quest voltooid</p><Link to="/quests/dashboard" className="mt-3 inline-block text-sm text-names-accent">Bekijk je XP →</Link></div> : started?.questions.length ? <GrowthQuiz questions={started.questions} onSubmit={answers => run('verify', answers)} busy={busy}/> : <Button disabled={busy} onClick={() => run(quest.handler === 'PROFILE' ? 'verify' : 'start')}>{busy ? 'Controleren…' : quest.handler === 'PROFILE' ? 'Verifieer profiel & ontvang XP' : 'Start de quiz'}</Button>}</GrowthHubGate>
    {message && <p role="status" className="mt-5 rounded-xl border border-border p-4 text-names-accent">{message}</p>}{error && <p role="alert" className="mt-5 rounded-xl border border-destructive/40 p-4">{error}</p>}
  </>;
}