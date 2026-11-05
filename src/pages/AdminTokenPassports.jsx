import { useState } from 'react';
import AdminOperationsNavigation from '@/components/solhandle/admin/AdminOperationsNavigation';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import PassportResult from '@/components/solhandle/token-identity/PassportResult';
import PassportCreate from '@/components/solhandle/token-identity/PassportCreate';
import PassportTable from '@/components/solhandle/token-identity/PassportTable';
import PassportDetail from '@/components/solhandle/token-identity/PassportDetail';
import passportRequest from '@/components/solhandle/token-identity/passportRequest';
import '@/components/solhandle/token-identity/passport-test.css';
export default function AdminTokenPassports() {
  const [filter,setFilter]=useState('all'),[sort,setSort]=useState('-created_at'),[cursors,setCursors]=useState([null]),[params,setParams]=useSearchParams();
  const page=cursors.length,cursor=cursors[page-1];
  const client=useQueryClient();
  const registrations=useQuery({queryKey:['passport-test-list',filter,sort,cursor],queryFn:()=>passportRequest({action:'list',filter,sort,cursor:cursor||undefined}),retry:false,refetchOnWindowFocus:false});
  const latest=useQuery({queryKey:['passport-test-list','all','-created_at',null],queryFn:()=>passportRequest({action:'list',filter:'all',sort:'-created_at'}),retry:false,refetchOnWindowFocus:false});
  function setPage(value){if(value===1)setCursors([null]);else if(value<page)setCursors(current=>current.slice(0,value));else if(registrations.data?.next_cursor)setCursors(current=>[...current,registrations.data.next_cursor]);}
  const open=id=>setParams(id?{association:id}:{});
  const refreshResults=()=>client.invalidateQueries({queryKey:['passport-test-list']});
  async function created(id) {setFilter('all');setPage(1);await refreshResults();open(id);}
  return <main className="passport-test-workspace"><header className="ep-page-heading"><span className="ep-eyebrow">SOLHANDLE · REGISTRATION REVIEW</span><h1>Token Identity</h1><p>Connect a token address to a wallet-signed handle association, then review the evidence.</p></header><aside className="passport-test-notice"><strong>Project verification workspace. Approved project passports publish with prior signed consent.</strong><p>Project applications include signed publication consent. Independently verify the official evidence and confirm project representation before approving; approved project passports appear in Discover automatically. Rejection or suspension removes publication and cancels automatic republication.</p><p>Original test evidence is preserved as historical evidence. Wallet control is not token creator verification.</p><Link className="ep-button" to="/token-passport">Open user registration</Link></aside><AdminOperationsNavigation/><PassportResult id={latest.data?.items?.[0]?.id} loading={latest.isPending} error={latest.error?.message} onOpen={open}/><PassportCreate onCreated={created}/><PassportTable data={registrations.data} loading={registrations.isFetching} error={registrations.error?.message} filter={filter} setFilter={setFilter} sort={sort} setSort={setSort} page={page} setPage={setPage} onOpen={open}/>{registrations.error&&<button className="ep-link" onClick={()=>registrations.refetch()}>Retry loading registrations</button>}<PassportDetail id={params.get('association')||''} onClose={()=>open('')} onReviewed={refreshResults}/></main>;
}