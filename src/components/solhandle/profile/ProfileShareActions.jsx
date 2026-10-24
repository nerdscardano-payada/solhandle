import { useState } from 'react';
import { Linkedin, MessageCircle, Check, Share2 } from 'lucide-react';
import '@/components/solhandle/design/profile-share-buttons.css';

export default function ProfileShareActions({ url, text, label }) {
  const [feedback, setFeedback] = useState(null);
  const status = feedback?.url === url ? feedback.status : '';
  const copy = async () => {
    try { await navigator.clipboard.writeText(`${text}\n${url}`); setFeedback({ url, status: 'copied' }); }
    catch { setFeedback({ url, status: 'manual' }); }
  };
  return <div className="sd-profile-share"><div className="sd-profile-share-row" role="group" aria-label="Share this public profile"><span><Share2 size={13} aria-hidden="true"/> Share</span><a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" aria-label={`Share ${label} on LinkedIn (new window)`}><Linkedin size={14} aria-hidden="true"/> LinkedIn</a><a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" aria-label={`Share ${label} on X (new window)`}><span className="sd-share-x" aria-hidden="true">X</span> X</a><button type="button" onClick={copy} title="Copy the link and paste it in Discord">{status === 'copied' ? <Check size={14} aria-hidden="true"/> : <MessageCircle size={14} aria-hidden="true"/>} Discord</button></div><span className="sd-profile-share-status" role="status">{status === 'copied' ? 'Link copied. Paste it into your Discord chat or channel.' : status === 'manual' ? 'Copy this link to share in Discord:' : ''}</span>{status === 'manual' && <input aria-label="Link to share in Discord" value={url} readOnly onFocus={event => event.target.select()}/>}</div>;
}