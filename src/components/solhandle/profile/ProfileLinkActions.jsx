import { useState } from 'react';
import { Copy, Share2, Linkedin } from 'lucide-react';
import { getCanonicalHandleUrl } from '@/lib/shareSolHandle';
export function publicIdentityUrl(handle) {
 return new URL(`/profile/@${encodeURIComponent(handle.replace(/^@/, ''))}`, getCanonicalHandleUrl(handle)).href;
}
export default function ProfileLinkActions({ handle }) {
 const url = publicIdentityUrl(handle), text = `Connect with @${handle.replace(/^@/, '')} on Solana.`, [notice, setNotice] = useState('');
 async function copy() {
  try { await navigator.clipboard.writeText(url); setNotice('Profile link copied. Paste it on your website or in a conversation.'); }
  catch { setNotice('Select and copy the profile link below.'); }
 }
 async function share() {
  if (!navigator.share) return copy();
  try { await navigator.share({ title: `@${handle} · SolHandle`, text, url }); }
  catch (error) { if (error.name !== 'AbortError') setNotice('Sharing is unavailable. Copy the profile link instead.'); }
 }
 return <div className="identity-share-actions">
  <div className="flex flex-wrap gap-3">
   <button type="button" className="ep-link" onClick={share}><Share2 size={16}/>Share profile</button>
   <button type="button" className="ep-link" onClick={copy}><Copy size={16}/>Copy link</button>
   <a className="ep-link" href={`https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer">Share on X</a>
   <a className="ep-link" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer"><Linkedin size={16}/>LinkedIn</a>
  </div>
  <input className="identity-share-url" aria-label="Personal profile link" readOnly value={url} onFocus={event => event.target.select()}/>
  {notice && <p role="status">{notice}</p>}
 </div>;
}