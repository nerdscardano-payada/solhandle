import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import PassportCreate from '@/components/solhandle/token-identity/PassportCreate';
import PassportTable from '@/components/solhandle/token-identity/PassportTable';
import PassportDetail from '@/components/solhandle/token-identity/PassportDetail';
import passportRequest from '@/components/solhandle/token-identity/passportRequest';
import '@/components/solhandle/token-identity/passport-test.css';
export default function AdminTokenPassports() {
  const [filter,setFilter]=useState('all'),[sort,setSort]=useState('-created_at'),[page,setPage]=useState(1),[params,setParams]=useSearchParams();
  const registrations=useQuery({queryKey:['passport-test-list',filter,sort,page],queryFn:()=>passportRequest({action:'list',filter,sort,page}),retry:false});
  const open=id=>setParams(id?{association:id}:{});
  async function created(id) {setFilter('all');setPage(1);await registrations.refetch();open(id);}
  return <main className="passport-test-workspace"><header className="ep-page-heading"><span className="ep-eyebrow">SOLHANDLE · FREE TEST WORKSPACE</span><h1>Token Identity</h1><p>Connect a token address to a wallet-signed handle association, then review the evidence.</p></header><aside className="passport-test-notice"><strong>Administrator-only pilot. No public release or payments.</strong><p>Uses existing administrator sign-in plus a fresh wallet signature. Storage commits each operation atomically in one bounded test register: 20 associations and 100 history events. Metadata comes only from on-chain accounts; external addresses are never fetched.</p><p>These are test records about Mainnet tokens, not on-chain Passport registrations. Wallet control is not token creator verification.</p></aside><PassportCreate onCreated={created}/><PassportTable data={registrations.data} loading={registrations.isFetching} error={registrations.error?.message} filter={filter} setFilter={setFilter} sort={sort} setSort={setSort} page={page} setPage={setPage} onOpen={open}/>{registrations.error&&<button className="ep-link" onClick={()=>registrations.refetch()}>Retry loading registrations</button>}<PassportDetail id={params.get('association')||''} onClose={()=>open('')} onReviewed={()=>registrations.refetch()}/></main>;
}