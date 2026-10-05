import { ArrowRight, LoaderCircle, Search } from 'lucide-react';

import MintBackground from '@/components/solhandle/MintBackground';
import WidgetResult from '@/components/solhandle/widgets/WidgetResult';
import WidgetActivitySection from '@/components/solhandle/widgets/WidgetActivitySection';
import { widgetOrigin } from '@/components/solhandle/widgets/widgetOptions';
export default function SearchWidget({ lookup, inputId, referralCode, showClaimed = false, showMarket = false }) {
  return <div className="solhandle-search-widget relative w-full text-foreground">
    <section aria-label="SolHandle Search & Claim widget" className="relative overflow-hidden rounded-2xl border border-names-accent/60 bg-background p-5 shadow-xl shadow-names-accent/15">
      <MintBackground/>
      <div className="relative z-10">
        <header className="mb-5 flex flex-wrap items-center justify-between gap-2"><h2 className="text-xl font-semibold tracking-tight">Find your SolHandle</h2><a href={`${widgetOrigin}/directory`} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-names-accent">Browse Premium Directory →</a></header>
        <form onSubmit={event => { event.preventDefault(); lookup.lookup(); }}>
          <label htmlFor={inputId} className="sr-only">Your @name</label>
          <div className="flex min-w-0 items-center gap-2 rounded-xl border border-names-accent/50 bg-background px-3 py-3 focus-within:ring-1 focus-within:ring-names-accent">
            <Search size={18} className="shrink-0 text-muted-foreground"/><span className="text-muted-foreground">@</span>
            <input id={inputId} required value={lookup.input.replace(/^@+/, '')} onChange={event => lookup.change(event.target.value)} maxLength={20} placeholder="ansem" spellCheck={false} autoCapitalize="none" autoComplete="off" className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"/>
            <span className="shrink-0 text-xs text-muted-foreground">{lookup.input.replace(/^@+/, '').length}/20</span>
            <button type="submit" disabled={lookup.loading} aria-label="Check availability" className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-names-accent disabled:opacity-50">{lookup.loading ? <LoaderCircle size={18} className="animate-spin"/> : <ArrowRight size={18}/>}</button>
          </div>
          {!lookup.result && <button disabled={lookup.loading} className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-names-success via-names-accent to-names-secondary px-4 py-3 text-sm font-semibold text-background disabled:opacity-50">{lookup.loading ? <><LoaderCircle size={16} className="animate-spin"/>Checking on Solana…</> : 'Check availability'}</button>}
        </form>
        {lookup.error && <p role="alert" className="mt-4 text-sm text-names-warning">{lookup.error}</p>}
        {lookup.result && <WidgetResult type="search" result={lookup.result} referralCode={referralCode}/>}
        <p className="mt-5 text-center text-xs leading-5 text-muted-foreground">One-time payment. No renewals. Yours until you transfer it.</p>
        {showClaimed && <WidgetActivitySection/>}
        {showMarket && <WidgetActivitySection market/>}
        <a href={widgetOrigin} target="_blank" rel="noopener noreferrer" className="mt-4 block text-center text-xs text-muted-foreground">Powered by SolHandle ↗</a>
      </div>
    </section>
  </div>;
}