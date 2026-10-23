import { createContext, useContext, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAuth } from '@/lib/AuthContext';
import labClient from '@/components/solhandle/network/lab/labClient';
const NetworkSessionContext = createContext(null);
export const useNetworkSession = () => useContext(NetworkSessionContext);
export default function NetworkSessionProvider({ children }) {
  const { user } = useAuth();
  const wallet = useWallet();
  const address = wallet.publicKey?.toBase58() || '';
  const operator = user?.role === 'admin';
  const [draft, setDraft] = useState(null);
  const bootstrap = useQuery({ queryKey: ['network-lab', 'bootstrap', user?.id], queryFn: () => labClient({ action: 'bootstrap' }), enabled: operator, retry: 1 });
  const identities = bootstrap.data?.identities || [];
  const linked = address ? identities.find(profile => profile.walletAddress === address) : null;
  const candidate = address && draft?.address === address ? identities.find(profile => profile.id === draft.id && !profile.walletAddress) : null;
  const actorId = linked?.id || candidate?.id || '';
  const account = useQuery({ queryKey: ['network-lab', actorId, 'profile', actorId], queryFn: () => labClient({ action: 'profile', actorId, target: actorId }), enabled: Boolean(operator && address && actorId), retry: 1, refetchInterval: 30000 });
  const profile = account.data?.profile;
  const ready = Boolean(operator && linked && profile?.identityConfigured && profile.ownerVerified);
  const selectProfile = id => setDraft({ address, id });
  return <NetworkSessionContext.Provider value={{ address, operator, bootstrap, identities, actorId, profile, account, ready, selectProfile }}>{children}</NetworkSessionContext.Provider>;
}