import { useState } from 'react';
import { widgetOrigin } from '@/components/solhandle/widgets/widgetOptions';
export default function WidgetResult({ type, result }) {
  const [feedback, setFeedback] = useState('');
  async function copy() {
    try { await navigator.clipboard.writeText(result.address); setFeedback('Address copied'); }
    catch { setFeedback('Select the address above to copy it manually.'); }
  }
  if (type === 'search') {
    const available = result.available && result.status === 'AVAILABLE';
    const labels = { AVAILABLE: 'Available to claim', CLAIMED: 'Already claimed', RESERVED: 'Reserved for an official claim', PROTECTED: 'Protected brand name' };
    return <div className="mt-4 rounded-xl border border-border bg-background p-4"><p className="text-xl font-semibold">@{result.handle}</p><p className="mt-1 text-sm text-names-accent">{labels[result.status]}</p>{available && Number.isFinite(result.priceLamports) && <p className="mt-2 text-sm text-muted-foreground">{result.priceLamports / 1e9} SOL · current mint price, network costs extra</p>}<a href={`${widgetOrigin}${result.status === 'CLAIMED' ? `/${result.handle}` : `/search?claim=${encodeURIComponent(result.handle)}`}`} target="_blank" rel="noopener noreferrer" className="mt-4 block rounded-lg bg-names-accent px-4 py-3 text-center text-sm font-semibold text-background">{available ? 'Continue to claim on SolHandle ↗' : result.status === 'CLAIMED' ? 'View SolHandle ↗' : 'See options on SolHandle ↗'}</a><p className="mt-2 text-xs text-muted-foreground">Opens a new tab. Availability is checked again before claiming.</p></div>;
  }
  return <div className="mt-4 rounded-xl border border-border bg-background p-4"><p className="text-xl font-semibold text-names-accent">{type === 'identity' ? result.primaryHandle || 'No preferred @name set' : `@${result.handle}`}</p><p className="mt-2 select-all break-all font-mono text-xs leading-6">{result.address}</p><p className="mt-2 text-xs text-muted-foreground">{result.noName ? 'The original wallet stays visible.' : 'Ownership checked on Solana mainnet. Not a sign-in or safety endorsement.'}</p><div className="mt-3 flex flex-wrap gap-3"><button type="button" onClick={copy} className="text-sm font-semibold text-names-accent">Copy wallet address</button>{!result.noName && <a href={`${widgetOrigin}/${(result.primaryHandle || result.handle).replace(/^@/, '')}`} target="_blank" rel="noopener noreferrer" className="text-sm text-names-secondary">View profile ↗</a>}</div><p role="status" className="mt-2 text-xs text-muted-foreground">{feedback}</p></div>;
}