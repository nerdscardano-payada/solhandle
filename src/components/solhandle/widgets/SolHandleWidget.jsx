import { useId } from 'react';
import { LoaderCircle } from 'lucide-react';
import { widgetOptions, widgetOrigin } from '@/components/solhandle/widgets/widgetOptions';
import useWidgetLookup from '@/components/solhandle/widgets/useWidgetLookup';
import WidgetResult from '@/components/solhandle/widgets/WidgetResult';
import SearchWidget from '@/components/solhandle/widgets/SearchWidget';
export default function SolHandleWidget({ type = 'search', wallet = '', referralCode = '' }) {
  const option = widgetOptions.find(item => item.id === type) || widgetOptions[0];
  const lookup = useWidgetLookup(option.id, wallet);
  const inputId = useId();
  if (option.id === 'search') return <SearchWidget lookup={lookup} inputId={inputId} referralCode={referralCode}/>;
  return <section aria-label={`${option.title} widget`} className="w-full rounded-2xl border border-names-accent/30 bg-card p-5 text-card-foreground">
    <p className="text-xs font-semibold uppercase tracking-widest text-names-secondary">SolHandle · {option.title}</p>
    <h2 className="mt-3 text-2xl font-semibold tracking-tight">{option.heading}</h2>
    <p className="mt-2 text-sm leading-6 text-muted-foreground">{option.prompt}</p>
    {!(option.id === 'identity' && wallet) && <form onSubmit={event => { event.preventDefault(); lookup.lookup(); }} className="mt-5">
      <label htmlFor={inputId} className="block text-xs font-semibold text-muted-foreground">{option.id === 'identity' ? 'Solana wallet address' : 'Your @name'}</label>
      <input id={inputId} required value={lookup.input} onChange={event => lookup.change(event.target.value)} maxLength={option.id === 'identity' ? 44 : 21} placeholder={option.id === 'identity' ? 'Paste a wallet address' : '@ansem'} spellCheck={false} autoCapitalize="none" autoComplete="off" className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-3 text-sm focus:border-names-accent focus:outline-none"/>
      <button disabled={lookup.loading} className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-names-accent px-4 py-3 text-sm font-semibold text-background disabled:opacity-50">{lookup.loading ? <><LoaderCircle size={16} className="animate-spin"/>Checking…</> : option.button}</button>
    </form>}
    {option.id === 'identity' && wallet && <button type="button" onClick={() => lookup.lookup(wallet)} disabled={lookup.loading} className="mt-4 text-sm text-names-accent disabled:opacity-50">{lookup.loading ? 'Checking on Solana…' : 'Refresh identity'}</button>}
    {lookup.error && <p role="alert" className="mt-3 text-sm text-names-warning">{lookup.error}</p>}
    {lookup.result && <WidgetResult key={JSON.stringify(lookup.result)} type={option.id} result={lookup.result} referralCode={referralCode}/>}
    {option.id === 'lookup' && <p className="mt-4 text-xs leading-5 text-muted-foreground">Lookup only. No payment is sent. Resolve again before any use of the address.</p>}
    <a href={widgetOrigin} target="_blank" rel="noopener noreferrer" className="mt-5 block border-t border-border pt-3 text-xs text-muted-foreground">Powered by SolHandle ↗</a>
  </section>;
}