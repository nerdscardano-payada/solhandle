import { useState } from 'react';
import { Link } from 'react-router-dom';
import ProfileSectionTabs from '@/components/solhandle/profile/ProfileSectionTabs';
import NetworkProfilePaymentTools from '@/components/solhandle/network/NetworkProfilePaymentTools';
import NetworkWalletIdentity from '@/components/solhandle/network/NetworkWalletIdentity';
import NetworkProfileFrame from '@/components/solhandle/network/NetworkProfileFrame';
import WalletButton from '@/components/solhandle/WalletButton';
import useProfileIdentity from '@/components/solhandle/profile/useProfileIdentity';

export default function NetworkGuestProfile() {
  const { address, identity, loading, error } = useProfileIdentity();
  const [tab, setTab] = useState('posts');
  const handle = !error && identity?.primaryHandle ? `@${identity.primaryHandle.replace(/^@/, '')}` : '';
  const profile = { kind: 'PERSON', name: handle || 'Your profile', handle, bio: 'One recognizable name for your network, identity and payments.' };
  return <><NetworkProfileFrame profile={profile} onIdentity={() => setTab('identity')} label={loading ? 'Checking identity…' : handle ? 'Wallet identity' : 'Your SolHandle'} actions={<><WalletButton className="sd-button sd-gradient"/><NetworkProfilePaymentTools/></>} identity={<p className="text-xs text-identity-muted">{error ? 'Your on-chain identity could not be verified.' : address ? 'Your connected wallet. A social profile is not created automatically.' : 'Connect your existing Solana wallet to view your Primary Handle.'}</p>} meta={<Link to="/" className="sd-text-button">Find and claim your @handle</Link>} counts={<span>Public Social sign-in is not enabled yet.</span>}/><ProfileSectionTabs value={tab} onChange={setTab}/>{tab === 'identity' ? <NetworkWalletIdentity/> : tab === 'about' ? <section className="sd-profile-detail"><h2>About {profile.name}</h2><p className="sd-profile-bio">{profile.bio}</p><button type="button" className="sd-button sd-secondary" onClick={() => setTab('identity')}>View Identity</button></section> : <section className="sd-profile-feed"><div className="sd-empty"><h3>No published posts yet.</h3><p>Public Social sign-in is not enabled yet. Connecting a wallet does not create a social profile.</p></div></section>}</>;
}