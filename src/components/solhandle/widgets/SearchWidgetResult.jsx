import { Check, ShieldAlert, Wallet } from 'lucide-react';
import { widgetOrigin } from '@/components/solhandle/widgets/widgetOptions';
export default function SearchWidgetResult({ result, referralCode = '' }) {
  const available = result.available && result.status === 'AVAILABLE';
  const labels = { AVAILABLE: 'is available!', CLAIMED: 'is already claimed', RESERVED: 'is reserved for an official claim', PROTECTED: 'is a protected brand name' };
  const params = new URLSearchParams({ claim: result.handle });
  if (/^[a-z0-9-]{1,40}$/.test(referralCode)) params.set('ref', referralCode);
  const url = `${widgetOrigin}${result.status === 'CLAIMED' ? `/${result.handle}` : `/search?${params}`}`;
  const price = Number.isFinite(result.priceLamports) ? (result.priceLamports / 1e9).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 9 }) : '';
  const rarity = ['Legendary', 'Ultra Rare', 'Rare', 'Uncommon'][result.handle.length - 1] || 'Standard';
  return <div className="mt-4" aria-live="polite">
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card/80 p-4">
      <div className="flex min-w-0 items-start gap-3"><span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${available ? 'bg-names-success/15 text-names-success' : 'bg-names-secondary/15 text-names-secondary'}`}>{available ? <Check size={24}/> : <ShieldAlert size={22}/>}</span>
        <div className="min-w-0"><p className="break-all text-xl font-bold">@{result.handle}</p><p className={`mt-1 text-sm ${available ? 'text-names-success' : 'text-names-secondary'}`}>{labels[result.status]}</p><div className="mt-3 flex flex-wrap gap-2"><span className="rounded-full border border-names-accent/30 bg-names-accent/10 px-2.5 py-1 text-xs font-semibold text-names-accent">✦ {rarity}</span>{result.nameClass === 'Premium' && <span className="rounded-full border border-names-secondary/40 bg-names-secondary/10 px-2.5 py-1 text-xs font-semibold text-names-secondary">◆ PREMIUM</span>}</div></div>
      </div>
      {available && price && <div className="shrink-0 text-right"><span className="text-xs text-muted-foreground">Price</span><p className="mt-1 text-lg font-bold">{price} SOL</p></div>}
    </div>
    {(result.categories?.length > 0 || result.handleScore > 0) && <div className="mt-4 flex flex-wrap items-center gap-2">{result.categories?.length > 0 && <><span className="text-xs text-muted-foreground">Categories</span>{result.categories.map(category => <span key={category} className="rounded-full border border-border px-2.5 py-1 text-xs capitalize">{category}</span>)}</>}{result.handleScore > 0 && <span className="ml-auto text-xs font-medium text-names-accent">Handle Score {result.handleScore}/100</span>}</div>}
    {result.handleScore > 0 && <p className="mt-2 text-xs leading-5 text-muted-foreground">Handle Score reflects memorability and relevance, not financial value.</p>}
    <a href={url} target="_blank" rel="noopener noreferrer" className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-names-success via-names-accent to-names-secondary px-3 py-3.5 text-center text-sm font-semibold text-background">{available && <Wallet size={18} className="shrink-0"/>}{available ? `Claim @${result.handle}${price ? ` · ${price} SOL` : ''} ↗` : result.status === 'CLAIMED' ? `View @${result.handle} ↗` : 'See options on SolHandle ↗'}</a>
    <p className="mt-3 text-center text-xs leading-5 text-muted-foreground">Continue in a new tab. Availability is checked again before claiming.{available && ' Network costs extra.'}</p>
  </div>;
}