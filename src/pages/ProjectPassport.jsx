import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PublicProjectPassportCard from '@/components/solhandle/token-identity/PublicProjectPassportCard';
import '@/components/solhandle/token-identity/project-passport-public.css';
export default function ProjectPassport() {
  const {mint}=useParams();
  const {data,error,isPending,refetch}=useQuery({queryKey:['public-project-passport',mint],queryFn:async()=>{const response=await base44.functions.invoke('checkTokenIdentity',{action:'passport',mint});if(response.data.error)throw new Error(response.data.error);return response.data;},retry:false,refetchOnWindowFocus:false});
  const notFound=error?.response?.status===404||error?.status===404;
  useEffect(()=>{
    if(!notFound)return;
    const meta=document.createElement('meta');meta.name='prerender-status-code';meta.content='404';document.head.appendChild(meta);return ()=>meta.remove();
  },[notFound]);
  useEffect(()=>{const previous=document.title;document.title=data?.passport?`${data.passport.token_name||'Project'} · SolHandle Project Passport`:'Project Passport · SolHandle';return ()=>{document.title=previous;};},[data?.passport?.token_name]);
  return <main className="ep-page project-passport-page space-y-6">
    <Link className="ep-link" to="/discover?tab=passports">← Explore project passports</Link>
    {isPending&&<p role="status">Loading project passport and checking handle ownership…</p>}
    {error&&(notFound?<section className="space-y-3"><h1 className="text-2xl font-bold">Project passport not found</h1><p className="text-ecosystem-muted">No public reviewed project passport is available for this token address.</p></section>:<section className="space-y-3" role="alert"><h1 className="text-2xl font-bold">Passport temporarily unavailable</h1><p className="text-ecosystem-muted">The passport could not be loaded. Please try again.</p><button className="ep-button" onClick={()=>refetch()}>Try again</button></section>)}
    {!isPending&&!error&&data?.passport&&<PublicProjectPassportCard key={mint} passport={data.passport} result={data.result}/>}
  </main>;
}