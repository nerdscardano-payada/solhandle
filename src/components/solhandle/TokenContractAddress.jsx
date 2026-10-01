import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export default function TokenContractAddress({ tokenMint }) {
  const [copied, setCopied] = useState(false);
  if (!tokenMint) return null;
  const copy = async () => {
    await navigator.clipboard.writeText(tokenMint);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };
  return <button type="button" onClick={copy} aria-label="Copy $HANDLE contract address" className="mb-4 flex w-full items-center gap-3 rounded-xl border border-names-accent/25 bg-names-accent/5 px-3 py-3 text-left sm:hidden">
    <span className="shrink-0 text-xs font-semibold text-names-accent">CA</span>
    <span className="min-w-0 flex-1 break-all font-mono text-xs text-names-accent">{tokenMint}</span>
    {copied ? <Check className="h-4 w-4 shrink-0 text-names-success" /> : <Copy className="h-4 w-4 shrink-0 text-names-accent" />}
    <span className="sr-only" aria-live="polite">{copied ? 'Copied' : ''}</span>
  </button>;
}