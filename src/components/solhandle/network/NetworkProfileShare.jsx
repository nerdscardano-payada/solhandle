import { useState } from 'react';
import { Check, Linkedin, MessageCircle, Share2 } from 'lucide-react';
import { profilePath } from '@/components/solhandle/network/networkClient';

export default function NetworkProfileShare({ profile }) {
  const [feedback, setFeedback] = useState(null);
  if (!profile?.id) return null;
  const url = new URL(profilePath(profile), window.location.origin).href;
  const status = feedback?.url === url ? feedback.status : '';
  const text = `${profile.name} on SolHandle`;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setFeedback({ url, status: 'copied' });
    } catch {
      setFeedback({ url, status: 'manual' });
    }
  };
  const actionClass = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-identity-border px-3 py-2 text-xs text-identity-muted hover:text-identity-text';
  return <div className="min-w-0 basis-full">
    <div role="group" aria-label="Share this public profile" className="flex flex-wrap items-center gap-2">
      <span className="mr-1 inline-flex items-center gap-2 text-xs text-identity-muted"><Share2 className="h-3.5 w-3.5" aria-hidden="true"/>Share</span>
      <a className={actionClass} href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" aria-label={`Share ${profile.name} on LinkedIn (new window)`}><Linkedin className="h-3.5 w-3.5" aria-hidden="true"/>LinkedIn</a>
      <a className={actionClass} href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" aria-label={`Share ${profile.name} on X (new window)`}><span aria-hidden="true">X</span>X</a>
      <button className={actionClass} type="button" onClick={copy} title="Copy the profile link to paste in Discord">{status === 'copied' ? <Check className="h-3.5 w-3.5" aria-hidden="true"/> : <MessageCircle className="h-3.5 w-3.5" aria-hidden="true"/>}Discord</button>
    </div>
    <p role="status" className="mt-2 text-xs text-identity-muted">{status === 'copied' ? 'Profile link copied. Paste it in Discord.' : status === 'manual' ? 'Copy this public profile link to share in Discord:' : ''}</p>
    {status === 'manual' && <input className="mt-2 w-full min-w-0 rounded-lg border border-identity-border bg-card p-2 text-xs text-identity-text" aria-label="Public profile link for Discord" readOnly value={url} onFocus={event => event.target.select()}/>}
  </div>;
}