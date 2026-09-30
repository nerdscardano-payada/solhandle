import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { authorizeNamesWallet, namesProof } from '@/components/solhandle/names/namesWallet';
export default function useNamesExplorer() {
  const [params, setParams] = useSearchParams(), { publicKey, signMessage } = useWallet();
  const tab = ['trending', 'available', 'owned', 'watchlist'].includes(params.get('tab')) ? params.get('tab') : 'trending';
  const wallet = publicKey?.toBase58() || '';
  const [search, setSearch] = useState(''), [debounced, setDebounced] = useState('');
  const [filters, setFilters] = useState({ rarity: '', characterType: '', sort: 'newest' });
  const [rank, setRank] = useState('searches'), [preset, setPreset] = useState('all');
  const [proof, setProof] = useState(null), [busy, setBusy] = useState(false), [authError, setAuthError] = useState('');
  const authorization = proof?.wallet === wallet && Date.now() - proof.timestamp < 9 * 60000 ? proof : namesProof(wallet);
  useEffect(() => { const timer = setTimeout(() => setDebounced(search), 250); return () => clearTimeout(timer); }, [search]);
  useEffect(() => { const timer = setInterval(() => setProof(namesProof(wallet)), 30000); return () => clearInterval(timer); }, [wallet]);
  const query = useInfiniteQuery({
    queryKey: ['names', tab, debounced, filters, rank, preset, tab === 'watchlist' ? wallet : '', tab === 'watchlist' ? authorization?.timestamp : null],
    queryFn: async ({ pageParam }) => (await base44.functions.invoke('discoverNames', { tab, search: debounced, ...filters, rank, preset, cursor: pageParam, proof: tab === 'watchlist' ? authorization : undefined })).data,
    initialPageParam: null, getNextPageParam: page => page.has_more ? page.next_cursor : undefined,
    enabled: tab !== 'watchlist' || Boolean(authorization), staleTime: 60000, retry: false
  });
  const verify = async () => {
    setBusy(true); setAuthError('');
    try { setProof(await authorizeNamesWallet(publicKey, signMessage)); }
    catch (error) { setAuthError(error.response?.data?.error || error.message || 'Wallet verification failed.'); }
    finally { setBusy(false); }
  };
  const onTab = value => { setAuthError(''); setParams({ tab: value }); };
  return { ...query, tab, search, filters, rank, preset, wallet, busy, authError, verify, authorization, onTab, onSearch: setSearch, onFilters: setFilters, onRank: setRank, onPreset: setPreset, items: query.data?.pages.flatMap(page => page.items) || [] };
}