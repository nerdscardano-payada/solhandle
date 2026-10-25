import { Link, useParams } from 'react-router-dom';
import useHandleMintIdentity from '@/components/solhandle/network/useHandleMintIdentity';
import NetworkMintDetails from '@/components/solhandle/network/NetworkMintDetails';

export default function NetworkHandleIdentity() {
  const { handle: rawHandle = '' } = useParams();
  const handle = rawHandle.replace(/^@+/, '').toLowerCase();
  const valid = /^[a-z0-9]{1,20}$/.test(handle);
  const query = useHandleMintIdentity(valid ? handle : '');
  return <section lang="en" translate="no" className="space-y-4 p-4 sm:p-6">
    <h1 className="text-2xl font-bold text-foreground">Handle identity</h1>
    <p className="text-sm text-identity-muted">This address identifies a handle NFT, not a Network account. Owning the NFT does not grant access to another account, its history or contacts.</p>
    {!valid ? <p role="alert" className="text-sm text-identity-muted">Enter a valid handle with 1–20 letters or numbers.</p>
      : query.isPending ? <p role="status" className="text-sm text-identity-muted">Checking the handle on Solana…</p>
      : query.isError || !query.data ? <div className="space-y-3"><p role="alert" className="text-sm text-identity-muted">This handle could not be verified live. It may not be minted, or verification may be temporarily unavailable. No Network account is inferred.</p><button type="button" className="sd-button sd-secondary" onClick={() => query.refetch()} disabled={query.isFetching}>{query.isFetching ? 'Checking…' : 'Retry verification'}</button></div>
      : <NetworkMintDetails identity={query.data} refresh={() => query.refetch()}/>}
    <Link to="/network/discover" className="sd-button sd-secondary">Browse published profiles</Link>
  </section>;
}