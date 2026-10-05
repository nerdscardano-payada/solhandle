import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function ResolveCodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true); setError('');
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Copy unavailable. Select the snippet and copy it manually.');
    }
  }
  return <div className="mt-4 min-w-0 max-w-full overflow-hidden rounded-xl border border-border bg-background">
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-3 py-3 lg:px-4"><span className="text-xs text-muted-foreground">{language}</span><button type="button" onClick={copy} className="inline-flex min-h-11 shrink-0 items-center gap-2 text-sm text-names-accent lg:min-h-0">{copied ? <Check size={16}/> : <Copy size={16}/>} {copied ? 'Copied' : 'Copy snippet'}</button></div>
    <pre className="max-w-full overflow-x-auto overscroll-x-contain p-3 text-xs leading-6 lg:p-4 lg:text-sm"><code>{code}</code></pre>
    {error && <p role="alert" className="px-4 pb-3 text-sm text-names-warning">{error}</p>}
  </div>;
}