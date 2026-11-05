import { useEffect, useRef, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import WalletButton from '@/components/solhandle/WalletButton';
import signConnectedMessage from '@/lib/signConnectedMessage';
import passportRequest from '@/components/solhandle/token-identity/passportRequest';
import PassportTokenSnapshot from '@/components/solhandle/token-identity/PassportTokenSnapshot';
export default function PassportCreate({ onCreated, request = passportRequest, member = false }) {
  const session=useWallet(), address=session.publicKey?.toBase58()||'', generation=useRef(0);
  const [mint,setMint]=useState(''),[handle,setHandle]=useState(''),[note,setNote]=useState(''),[token,setToken]=useState(null),[busy,setBusy]=useState(false),[error,setError]=useState('');
  const handles=useQuery({queryKey:['passport-test-owned',address],queryFn:async()=>{const {data}=await base44.functions.invoke('getOwnerHandles',{wallet:address});if(data.error)throw new Error(data.error);return data;},enabled:!!address,retry:false,staleTime:60000});
  useEffect(()=>{generation.current+=1;setHandle('');setToken(null);setError('');setBusy(false);},[address]);
  async function lookup() { const run=generation.current;setBusy(true);setError('');setToken(null);try{const data=await request({action:'lookup',mint:mint.trim()});if(run===generation.current)setToken(data.token);}catch(e){if(run===generation.current)setError(e.message);}finally{if(run===generation.current)setBusy(false);} }
  async function submit(e) {
    e.preventDefault();const run=generation.current;setBusy(true);setError('');
    try {
      if(!token||token.mint!==mint.trim()||!address||!handle)throw new Error('Look up a token and select an owned handle first.');
      const input={mint:token.mint,handle,wallet:address,note};const proof=await request({...input,action:'challenge'});
      if(run!==generation.current)throw new Error('Wallet changed. Start again.');
      const bytes=await signConnectedMessage(session,new TextEncoder().encode(proof.message));
      if(run!==generation.current||session.wallet?.adapter?.publicKey?.toBase58()!==address)throw new Error('Wallet changed while signing. Start again.');
      const result=await request({...input,action:'create',challengeKey:proof.challengeKey,proof:proof.proof,signature:btoa(Array.from(bytes,b=>String.fromCharCode(b)).join(''))});
      if(run===generation.current){setNote('');await onCreated(result.id);}
    }catch(e){if(run===generation.current)setError(e.message);}finally{if(run===generation.current)setBusy(false);}
  }
  return <section className="passport-test-panel"><header className="passport-test-panel-heading"><div><h2>{member?'Register a token association':'Create a test association'}</h2><p>Prove control of an official handle, not token creation or safety.</p></div><WalletButton/></header>
    <form onSubmit={submit} className="passport-test-form"><label>Token mint address<div className="passport-test-input-action"><input value={mint} maxLength={44} disabled={busy} onChange={e=>{setMint(e.target.value);setToken(null);}} placeholder="Paste an exact Solana mint address" required/><button type="button" className="ep-button" disabled={busy||!mint.trim()} onClick={lookup}>{busy?'Working…':'Look up token'}</button></div></label>
      {token&&<PassportTokenSnapshot token={token}/>}
      <label>Owned SolHandle<select value={handle} disabled={!address||busy||handles.isLoading} onChange={e=>setHandle(e.target.value)} required><option value="">{!address?'Connect a wallet':handles.isLoading?'Loading handles…':'Select an owned handle'}</option>{(handles.data?.handles||[]).map(item=><option key={item.asset} value={item.handle.replace(/^@/,'')}>{item.display||'@'+item.handle}{item.isPrimary?' · Primary':''}</option>)}</select></label>
      {handles.error&&<p role="alert">{handles.error.response?.data?.error||handles.error.message}</p>}{address&&handles.isSuccess&&!handles.data?.handles?.length&&<p>No handle candidates were found. Mint or transfer an official handle to this wallet before continuing.</p>}
      <label>Association note (optional)<textarea value={note} disabled={busy} maxLength={240} rows={2} onChange={e=>setNote(e.target.value)} placeholder="Explain the relationship without claiming unverified authority."/></label>
      <p className="passport-test-muted">{member?'Signing submits a private association for administrator review. Publishing later requires a separate signature. No payment or blockchain transaction.':'Mainnet is read only. Signing creates a private test record; there is no payment or blockchain transaction.'}</p>
      <button className="ep-button ep-primary" disabled={busy||!token||!handle||!address} type="submit">{busy?'Waiting for lookup or signature…':'Sign & save for review'}</button>{error&&<p role="alert" className="passport-test-error">{error}</p>}
    </form>
  </section>;
}