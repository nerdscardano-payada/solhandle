import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import downloadProjectPassport from '@/components/solhandle/token-identity/downloadProjectPassport';

export default function ProjectPassportDownload({surfaceRef,handle}) {
  const [busy,setBusy]=useState(false),[message,setMessage]=useState('');
  async function download() {
    if(busy||!surfaceRef.current)return;
    setBusy(true);setMessage('');
    try {await downloadProjectPassport(surfaceRef.current,handle);}
    catch {setMessage('The passport image could not be downloaded. Please try again once all images have loaded.');}
    finally {setBusy(false);}
  }
  return <div><button className="ep-button" onClick={download} disabled={busy} aria-busy={busy}>{busy?<Loader2 size={16} className="animate-spin"/>:<Download size={16}/>} {busy?'Preparing image…':'Download PNG'}</button>{message&&<p className="mt-2 text-sm text-ecosystem-muted" role="alert">{message}</p>}</div>;
}