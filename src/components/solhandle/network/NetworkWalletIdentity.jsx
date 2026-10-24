import { Link } from 'react-router-dom';
import useProfileIdentity from '@/components/solhandle/profile/useProfileIdentity';
import useHandleMintIdentity from '@/components/solhandle/network/useHandleMintIdentity';
import NetworkMintDetails from '@/components/solhandle/network/NetworkMintDetails';
import WalletButton from '@/components/solhandle/WalletButton';

export default function NetworkWalletIdentity() {
  const wallet = useProfileIdentity();
  const query = useHandleMintIdentity(wallet.address && !wallet.error ? wallet.identity?.primaryHandle : '');
  const refresh = () => { wallet.refresh(); if (wallet.identity?.primaryHandle) query.refetch(); };
  if (!wallet.address) return <section className="space-y-3 p-5"><h2 className="text-xl font-semibold">Identity</h2><p className="text-sm text-identity-muted">Connect your wallet to view your primary handle and its real NFT details. This does not sign you into a social account.</p><WalletButton/></section>;
  if (wallet.loading || wallet.refreshing || query.isFetching) return <p role="status" className="p-6 text-sm text-identity-muted">Checking your primary handle on-chain…</p>;
  if (wallet.error || query.isError) return <section className="space-y-3 p-5"><p role="alert" className="text-sm text-identity-muted">Live identity verification is unavailable. No previous ownership is shown as current.</p><button type="button" onClick={refresh} className="social-action social-action-secondary">Retry verification</button></section>;
  if (!wallet.identity) return <section className="space-y-3 p-5"><h2 className="text-xl font-semibold">No verified primary handle</h2><p className="text-sm text-identity-muted">This wallet has no currently verified primary handle. Select one from your owned handles, or claim a handle.</p><Link to="/my-handles" className="social-action social-action-secondary">Manage my handles</Link><Link to="/" className="social-action social-action-secondary">Claim a handle</Link><button type="button" onClick={() => wallet.refresh()} className="social-action social-action-secondary">Check again</button></section>;
  if (!query.data) return <p role="status" className="p-6 text-sm text-identity-muted">Loading mint details…</p>;
  if (query.data.address !== wallet.address || query.data.assetAddress !== wallet.identity.assetAddress || query.data.primaryActive !== true) return <section className="space-y-3 p-5"><p role="alert" className="text-sm text-identity-muted">Ownership or your primary handle has changed, or could not be confirmed. Refresh before using this identity.</p><button type="button" onClick={refresh} className="social-action social-action-secondary">Refresh identity</button></section>;
  return <NetworkMintDetails identity={query.data} refresh={refresh}/>;
}