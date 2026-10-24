import useHandleMintIdentity from '@/components/solhandle/network/useHandleMintIdentity';
import NetworkMintDetails from '@/components/solhandle/network/NetworkMintDetails';

export default function NetworkProfileIdentity({ profile }) {
  const bound = Boolean(profile?.ownerVerified && profile?.handle && Date.parse(profile.verifiedUntil) > Date.now());
  const query = useHandleMintIdentity(bound ? profile.handle : '');
  if (!bound) return <section className="space-y-3 p-5"><h2 className="text-xl font-semibold">Identity</h2><p className="text-sm text-identity-muted">This profile has no currently verified handle binding. No NFT or wallet is inferred from its display name, profile picture or the visitor’s connected wallet.</p><p className="text-xs text-identity-muted">The social profile and its history stay with the account when a handle is transferred.</p></section>;
  if (query.isFetching) return <p role="status" className="p-6 text-sm text-identity-muted">Checking the handle NFT on-chain…</p>;
  if (query.isError || !query.data) return <section className="space-y-3 p-5"><p role="alert" className="text-sm text-identity-muted">The handle could not be verified live. Previous ownership data is not shown as current.</p><button type="button" className="social-action social-action-secondary" onClick={() => query.refetch()}>Retry verification</button></section>;
  if (query.data.address !== profile.boundWalletAddress || query.data.assetAddress !== profile.boundAssetAddress) return <section className="space-y-3 p-5"><p role="alert" className="text-sm text-identity-muted">Current on-chain ownership no longer matches this profile’s verified binding. No identity is displayed for this account.</p><button type="button" onClick={() => query.refetch()} className="social-action social-action-secondary">Check again</button></section>;
  return <NetworkMintDetails identity={query.data} refresh={() => query.refetch()}/>;
}