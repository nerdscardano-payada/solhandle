import { ArrowDown, ArrowRight, Wallet } from 'lucide-react';
import IntroIdentityCard from '@/components/solhandle/intro/IntroIdentityCard';

const address = '7YttLkHDoNj9wyDur5QKQ8LqhxRk6RhhVxb4jWQZ8uNw';
export default function IntroJourney() {
  return <section aria-label="Van walletadres naar SolHandle" className="mx-auto mt-8 max-w-4xl min-[768px]:mt-10">
    <div className="grid items-center gap-4 min-[768px]:grid-cols-[1fr_80px_1fr] min-[768px]:gap-5">
      <div className="intro-address rounded-3xl border border-border bg-card/60 p-6 text-left min-[768px]:p-8">
        <div className="flex items-center justify-between"><Wallet className="h-6 w-6 text-muted-foreground"/><span className="text-[10px] uppercase tracking-widest text-muted-foreground">44 tekens</span></div>
        <p className="mt-6 text-xs uppercase tracking-[0.2em] text-muted-foreground">Je Solana-walletadres</p>
        <div aria-hidden="true" className="mt-4 grid grid-cols-11 gap-y-2 font-mono text-lg text-muted-foreground min-[768px]:text-xl">{address.split('').map((char, i) => <span key={i} className="intro-character" style={{ animationDelay: `${i * 35}ms` }}>{char}</span>)}</div>
        <span className="sr-only">{address}</span>
        <p className="mt-6 text-sm text-muted-foreground">Moeilijk te onthouden.<br/>Makkelijk verkeerd over te nemen.</p>
      </div>
      <div aria-hidden="true" className="intro-connector flex flex-col items-center gap-2 text-names-accent"><span className="text-[10px] font-semibold uppercase tracking-widest">SolHandle</span><ArrowRight className="hidden h-8 w-8 min-[768px]:block"/><ArrowDown className="h-7 w-7 min-[768px]:hidden"/></div>
      <IntroIdentityCard/>
    </div>
    <p className="mt-4 text-center text-[11px] leading-5 text-muted-foreground">Illustratief voorbeeld: dit adres is niet het echte walletadres achter @ansem.</p>
  </section>;
}