import { useState } from 'react';
import { Linkedin, MessageCircle, Check, Share2 } from 'lucide-react';
import '@/components/solhandle/design/profile-share-buttons.css';

export default function ProfileShareButtons({ handle }) {
  const [status, setStatus] = useState('');
  if (!handle) return null;
  const url = `https://solhandle.io/@${encodeURIComponent(handle.replace(/^@/, ''))}`;
  const text = `Ontdek ${handle} op SolHandle.`;
  const copyForDiscord = async () => {
    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setStatus('copied');
    } catch {
      setStatus('manual');
    }
  };
  return <div className="sd-profile-share">
    <div className="sd-profile-share-row" role="group" aria-label="Deel deze SolHandle">
      <span><Share2 size={13} aria-hidden="true"/> Delen</span>
      <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" aria-label={`Deel ${handle} op LinkedIn (nieuw venster)`}><Linkedin size={14} aria-hidden="true"/> LinkedIn</a>
      <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" aria-label={`Deel ${handle} op X (nieuw venster)`}><span className="sd-share-x" aria-hidden="true">X</span> X</a>
      <button type="button" onClick={copyForDiscord} title="Kopieer de link en plak hem in Discord">{status === 'copied' ? <Check size={14} aria-hidden="true"/> : <MessageCircle size={14} aria-hidden="true"/>} Discord</button>
    </div>
    <span className="sd-profile-share-status" role="status">{status === 'copied' ? 'Link gekopieerd. Plak hem in je Discord-chat of kanaal.' : status === 'manual' ? 'Kopieer deze link om te delen in Discord:' : ''}</span>
    {status === 'manual' && <input aria-label="Link om te delen in Discord" value={url} readOnly onFocus={event => event.target.select()}/>}
  </div>;
}