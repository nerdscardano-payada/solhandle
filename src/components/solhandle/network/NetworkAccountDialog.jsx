import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useNetworkSession } from '@/components/solhandle/network/NetworkSessionProvider';
import NetworkProfileDialog from '@/components/solhandle/network/NetworkProfileDialog';
import NetworkWalletSetup from '@/components/solhandle/network/NetworkWalletSetup';

import WalletButton from '@/components/solhandle/WalletButton';

export default function NetworkAccountDialog() {
  const session = useNetworkSession();
  const location = useLocation();
  const navigate = useNavigate();
  const open = ['#account', '#appearance'].includes(location.hash);
  return <NetworkProfileDialog open={open} onOpenChange={value => { if (!value) navigate({ pathname: location.pathname, search: location.search, hash: '' }, { replace: true }); }} title="Identity & account" description="Manage your wallet and verified handles.">
    {open && <>{session?.operator ? <NetworkWalletSetup/> : <div className="space-y-4"><WalletButton/><Link to="/profile" className="sd-button sd-secondary">Wallet details & my handles</Link></div>}
      <nav aria-label="Account shortcuts" className="flex flex-wrap gap-2"><Link to="/network/notifications" className="sd-button sd-secondary">Notifications</Link><Link to="/network/bookmarks" className="sd-button sd-secondary">Saved</Link></nav>
    </>}
  </NetworkProfileDialog>;
}