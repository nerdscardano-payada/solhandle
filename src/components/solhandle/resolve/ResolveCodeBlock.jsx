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
  return <div className="mt-4 overflow-hidden rounded-xl border border-border bg-background">
    <div className="flex items-center justify-between border-b border-border px-4 py-3"><span className="text-xs text-muted-foreground">{language}</span><button type="button" onClick={copy} className="inline-flex items-center gap-2 text-sm text-names-accent">{copied ? <Check size={16}/> : <Copy size={16}/>} {copied ? 'Copied' : 'Copy snippet'}</button></div>
    <pre className="overflow-x-auto p-4 text-xs leading-6 lg:text-sm"><code>{code}</code></pre>
    {error && <p role="alert" className="px-4 pb-3 text-sm text-names-warning">{error}</p>}
  </div>;
}