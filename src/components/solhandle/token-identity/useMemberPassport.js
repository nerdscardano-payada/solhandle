import { useCallback, useEffect, useRef, useState } from 'react';
import signConnectedMessage from '@/lib/signConnectedMessage';
import memberPassportRequest from '@/components/solhandle/token-identity/memberPassportRequest';
const signatureText=bytes=>btoa(Array.from(bytes,b=>String.fromCharCode(b)).join(''));
export default function useMemberPassport(session) {
  const wallet=session.publicKey?.toBase58()||'',alive=useRef(true);
  const [authorization,setAuthorization]=useState(null),[busy,setBusy]=useState(false),[error,setError]=useState('');
  useEffect(()=>{alive.current=true;return()=>{alive.current=false;};},[]);
  useEffect(()=>{
    if(!authorization)return;
    const timer=setTimeout(()=>{setAuthorization(null);setError('Wallet access expired. Unlock again.');},Math.max(0,Date.parse(authorization.expires_at)-Date.now()));
    return()=>clearTimeout(timer);
  },[authorization]);
  async function unlock() {
    setBusy(true);setError('');
    try {
      const proof=await memberPassportRequest({action:'accessChallenge',wallet});
      if(!alive.current)return;
      const bytes=await signConnectedMessage(session,new TextEncoder().encode(proof.message));
      if(!alive.current||session.wallet?.adapter?.publicKey?.toBase58()!==wallet)return;
      const auth={accessProof:proof.proof,accessSignature:signatureText(bytes),expires_at:proof.expires_at};
      await memberPassportRequest({...auth,action:'list'});
      if(alive.current)setAuthorization(auth);
    }catch(e){if(alive.current)setError(e.message);}finally{if(alive.current)setBusy(false);}
  }
  const request=useCallback(payload=>{
    if(!authorization||Date.parse(authorization.expires_at)<=Date.now())return Promise.reject(new Error('Unlock Token Passport with your wallet again.'));
    return memberPassportRequest({...payload,accessProof:authorization.accessProof,accessSignature:authorization.accessSignature});
  },[authorization]);
  return {wallet,authorization,busy,error,unlock,request,lock:()=>setAuthorization(null)};
}