import { useState } from 'react';
import { Button } from '@/components/ui/button';
import demoShareHashtags from '@/components/solhandle/demos/demoShareHashtags';
export default function DemoShare({ title, category, slug }) {
  const [status, setStatus] = useState('');
  async function copy() { try { await navigator.clipboard.writeText(window.location.href); setStatus('Demo link copied.'); } catch { setStatus('Unable to copy. Copy the address from your browser.'); } }
  const share = () => {
    const hashtags = demoShareHashtags(category, slug).map(tag => `#${tag}`).join(' ');
    const message = `44 characters → one @handle.\nExplore ${title} with SolHandle.\n\n${window.location.href}\n\n${hashtags}`;
    window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };
  return <div className="flex flex-wrap items-center gap-3"><Button variant="outline" onClick={copy}>Copy Demo Link</Button><Button variant="outline" onClick={share}>Share on X</Button><span role="status" className="text-sm text-muted-foreground">{status}</span></div>;
}