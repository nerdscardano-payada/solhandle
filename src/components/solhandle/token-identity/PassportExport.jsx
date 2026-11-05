import { useState } from 'react';
import passportRequest from '@/components/solhandle/token-identity/passportRequest';
export default function PassportExport({ filter='all', ids, onNotice, disabled=false }) {
  const [busy,setBusy]=useState(false);
  async function download() {
    setBusy(true);
    try {
      const chunks=['\uFEFF'];let cursor,result;
      do {result=await passportRequest({action:'exportEvidence',filter,ids,cursor});chunks.push(result.csv+'\r\n');if(result.has_more&&!result.next_cursor)throw new Error('Export could not continue. Please try again.');cursor=result.next_cursor;}while(result.has_more);
      const url=URL.createObjectURL(new Blob(chunks,{type:'text/csv;charset=utf-8'})),link=document.createElement('a');link.href=url;link.download='solhandle-association-evidence.csv';document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);onNotice('Signed association evidence downloaded. This is not an on-chain registration receipt.');
    }
    catch(error) { onNotice(error.message); }
    finally { setBusy(false); }
  }
  return <span className="dt1-export"><button type="button" className="dt1-btn dt1-btn--beam" onClick={download} disabled={disabled||busy}><span className="dt1-beam-track" aria-hidden="true"><span className="dt1-beam"/></span>{busy?'Preparing…':ids?'Export selected evidence':'Export evidence CSV'}</button></span>;
}