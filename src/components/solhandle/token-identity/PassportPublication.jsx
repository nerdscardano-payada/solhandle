import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import passportRequest from '@/components/solhandle/token-identity/passportRequest';
import signConnectedMessage from '@/lib/signConnectedMessage';
export default function PassportPublication({item, request = passportRequest, walletScope = 'admin'}) {
  const session=useWallet(),[busy,setBusy]=useState(false),[error,setError]=useState('');
  const state=useQuery({queryKey:['passport-publication',walletScope,item.id,item.revision],queryFn:()=>request({action:'publication',id:item.id}),retry:false});
  const active=state.data?.publication?.status==='ACTIVE',queued=state.data?.auto_publish===true;
  async function act(withdraw=false) {
    setBusy(true);setError('');
    try {
      if(withdraw)await request({action:'withdrawPublic',id:item.id});
      else {
        if(session.publicKey?.toBase58()!==item.wallet)throw new Error('Connect the original signing wallet first.');
        const proof=await request({action:'publishChallenge',id:item.id});
        const bytes=await signConnectedMessage(session,new TextEncoder().encode(proof.message));
        if(session.wallet?.adapter?.publicKey?.toBase58()!==item.wallet)throw new Error('Wallet changed. Please sign again.');
        await request({action:'publish',id:item.id,challengeKey:proof.challengeKey,signature:btoa(Array.from(bytes,b=>String.fromCharCode(b)).join(''))});
      }
      await state.refetch();
    }catch(e){setError(e.message);}finally{setBusy(false);}
  }
  return <section className="passport-test-panel"><h3>{item.flow==='PROJECT_V1'?'Discover publication':'Public token check'}</h3><p>{item.flow==='PROJECT_V1'?'Your application already includes signed consent to appear in Discover after project verification. Private evidence, notes and administrator history are not shared.':'This older association requires a separate publication signature and is not a reviewed project passport.'}</p>
    {state.isPending?<p role="status">Loading publication status…</p>:state.error?<><p role="alert">{state.error.message}</p><button className="ep-button" onClick={()=>state.refetch()}>Reload</button></>:<><p>{active?'Passport published.':queued?item.status==='pending'?'Waiting for project verification. Publication follows approval automatically.':'Publication is queued. Ask the reviewer to finish approval if it has not appeared.':state.data?.publication?'Publication withdrawn.':'Not published.'}</p><button className="ep-button" disabled={busy||(!active&&!queued&&item.status!=='approved')} onClick={()=>act(active||queued)}>{busy?'Processing…':active?'Withdraw passport':queued?'Cancel publication consent':'Sign and publish'}</button>{state.data?.publication&&<Link className="ep-link" to={`/token-check?mint=${encodeURIComponent(item.mint)}`}>View public token check</Link>}</>}
    {item.flow==='PROJECT_V1'&&active&&<Link className="ep-link" to="/discover?tab=passports">View Discover passports</Link>}
    {error&&<p role="alert">{error}</p>}
  </section>;
}