import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import Header from '@/components/solhandle/Header';
import WeekendProofTable from '@/components/solhandle/weekend/WeekendProofTable';
import WeekendClosureNotice from '@/components/solhandle/weekend/WeekendClosureNotice';
export default function MintWeekend() {
  const query = useQuery({ queryKey: ['mint-weekend'], queryFn: async () => (await base44.functions.invoke('weekendMintRead', {})).data, refetchInterval: 60000, retry: false });
  const data = query.data;
  return <main className="dark min-h-screen bg-background text-foreground">
    <div className="mx-auto max-w-7xl border-x border-border">
      <Header/>
      <div className="mx-auto max-w-6xl space-y-5 px-4 py-6 lg:space-y-7 lg:px-9 lg:py-10">
        <Link to="/" className="text-sm text-names-accent">← Back to home</Link>
        <section>
          <p className="text-sm font-semibold uppercase tracking-widest text-names-secondary">SolHandle Mint Weekend · Closed</p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight lg:text-5xl">Mint Weekend proof archive</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">3–6 October 2026 · Final verified winners, mint transactions and reward payments.</p>
        </section>
        {query.isLoading ? <p role="status">Loading verified proofs…</p> : query.isError ? <div role="alert"><p>Unable to load campaign proofs. No unverified results are shown.</p><button onClick={() => query.refetch()} className="mt-2 text-names-accent">Try again</button></div> : data && <>
          {data.scan?.final && data.winners.length > 0 && data.winners.every(w => data.settlements.some(s => s.key === `reward:${w.wallet}` && s.signature)) && <WeekendClosureNotice/>}
          <WeekendProofTable data={data}/>
        </>}
      </div>
    </div>
  </main>;
}