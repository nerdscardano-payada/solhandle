import { useState } from 'react';
import { Share2 } from 'lucide-react';
export default function NetworkShare({ path, title, compact = false }) {
  const [status, setStatus] = useState('');
  const share = async () => {
    try {
      const url = new URL(path, window.location.origin).href;
      if (navigator.share) await navigator.share({ title, url });
      else await navigator.clipboard.writeText(url);
      setStatus(navigator.share ? 'Shared' : 'Link copied');
    } catch (error) { if (error.name !== 'AbortError') setStatus('Could not share. Copy the address from your browser.'); }
  };
  return <span className={compact ? 'network-post-share' : 'inline-flex flex-col items-start gap-1'}><button type="button" aria-label={compact ? 'Share post' : undefined} title={compact ? 'Share post' : undefined} onClick={share} className={compact ? 'network-feed-action' : 'inline-flex items-center gap-2 rounded-full border border-identity-border px-4 py-2 text-sm hover:border-names-accent'}><Share2 className="h-4 w-4"/><span className={compact ? 'sr-only' : ''}>Share</span></button>{status && <span role="status" className={compact ? 'network-share-feedback' : 'text-xs text-identity-muted'}>{status}</span>}</span>;
}