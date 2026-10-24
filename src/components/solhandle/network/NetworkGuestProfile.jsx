import { Link } from 'react-router-dom';
import NetworkProfileFrame from '@/components/solhandle/network/NetworkProfileFrame';
import WalletButton from '@/components/solhandle/WalletButton';
import useProfileIdentity from '@/components/solhandle/profile/useProfileIdentity';

export default function NetworkGuestProfile() {
  const { address, identity, loading, error } = useProfileIdentity();
  const handle = !error && identity?.primaryHandle ? `@${identity.primaryHandle.replace(/^@/, '')}` : '';
  const profile = { kind: 'PERSON', name: handle || 'Your profile', handle, bio: 'One recognizable name for your network, identity and payments.' };
  return <NetworkProfileFrame profile={profile} onIdentity={() => document.getElementById('network-wallet-details')?.scrollIntoView({ block: 'start' })} label={loading ? 'Checking identity…' : handle ? 'Wallet identity' : 'Your SolHandle'} actions={<WalletButton className="sd-button sd-gradient"/>} identity={<p className="text-xs text-identity-muted">{error ? 'Your on-chain identity could not be verified.' : address ? 'Your connected wallet. A social profile is not created automatically.' : 'Connect your existing Solana wallet to view your Primary Handle.'}</p>} meta={<Link to="/" className="sd-text-button">Find and claim your @handle</Link>} counts={<span>Public Social sign-in is not enabled yet.</span>}/>;
}