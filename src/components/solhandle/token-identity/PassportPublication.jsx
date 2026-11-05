import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import passportRequest from '@/components/solhandle/token-identity/passportRequest';
import signConnectedMessage from '@/lib/signConnectedMessage';
export default function PassportPublication({item, request = passportRequest, walletScope = 'admin'}) {
  const session=useWallet(),[busy,setBusy]=useState(false),[error,setError]=useState('');
  const state=useQuery({queryKey:['passport-publication',walletScope,item.id,item.revision],queryFn:()=>request({action:'publication',id:item.id}),retry:false});
  const active=state.data?.publication?.status==='ACTIVE';
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
  return <section className="passport-test-panel"><h3>Public token check</h3><p>Private registrations remain private. Only after a fresh wallet signature will the token address, @handle, wallet, handle asset and publication dates become public. Private notes and administrator history are not shared.</p>
    {state.isPending?<p role="status">Loading publication status…</p>:state.error?<><p role="alert">{state.error.message}</p><button className="ep-button" onClick={()=>state.refetch()}>Reload</button></>:<><p>{active?'Public association active.':state.data?.publication?'Public association withdrawn.':'Not published yet.'}</p><button className="ep-button" disabled={busy||(!active&&item.status!=='approved')} onClick={()=>act(active)}>{busy?'Processing…':active?'Withdraw public association':'Sign and publish'}</button>{state.data?.publication&&<Link className="ep-link" to={`/token-check?mint=${encodeURIComponent(item.mint)}`}>View public token check</Link>}</>}
    {error&&<p role="alert">{error}</p>}
  </section>;
}