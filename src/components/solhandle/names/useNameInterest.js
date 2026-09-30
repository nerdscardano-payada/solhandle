import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { base44 } from '@/api/base44Client';
import { authorizeNamesWallet, namesProof } from '@/components/solhandle/names/namesWallet';
export default function useNameInterest(handle) {
  const { publicKey, signMessage } = useWallet(), { setVisible } = useWalletModal();
  const wallet = publicKey?.toBase58() || '', client = useQueryClient();
  const [revision, setRevision] = useState(0), [busy, setBusy] = useState(false), [error, setError] = useState('');
  const proof = namesProof(wallet);
  const query = useQuery({ queryKey: ['name-interest', handle, wallet, proof?.timestamp || revision], queryFn: async () => (await base44.functions.invoke('namesWatch', { action: 'detail', handle, proof })).data, staleTime: 60000, retry: false });
  useEffect(() => { const refresh = () => setRevision(v => v + 1); window.addEventListener('solhandle:names-authorized', refresh); return () => window.removeEventListener('solhandle:names-authorized', refresh); }, []);
  const toggle = async () => {
    if (!wallet) { setVisible(true); return; }
    setBusy(true); setError('');
    try {
      const authorization = await authorizeNamesWallet(publicKey, signMessage);
      const next = (await base44.functions.invoke('namesWatch', { action: 'set', handle, watching: !query.data?.watching, proof: authorization })).data;
      client.setQueryData(['name-interest', handle, wallet, authorization.timestamp], next);
      client.invalidateQueries({ queryKey: ['names'] });
      window.dispatchEvent(new CustomEvent('solhandle:names-changed', { detail: handle }));
      setRevision(v => v + 1);
    } catch (caught) { setError(caught.response?.data?.error || caught.message || 'Watchlist could not be updated.'); }
    finally { setBusy(false); }
  };
  return { ...query, busy, actionError: error, toggle, wallet };
}