import { useQuery } from '@tanstack/react-query';
import { ChevronDown } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import HandleDetailRecord from '@/components/solhandle/handles/HandleDetailRecord';
import IdentityCopy from '@/components/solhandle/profile/IdentityCopy';
import '@/components/solhandle/handles/handle-detail.css';
import '@/components/solhandle/profile/profile.css';

export default function PublicProfileDetails({ handle }) {
  const query = useQuery({ queryKey: ['public-profile-handle-details', handle], queryFn: async () => (await base44.functions.invoke('getHandleAvailability', { handle })).data, retry: false, staleTime: 0 });
  const data = query.data, owner = data?.currentOwner;
  return <details className="handle-profile-panel public-profile-disclosure">
      <summary>On-chain Identity Details <ChevronDown size={18}/></summary>
      <div className="public-profile-disclosure-content">
      {query.isPending ? <p role="status">Loading handle details…</p> : query.isError ? <p role="alert">Handle details could not be loaded. <button className="ep-link" onClick={() => query.refetch()}>Retry</button></p> : <div className="grid min-w-0 gap-4">
    <div className="min-w-0 flex flex-col gap-6">
      <HandleDetailRecord handle={handle} data={data} owner={owner} invalid={data?.status === 'INVALID'} available={data?.available}/>
    </div>
    <div className="min-w-0 flex flex-col gap-6">
      <section className="handle-profile-panel !mt-0"><h2>Wallet & handle</h2><p>Solana Mainnet</p>{owner && <div className="identity-address"><span className="identity-eyebrow">CURRENT OWNER WALLET</span><div><code>{owner}</code><IdentityCopy value={owner} label="Copy wallet address"/></div><a className="ep-link" href={`https://solscan.io/account/${owner}`} target="_blank" rel="noopener noreferrer">View wallet on Solscan</a></div>}</section>
    </div>
      </div>}
      </div>
    </details>;
}