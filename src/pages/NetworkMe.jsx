import { Link } from 'react-router-dom';
import { Bell, Bookmark } from 'lucide-react';
import { useNetworkSession } from '@/components/solhandle/network/NetworkSessionProvider';
import NetworkOwnerView from '@/components/solhandle/network/NetworkOwnerView';
import NetworkSectionHeader from '@/components/solhandle/network/NetworkSectionHeader';
import NetworkThemeSettings from '@/components/solhandle/network/NetworkThemeSettings';
import NetworkWalletSetup from '@/components/solhandle/network/NetworkWalletSetup';
import WalletButton from '@/components/solhandle/WalletButton';
export default function NetworkMe() {
  const session = useNetworkSession();
  return <>{session?.operator ? <NetworkOwnerView view="profile"/> : <><NetworkSectionHeader title="Profiel"/><section className="social-section space-y-4"><h2>Jouw @handle op Solana</h2><p className="text-sm leading-relaxed text-identity-muted">Verbind je bestaande wallet om je Primary Handle te herkennen. Publieke wallet-aanmelding voor een sociaal account is nog niet beschikbaar; openbare content kun je al bekijken.</p><WalletButton/><Link to="/" className="social-action text-names-accent">Nog geen handle? Ontdek en claim er één</Link></section></>}<nav aria-label="Profielacties" className="flex flex-wrap gap-2 border-t border-identity-border p-5"><Link to="/network/notifications" className="social-action text-identity-muted"><Bell className="h-4 w-4"/>Meldingen</Link><Link to="/network/bookmarks" className="social-action text-identity-muted"><Bookmark className="h-4 w-4"/>Bewaard</Link></nav><NetworkThemeSettings/><details id="account" className="border-t border-identity-border p-5"><summary className="cursor-pointer font-semibold">Accountbeheer & wallet</summary>{session?.operator ? <NetworkWalletSetup/> : <div className="space-y-4 pt-4"><WalletButton/><Link to="/profile" className="social-action text-names-accent">Walletdetails en mijn handles</Link></div>}</details></>;
}