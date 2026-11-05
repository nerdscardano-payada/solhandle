import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import passportRequest from '@/components/solhandle/token-identity/passportRequest';
import signConnectedMessage from '@/lib/signConnectedMessage';
export default function PassportPublication({item}) {
  const session=useWallet(),[busy,setBusy]=useState(false),[error,setError]=useState('');
  const state=useQuery({queryKey:['passport-publication',item.id,item.revision],queryFn:()=>passportRequest({action:'publication',id:item.id}),retry:false});
  const active=state.data?.publication?.status==='ACTIVE';
  async function act(withdraw=false) {
    setBusy(true);setError('');
    try {
      if(withdraw)await passportRequest({action:'withdrawPublic',id:item.id});
      else {
        if(session.publicKey?.toBase58()!==item.wallet)throw new Error('Verbind eerst de oorspronkelijke ondertekenende wallet.');
        const proof=await passportRequest({action:'publishChallenge',id:item.id});
        const bytes=await signConnectedMessage(session,new TextEncoder().encode(proof.message));
        if(session.wallet?.adapter?.publicKey?.toBase58()!==item.wallet)throw new Error('Wallet gewijzigd. Onderteken opnieuw.');
        await passportRequest({action:'publish',id:item.id,challengeKey:proof.challengeKey,signature:btoa(Array.from(bytes,b=>String.fromCharCode(b)).join(''))});
      }
      await state.refetch();
    }catch(e){setError(e.message);}finally{setBusy(false);}
  }
  return <section className="passport-test-panel"><h3>Openbare tokencontrole</h3><p>Privétests blijven privé. Alleen na een nieuwe wallet-handtekening worden tokenadres, @handle, wallet, handle-asset en publicatiedata openbaar. Privénotities en beheerhistorie worden niet gedeeld.</p>
    {state.isPending?<p role="status">Publicatiestatus laden…</p>:state.error?<><p role="alert">{state.error.message}</p><button className="ep-button" onClick={()=>state.refetch()}>Opnieuw laden</button></>:<><p>{active?'Openbare koppeling actief.':state.data?.publication?'Openbare koppeling ingetrokken.':'Nog niet openbaar gemaakt.'}</p><button className="ep-button" disabled={busy||(!active&&item.status!=='approved')} onClick={()=>act(active)}>{busy?'Bezig…':active?'Openbare koppeling intrekken':'Ondertekenen en openbaar maken'}</button>{state.data?.publication&&<Link className="ep-link" to={`/token-check?mint=${encodeURIComponent(item.mint)}`}>Bekijk de openbare tokencontrole</Link>}</>}
    {error&&<p role="alert">{error}</p>}
  </section>;
}