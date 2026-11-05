import { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import WalletButton from '@/components/solhandle/WalletButton';
import PassportCreate from '@/components/solhandle/token-identity/PassportCreate';
import MemberPassportDetail from '@/components/solhandle/token-identity/MemberPassportDetail';
import useMemberPassport from '@/components/solhandle/token-identity/useMemberPassport';
export default function MemberPassportWorkspace({session}) {
  const access=useMemberPassport(session),[selected,setSelected]=useState('');
  const list=useInfiniteQuery({queryKey:['member-passports',access.wallet,access.authorization?.accessProof],initialPageParam:undefined,queryFn:({pageParam})=>access.request({action:'list',cursor:pageParam}),getNextPageParam:page=>page.has_more?page.next_cursor:undefined,enabled:!!access.authorization,retry:false,gcTime:0,refetchOnWindowFocus:false});
  const rows=list.data?.pages.flatMap(page=>page.items)||[];
  async function created(id){await list.refetch();setSelected(id);}
  if(!access.authorization)return <section className="passport-test-panel"><div className="passport-test-panel-heading"><div><h2>Access my Token Passports</h2><p>Connect your wallet, then sign to access only your registrations. No email account required. Access stays in memory and expires after one hour.</p></div><WalletButton/></div><button className="ep-button ep-primary" disabled={!access.wallet||access.busy} onClick={access.unlock}>{access.busy?'Waiting for wallet signature…':'Sign to access my registrations'}</button>{access.error&&<p className="passport-test-error" role="alert">{access.error}</p>}</section>;
  return <>
    <section className="passport-test-panel"><div className="passport-test-panel-heading"><h2>My registrations</h2><div className="flex flex-wrap gap-2"><button className="ep-button" disabled={list.isFetching} onClick={()=>list.refetch()}>Refresh registrations</button><button className="ep-button" onClick={access.lock}>Lock wallet access</button></div></div>
      {list.isPending?<p role="status">Loading your registrations…</p>:list.error?<p role="alert">{list.error.message}</p>:!rows.length?<p>No registrations yet. Submit your first association below.</p>:<label className="grid gap-2">Choose a registration<select value={selected} onChange={e=>setSelected(e.target.value)}><option value="">Select a registration</option>{rows.map(item=><option key={item.id} value={item.id}>@{item.handle} · {item.token_name||item.mint} · {item.status}</option>)}</select></label>}
      {list.hasNextPage&&<button className="ep-button" disabled={list.isFetchingNextPage} onClick={()=>list.fetchNextPage()}>{list.isFetchingNextPage?'Loading…':'Load more registrations'}</button>}
    </section>
    <MemberPassportDetail key={selected} id={selected} wallet={access.wallet} request={access.request}/>
    <PassportCreate member request={access.request} onCreated={created}/>
  </>;
}