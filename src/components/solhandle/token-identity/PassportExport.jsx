import { useState } from 'react';
import passportRequest from '@/components/solhandle/token-identity/passportRequest';
export default function PassportExport({ filter='all', ids, onNotice, disabled=false }) {
  const [busy,setBusy]=useState(false);
  async function download() {
    setBusy(true);
    try { const result=await passportRequest({action:'exportEvidence',filter,ids}); const url=URL.createObjectURL(new Blob([result.csv],{type:'text/csv;charset=utf-8'})); const link=document.createElement('a'); link.href=url; link.download='solhandle-test-association-evidence.csv'; document.body.appendChild(link); link.click(); link.remove(); setTimeout(()=>URL.revokeObjectURL(url),1000); onNotice('Test evidence downloaded. This is not an on-chain registration receipt.'); }
    catch(error) { onNotice(error.message); }
    finally { setBusy(false); }
  }
  return <span className="dt1-export"><button type="button" className="dt1-btn dt1-btn--beam" onClick={download} disabled={disabled||busy}><span className="dt1-beam-track" aria-hidden="true"><span className="dt1-beam"/></span>{busy?'Preparing…':ids?'Export selected evidence':'Export evidence CSV'}</button></span>;
}