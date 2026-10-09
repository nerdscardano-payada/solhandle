import { createContext, useContext, useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import growthHubClient, { growthError } from '@/components/solhandle/quests/growthHubClient';
const Context = createContext(null);
export const useGrowthHub = () => useContext(Context);
export default function GrowthHubProvider({ children }) {
  const { publicKey, signMessage } = useWallet(), wallet = publicKey?.toBase58() || '', client = useQueryClient();
  const [proof, setProof] = useState(null), [me, setMe] = useState(null), [busy, setBusy] = useState(false), [error, setError] = useState('');
  const catalog = useQuery({ queryKey: ['growth-hub-catalog'], queryFn: () => growthHubClient({ action: 'catalog' }), staleTime: 30000 });
  useEffect(() => { setProof(null); setMe(null); setError(''); }, [wallet]);
  const validProof = proof?.wallet === wallet && Date.parse(proof.expires_at) > Date.now() ? proof : null;
  const verifyWallet = async () => {
    if (!wallet || !signMessage) { setError('Verbind een wallet die berichtsignatures ondersteunt.'); return; }
    setBusy(true); setError('');
    try {
      const challenge = await growthHubClient({ action: 'challenge', wallet });
      const bytes = await signMessage(new TextEncoder().encode(challenge.message));
      const next = { wallet, challenge_id: challenge.challenge_id, expires_at: challenge.expires_at, signature: btoa(Array.from(bytes, b => String.fromCharCode(b)).join('')) };
      const overview = await growthHubClient({ action: 'join', proof: next });
      setProof(next); setMe(overview);
    } catch (e) { setError(growthError(e)); } finally { setBusy(false); }
  };
  const act = async payload => {
    if (!validProof || Date.parse(validProof.expires_at) <= Date.now()) throw new Error('Verifieer opnieuw je wallet; de verificatie is 15 minuten geldig.');
    const data = await growthHubClient({ ...payload, proof: validProof });
    if (data.overview) { setMe(data.overview); client.invalidateQueries({ queryKey: ['growth-hub-leaderboard'] }); }
    else if (data.profile) { setMe(data); if (payload.action === 'visibility') client.invalidateQueries({ queryKey: ['growth-hub-leaderboard'] }); }
    return data;
  };
  const refresh = async () => { setBusy(true); setError(''); try { await act({ action: 'me' }); } catch (e) { setError(growthError(e)); } finally { setBusy(false); } };
  return <Context.Provider value={{ wallet, me: validProof ? me : null, verified: Boolean(validProof), busy, error, setError, verifyWallet, act, refresh, catalog }}>{children}</Context.Provider>;
}