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
  const [filter,setFilter]=useState('all'),[sort,setSort]=useState('-created_at'),[page,setPage]=useState(1),[params,setParams]=useSearchParams();
  const client=useQueryClient();
  const registrations=useQuery({queryKey:['passport-test-list',filter,sort,page],queryFn:()=>passportRequest({action:'list',filter,sort,page}),retry:false});
  const latest=useQuery({queryKey:['passport-test-list','all','-created_at',1],queryFn:()=>passportRequest({action:'list',filter:'all',sort:'-created_at',page:1}),retry:false});
  const open=id=>setParams(id?{association:id}:{});
  const refreshResults=()=>client.invalidateQueries({queryKey:['passport-test-list']});
  async function created(id) {setFilter('all');setPage(1);await refreshResults();open(id);}
  return <main className="passport-test-workspace"><header className="ep-page-heading"><span className="ep-eyebrow">SOLHANDLE · FREE TEST WORKSPACE</span><h1>Token Identity</h1><p>Connect a token address to a wallet-signed handle association, then review the evidence.</p></header><aside className="passport-test-notice"><strong>Private test workspace. Public lookup requires separate signed publication.</strong><p>Uses existing administrator sign-in plus a fresh wallet signature. Storage commits each operation atomically in one bounded test register: 20 associations and 100 history events. Metadata comes only from on-chain accounts; external addresses are never fetched.</p><p>These are test records about Mainnet tokens, not on-chain Passport registrations. Wallet control is not token creator verification.</p></aside><aside className="passport-test-notice"><strong>User registrations share this limited pilot review queue.</strong><p>Entries marked “User registration” were submitted by their signing wallet. Approval never publishes them automatically; the owner must give a separate publication signature. The shared pilot remains limited to 20 associations.</p><Link className="ep-button" to="/token-passport">Open user registration</Link></aside><AdminOperationsNavigation/><PassportResult id={latest.data?.items?.[0]?.id} loading={latest.isPending} error={latest.error?.message} onOpen={open}/><PassportCreate onCreated={created}/><PassportTable data={registrations.data} loading={registrations.isFetching} error={registrations.error?.message} filter={filter} setFilter={setFilter} sort={sort} setSort={setSort} page={page} setPage={setPage} onOpen={open}/>{registrations.error&&<button className="ep-link" onClick={()=>registrations.refetch()}>Retry loading registrations</button>}<PassportDetail id={params.get('association')||''} onClose={()=>open('')} onReviewed={refreshResults}/></main>;
}