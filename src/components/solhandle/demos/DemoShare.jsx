import { useState } from 'react';
import { Button } from '@/components/ui/button';
import demoShareHashtags from '@/components/solhandle/demos/demoShareHashtags';
export default function DemoShare({ title, description = '', category, slug }) {
  const [status, setStatus] = useState('');
  async function copy() { try { await navigator.clipboard.writeText(window.location.href); setStatus('Demo link copied.'); } catch { setStatus('Unable to copy. Copy the address from your browser.'); } }
  const share = () => {
    const hashtags = demoShareHashtags(category, slug).map(tag => `#${tag}`).join(' ');
    const intro = `👀 ${title} with SolHandle`;
    const ending = `\n\n🚀 Try the demo:\n${window.location.href}\n\n${hashtags}`;
    // X counts each URL as 23 characters; leave room for emoji weighting.
    const budget = Math.max(0, 270 - (intro.length + 2 + ending.length - window.location.href.length + 23));
    const explanation = description.length > budget
      ? `${description.slice(0, Math.max(0, budget - 1)).replace(/\s+\S*$/, '').trimEnd()}…`
      : description;
    const message = `${intro}\n\n${explanation}${ending}`;
    window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };
  return <div className="flex flex-wrap items-center gap-3"><Button variant="outline" onClick={copy}>Copy Demo Link</Button><Button variant="outline" onClick={share}>Share on X</Button><span role="status" className="text-sm text-muted-foreground">{status}</span></div>;
}