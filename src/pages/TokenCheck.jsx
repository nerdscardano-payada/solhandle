import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
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
  return <main className="ep-page token-check-page space-y-6"><header className="ep-page-heading"><span className="ep-eyebrow">SOLHANDLE · TOKEN IDENTITY</span><h1>Check a token address</h1><p>See which @handle is publicly associated with this exact address and whether handle ownership still matches at the time of the check. No account or wallet needed.</p></header>
    <Link className="ep-button" to="/token-passport">Register or manage my Token Passport</Link>
    <form className="token-check-form" onSubmit={submit}><label htmlFor="token-check-mint">Solana token address</label><div className="token-check-input"><input id="token-check-mint" value={mint} disabled={busy} onChange={e=>{setMint(e.target.value);setResult(null);setError('');}} placeholder="Paste the exact token mint address" maxLength={44} required autoComplete="off" spellCheck={false}/><button className="ep-button ep-primary" disabled={busy||!mint.trim()}>{busy?'Checking…':'Check token'}</button></div><p className="ep-small">Supports SPL and Token-2022 token mints on Solana Mainnet.</p></form>
    {busy&&<p role="status">Checking public registration and blockchain…</p>}
    {error&&<div role="alert"><p>{error}</p><button className="ep-button" disabled={busy} onClick={submit}>Try again</button></div>}
    {!busy&&result&&<><TokenCheckResult result={result}/><button className="ep-button" onClick={submit}>Refresh check</button></>}
    <aside className="token-check-notice"><strong>This is an identity check, not a security audit.</strong><p>An association does not prove token creation, trustworthiness, liquidity or investment value. Verify the full address through independent official channels. Names and symbols can be copied.</p><p>Only associations explicitly signed for publication appear here. No result means no public registration, not that a token is unsafe. Checks are snapshots in time; results may be reused for up to 30 seconds.</p></aside>
  </main>;
}