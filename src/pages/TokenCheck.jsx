import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import TokenCheckResult from '@/components/solhandle/token-identity/TokenCheckResult';
import '@/components/solhandle/token-identity/token-check.css';
export default function TokenCheck() {
  const [params,setParams]=useSearchParams(),requested=params.get('mint')||'';
  const [mint,setMint]=useState(requested),[result,setResult]=useState(null),[busy,setBusy]=useState(false),[error,setError]=useState('');
  useEffect(()=>{
    let current=true;
    setMint(requested);setResult(null);setError('');
    if(!requested){setBusy(false);return;}
    setBusy(true);
    base44.functions.invoke('checkTokenIdentity',{mint:requested}).then(({data})=>{if(data.error)throw new Error(data.error);if(current)setResult(data);}).catch(e=>{if(current)setError(e.response?.data?.error||e.message);}).finally(()=>{if(current)setBusy(false);});
    return ()=>{current=false;};
  },[requested,params.get('refresh')]);
  function submit(e){e.preventDefault();setParams({mint:mint.trim(),refresh:String(Date.now())},{replace:true});}
  return <main className="ep-page token-check-page space-y-6"><header className="ep-page-heading"><span className="ep-eyebrow">SOLHANDLE · TOKEN IDENTITY</span><h1>Controleer een tokenadres</h1><p>Bekijk welke @handle publiek aan dit exacte adres is gekoppeld en of het handle-eigendom bij de controle nog overeenkomt. Geen account of wallet nodig.</p></header>
    <form className="token-check-form" onSubmit={submit}><label htmlFor="token-check-mint">Solana-tokenadres</label><div className="token-check-input"><input id="token-check-mint" value={mint} disabled={busy} onChange={e=>{setMint(e.target.value);setResult(null);setError('');}} placeholder="Plak het exacte tokenmint-adres" maxLength={44} required autoComplete="off" spellCheck={false}/><button className="ep-button ep-primary" disabled={busy||!mint.trim()}>{busy?'Controleren…':'Controleer token'}</button></div><p className="ep-small">Ondersteunt SPL- en Token-2022-tokenmints op Solana Mainnet.</p></form>
    {busy&&<p role="status">Openbare registratie en blockchain controleren…</p>}
    {error&&<div role="alert"><p>{error}</p><button className="ep-button" disabled={busy} onClick={submit}>Opnieuw proberen</button></div>}
    {!busy&&result&&<><TokenCheckResult result={result}/><button className="ep-button" onClick={submit}>Controle vernieuwen</button></>}
    <aside className="token-check-notice"><strong>Dit is een identiteitscontrole, geen veiligheidsaudit.</strong><p>Een koppeling bewijst geen tokenmakerschap, betrouwbaarheid, liquiditeit of investeringswaarde. Controleer het volledige adres via onafhankelijke officiële kanalen. Naam en symbool kunnen worden nagebootst.</p><p>Alleen expliciet voor publicatie ondertekende koppelingen verschijnen hier. Geen resultaat betekent geen openbare registratie, niet dat een token onveilig is. Controles zijn momentopnamen; resultaten kunnen maximaal 30 seconden worden hergebruikt.</p></aside>
  </main>;
}