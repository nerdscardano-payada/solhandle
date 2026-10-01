import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { authorizeNamesWallet, namesProof } from '@/components/solhandle/names/namesWallet';
export default function useNamesExplorer() {
  const [params, setParams] = useSearchParams(), { publicKey, signMessage } = useWallet();
  const tab = ['trending', 'available', 'owned', 'for-sale', 'watchlist'].includes(params.get('tab')) ? params.get('tab') : 'trending';
  const wallet = publicKey?.toBase58() || '';
  const [search, setSearch] = useState(''), [debounced, setDebounced] = useState('');
  const [filters, setFilters] = useState({ rarity: '', characterType: '', sort: 'newest' });
  const [rank, setRank] = useState('searches'), [preset, setPreset] = useState('all');
  const [proof, setProof] = useState(null), [busy, setBusy] = useState(false), [authError, setAuthError] = useState('');
  const authorization = proof?.wallet === wallet && Date.now() - proof.timestamp < 9 * 60000 ? proof : namesProof(wallet);
  useEffect(() => { const timer = setTimeout(() => setDebounced(search), 250); return () => clearTimeout(timer); }, [search]);
  useEffect(() => { const timer = setInterval(() => setProof(namesProof(wallet)), 30000); return () => clearInterval(timer); }, [wallet]);
  const key = JSON.stringify([tab, debounced, filters, rank, preset, tab === 'watchlist' ? wallet : '', tab === 'watchlist' ? authorization?.timestamp : null]);
  const [navigation, setNavigation] = useState(null);
  const nav = navigation?.key === key ? navigation : { key, index: 0, cursors: [null] };
  const query = useQuery({
    queryKey: ['names', 'paged-14', key, nav.index],
    queryFn: async () => (await base44.functions.invoke('discoverNames', { tab, search: debounced, ...filters, rank, preset, cursor: nav.cursors[nav.index], proof: tab === 'watchlist' ? authorization : undefined })).data,
    enabled: tab !== 'watchlist' || Boolean(authorization), staleTime: 60000, refetchInterval: ['trending', 'available'].includes(tab) ? 60000 : false, retry: false
  });
  const verify = async () => {
    setBusy(true); setAuthError('');
    try { setProof(await authorizeNamesWallet(publicKey, signMessage)); }
    catch (error) { setAuthError(error.response?.data?.error || error.message || 'Wallet verification failed.'); }
    finally { setBusy(false); }
  };
  const onTab = value => { setAuthError(''); setParams({ tab: value }); };
  return { ...query, tab, search, filters, rank, preset, wallet, busy, authError, verify, authorization, onTab, onSearch: setSearch, onFilters: setFilters, onRank: setRank, onPreset: setPreset, items: query.data?.items || [], page: nav.index + 1, hasNext: Boolean(query.data?.has_more), onPrevious: () => setNavigation({ ...nav, index: nav.index - 1 }), onNext: () => setNavigation({ ...nav, index: nav.index + 1, cursors: [...nav.cursors.slice(0, nav.index + 1), query.data.next_cursor] }) };
}