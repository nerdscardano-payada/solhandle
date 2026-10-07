import { useRef, useState } from 'react';
import { Search, ArrowRight, Sparkles } from 'lucide-react';
import HandleSearch from '@/components/solhandle/HandleSearch';

export default function HeroSearch({ wallet }) {
  const pendingClaim = new URLSearchParams(window.location.search).get('claim') || '';
  const [input, setInput] = useState(pendingClaim);
  const [submitted, setSubmitted] = useState(pendingClaim);
  const field = useRef(null);
  const submit = event => { event.preventDefault(); if (input.trim()) setSubmitted(input.trim().replace(/^@+/, '').toLowerCase()); };
  return <div>
    <form onSubmit={submit} className="flex items-center gap-2 rounded-full border border-names-accent bg-card/80 pl-5 shadow-lg shadow-names-accent/15">
      <Search className="h-5 w-5 shrink-0 text-foreground"/>
      <input ref={field} value={input} onChange={event => setInput(event.target.value)} placeholder="@ansem" aria-label="Find your SolHandle" maxLength={21} required className="min-w-0 flex-1 bg-transparent py-4 text-base text-foreground outline-none placeholder:text-muted-foreground"/>
      <button type="submit" className="flex shrink-0 items-center gap-2 rounded-full bg-gradient-to-r from-names-accent to-names-secondary px-5 py-4 text-sm font-bold text-background">Search a Handle <ArrowRight className="h-4 w-4"/></button>
    </form>
    <button type="button" onClick={() => input.trim() ? setSubmitted(input.trim().replace(/^@+/, '').toLowerCase()) : field.current?.focus()} className="mt-4 inline-flex items-center gap-3 rounded-full border border-names-secondary/70 bg-names-secondary/5 px-6 py-2.5 text-sm font-semibold text-foreground"><Sparkles className="h-4 w-4"/>Mint Your @<ArrowRight className="h-4 w-4"/></button>
    {submitted && <div className="mt-5"><HandleSearch key={submitted} wallet={wallet} initialHandle={submitted}/></div>}
  </div>;
}