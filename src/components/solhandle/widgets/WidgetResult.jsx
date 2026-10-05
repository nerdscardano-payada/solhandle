import { useState } from 'react';
import { widgetOrigin } from '@/components/solhandle/widgets/widgetOptions';
import SearchWidgetResult from '@/components/solhandle/widgets/SearchWidgetResult';
export default function WidgetResult({ type, result, referralCode = '' }) {
  const [feedback, setFeedback] = useState('');
  async function copy() {
    try { await navigator.clipboard.writeText(result.address); setFeedback('Address copied'); }
    catch { setFeedback('Select the address above to copy it manually.'); }
  }
  if (type === 'search') return <SearchWidgetResult result={result} referralCode={referralCode}/>;
  return <div className="mt-4 rounded-xl border border-border bg-background p-4"><p className="text-xl font-semibold text-names-accent">{type === 'identity' ? result.primaryHandle || 'No preferred @name set' : `@${result.handle}`}</p><p className="mt-2 select-all break-all font-mono text-xs leading-6">{result.address}</p><p className="mt-2 text-xs text-muted-foreground">{result.noName ? 'The original wallet stays visible.' : 'Ownership checked on Solana mainnet. Not a sign-in or safety endorsement.'}</p><div className="mt-3 flex flex-wrap gap-3"><button type="button" onClick={copy} className="text-sm font-semibold text-names-accent">Copy wallet address</button>{!result.noName && <a href={`${widgetOrigin}/${(result.primaryHandle || result.handle).replace(/^@/, '')}`} target="_blank" rel="noopener noreferrer" className="text-sm text-names-secondary">View profile ↗</a>}</div><p role="status" className="mt-2 text-xs text-muted-foreground">{feedback}</p></div>;
}