import { useState } from 'react';
import { Share2 } from 'lucide-react';
export default function ProjectPassportShare({name}) {
  const [message,setMessage]=useState('');
  async function share() {
    setMessage('');
    try {
      const url=window.location.origin+window.location.pathname;
      if(navigator.share) await navigator.share({title:`${name} · SolHandle Project Passport`,url});
      else {await navigator.clipboard.writeText(url);setMessage('Passport link copied.');}
    } catch(error) {if(error.name!=='AbortError')setMessage('Could not share automatically. Copy the page address to share this passport.');}
  }
  return <div><button className="ep-button" onClick={share}><Share2 size={16}/>Share passport</button>{message&&<p className="mt-2 text-sm text-ecosystem-muted" role="status">{message}</p>}</div>;
}