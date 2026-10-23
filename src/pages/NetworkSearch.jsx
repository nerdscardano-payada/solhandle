import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import SearchForm from '@/components/solhandle/network/NetworkSearch';
import useNetworkPages from '@/components/solhandle/network/useNetworkPages';
import NetworkState from '@/components/solhandle/network/NetworkState';
import NetworkProfileCard from '@/components/solhandle/network/NetworkProfileCard';
import NetworkPostCard from '@/components/solhandle/network/NetworkPostCard';
import NetworkMore from '@/components/solhandle/network/NetworkMore';
import { useNetworkSession } from '@/components/solhandle/network/NetworkSessionProvider';
import NetworkOwnerView from '@/components/solhandle/network/NetworkOwnerView';
export default function NetworkSearch() {
  const [params] = useSearchParams();
  const q = (params.get('q') || '').slice(0, 80);
  const [tab, setTab] = useState('profiles');
  const session = useNetworkSession();
  const query = useNetworkPages(tab === 'profiles' ? 'profiles' : 'feed', { q }, Boolean(q.trim()) && !session?.operator);
  const items = query.data?.pages.flatMap(page => page.items) || [];
  if (session?.operator) return <NetworkOwnerView view="people" search={q}/>;
  return <><header className="space-y-4 border-b border-identity-border p-6"><h1 className="text-2xl font-semibold">Search Network</h1><SearchForm key={q}/><p className="text-xs text-identity-muted">Search published profile names, bios and post text. Handle search will activate with verified handle bindings.</p></header><div className="flex gap-4 border-b border-identity-border p-5">{['profiles', 'posts'].map(value => <button key={value} onClick={() => setTab(value)} aria-pressed={tab === value} className={`capitalize ${tab === value ? 'font-semibold text-names-accent' : 'text-identity-muted'}`}>{value}</button>)}</div>{!q.trim() ? <p className="p-10 text-center text-identity-muted">Enter a name or keyword.</p> : <NetworkState query={query} empty={!items.length && !query.hasNextPage && 'No matching public results.'}>{tab === 'profiles' ? <div className="space-y-4 p-5">{items.map(item => <NetworkProfileCard key={item.id} profile={item}/>)}</div> : items.map(item => <NetworkPostCard key={item.id} post={item}/>)}<NetworkMore query={query}/></NetworkState>}</>;
}