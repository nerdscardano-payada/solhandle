import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
const call=async body=>(await base44.functions.invoke('aiAdvisor',body)).data;
const readReceipt=()=>{const value=new URLSearchParams(window.location.hash.slice(1));const id=value.get('analysis'),token=value.get('key');return id&&token?{id,token}:null;};
export default function useAIAdvisor() {
 const [receipt,setReceipt]=useState(readReceipt),[busy,setBusy]=useState(false),[error,setError]=useState(''),[started,setStarted]=useState(Date.now()),[resetKey,setResetKey]=useState(0);
 const config=useQuery({queryKey:['ai-advisor-config'],queryFn:()=>call({action:'config'}),retry:false,staleTime:300000});
 const query=useQuery({queryKey:['ai-advisor-report',receipt?.id,receipt?.token],queryFn:()=>call({action:'status',...receipt}),enabled:Boolean(receipt),retry:false,refetchOnWindowFocus:false,refetchInterval:q=>receipt&&!q.state.error&&(!q.state.data||['queued','researching'].includes(q.state.data.status))&&Date.now()-started<660000?5000:false});
 useEffect(()=>{const changed=()=>{setReceipt(readReceipt());setStarted(Date.now());};window.addEventListener('hashchange',changed);return()=>window.removeEventListener('hashchange',changed);},[]);
 async function start(values){setBusy(true);setError('');try{const result=await call({action:'start',...values});const next={id:result.id,token:result.token};window.history.replaceState(null,'',`${window.location.pathname}#${new URLSearchParams({analysis:next.id,key:next.token})}`);setStarted(Date.now());setReceipt(next);}catch(e){setError(e.response?.data?.error||e.message);}finally{setBusy(false);setResetKey(v=>v+1);}}
 function reset(){window.history.replaceState(null,'',window.location.pathname);setReceipt(null);setError('');setStarted(Date.now());}
 return {config,query,receipt,busy,error,start,reset,resetKey};
}