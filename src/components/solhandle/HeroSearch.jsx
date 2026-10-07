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
    <form onSubmit={submit} className="hero-search-shell flex items-center gap-3 rounded-full pl-5">
      <Search className="h-5 w-5 shrink-0 text-foreground"/>
      <input ref={field} value={input} onChange={event => setInput(event.target.value)} placeholder="@ansem" aria-label="Find your SolHandle" maxLength={21} required className="min-w-0 flex-1 bg-transparent py-5 text-xl text-foreground outline-none placeholder:text-muted-foreground"/>
      <button type="submit" className="hero-search-button flex shrink-0 items-center gap-3 rounded-full px-7 py-5 text-base font-bold text-background">Search a Handle <ArrowRight className="h-4 w-4"/></button>
    </form>
    <button type="button" onClick={() => input.trim() ? setSubmitted(input.trim().replace(/^@+/, '').toLowerCase()) : field.current?.focus()} className="hero-mint-button mt-5 inline-flex items-center gap-3 rounded-full px-7 py-3 text-base font-semibold text-foreground"><Sparkles className="h-4 w-4"/>Mint Your @<ArrowRight className="h-4 w-4"/></button>
    {submitted && <div className="mt-5"><HandleSearch key={submitted} wallet={wallet} initialHandle={submitted}/></div>}
  </div>;
}