import { Link } from 'react-router-dom';
import { Bell, Bookmark } from 'lucide-react';
import { useNetworkSession } from '@/components/solhandle/network/NetworkSessionProvider';
import NetworkOwnProfile from '@/components/solhandle/network/NetworkOwnProfile';
import NetworkSectionHeader from '@/components/solhandle/network/NetworkSectionHeader';
import NetworkThemeSettings from '@/components/solhandle/network/NetworkThemeSettings';
import NetworkWalletSetup from '@/components/solhandle/network/NetworkWalletSetup';
import WalletButton from '@/components/solhandle/WalletButton';
import NetworkWalletIdentity from '@/components/solhandle/network/NetworkWalletIdentity';
import NetworkProfilePaymentTools from '@/components/solhandle/network/NetworkProfilePaymentTools';
import NetworkGuestProfile from '@/components/solhandle/network/NetworkGuestProfile';
export default function NetworkMe() {
  const session = useNetworkSession();
  return <>{session?.operator ? <NetworkOwnProfile/> : <NetworkGuestProfile/>}{(!session?.operator || !session?.actorId) && <><div className="flex flex-wrap gap-3 px-5 py-4" aria-label="My Pay and Contacts"><NetworkProfilePaymentTools/></div><section id="network-wallet-details"><NetworkWalletIdentity/></section></>}<nav aria-label="Profile actions" className="flex flex-wrap gap-2 border-t border-identity-border p-5"><Link to="/network/notifications" className="social-action text-identity-muted"><Bell className="h-4 w-4"/>Notifications</Link><Link to="/network/bookmarks" className="social-action text-identity-muted"><Bookmark className="h-4 w-4"/>Saved</Link></nav><NetworkThemeSettings/><details id="account" className="border-t border-identity-border p-5"><summary className="cursor-pointer font-semibold">Account management & wallet</summary>{session?.operator ? <NetworkWalletSetup/> : <div className="space-y-4 pt-4"><WalletButton/><Link to="/profile" className="social-action text-names-accent">Wallet details & my handles</Link></div>}</details></>;
}